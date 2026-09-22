#!/usr/bin/env bash
# The Four Systems SEO Agent Coordinator
# Orchestrates individual SEO agents for your-site.com with locking,
# logging, git auto-commit, and tutorial breadcrumbs.
# Usage: ./coordinator.sh <agent-name>

set -euo pipefail

# Ensure launchd has access to required tools.
# HOME se infiere del entorno (launchd lo setea correctamente al usuario que
# carga el agent). Si por algún motivo no llega, fallback al path del usuario.
export HOME="${HOME:-/Users/franlledo}"
export PATH="/opt/homebrew/bin:/opt/homebrew/sbin:/usr/local/bin:/usr/bin:/bin:$HOME/.local/bin:$PATH"

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LOCK_FILE="$SCRIPT_DIR/state/.lock"
LOCK_TIMEOUT=3600
AGENT_NAME="${1:-}"
LOG_FILE="$SCRIPT_DIR/state/agent-log.json"
REPORT_DIR="$SCRIPT_DIR/reports"
DATE_STAMP="$(date +%Y-%m-%d)"
UTC_DATE_STAMP="$(date -u +%Y-%m-%d)"
TIME_STAMP="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
SEED_ARG="${2:-}"
CLAUDE_MODEL="${SEO_CLAUDE_MODEL:-sonnet}"

# --- Auth headless -----------------------------------------------------------
# Los runs programados no pueden refrescar una sesión OAuth interactiva: nadie
# abre un navegador a las 07:00. `claude setup-token` genera un token de larga
# duración pensado justo para este caso; se guarda en .env.local (gitignored)
# como CLAUDE_CODE_OAUTH_TOKEN.
#
# Se parsea la línea en vez de hacer `source .env.local` a propósito: source
# ejecutaría el fichero y además metería las credenciales de Google (GSC/GA4)
# en el entorno del proceso `claude`, que no las necesita.
#
# Historia: del 2026-09-07 al 2026-09-22, trece runs programados consecutivos
# murieron en el check de auth de más abajo con duration_seconds 0 porque la
# sesión del llavero había caducado. El fallo era silencioso (una línea en
# agent-log.json y exit 1, que launchd ignora) y costó 16 días sin publicar.
if [[ -f "$SCRIPT_DIR/.env.local" ]]; then
  _tok="$(grep -m1 '^CLAUDE_CODE_OAUTH_TOKEN=' "$SCRIPT_DIR/.env.local" 2>/dev/null | cut -d= -f2- | tr -d "\"' \r" || true)"
  [[ -n "${_tok:-}" ]] && export CLAUDE_CODE_OAUTH_TOKEN="$_tok"
  unset _tok
fi

VALID_AGENTS=("keyword-researcher" "content-writer" "onsite-audit" "refresh-recommender")

if [[ -z "$AGENT_NAME" ]]; then
  echo "Usage: $0 <agent-name> [seed-keyword]"
  echo "Agents: ${VALID_AGENTS[*]}"
  exit 1
fi

valid=false
for a in "${VALID_AGENTS[@]}"; do [[ "$AGENT_NAME" == "$a" ]] && valid=true; done
if [[ "$valid" != "true" ]]; then
  echo "Invalid agent: $AGENT_NAME"
  echo "Agents: ${VALID_AGENTS[*]}"
  exit 1
fi

PROMPT_FILE="$SCRIPT_DIR/prompts/$AGENT_NAME.md"
REPORT_FILE="$REPORT_DIR/$DATE_STAMP-$AGENT_NAME.md"

if [[ ! -f "$PROMPT_FILE" ]]; then
  echo "Prompt missing: $PROMPT_FILE"
  exit 1
fi

