# AGENTS.md — seo-franlledo (Sistema SEO/GEO de franlledo.com)

Fuente única de verdad para **cualquier** agente de IA (Claude, Codex, Gemini,
Cursor, Kimi, DeepSeek, Aider, etc.) que trabaje en este proyecto. Todo lo que
un agente necesita saber está aquí o enlazado desde aquí.

---

## Qué es este proyecto

Repo de tooling y agentes autónomos que generan y mantienen el SEO/GEO de
**franlledo.com** (proyecto principal de Fran Lledó): investigación de
keywords, redacción de posts, auditoría on-site, recomendador de refresh e
informe semanal. Este repo coordina los agentes; el sitio publicado vive en un
repo aparte, **`/Users/franlledo/Projects/franlledo-web`** (Astro SSG →
Docker/nginx → Coolify en un VPS Hetzner).

Nació como fork de la plantilla "The Four Systems" (`origin`:
`Soyfranlledo/the-four-systems`; `upstream`: `NicoSKOOL/the-four-systems`) y
está adaptado por completo al negocio de Fran.

El objetivo no es "hacer SEO decente". Es ser **excepcionalmente buenos**: cada
post, cada URL, cada decisión técnica tiene que estar al nivel del mejor SEO en
español del nicho. Fran lo considera su proyecto principal.

---

## Estado actual (resumen — el detalle vivo está en PROJECT_STATUS.md)

- Proyecto **activo**, con runs automáticos programados varias veces por semana
  (última actividad: finales de julio de 2026).
- **35 artículos publicados** en producción. Último:
  `/blog/que-es-una-landing-page/` (2026-07-21).
- Cola de contenido: **0 items `queued`** (24 `written`, 1 `needs_review`).
  El keyword-researcher debe resembrarla o el content-writer saldrá en no-op
  (`NO_QUEUED_ITEMS`).
- Diagnóstico 2026-07-28: el cuello de botella es **autoridad de dominio**, no
  contenido (impresiones +47% en 28d, clics planos, posición media 18). Se
  implementó un gate de winnability (`Step 5b`) en el keyword-researcher que
  degrada a P2 las SERPs-muro donde la autoridad mediana del top-5 supera con
  mucho la del sitio.
- Incidencia abierta: dos runs programados (14/07 y 22/07) **no se dispararon**
  sin dejar rastro en logs ni commits. Patrón sistémico de cron/launchd sin
  investigar; revisar si ocurre una tercera vez.

Para la fotografía completa (rendimiento GSC, indexación, hitos pendientes),
lee siempre `PROJECT_STATUS.md`.

---

## Memoria operativa obligatoria

Este repositorio conserva memoria entre sesiones. Ningún agente debe empezar a
trabajar basándose solo en el chat actual.

### Al comenzar una sesión

Leer, en este orden:

1. `AGENTS.md` (este archivo): reglas e invariantes.
2. `PROJECT_STATUS.md`: fotografía actual, tareas pendientes y próximos hitos.
3. Las últimas entradas de `docs/session-log.md`: decisiones y contexto reciente.
4. `git status` y los últimos commits de este repo y del repo web
   `/Users/franlledo/Projects/franlledo-web`.
5. Los JSON de `state/` que afecten a la tarea. Son la fuente de verdad
   operativa para cola, keywords, auditoría e indexación.
6. `memory/MEMORY.md`: feedback persistente de Fran (p. ej., **no sugerir
   compartir los posts del blog en sus redes sociales** — sus redes son para
   captación directa de leads y los posts los escribe la IA, no él).

### Al cerrar una sesión con cambios relevantes

1. Actualizar `PROJECT_STATUS.md`: debe describir el estado que queda, no narrar
   todo lo ocurrido.
2. Añadir una entrada fechada a `docs/session-log.md` con decisiones, acciones,
   verificaciones, commits y trabajo pendiente.
