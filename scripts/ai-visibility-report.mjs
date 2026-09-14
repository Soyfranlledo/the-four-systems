#!/usr/bin/env node
// Muestreo mensual reanudable. Las respuestas de pago nunca se repiten solas.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateApi, validateConfig, extractResponse, classify, isGroundingUrl,
  sourceUrl, summarize, renderReport, measurementSignature } from './lib/ai-visibility.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CONFIG = path.join(ROOT, 'state/ai-visibility-config.json');
const LATEST = path.join(ROOT, 'state/ai-visibility-latest.json');
const BASE = path.join(ROOT, 'reports/ai-visibility');
const LOCK = path.join(ROOT, 'state/.ai-visibility.lock');
const read = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
function atomic(file, data) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const temp = `${file}.${process.pid}.tmp`;
  fs.writeFileSync(temp, typeof data === 'string' ? data : JSON.stringify(data, null, 2) + '\n', { mode: 0o600 });
  fs.renameSync(temp, file);
}
export const monthInMadrid = (date = new Date()) => new Intl.DateTimeFormat('sv-SE',
  { timeZone: 'Europe/Madrid', year: 'numeric', month: '2-digit' }).format(date);

export function requestFor(config, provider, prompt) {
  const request = { model_name: provider.model, user_prompt: prompt.text,
    system_message: config.system_message, max_output_tokens: config.max_output_tokens };
  if (provider.id !== 'perplexity') request.web_search = true;
  if (['chat_gpt', 'claude'].includes(provider.id)) request.web_search_country_iso_code = 'ES';
  return request;
}

async function dfs(endpoint, body) {
  const env = read(path.join(ROOT, '.mcp.json')).mcpServers['dfs-mcp'].env;
  const auth = Buffer.from(`${env.DATAFORSEO_USERNAME}:${env.DATAFORSEO_PASSWORD}`).toString('base64');
  const response = await fetch(`https://api.dataforseo.com/v3${endpoint}`, {
    method: body ? 'POST' : 'GET',
    headers: { Authorization: `Basic ${auth}`, 'Content-Type': 'application/json' },
    ...(body ? { body: JSON.stringify(body) } : {}), signal: AbortSignal.timeout(145000),
  });
  if (!response.ok) throw new Error(`DataForSEO HTTP ${response.status}; resultado/coste sin confirmar`);
  return response.json();
}

function lock() {
  try {
    const fd = fs.openSync(LOCK, 'wx', 0o600);
    fs.writeFileSync(fd, JSON.stringify({ pid: process.pid, started_at: new Date().toISOString() }));
    fs.closeSync(fd);
  } catch (error) {
    if (error.code !== 'EEXIST') throw error;
    const owner = read(LOCK);
    try { process.kill(owner.pid, 0); }
    catch (probe) {
      if (probe.code === 'ESRCH') { fs.unlinkSync(LOCK); return lock(); }
      throw probe;
    }
    throw new Error(`Medición en curso (PID ${owner.pid}); no se crean llamadas duplicadas`);
  }
  return () => fs.unlinkSync(LOCK);
}

async function resolveGrounding(original) {
  let url = original;
  try {
    for (let i = 0; i < 4; i++) {
      // Solo solicitar a Google la redirección. No se visita la web destino.
      if (!isGroundingUrl(url)) return { url: sourceUrl(url) };
      const response = await fetch(url, { redirect: 'manual', signal: AbortSignal.timeout(8000) });
      const location = response.headers.get('location');
      await response.body?.cancel();
      if (!location || response.status < 300 || response.status >= 400) return { url: null, error: `HTTP ${response.status} sin redirección` };
      url = new URL(location, url).href;
    }
    return { url: null, error: 'Demasiadas redirecciones' };
  } catch { return { url: null, error: 'No se pudo resolver la redirección' }; }
}

function previousRun(period) {
  if (!fs.existsSync(BASE)) return null;
  const candidates = fs.readdirSync(BASE).filter((name) => /^\d{4}-\d{2}$/.test(name) && name < period).sort().reverse();
  for (const candidate of candidates) {
    const file = path.join(BASE, candidate, 'run.json');
    if (fs.existsSync(file)) return read(file);
  }
  return null;
}