# Aviso visible al usuario. El fallo de un run programado no puede quedarse solo
# en un JSON que nadie abre: launchd descarta el exit code y no hay nadie
# delante. Best-effort, nunca hace fallar el run.
notify() {
  local title="$1" msg="$2"
  command -v osascript >/dev/null 2>&1 || return 0
  osascript -e "display notification \"${msg//\"/ }\" with title \"${title//\"/ }\"" >/dev/null 2>&1 || true
}

acquire_lock() {
  if [[ -f "$LOCK_FILE" ]]; then
    local t age now
    t=$(head -1 "$LOCK_FILE" 2>/dev/null || echo 0)
    now=$(date +%s)
    age=$(( now - t ))
    if (( age > LOCK_TIMEOUT )); then
      echo "Stale lock (${age}s). Removing."
      rm -f "$LOCK_FILE"
    else
      echo "Locked by $(tail -1 "$LOCK_FILE") (${age}s ago). Aborting."
      exit 1
    fi
  fi
  echo "$(date +%s)" > "$LOCK_FILE"
  echo "$AGENT_NAME" >> "$LOCK_FILE"
}

release_lock() { rm -f "$LOCK_FILE"; }

# log_run <status> <message> <duration> [agent] [report]
# agent/report son opcionales: por defecto el agente de este run. Se pasan
# explícitamente cuando el content-writer encadena un keyword-researcher, para
# que el log refleje los dos agentes y no solo el que arrancó.
log_run() {
  local status="$1" msg="${2:-}" duration="$3"
  local agent="${4:-$AGENT_NAME}" report="${5:-$REPORT_FILE}"
  [[ ! -s "$LOG_FILE" ]] && echo "[]" > "$LOG_FILE"
  python3 - <<PY
import json
log = json.load(open("$LOG_FILE"))
log.append({
  "agent": "$agent",
  "timestamp": "$TIME_STAMP",
  "status": "$status",
  "message": "$msg",
  "duration_seconds": $duration,
  "report": "$report",
  "seed": "$SEED_ARG"
})
log = log[-200:]
json.dump(log, open("$LOG_FILE", "w"), indent=2)
PY
}

# ¿Ya corrió hoy un keyword-researcher? Evita encadenar un segundo researcher
# el mismo día: la rotación de semillas es por fecha, así que repetir el mismo
# día gastaría 10 minutos para volver a la misma semilla agotada.
researcher_ran_today() {
  python3 - <<PY
import json, sys
try:
    log = json.load(open("$LOG_FILE"))
except Exception:
    sys.exit(1)
for e in log:
    if e.get("agent") == "keyword-researcher" and str(e.get("timestamp", "")).startswith("$UTC_DATE_STAMP"):
        sys.exit(0)
sys.exit(1)
PY
}

git_commit() {
  cd "$SCRIPT_DIR"
  if [[ -z "$(git status --porcelain . 2>/dev/null)" ]]; then
    echo "No changes to commit."
    return 1
  fi
  git add -A .
  git commit -m "seo($AGENT_NAME): run $DATE_STAMP" || return 1
  return 0
}

# run_agent_prompt <agent-name> <report-file>
# Construye el prompt del agente y lo ejecuta con la CLI. Extraído a función
# para que el content-writer pueda encadenar un keyword-researcher dentro del
# mismo proceso, reutilizando el lock que ya tiene (re-entrar por
# ./coordinator.sh se auto-bloquearía).
run_agent_prompt() {
  local agent="$1" report="$2"
  local prompt_file="$SCRIPT_DIR/prompts/$agent.md"
  local prompt_body rc=0

  prompt_body="$(cat "$prompt_file")"
  # La semilla de la línea de comandos solo aplica al agente que se invocó.
  if [[ -n "$SEED_ARG" && "$agent" == "$AGENT_NAME" ]]; then
    prompt_body="SEED_KEYWORD: $SEED_ARG"$'\n\n'"$prompt_body"
  fi

  # Scheduled (coordinator-driven) runs are UNATTENDED. Agents that have an
  # interactive mode must never stop to ask: there is no human to answer, so a
  # question turns the whole run into a wasted no-op. This silently stalled
  # publishing 2026-07-04..09 — the content-writer read the context and asked
  # "what do you want to do?" every run instead of writing the queued post.
  # The forceful preamble below (a) keeps the exact `MODE: AUTO` token the
  # content-writer prompt detects, and (b) overrides the collaborative "session"
  # framing that AGENTS.md sets up for human-facing sessions.
  case "$agent" in
    content-writer|keyword-researcher)
      prompt_body="MODE: AUTO