3. No duplicar informes automáticos completos: enlazarlos desde la bitácora.
4. No guardar secretos, tokens, credenciales ni datos personales.
5. Validar y hacer commit/push de la documentación junto con el estado final.

### Jerarquía de fuentes

- Reglas permanentes: `AGENTS.md`.
- Estado humano actual y siguiente acción: `PROJECT_STATUS.md`.
- Estado estructurado de los agentes: `state/*.json`.
- Historial de decisiones entre sesiones: `docs/session-log.md`.
- Salidas detalladas de ejecuciones: `reports/` y `output/`.
- Historial técnico definitivo: commits de Git en ambos repositorios.

---

## ⛔ INVARIANTES SEO — nunca violar

Estas reglas son no-negociables. Un fallo aquí degrada el SEO de forma difícil
de revertir (requiere 301, re-indexación y semanas de espera). Antes de publicar
cualquier cosa, verifícalas.

### 1. Las URLs del blog van SIN FECHA. Nunca.

La URL pública de un post es `https://franlledo.com/blog/<slug>/`, donde `<slug>`
son **solo keywords en minúscula separadas por guiones**. Nada de prefijos de
fecha (`2026-06-08-`), números, ni tokens que no sean keyword.

**Por qué importa:** en Astro el nombre del fichero `.md` en `src/content/blog/`
se convierte en `post.id`, que es a la vez la URL **y** el `<link rel=canonical>`.
Una fecha en una URL evergreen le dice a Google "esto caduca", diluye el slug, y
solo se deshace con un 301.

**Cómo está garantizado:** el artefacto local en `output/posts/` SÍ se llama
`<YYYY-MM-DD>-<slug>.md` (para ordenar cronológicamente en el editor), pero
`scripts/publish-to-astro.py` **elimina el prefijo de fecha** al copiar al repo
web. Ese strip es la única línea de defensa: no lo toques sin entenderlo.

> **Incidente 2026-06-08:** 9 posts se publicaron con URLs tipo
> `/blog/2026-05-29-infoproductos-con-ia/`. Se migraron a slug limpio con `git mv`
> + 9 redirects 301 en `docker/nginx.conf` del repo web. Causa raíz: el nombre de
> fichero con fecha llegaba intacto a la URL. Corregido en `publish-to-astro.py`.
> **Esto no puede volver a pasar.**

### 2. Los redirects 301 viven en `docker/nginx.conf` del repo web.

El sitio se sirve con **nginx** (Docker en Coolify), no Apache. Cualquier
`.htaccess` está MUERTO — nginx no lo lee (el `public/.htaccess` obsoleto del
repo web se eliminó el 2026-07-03 precisamente por esto). Cualquier 301 va al
bloque `map $uri $r301` de `docker/nginx.conf`. Push a `main` → Coolify
reconstruye en ~1-2 min → 301 reales de servidor.

### 3. Enlaces internos: apuntar al destino final, nunca a una URL que redirige.

Si renombras/migras una URL, busca y corrige los enlaces internos que apuntaban a
la vieja (`grep -rn "blog/2026-" src/`). Un enlace interno que pasa por un 301
desperdicia crawl budget y equity.

### 4. Verificar antes de cantar victoria.

Tras cualquier cambio de URLs: `npm run build` en el repo web (valida esquema Zod
y regenera el sitemap), y confirma que NO queda ninguna URL con fecha en
`dist/sitemap*.xml` ni en `dist/llms*.txt`. En producción, comprueba que la URL
vieja da 301 y la nueva 200.

### 5. Los ensayos duplicados en Substack no se indexan en franlledo.com.

Los ensayos individuales de `https://franlledo.com/ensayos/<slug>/` se publican
con el mismo contenido en Substack y en la web. La copia de franlledo.com debe
seguir accesible para lectores, pero lleva `noindex, follow` y queda fuera del
sitemap XML. No usar canonical externo ni añadir enlaces automáticos a Substack.
La portada `/ensayos/` sí puede indexarse porque es una página original de
navegación.

