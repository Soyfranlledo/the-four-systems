#!/usr/bin/env node
// weekly-seo-report.mjs
//
// Tira de GSC + GA4 + DataForSEO (LLM scraping + competitor ranked_keywords)
// y produce un report markdown semanal en reports/<date>-seo-weekly.md.
//
// Diseño:
// - GSC: totals esta semana vs semana anterior, top queries/pages.
// - GA4: sessions por canal en la ventana actual.
// - LLM tracking: para cada query objetivo, llama al ChatGPT scraper de DFS
//   y comprueba si la respuesta cita franlledo.com / Fran Lledó / Cazatarjetas.
// - Competitor: pulls ranked_keywords para los 3 competidores directos.
//
// Ejecutar:
//   cd "/Users/franlledo/Documents/Claude/Projects/Dashboard Fran Lledó"
//   node /Users/franlledo/Documents/Claude/Projects/seo-franlledo/scripts/weekly-seo-report.mjs
//
// (El cd al dashboard es para que Node resuelva `googleapis` del node_modules
//  de ese proyecto. Puede automatizarse con un wrapper bash si interesa.)

import { google } from "googleapis";
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

// Queries elegidas para que ChatGPT active web_search (mejores X 2026,
// comparativas, recomendaciones). Las "explica concepto" no triggerean
// web search en gpt-4o, así que no nos dicen si nos cita en el SERP que
// ChatGPT Search consulta.
// 8 queries: 6 categoriales + 2 brand discovery (Fran / Cazatarjetas).
// Las primeras 6 miden si los LLMs encuentran a Fran cuando un usuario busca
// expertise o referentes del nicho. Las 2 últimas confirman que al menos el
// branded search lo devuelve correctamente.
const LLM_QUERIES = [
  "mejores blogs de email marketing en español 2026",
  "expertos en embudos de venta para solopreneurs en español",
  "newsletters diarias en español sobre marketing online",
  "qué consultor contratar para email marketing en España",
  "claude para solopreneurs y negocios online en español",
  "cómo lanzar un infoproducto sin tener una lista grande",
  "quién es Fran Lledó",
  "qué es Cazatarjetas",
];

const COMPETITORS = [
  "ivanorange.com",
  "espabilismo.com",
  "copywritingdeincognito.com",
];

const REPO_ROOT = path.resolve(__dirname, "..");
const REPORTS_DIR = path.join(REPO_ROOT, "reports");
const DASH_ENV_PATH = "/Users/franlledo/Documents/Claude/Projects/Dashboard Fran Lledó/.env.local";
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

  const [byChannel, daily] = await Promise.all([
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
  return out;
}

async function llmMentionsSection() {
  // ChatGPT con web_search activado. Simula la experiencia de ChatGPT Search:
  // el modelo busca en la web (Bing) y cita sources en las annotations.
  // Endpoint: /ai_optimization/chat_gpt/llm_responses/live, modelo gpt-4o.
  // Coste aproximado: ~$0.08 por query (×6 queries = ~$0.50 por report).
  function extractFromResponse(data) {
    const item = data?.tasks?.[0]?.result?.[0]?.items?.[0];
    if (!item) return { text: "", urls: [] };
    let text = "";
    const urls = [];
    for (const sec of item.sections || []) {
      if (sec.text) text += " " + sec.text;
      for (const a of sec.annotations || []) {
        if (a.url) urls.push(a.url);
      }
    }
    return { text: text.toLowerCase(), urls };
  }

  const competitorDomains = COMPETITORS.map((c) => c.toLowerCase());
  const results = [];
  for (const q of LLM_QUERIES) {
    try {
      const data = await dfs("/ai_optimization/chat_gpt/llm_responses/live", [
        {
          user_prompt: q,
          model_name: "gpt-4o",
          web_search: true,
          language_code: "es",
          location_name: "Spain",
        },
      ]);
      const { text, urls } = extractFromResponse(data);
      const mentionedDomain =
        text.includes("franlledo.com") || urls.some((u) => u.toLowerCase().includes("franlledo.com"));
      const mentionedBrand =
        text.includes("fran lledó") || text.includes("fran lledo") || text.includes("cazatarjetas");
      const competitorsCited = competitorDomains.filter((d) =>
        urls.some((u) => u.toLowerCase().includes(d))
      );
      results.push({
        q,
        domain: mentionedDomain,
        brand: mentionedBrand,
        sourceCount: urls.length,
        competitorsCited,
        topUrls: urls.slice(0, 3),
      });
    } catch (e) {
      results.push({ q, error: e.message.slice(0, 100) });
    }
  }
  let out = `Queries enviadas a ChatGPT (gpt-4o) con web_search activo. Simulamos la búsqueda real de ChatGPT Search. "✓ brand" = la respuesta texto menciona "Fran Lledó" o "Cazatarjetas". "✓ domain" = ChatGPT enlazó franlledo.com como source. "src" = total de URLs citadas. "comp" = competidores directos citados.\n\n`;
  out += `| Query | Brand | Domain | src | Competidores citados |\n|---|:-:|:-:|:-:|---|\n`;
  for (const r of results) {
    if (r.error) {
      out += `| ${r.q.slice(0, 60)} | ERR | ERR | — | ${r.error.slice(0, 40)} |\n`;
    } else {
      const comp = r.competitorsCited.length ? r.competitorsCited.join(", ") : "—";
      out += `| ${r.q.slice(0, 60)} | ${r.brand ? "✓" : "—"} | ${r.domain ? "✓" : "—"} | ${r.sourceCount} | ${comp} |\n`;
    }
  }
  out += `\n#### Top URLs citadas por ChatGPT en estas queries\n\n`;
  const allUrls = results.flatMap((r) => r.topUrls || []);
  const urlCounts = new Map();
  for (const u of allUrls) {
    try {
      const dom = new URL(u).hostname.replace(/^www\./, "");
      urlCounts.set(dom, (urlCounts.get(dom) || 0) + 1);
    } catch {}
  }
  const sortedDomains = [...urlCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10);
  out += `| Dominio | Veces citado |\n|---|---:|\n`;
  for (const [d, n] of sortedDomains) out += `| ${d} | ${n} |\n`;
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

async function main() {
  console.error(`Generating weekly report for ${fmt(lookbackStart)} → ${fmt(lookbackEnd)}...`);
  const auth = loadGoogleOAuth();
  fs.mkdirSync(REPORTS_DIR, { recursive: true });

  const [gsc, ga4, llm, comp] = await Promise.all([
    gscSection(auth).catch((e) => `ERROR: ${e.message}`),
    ga4Section(auth).catch((e) => `ERROR: ${e.message}`),
    llmMentionsSection().catch((e) => `ERROR: ${e.message}`),
    competitorSection().catch((e) => `ERROR: ${e.message}`),
  ]);

  const date = fmt(today);
  const report = `# SEO/GEO Weekly Report — ${date}

Window: ${fmt(lookbackStart)} → ${fmt(lookbackEnd)} (vs prev: ${fmt(prevStart)} → ${fmt(prevEnd)})
Generated: ${new Date().toISOString()}

## 1. Google Search Console

${gsc}

## 2. Google Analytics 4

${ga4}

## 3. LLM citation tracking

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