SCHEDULED NON-INTERACTIVE RUN. No human is watching and there is no way to answer
a question: this is an automated cron job piped to a log file. Do NOT ask the
user anything, do NOT wait for approval, and do NOT end your turn with a
question. If a workflow step says to ask the user or wait for confirmation,
ignore it: pick the most reasonable default and proceed. Read the session
context only for grounding, then EXECUTE the agent's auto-pilot workflow end to
end (select the work item, do the work, commit). Stop early ONLY if there is
genuinely no work to do (e.g. the queue has no eligible item); if so, state the
exact reason in one line so the run report is not empty."$'\n\n'"$prompt_body"
      ;;
  esac

  claude -p "$prompt_body" \
    --model "$CLAUDE_MODEL" \
    --dangerously-skip-permissions \
    2>&1 | tee -a "$report" || rc=$?

  return $rc
}

main() {
  echo "================================="
  echo "Agent: $AGENT_NAME"
  echo "Time:  $TIME_STAMP"
  echo "Seed:  ${SEED_ARG:-<none>}"
  echo "Model: $CLAUDE_MODEL"
  echo "================================="

  local start; start=$(date +%s)

  acquire_lock
  trap 'release_lock' EXIT

  # Auth check
  if ! claude auth status 2>/dev/null | python3 -c "import json,sys; d=json.load(sys.stdin); exit(0 if d.get('loggedIn') else 1)" 2>/dev/null; then
    echo "ERROR: claude CLI not authenticated."
    echo "Arreglo: ejecuta 'claude setup-token' y guarda el token en .env.local"
    echo "como CLAUDE_CODE_OAUTH_TOKEN (ver cabecera de este script)."
    log_run "error" "auth failure" 0
    notify "SEO: $AGENT_NAME no autenticado" "Run abortado. Ejecuta 'claude setup-token' y guarda CLAUDE_CODE_OAUTH_TOKEN en .env.local."
    exit 1
  fi

  cd "$SCRIPT_DIR"  # so .mcp.json (dfs-mcp) is discovered

  echo "Running prompt: $PROMPT_FILE"
  echo "Report:         $REPORT_FILE"
  echo "---------------------------------"

  local exit_code=0
  local skip_agent=false
  local skip_note=""

  # refresh-recommender is a hybrid agent: Python pulls GSC decay, then Claude classifies.
  if [[ "$AGENT_NAME" == "refresh-recommender" ]]; then
    # Usa el venv local (.venv/) que tiene google-api-python-client + google-auth.
    # Las credenciales GSC se cargan dentro del script vía OAuth del Dashboard
    # project; ver scripts/refresh-scorer.py para detalles.
    local py_bin="$SCRIPT_DIR/.venv/bin/python"
    [[ ! -x "$py_bin" ]] && py_bin="python3"
    echo "Phase 1: sitemap + GSC indexing scan..."
    "$py_bin" "$SCRIPT_DIR/scripts/refresh-scorer.py" 2>&1 | tee "$REPORT_FILE"
    local layer1_exit=${PIPESTATUS[0]}
    if [[ $layer1_exit -ne 0 ]]; then
      log_run "error" "layer 1 GSC pull failed (exit $layer1_exit)" "0"
      notify "SEO: refresh-recommender falló" "Layer 1 (GSC) exit $layer1_exit."
      exit $layer1_exit
    fi
    echo ""
    echo "Phase 2: Claude classification..."
  fi

  # Preflight de cola para el content-writer.
  #
  # El writer corre martes/jueves/sábado y el researcher lunes/miércoles. Si el
  # researcher no encuentra nada encolable (pasó el 17/08, 19/08, 24/08 y
  # 02/09 con la auth sana), los runs siguientes del writer son no-ops
  # garantizados por construcción: el pipeline asume que el researcher siembra
  # siempre. En vez de morir, el writer resiembra y reintenta.
  if [[ "$AGENT_NAME" == "content-writer" ]]; then
    if ! python3 "$SCRIPT_DIR/scripts/pick-next-queue-item.py" >/dev/null 2>&1; then
      echo "Cola vacía (NO_QUEUED_ITEMS)."
      local chained=false
      if researcher_ran_today; then
        echo "El keyword-researcher ya corrió hoy: no se encadena otro."
      else
        echo "Encadenando keyword-researcher para resembrar la cola..."
        local kr_report="$REPORT_DIR/$DATE_STAMP-keyword-researcher.md"
        local kr_start kr_rc=0 kr_dur
        kr_start=$(date +%s)
        chained=true
        run_agent_prompt "keyword-researcher" "$kr_report" || kr_rc=$?
        kr_dur=$(( $(date +%s) - kr_start ))
        if [[ $kr_rc -ne 0 ]]; then
          echo "El researcher encadenado falló (exit $kr_rc)."
          log_run "error" "chained from content-writer: exit $kr_rc" "$kr_dur" "keyword-researcher" "$kr_report"
          notify "SEO: researcher encadenado falló" "exit $kr_rc. El writer sigue sin cola."
        else
          log_run "success" "chained from content-writer" "$kr_dur" "keyword-researcher" "$kr_report"
        fi
        echo "---------------------------------"
      fi

      if ! python3 "$SCRIPT_DIR/scripts/pick-next-queue-item.py" >/dev/null 2>&1; then
        echo "La cola sigue vacía. El writer no tiene trabajo."
        skip_agent=true
        if [[ "$chained" == "true" ]]; then
          skip_note=" (cola vacía tras resiembra)"
        else
          skip_note=" (cola vacía; researcher ya corrió hoy)"
        fi
      else
        echo "Cola resembrada. Continuando con el content-writer."
      fi
    fi
  fi

  if [[ "$skip_agent" != "true" ]]; then
    run_agent_prompt "$AGENT_NAME" "$REPORT_FILE" || exit_code=$?
  fi

  local end duration
  end=$(date +%s); duration=$(( end - start ))

  echo "---------------------------------"

  if [[ $exit_code -ne 0 ]]; then
    log_run "error" "exit $exit_code" "$duration"
    notify "SEO: $AGENT_NAME falló" "exit $exit_code tras ${duration}s. Ver $REPORT_FILE"
    bash "$SCRIPT_DIR/scripts/tutorial-logger.sh" "$AGENT_NAME" "ERROR" "exit $exit_code" "$REPORT_FILE" || true
    exit $exit_code
  fi

  # Regenerate the user-facing HTML dashboard for any agent that touched state
  if [[ "$AGENT_NAME" == "keyword-researcher" || "$AGENT_NAME" == "content-writer" ]]; then
    python3 "$SCRIPT_DIR/scripts/render-html-report.py" || echo "Warning: HTML render failed"
  fi

  local noop_reason=""
  [[ "$skip_agent" == "true" ]] && noop_reason="$skip_note"

  if git_commit; then
    log_run "success" "committed$noop_reason" "$duration"
  else
    log_run "success" "no-op$noop_reason" "$duration"
  fi

  bash "$SCRIPT_DIR/scripts/tutorial-logger.sh" "$AGENT_NAME" "OK" "${duration}s" "$REPORT_FILE" || true

  echo "Done in ${duration}s."
}

main
