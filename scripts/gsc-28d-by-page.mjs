// Consulta puntual: GSC últimos 28 días, clics/impresiones por página de /blog/.
// Reutiliza la auth OAuth local de .env.local. Ejecutar: node scripts/gsc-28d-by-page.mjs
import { google } from "googleapis";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..");
const SITE_GSC = "sc-domain:franlledo.com";

function loadGoogleOAuth() {
  const text = fs.readFileSync(path.join(REPO_ROOT, ".env.local"), "utf8");
  const env = {};
  for (const line of text.split("\n")) {
    const m = line.match(/^(GOOGLE_OAUTH_[A-Z_]+)=(.*)$/);
    if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
  const c = new google.auth.OAuth2(env.GOOGLE_OAUTH_CLIENT_ID, env.GOOGLE_OAUTH_CLIENT_SECRET);
  c.setCredentials({ refresh_token: env.GOOGLE_OAUTH_REFRESH_TOKEN });
  return c;
}

const fmt = (d) => d.toISOString().slice(0, 10);
const end = new Date(); end.setDate(end.getDate() - 3); // lag GSC
const start = new Date(end); start.setDate(start.getDate() - 27);

const sc = google.searchconsole({ version: "v1", auth: loadGoogleOAuth() });

// Totales del sitio
const totals = await sc.searchanalytics.query({
  siteUrl: SITE_GSC,
  requestBody: { startDate: fmt(start), endDate: fmt(end), dimensions: [] },
});
const t = totals.data.rows?.[0] || { clicks: 0, impressions: 0, ctr: 0, position: 0 };

// Por página
const pages = await sc.searchanalytics.query({
  siteUrl: SITE_GSC,
  requestBody: { startDate: fmt(start), endDate: fmt(end), dimensions: ["page"], rowLimit: 200 },
});

const rows = (pages.data.rows || [])
  .map((r) => ({ url: r.keys[0].replace("https://franlledo.com", ""), clicks: r.clicks, imp: r.impressions, pos: r.position }))
  .filter((r) => r.url.startsWith("/blog/") && !r.url.includes("/etiqueta/") && r.url !== "/blog/")
  .sort((a, b) => b.clicks - a.clicks || b.imp - a.imp);

console.log(`\n=== GSC ${fmt(start)} → ${fmt(end)} (últimos 28 días) ===`);
console.log(`SITIO TOTAL: ${t.clicks} clics | ${t.impressions} impresiones | CTR ${(t.ctr*100).toFixed(1)}% | pos media ${t.position.toFixed(1)}\n`);

const sumC = rows.reduce((s, r) => s + r.clicks, 0);
const sumI = rows.reduce((s, r) => s + r.imp, 0);
console.log(`ARTÍCULOS /blog/ con datos: ${rows.length}  |  Σ ${sumC} clics, ${sumI} impresiones\n`);
console.log("clic | impr | posM | URL");
console.log("-----|------|------|----");
for (const r of rows) {
  console.log(`${String(r.clicks).padStart(4)} | ${String(r.imp).padStart(4)} | ${r.pos.toFixed(0).padStart(4)} | ${r.url}`);
}
if (!rows.length) console.log("(ningún artículo de /blog/ registró impresiones en la ventana)");