---

## Arquitectura (los cuatro sistemas)

- **keyword-researcher** (`prompts/keyword-researcher.md`): descubre keywords
  con AI fan-out + DataForSEO, llena `state/keyword-bank.json` y
  `state/content-queue.json`. Incluye el gate de autoridad `Step 5b`
  (2026-07-28): antes de encolar, mide la mediana de autoridad del top-5
  orgánico contra el rank vivo del sitio y degrada a P2 las SERPs-muro
  (regla: `mediana top-5 > SITE_RANK+200 y sin rival desplazable`), con
  válvula de escape para candidatas GEO-citables.
- **content-writer** (`prompts/content-writer.md`): coge el siguiente item
  `queued`, escribe el post en `output/posts/<YYYY-MM-DD>-<slug>.md` + sidecar
  `.meta.json`, lintea, marca la cola, y publica vía `publish-to-astro.py`.
- **onsite-audit** (`prompts/onsite-audit.md`): Lighthouse + on-page, escribe
  `state/onsite-audit.json`.
- **refresh-recommender** (`prompts/refresh-recommender.md`): agente híbrido —
  primero `scripts/refresh-scorer.py` (Python, venv local) tira de GSC (URL
  Inspection API) y puntúa decay e indexación; después el LLM clasifica.
  Escribe `state/refresh-candidates.json`.

Orquestación: `./coordinator.sh <agente>` (locking con timeout de 1h, logging a
`state/agent-log.json`, git auto-commit `seo(<agente>): run <fecha>`,
breadcrumbs de tutorial). Informe semanal: `scripts/weekly-seo-report.mjs`
(GSC + GA4 + tracking de citas en LLMs + monitorización de competidores).

Existe además un modo **interactivo** de cada sistema como skill de Claude Code
en `.claude/skills/` (content-writer, keyword-researcher, onsite-audit,
refresh-recommender, context-bootstrapper). Las skills son puntos de entrada
con humano en el loop; la fuente de verdad de las reglas sigue siendo el prompt
correspondiente en `prompts/`.

---

## Stack y estructura

**Stack:** Bash (coordinator), Python 3 (venv local `.venv/` con
`google-api-python-client`, `google-auth`, `requests` — ver
`requirements.txt`), Node.js (scripts `.mjs` con `googleapis` — ver
`package.json`), CLI `claude` en modo headless (`claude -p ... --model sonnet
--dangerously-skip-permissions`), MCP DataForSEO (`dfs-mcp` vía `npx
dataforseo-mcp-server`), launchd (macOS) para la programación.

```
seo-franlledo/
├── AGENTS.md              ← este archivo (reglas e invariantes)
├── PROJECT_STATUS.md      ← estado vivo, se actualiza cada sesión
├── README.md              ← guía para humanos
├── coordinator.sh         ← orquestador de runs (locking, log, auto-commit)
├── prompts/               ← prompt de cada agente (fuente de verdad de reglas)
├── .claude/skills/        ← versión interactiva de cada agente + bootstrapper
├── .claude/launch.json    ← dev server del repo web (puerto 4321)
├── context/               ← ⚠ GITIGNORED. 8 ficheros de negocio (site-config,
│                            audience, tone-of-voice, experience-notes,
│                            services, brand-guidelines, competitors, author)
│                            + publishing.json (destino de publicación)
│                            + audit-urls.txt
├── context-templates/     ← plantillas .example de los ficheros de context/
├── state/                 ← fuente de verdad operativa (JSON):
│                            content-queue, keyword-bank, onsite-audit,
│                            refresh-candidates, refresh-queue, agent-log,
│                            seed-keywords.txt
├── scripts/               ← ver "Cómo ejecutar"
├── output/                ← ⚠ GITIGNORED. posts/ (artefactos locales con
│                            fecha), keywords/ (dashboards HTML y CSV),
│                            kit-clientes/
├── reports/               ← ⚠ GITIGNORED. Informes por run y semanales
├── docs/                  ← tutoriales 00-04 + session-log.md (bitácora)
├── launchd/               ← plists reales (com.franlledo.*) y de ejemplo
│                            (com.example.*)
├── memory/                ← feedback persistente de Fran
└── tutorial/              ← build-log generado por cada run (gitignored)
```

