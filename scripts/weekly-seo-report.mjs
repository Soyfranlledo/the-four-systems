#!/usr/bin/env node
// weekly-seo-report.mjs
//
// Tira de GSC + GA4 + DataForSEO (LLM scraping + competitor ranked_keywords)
// y produce un report markdown semanal en reports/<date>-seo-weekly.md.
//
// Diseño:
// - GSC: totals esta semana vs semana anterior, top queries/pages.
// - GA4: sessions por canal en la ventana actual.
// - IA: muestra mensual de 12 preguntas × 4 modelos, reusada entre informes
//   semanales. Conserva respuestas y separa menciones de citas verificables.
// - Competitor: pulls ranked_keywords para los 3 competidores directos.
//
// Ejecutar:
//   node <repo>/scripts/weekly-seo-report.mjs
//
// (`googleapis` se resuelve del node_modules local del repo — ya no depende
//  del Dashboard project. Credenciales OAuth en <repo>/.env.local.)

import { google } from "googleapis";
import { weeklyVisibilitySection } from "./ai-visibility-report.mjs";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ----- Config -----
const SITE_GSC = "sc-domain:franlledo.com";
const GA4_PROPERTY = "properties/443567178";
const SITE_DOMAIN = "franlledo.com";

const COMPETITORS = [
  "ivanorange.com",
  "espabilismo.com",
  "copywritingdeincognito.com",
];

const REPO_ROOT = path.resolve(__dirname, "..");
const REPORTS_DIR = path.join(REPO_ROOT, "reports");
// Credenciales OAuth locales al proyecto (mínimo privilegio: solo GOOGLE_OAUTH_*).
// Antes leía Dashboard Fran Lledó/.env.local en ~/Documents, que macOS Sequoia
// bloquea para procesos de launchd (TCC). Ahora vive dentro del repo.
const DASH_ENV_PATH = path.join(REPO_ROOT, ".env.local");
const DFS_MCP_JSON = path.join(REPO_ROOT, ".mcp.json");

// ----- Date helpers -----
const today = new Date();
const lookbackEnd = new Date(today);
lookbackEnd.setDate(lookbackEnd.getDate() - 3); // GSC has ~3 days lag
const lookbackStart = new Date(lookbackEnd);
lookbackStart.setDate(lookbackStart.getDate() - 6);
const prevEnd = new Date(lookbackStart);
prevEnd.setDate(prevEnd.getDate() - 1);
const prevStart = new Date(prevEnd);
prevStart.setDate(prevStart.getDate() - 6);

const fmt = (d) => d.toISOString().slice(0, 10);