function save(run, directory) {
  run.summary = summarize(run);
  run.updated_at = new Date().toISOString();
  atomic(path.join(directory, 'run.json'), run);
  let report = renderReport(run, previousRun(run.period));
  if (fs.existsSync(path.join(directory, 'analysis.md'))) {
    report = report.replace('\n\n', '\n\n[Lectura de los resultados y siguientes acciones](analysis.md)\n\n');
  }
  atomic(path.join(directory, 'report.md'), report);
  atomic(LATEST, { schema_version: 1, period: run.period, status: run.status, signature: run.signature,
    started_at: run.started_at, updated_at: run.updated_at,
    summary: { ...run.summary, top_domains: run.summary.top_domains.slice(0, 20), top_pages: run.summary.top_pages.slice(0, 20) },
    report: path.relative(ROOT, path.join(directory, 'report.md')),
    data: path.relative(ROOT, path.join(directory, 'run.json')) });
}

export function remainingCells(config, cells) {
  const attempted = new Set(cells.map((cell) => cell.id));
  return config.prompts.flatMap((prompt) => config.providers.map((provider) =>
    ({ id: `${prompt.id}--${provider.id}`, prompt, provider }))).filter((cell) => !attempted.has(cell.id));
}

export function committedCost(cells, reserve) {
  return cells.reduce((sum, c) => sum + (c.cost_usd ?? reserve), 0);
}

export async function collect({ maxCalls = Infinity } = {}) {
  const config = read(CONFIG);
  validateConfig(config);
  const period = monthInMadrid();
  const signature = measurementSignature(config);
  const directory = path.join(BASE, period);
  const ledger = path.join(directory, 'run.json');
  const release = lock();
  try {
    if (!fs.existsSync(ledger) && fs.existsSync(LATEST) && read(LATEST).period === period) {
      throw new Error('Existe una medición de este mes pero falta su archivo local. Restaurar reports/ai-visibility antes de consumir más API.');
    }
    const run = fs.existsSync(ledger) ? read(ledger) : {
      schema_version: 1, period, signature, config, started_at: new Date().toISOString(), status: 'partial', cells: [], resolutions: {}, models: {},
    };
    if (run.signature !== signature) throw new Error('Cambió la configuración dentro del mismo mes. Mantenerla estable o iniciar una serie revisada explícitamente.');
    // Un POST interrumpido pudo facturarse. Marcarlo, nunca repetirlo automáticamente.
    let interrupted = false;
    for (const c of run.cells) {
      if (c.status === 'pending') {
        interrupted = true;
        c.status = 'uncertain'; c.error = 'Ejecución interrumpida: revisar respuesta/coste antes de reintentar';
      }
    }
    let remaining = remainingCells(config, run.cells);
    if (!remaining.length) {
      if (interrupted) { run.status = 'partial'; save(run, directory); }
      return run;
    }
    fs.mkdirSync(path.join(directory, 'responses'), { recursive: true });
    // Descubrimiento gratuito, conservando los modelos fijados, sin sustituciones.
    const availability = new Map();
    const checks = await Promise.allSettled(config.providers.map(async (p) => {
      const data = await dfs(`/ai_optimization/${p.id}/llm_responses/models`);
      run.models[p.id] = data;
      const models = validateApi(data);
      if (!models.some((m) => m.model_name === p.model && m.web_search_supported)) throw new Error(`Modelo no disponible con búsqueda web: ${p.model}`);
      return p.id;
    }));
    checks.forEach((check, i) => availability.set(config.providers[i].id, check.status === 'fulfilled' ? null : check.reason.message));
    run.status = 'running';
    save(run, directory);
    let issued = 0;
    while (remaining.length && issued < maxCalls) {
      const batch = [];
      while (remaining.length && batch.length < 4 && issued + batch.length < maxCalls) {
        if (committedCost(run.cells, config.call_reserve_usd) + config.call_reserve_usd > config.max_cost_usd) break;
        const job = remaining.shift();
        const error = availability.get(job.provider.id);
        const cell = { id: job.id, provider: job.provider.id, prompt_id: job.prompt.id,
          requested_model: job.provider.model, status: error ? 'error' : 'pending',
          cost_usd: error ? 0 : null, ...(error ? { error } : {}), started_at: new Date().toISOString() };
        run.cells.push(cell);
        if (error) { atomic(path.join(directory, 'responses', `${job.id}.json`), { error, request_sent: false }); continue; }
        batch.push({ ...job, cell });
      }
      save(run, directory); // Reservas y IDs persistidos ANTES de enviar POST.
      if (!batch.length) break;
      await Promise.all(batch.map(async ({ provider, prompt, id, cell }) => {
        const request = requestFor(config, provider, prompt);
        const file = path.join(directory, 'responses', `${id}.json`);
        let raw;
        try {
          raw = await dfs(`/ai_optimization/${provider.id}/llm_responses/live`, [request]);
          atomic(file, { request, response: raw });
          const cost = raw.cost ?? raw.tasks?.[0]?.cost;
          cell.cost_usd = typeof cost === 'number' && Number.isFinite(cost) ? cost : null;
          const answer = extractResponse(raw);
          for (const url of answer.source_urls.filter(isGroundingUrl)) {
            if (!run.resolutions[url]) run.resolutions[url] = await resolveGrounding(url);
          }
          Object.assign(cell, classify(answer, config, run.resolutions), { status: 'ok' });
        } catch (error) {
          cell.status = raw ? 'error' : 'uncertain';
          cell.error = error.message;
          if (!raw) atomic(file, { request, error: cell.error, cost_unknown: true });
        }
        cell.finished_at = new Date().toISOString();
        save(run, directory);
        console.error(`${id}: ${cell.status}, fuentes=${cell.sources?.length ?? 'N/D'}, coste=${cell.cost_usd ?? 'desconocido'}`);
      }));
      issued += batch.length;
    }
    run.status = run.cells.length === config.prompts.length * config.providers.length
      && run.cells.every((c) => c.status === 'ok') ? 'complete' : 'partial';
    if (remaining.length && committedCost(run.cells, config.call_reserve_usd) + config.call_reserve_usd > config.max_cost_usd) run.status = 'budget_stopped';
    save(run, directory);
    return run;
  } finally { release(); }
}