**Nota sobre gitignore:** `context/`, `output/`, `reports/`, `tutorial/`,
`.env.local`, `.mcp.json` y `.claude/settings.local.json` NO están en git. Si
se cambia de máquina hay que reconstruirlos (las plantillas de `context/` están
en `context-templates/`).

---

## Cómo ejecutar

```bash
# Run manual de cualquier agente (mismo camino que los runs programados)
./coordinator.sh <keyword-researcher|content-writer|onsite-audit|refresh-recommender>
# Con semilla explícita para el researcher:
./coordinator.sh keyword-researcher "mi semilla"

# Informe semanal (GSC + GA4 + LLM citation tracking)
npm run weekly-report          # = node scripts/weekly-seo-report.mjs

# Consultas puntuales GSC (usan la OAuth de .env.local)
node scripts/gsc-28d-by-page.mjs     # clics/impresiones por página, 28 días
node scripts/gsc-28d-compare.mjs     # 28 días vs 28 anteriores, con deltas

# Validar un artículo antes de publicar
python3 scripts/lint-post.py output/posts/YYYY-MM-DD-slug.md

# Gestión de cola
python3 scripts/pick-next-queue-item.py   # siguiente `queued` (exit 2 si vacía)
python3 scripts/mark-queue-item.py ...    # cambia status/written_at/post_url

# Publicar un post al repo web (lo llama el content-writer; strip de fecha aquí)
python3 scripts/publish-to-astro.py ...

# Regenerar el dashboard HTML
python3 scripts/render-html-report.py

# Recrear el venv de Python si falta
python3 -m venv .venv && .venv/bin/pip install -r requirements.txt

# Build del sitio web (validación Zod + sitemap)
cd /Users/franlledo/Projects/franlledo-web && npm run build

# Ver qué agentes programados están cargados
launchctl list | grep 'com.franlledo.seo-'
```

### Programación activa (launchd, zona horaria Europe/Madrid)

| Job | Frecuencia | Plist |
| --- | --- | --- |
| Keyword researcher | lunes y miércoles, 09:00 | `launchd/com.franlledo.seo-keyword-researcher.plist` |
| Content writer | martes, jueves y sábado, 10:00 | `launchd/com.franlledo.seo-content-writer.plist` |
| Refresh recommender | día 1 de cada mes, 07:00 | `launchd/com.franlledo.seo-refresh-recommender.plist` |
| Informe semanal | lunes, 08:00 | `launchd/com.franlledo.seo-weekly-report.plist` |

Los `com.example.*.plist` son ejemplos de la plantilla upstream, no describen
la programación activa. Los logs stdout/stderr de launchd van a `/tmp/seo-*.std*`.

---

## Variables de entorno y credenciales (solo nombres — NUNCA valores)

- **`.env.local`** (raíz, gitignored): `GOOGLE_OAUTH_CLIENT_ID`,
  `GOOGLE_OAUTH_CLIENT_SECRET`, `GOOGLE_OAUTH_REFRESH_TOKEN` — OAuth de Google
  para GSC/GA4, usada por `scripts/*.mjs` y `scripts/refresh-scorer.py`.
- **`.mcp.json`** (raíz, gitignored): credenciales del MCP DataForSEO
  (`DATAFORSEO_USERNAME`, `DATAFORSEO_PASSWORD`). Plantilla en
  `.mcp.json.example`.
- **`SEO_CLAUDE_MODEL`** (opcional, entorno del coordinator): modelo de la CLI
  `claude` para los runs; por defecto `sonnet`.