// ----- Credential loaders -----
function loadGoogleOAuth() {
  const text = fs.readFileSync(DASH_ENV_PATH, "utf8");
  const env = {};
  for (const line of text.split("\n")) {
    const m = line.match(/^(GOOGLE_OAUTH_[A-Z_]+)=(.*)$/);
    if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
  const c = new google.auth.OAuth2(env.GOOGLE_OAUTH_CLIENT_ID, env.GOOGLE_OAUTH_CLIENT_SECRET);
  c.setCredentials({ refresh_token: env.GOOGLE_OAUTH_REFRESH_TOKEN });
  return c;
}

function loadDfsCreds() {
  const cfg = JSON.parse(fs.readFileSync(DFS_MCP_JSON, "utf8"));
  const env = cfg.mcpServers["dfs-mcp"].env;
  return { username: env.DATAFORSEO_USERNAME, password: env.DATAFORSEO_PASSWORD };
}

async function dfs(endpoint, body) {
  const { username, password } = loadDfsCreds();
  const auth = Buffer.from(`${username}:${password}`).toString("base64");
  const r = await fetch(`https://api.dataforseo.com/v3${endpoint}`, {
    method: "POST",
    headers: { "Authorization": `Basic ${auth}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!r.ok) throw new Error(`DFS ${endpoint} HTTP ${r.status}`);
  return r.json();
}

// ----- Sections -----

async function gscSection(auth) {
  const sc = google.searchconsole({ version: "v1", auth });
  const range = { startDate: fmt(lookbackStart), endDate: fmt(lookbackEnd) };
  const prevRange = { startDate: fmt(prevStart), endDate: fmt(prevEnd) };

  const [totalsThis, totalsPrev, queries, pages, sm] = await Promise.all([
    sc.searchanalytics.query({ siteUrl: SITE_GSC, requestBody: { ...range, dimensions: [] } }),
    sc.searchanalytics.query({ siteUrl: SITE_GSC, requestBody: { ...prevRange, dimensions: [] } }),
    sc.searchanalytics.query({ siteUrl: SITE_GSC, requestBody: { ...range, dimensions: ["query"], rowLimit: 15 } }),
    sc.searchanalytics.query({ siteUrl: SITE_GSC, requestBody: { ...range, dimensions: ["page"], rowLimit: 10 } }),
    sc.sitemaps.list({ siteUrl: SITE_GSC }),
  ]);

  const t = totalsThis.data.rows?.[0] || { clicks: 0, impressions: 0, ctr: 0, position: 0 };
  const p = totalsPrev.data.rows?.[0] || { clicks: 0, impressions: 0, ctr: 0, position: 0 };
  const delta = (c, pr) => {
    const d = c - pr;
    if (d === 0) return "0";
    return `${d > 0 ? "+" : ""}${d}`;
  };

  let out = `### Totals (${range.startDate} → ${range.endDate}, vs prev 7 days)\n\n`;
  out += `- Clicks: **${t.clicks}** (${delta(t.clicks, p.clicks)} vs prev ${p.clicks})\n`;
  out += `- Impressions: **${t.impressions}** (${delta(t.impressions, p.impressions)} vs prev ${p.impressions})\n`;
  out += `- CTR: ${(t.ctr * 100).toFixed(2)}%\n`;
  out += `- Avg position: ${t.position.toFixed(1)}\n\n`;

  out += `### Sitemaps registered\n\n`;
  for (const s of (sm.data.sitemap || [])) {
    out += `- \`${s.path}\` — lastDownloaded=${s.lastDownloaded || "(pending)"} errors=${s.errors || 0}\n`;
  }
  if (!(sm.data.sitemap || []).length) out += `- (none registered)\n`;
  out += "\n";

  out += `### Top 15 queries this window\n\n| Pos | Imp | Clk | Query |\n|---:|---:|---:|---|\n`;
  for (const r of queries.data.rows || []) {
    out += `| ${r.position.toFixed(1)} | ${r.impressions} | ${r.clicks} | ${r.keys[0].slice(0, 75).replace(/\|/g, "\\|")} |\n`;
  }

  out += `\n### Top 10 pages this window\n\n| Pos | Imp | Clk | Page |\n|---:|---:|---:|---|\n`;
  for (const r of pages.data.rows || []) {
    const pth = r.keys[0].replace(`https://${SITE_DOMAIN}`, "");
    out += `| ${r.position.toFixed(1)} | ${r.impressions} | ${r.clicks} | ${pth.slice(0, 75)} |\n`;
  }

  return out;
}

async function ga4Section(auth) {
  const ga = google.analyticsdata({ version: "v1beta", auth });

  const [byChannel, daily, signupsByChannel] = await Promise.all([
    ga.properties.runReport({
      property: GA4_PROPERTY,
      requestBody: {
        dateRanges: [{ startDate: fmt(lookbackStart), endDate: fmt(today) }],
        dimensions: [{ name: "sessionDefaultChannelGroup" }],
        metrics: [
          { name: "sessions" },
          { name: "totalUsers" },
          { name: "screenPageViews" },
        ],
        orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
      },
    }),
    ga.properties.runReport({
      property: GA4_PROPERTY,
      requestBody: {
        dateRanges: [{ startDate: fmt(lookbackStart), endDate: fmt(today) }],
        dimensions: [{ name: "date" }],
        metrics: [{ name: "sessions" }, { name: "screenPageViews" }],
        orderBys: [{ dimension: { dimensionName: "date" } }],
      },
    }),
    ga.properties.runReport({
      property: GA4_PROPERTY,
      requestBody: {
        dateRanges: [{ startDate: fmt(lookbackStart), endDate: fmt(today) }],
        dimensions: [
          { name: "sessionDefaultChannelGroup" },
          { name: "landingPagePlusQueryString" },
        ],
        metrics: [{ name: "eventCount" }, { name: "totalUsers" }],
        dimensionFilter: {
          filter: {
            fieldName: "eventName",
            stringFilter: { matchType: "EXACT", value: "newsletter_signup" },
          },
        },
        orderBys: [{ metric: { metricName: "eventCount" }, desc: true }],
      },
    }),
  ]);

  let out = `### Sessions by channel (${fmt(lookbackStart)} → today)\n\n| Channel | Sessions | Users | Pageviews |\n|---|---:|---:|---:|\n`;
  for (const row of byChannel.data.rows || []) {
    out += `| ${row.dimensionValues[0].value} | ${row.metricValues[0].value} | ${row.metricValues[1].value} | ${row.metricValues[2].value} |\n`;
  }
  out += `\n### Daily breakdown\n\n| Date | Sessions | Pageviews |\n|---|---:|---:|\n`;
  for (const row of daily.data.rows || []) {
    const d = row.dimensionValues[0].value;
    const date = `${d.slice(0, 4)}-${d.slice(4, 6)}-${d.slice(6, 8)}`;
    out += `| ${date} | ${row.metricValues[0].value} | ${row.metricValues[1].value} |\n`;
  }
  out += `\n### Newsletter signups by channel\n\n| Channel | Landing page | Signups | Users |\n|---|---|---:|---:|\n`;
  for (const row of signupsByChannel.data.rows || []) {
    out += `| ${row.dimensionValues[0].value} | ${row.dimensionValues[1].value} | ${row.metricValues[0].value} | ${row.metricValues[1].value} |\n`;
  }
  if (!(signupsByChannel.data.rows || []).length) {
    out += `| — | — | 0 | 0 |\n`;
  }
  return out;
}

async function competitorSection() {
  let out = "";
  for (const dom of COMPETITORS) {
    out += `\n**${dom}**\n\n`;
    try {
      const data = await dfs("/dataforseo_labs/google/ranked_keywords/live", [
        {
          target: dom,
          language_code: "es",
          location_name: "Spain",
          limit: 10,
          filters: [["ranked_serp_element.serp_item.rank_group", "<=", 20]],
          order_by: ["keyword_data.keyword_info.search_volume,desc"],
        },
      ]);
      const items = data?.tasks?.[0]?.result?.[0]?.items || [];
      if (items.length === 0) {
        out += "(no data; DFS database may not have this competitor yet)\n";
        continue;
      }
      out += "| Pos | Vol | KD | Keyword |\n|---:|---:|---:|---|\n";
      for (const it of items) {
        const k = it.keyword_data?.keyword || "?";
        const pos = it.ranked_serp_element?.serp_item?.rank_absolute || "?";
        const vol = it.keyword_data?.keyword_info?.search_volume ?? "—";
        const kd = it.keyword_data?.keyword_properties?.keyword_difficulty ?? "—";
        out += `| ${pos} | ${vol} | ${kd} | ${k.slice(0, 65)} |\n`;
      }
    } catch (e) {
      out += `ERROR: ${e.message}\n`;
    }
  }
  return out;
}

// ----- Main -----

// --- 0. Salud del pipeline ---------------------------------------------------
// El fallo de un agente programado es silencioso por diseño: coordinator.sh
// escribe una línea en state/agent-log.json y sale con exit 1, que launchd
// descarta. Del 2026-09-07 al 2026-09-22, trece runs consecutivos murieron por
// auth caducada y nadie se enteró en 16 días. Este informe corre los lunes con
// OAuth de Google, no con la CLI de claude, así que es inmune a ese fallo
// concreto: es el sitio correcto para poner el centinela.
function pipelineHealthSection() {
  const AGENT_LOG = path.join(REPO_ROOT, "state", "agent-log.json");
  const QUEUE = path.join(REPO_ROOT, "state", "content-queue.json");
  const lines = [];

  let log;
  try {
    log = JSON.parse(fs.readFileSync(AGENT_LOG, "utf8"));
  } catch (e) {
    return `ERROR: no se pudo leer state/agent-log.json (${e.message}). El centinela no ha podido comprobar nada; no interpretar como "todo correcto".`;
  }

  const now = Date.now();
  const daysSince = (ts) => (now - new Date(ts).getTime()) / 86400000;

  const recentErrors = log.filter((e) => {
    const d = daysSince(e.timestamp);
    return e.status === "error" && Number.isFinite(d) && d <= 7;
  });

  if (recentErrors.length === 0) {
    lines.push("Errores de agentes (últimos 7 días): **0**.");
  } else {
    lines.push(`Errores de agentes (últimos 7 días): **${recentErrors.length}**.`);
    lines.push("");
    lines.push("| Fecha | Agente | Mensaje |");
    lines.push("| --- | --- | --- |");
    for (const e of recentErrors.slice(-15)) {
      lines.push(`| ${String(e.timestamp).slice(0, 10)} | ${e.agent} | ${e.message} |`);
    }
    const authFails = recentErrors.filter((e) => String(e.message).includes("auth"));
    if (authFails.length) {
      lines.push("");
      lines.push(
        `**${authFails.length} fallo(s) de autenticación de la CLI.** Arreglo: ejecutar ` +
          "`claude setup-token` y guardar el token en `.env.local` como `CLAUDE_CODE_OAUTH_TOKEN`."
      );
    }
  }

  lines.push("");

  let lastWritten = null;
  const counts = {};
  try {
    const q = JSON.parse(fs.readFileSync(QUEUE, "utf8"));
    for (const it of q.items || []) {
      counts[it.status] = (counts[it.status] || 0) + 1;
      if (it.written_at && (!lastWritten || it.written_at > lastWritten)) lastWritten = it.written_at;
    }
  } catch (e) {
    lines.push(`No se pudo leer content-queue.json: ${e.message}`);
  }

  if (lastWritten) {
    const d = Math.floor(daysSince(lastWritten));
    lines.push(
      `Días desde la última publicación: **${d}**${d > 10 ? " (ATENCIÓN)" : ""} (${String(lastWritten).slice(0, 10)}).`
    );
  } else {
    lines.push("Días desde la última publicación: sin dato (`written_at` vacío en toda la cola).");
  }

  const queued = counts.queued || 0;
  const rest = Object.entries(counts)
    .filter(([k]) => k !== "queued")
    .map(([k, v]) => `${v} ${k}`)
    .join(", ");
  lines.push(`Cola: **${queued} queued**${rest ? `, ${rest}` : ""}.`);

  if (queued === 0) {
    lines.push("");
    lines.push(
      "Cola en 0: el próximo content-writer resembrará encadenando un keyword-researcher " +
        "(preflight de cola en `coordinator.sh`). Si aun así sale no-op, la semilla de rotación está agotada."
    );
  }

  return lines.join("\n");
}

async function main() {
  console.error(`Generating weekly report for ${fmt(lookbackStart)} → ${fmt(lookbackEnd)}...`);
  const auth = loadGoogleOAuth();
  fs.mkdirSync(REPORTS_DIR, { recursive: true });

  let health;
  try {
    health = pipelineHealthSection();
  } catch (e) {
    health = `ERROR generando la sección de salud: ${e.message}`;
  }

  const [gsc, ga4, llm, comp] = await Promise.all([
    gscSection(auth).catch((e) => `ERROR: ${e.message}`),
    ga4Section(auth).catch((e) => `ERROR: ${e.message}`),
    weeklyVisibilitySection().catch((e) => `Medición de IA no disponible: ${e.message}. No interpretar como ausencia de citas; revisar state/ai-visibility-latest.json para la última medición.`),
    competitorSection().catch((e) => `ERROR: ${e.message}`),
  ]);

  const date = fmt(today);
  const report = `# SEO/GEO Weekly Report — ${date}

Window: ${fmt(lookbackStart)} → ${fmt(lookbackEnd)} (vs prev: ${fmt(prevStart)} → ${fmt(prevEnd)})
Generated: ${new Date().toISOString()}

## 0. Salud del pipeline

${health}

## 1. Google Search Console

${gsc}

## 2. Google Analytics 4

${ga4}

## 3. Visibilidad en IA (medición mensual)

${llm}

## 4. Competitor monitoring

${comp}

---
*Auto-generated by scripts/weekly-seo-report.mjs.*
`;

  const reportPath = path.join(REPORTS_DIR, `${date}-seo-weekly.md`);
  fs.writeFileSync(reportPath, report);
  console.error(`Report written: ${reportPath}`);
  console.log(report);
}

main().catch((e) => {
  console.error("FATAL:", e);
  process.exit(1);
});
