// Consulta puntual: GSC últimos 28 días vs los 28 anteriores — totales,
// páginas y queries con delta. Reutiliza la auth OAuth de .env.local.
// Ejecutar: node scripts/gsc-28d-compare.mjs
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
const prevEnd = new Date(start); prevEnd.setDate(prevEnd.getDate() - 1);
const prevStart = new Date(prevEnd); prevStart.setDate(prevStart.getDate() - 27);

const sc = google.searchconsole({ version: "v1", auth: loadGoogleOAuth() });

async function query(startDate, endDate, dimensions, rowLimit = 100) {
  const r = await sc.searchanalytics.query({
    siteUrl: SITE_GSC,
    requestBody: { startDate: fmt(startDate), endDate: fmt(endDate), dimensions, rowLimit },
  });
  return r.data.rows || [];
}

const [curTot, prevTot, curPages, prevPages, curQ, prevQ] = await Promise.all([
  query(start, end, []),
  query(prevStart, prevEnd, []),
  query(start, end, ["page"], 200),
  query(prevStart, prevEnd, ["page"], 200),
  query(start, end, ["query"], 200),
  query(prevStart, prevEnd, ["query"], 200),
]);

const t = curTot[0] || { clicks: 0, impressions: 0, ctr: 0, position: 0 };
const p = prevTot[0] || { clicks: 0, impressions: 0, ctr: 0, position: 0 };
const pct = (a, b) => (b === 0 ? (a > 0 ? "n/a (antes 0)" : "0%") : `${(((a - b) / b) * 100).toFixed(0)}%`);

console.log(JSON.stringify({
  window: { current: [fmt(start), fmt(end)], previous: [fmt(prevStart), fmt(prevEnd)] },
  totals: {
    current: { clicks: t.clicks, impressions: t.impressions, ctr: +(t.ctr * 100).toFixed(2), position: +t.position.toFixed(1) },
    previous: { clicks: p.clicks, impressions: p.impressions, ctr: +(p.ctr * 100).toFixed(2), position: +p.position.toFixed(1) },
    delta: { clicks: pct(t.clicks, p.clicks), impressions: pct(t.impressions, p.impressions) },
  },
}, null, 1));

function merge(cur, prev, keyName) {
  const map = new Map();
  for (const r of cur) map.set(r.keys[0], { [keyName]: r.keys[0], c: r.clicks, i: r.impressions, pos: +r.position.toFixed(1), pc: 0, pi: 0, ppos: null });
  for (const r of prev) {
    const e = map.get(r.keys[0]) || { [keyName]: r.keys[0], c: 0, i: 0, pos: null, pc: 0, pi: 0, ppos: null };
    e.pc = r.clicks; e.pi = r.impressions; e.ppos = +r.position.toFixed(1);
    map.set(r.keys[0], e);
  }
  return [...map.values()];
}

const pages = merge(curPages, prevPages, "url").map((r) => ({ ...r, url: r.url.replace("https://franlledo.com", "") }));
const queries = merge(curQ, prevQ, "q");

const fmtRow = (r, label) => `${String(r.c).padStart(3)} clics (antes ${r.pc}) | ${String(r.i).padStart(4)} impr (antes ${r.pi}) | pos ${r.pos ?? "-"} (antes ${r.ppos ?? "-"}) | ${label}`;

console.log("\n=== PÁGINAS top actuales (por clics, luego impresiones) ===");
for (const r of pages.sort((a, b) => b.c - a.c || b.i - a.i).slice(0, 15)) console.log(fmtRow(r, r.url));

console.log("\n=== PÁGINAS que más caen (clics o impresiones vs prev) ===");
for (const r of pages.filter((r) => r.pc - r.c > 0 || r.pi - r.i > 5).sort((a, b) => (b.pc - b.c) - (a.pc - a.c) || (b.pi - b.i) - (a.pi - a.i)).slice(0, 10)) console.log(fmtRow(r, r.url));

console.log("\n=== QUERIES top actuales ===");
for (const r of queries.sort((a, b) => b.c - a.c || b.i - a.i).slice(0, 15)) console.log(fmtRow(r, r.q));

console.log("\n=== QUERIES que más caen ===");
for (const r of queries.filter((r) => r.pc - r.c > 0 || r.pi - r.i > 5).sort((a, b) => (b.pc - b.c) - (a.pc - a.c) || (b.pi - b.i) - (a.pi - a.i)).slice(0, 10)) console.log(fmtRow(r, r.q));

console.log("\n=== QUERIES nuevas con más impresiones (no aparecían antes) ===");
for (const r of queries.filter((r) => r.pi === 0 && r.i > 0).sort((a, b) => b.i - a.i).slice(0, 10)) console.log(fmtRow(r, r.q));