- **`context/publishing.json`** (gitignored) contiene además la clave IndexNow
  del sitio (pública por diseño, pero no la copies a documentación).

Ningún secreto va jamás a documentación, informes ni commits.

---

## Convenciones

- **Idioma:** todo el contenido, la documentación y los commits en español.
- **Commits automáticos:** `seo(<agente>): run <YYYY-MM-DD>` (los hace el
  coordinator). Los commits manuales de documentación usan prefijo `docs:` y
  los de cambios SEO `seo:` o `seo(<agente>):`.
- **Posts:** artefacto local `output/posts/<YYYY-MM-DD>-<slug>.md` + sidecar
  `.meta.json`; URL pública sin fecha (invariante 1). Frontmatter según el
  esquema de `context/publishing.json` (title, description ~155c, pubDate,
  keyword, secondaryKeywords, draft:false, etc.).
- **Reglas duras de redacción** (las verifica `scripts/lint-post.py`):
  - `seoTitle` ≤47 caracteres con número/dato (el layout añade
    " — Fran Lledó", 13 car.; título SERP total ≤60). Regla 8 del linter:
    description 120-160.
  - Prohibidos em-dashes y emojis en los posts.
  - Firma obligatoria "Un abrazo postal,\nFran" antes del componente
    `<EmailCapture />` (CTA al final del post).
  - Nunca enlazar a productos desde los posts.
  - Cubrir el `fan_out_cluster` completo (microtemática/subpreguntas, no solo
    variantes de la keyword) e incluir **≥1 dato propio y extraíble** que
    fuerce la cita por IAs generativas (aprendizajes GEO de la entrevista a
    Luis Villanueva, 2026-07-09; solo se aplicaron los consejos SEO, no los de
    negocio — decisión de Fran).
- **Alcance temático:** `context/site-config.md` manda; p. ej. **nunca
  comparativas de herramientas** (por eso el cluster "vender cursos online" se
  descartó en el run del 2026-07-20).
- **Distribución:** NO sugerir compartir los posts del blog en las redes de
  Fran (ver `memory/feedback_social_redes.md`).
- **Informes:** un markdown por run en `reports/<fecha>-<agente>.md`; el
  semanal en `reports/<fecha>-seo-weekly.md`.

---

## Gotchas y decisiones importantes

- **Ruta del repo web:** la ruta real es `/Users/franlledo/Projects/franlledo-web`
  (corregida en `context/publishing.json` el 2026-07-03). Documentación antigua
  (README, `.claude/launch.json`, entradas viejas de la bitácora) puede seguir
  mencionando `~/Documents/Claude/franlledo-web`, que ya NO existe. Ante la
  duda, `context/publishing.json` manda. Como `context/` está gitignored, si se
  cambia de máquina hay que corregir `repo_path` a mano otra vez.
- **Publicación sin validación humana:** push directo a `main` del repo web →
  Coolify deploya en ~1-2 min. Fran prefiere editar a posteriori antes que
  validar a priori. IndexNow se pinga automáticamente al publicar (acelera
  Bing → ChatGPT Search).
- **Runs programados = NO interactivos:** el coordinator antepone una cabecera
  `MODE: AUTO` contundente al prompt de content-writer y keyword-researcher.
  Historia: entre el 04 y el 09 de julio de 2026 cada run programado fue un
  no-op de ~30s porque el agente leía el contexto y preguntaba "¿qué quieres
  hacer?" en vez de ejecutar (el marco "de sesión con humano" de este archivo
  pisaba la orden de auto-pilot). Si tocas `coordinator.sh`, no elimines esa
  cabecera. Si eres un agente en un run programado: no preguntes nada, ejecuta
  el workflow completo y termina; para en seco solo si genuinamente no hay
  trabajo (y di el motivo exacto en una línea).