export async function weeklyVisibilitySection() {
  const run = await collect();
  let section = renderReport(run, previousRun(run.period), true).replace(/^# /, '### ').replace(/^## /gm, '#### ');
  if (fs.existsSync(path.join(BASE, run.period, 'analysis.md'))) section += `\n[Análisis de esta medición](ai-visibility/${run.period}/analysis.md).\n`;
  return section;
}

async function main() {
  const args = process.argv.slice(2);
  if (args.includes('--plan')) {
    const config = read(CONFIG);
    validateConfig(config);
    console.log(JSON.stringify({ period: monthInMadrid(), prompts: config.prompts, providers: config.providers,
      total_calls: config.prompts.length * config.providers.length, max_cost_usd: config.max_cost_usd,
      note: 'Plan local, sin llamadas a API. El umbral no garantiza un tope exacto por las respuestas en curso.' }, null, 2));
  } else if (args.includes('--collect')) {
    const i = args.indexOf('--max-calls');
    const maxCalls = i < 0 ? Infinity : Number(args[i + 1]);
    if (!(maxCalls > 0) || (i >= 0 && !Number.isInteger(maxCalls))) throw new Error('--max-calls debe ser un entero positivo');
    const run = await collect({ maxCalls });
    console.log(JSON.stringify({ period: run.period, status: run.status, summary: run.summary }, null, 2));
  } else if (args.includes('--render')) {
    const release = lock();
    try {
      const latest = read(LATEST);
      const run = read(path.join(ROOT, latest.data));
      const directory = path.dirname(path.join(ROOT, latest.data));
      // Reclasificar desde el original permite corregir el parser sin pagar otra vez.
      for (const c of run.cells) if (c.status === 'ok') {
        const raw = read(path.join(directory, 'responses', `${c.id}.json`));
        Object.assign(c, classify(extractResponse(raw.response), run.config, run.resolutions));
      }
      save(run, directory);
      console.log(path.join(ROOT, latest.report));
    } finally { release(); }
  } else console.log('Uso: node scripts/ai-visibility-report.mjs --plan | --collect [--max-calls 4] | --render');
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => { console.error(error.message); process.exitCode = 1; });
}