- **launchd y PATH:** launchd no carga nvm (shell no-interactivo). Los plists
  llevan PATH explícito apuntando al bin de la versión de node por defecto de
  nvm — **si actualizas node con nvm, actualiza esa ruta en los plists**. La
  CLI `claude` se resuelve vía `~/.local/bin/claude` (symlink creado el
  2026-06-25 porque solo existía el binario de la extensión de VSCode).
- **Runs fantasma (incidencia abierta):** el 14/07 (content-writer) y el 22/07
  (keyword-researcher) los runs programados no se dispararon — sin commit, sin
  entrada en `state/agent-log.json`. Dos ocurrencias apuntan a algo sistémico
  en launchd. Si ves una cola vacía o un item `queued` estancado varios días,
  sospecha de esto y revisa `launchctl list` / los logs de `/tmp/seo-*`.
- **DataForSEO intermitente:** el MCP `dfs-mcp` estuvo caído del 17 al 30 de
  junio de 2026; los volúmenes/KD de esa ventana en `state/keyword-bank.json`
  son estimaciones por WebSearch, no datos de API. Además,
  `dataforseo_labs_google_keyword_ideas` con frases largas devuelve mucho ruido
  de categoría: pivota a `keyword_suggestions` / `related_keywords` /
  `keyword_overview` sobre listas curadas (patrón confirmado el 13/07, 15/07 y
  20/07).
- **Congelación de snippets:** tras desplegar titles/descriptions nuevos, no
  volver a tocarlos durante ~2 semanas para poder medir CTR (ventanas: 03/07 →
  ~17/07; refresh del 16/07 → ventana nueva desde esa fecha).
- **Autoridad, no contenido (2026-07-28):** rank DataForSEO de franlledo.com =
  227 frente a 400-700 del típico competidor de página 1. cazatarjetas.com es
  más débil (162), así que el enlace cazatarjetas→franlledo es "hacerlo y
  olvidarlo", no una palanca. Las palancas reales son de Fran: enlaces
  editoriales, YouTube/Substack→blog. La única SERP ganable medida: "asuntos
  de email" (ya #5 orgánico).
- **Informes HTML históricos** de `output/keywords/` pueden contener URLs con
  fecha del incidente del 8 de junio. Son snapshots, no fuentes activas.
- **Emails de aviso de GSC** pueden describir problemas ya resueltos:
  los del 18/07 ("Error de redirección", "404") eran transitorios de la ventana
  de deploy del 16/07, verificados sanos con la URL Inspection API. Antes de
  actuar sobre un email de GSC, verifica el estado real en producción y con la
  API.
- **`agentes-ia-sin-codigo-para-emprendedores`** está en `needs_review` desde
  el 2026-07-02 por solapamiento con dos posts de IA ya publicados: decidir si
  se retira, fusiona o replantea (ver `reports/2026-07-02-content-writer.md`).
- **Ensayos y Substack:** invariante 5 — `noindex, follow`, fuera del sitemap,
  sin canonical externo.

---

## Relación con otros proyectos de Fran

- **`/Users/franlledo/Projects/franlledo-web`** — el sitio franlledo.com
  (Astro SSG). Es el destino de publicación de este repo y donde viven los
  redirects (`docker/nginx.conf`), el sitemap y el script de OG images
  (`scripts/og/generate-og.mjs`, requiere Playwright — integración pendiente,
  hito 2).
- **cazatarjetas.com** — el otro negocio de Fran (Cazatarjetas). Sitio
  independiente con su propia propiedad de GSC (a veces sus emails de GSC se
  cuelan en el mismo buzón — no confundir). Autoridad menor que franlledo.com.
- **Substack de Fran** — publica los mismos ensayos que
  `franlledo.com/ensayos/` (ver invariante 5).
- **Dashboard project (Google Cloud)** — el proyecto OAuth cuyas credenciales
  usa `refresh-scorer.py` y los scripts `.mjs` para GSC/GA4.
