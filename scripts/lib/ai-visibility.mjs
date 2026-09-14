// Métricas reproducibles a partir de las respuestas originales de DataForSEO.
import { createHash } from 'node:crypto';

const normalize = (s) => s.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase();
const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
export const isMention = (text, aliases) => aliases.some((alias) =>
  new RegExp(`(^|[^\\p{L}\\p{N}])${escapeRegex(normalize(alias))}(?=$|[^\\p{L}\\p{N}])`, 'u').test(normalize(text)));

export function sourceUrl(value) {
  try {
    const url = new URL(value);
    if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) return null;
    url.hash = '';
    for (const key of [...url.searchParams.keys()]) {
      if (/^(utm_|gclid$|fbclid$)/i.test(key)) url.searchParams.delete(key);
    }
    return url.href;
  } catch { return null; }
}

export function domainMatches(url, domain) {
  const valid = sourceUrl(url);
  if (!valid) return false;
  const host = new URL(valid).hostname.toLowerCase().replace(/\.$/, '');
  return host === domain || host.endsWith(`.${domain}`);
}

export const isGroundingUrl = (url) => {
  try { return new URL(url).hostname === 'vertexaisearch.cloud.google.com'; }
  catch { return false; }
};

export function validateApi(data) {
  const task = data?.tasks?.[0];
  if (data?.status_code !== 20000 || task?.status_code !== 20000) {
    throw new Error(`DataForSEO ${task?.status_code ?? data?.status_code ?? 'sin estado'}: ${task?.status_message ?? data?.status_message ?? 'respuesta inválida'}`);
  }
  if (!Array.isArray(task.result) || task.result.length === 0) throw new Error('DataForSEO: resultado vacío');
  return task.result;
}

export function extractResponse(data) {
  const result = validateApi(data)[0];
  const text = [];
  const urls = new Set();
  const candidateUrls = new Set();
  const sections = (result.items ?? []).filter((item) => item.type === 'message').flatMap((item) => item.sections ?? []);
  const visibleText = sections.map((s) => s.text ?? '').join('\n');
  const numbered = new Set([...visibleText.matchAll(/\[(\d+(?:\s*,\s*\d+)*)\]/g)]
    .flatMap((m) => m[1].split(',').map((n) => Number(n.trim()))));
  const isPerplexity = data.tasks[0].data?.se === 'perplexity' || /^sonar(?:-|$)/.test(result.model_name ?? '');
  for (const item of result.items ?? []) {
    // Las menciones dentro del razonamiento no son respuestas al usuario.
    if (item.type !== 'message') continue;
    for (const section of item.sections ?? []) {
      if (typeof section.text === 'string') {
        text.push(section.text);
        // Solo enlaces explícitos; escribir un dominio en texto no es citarlo.
        for (const match of section.text.matchAll(/\[[^\]]*\]\(<?(https?:\/\/[^\s)>]+)>?(?:\s+"[^"]*")?\)/g)) {
          const url = sourceUrl(match[1]);
          if (url) urls.add(url);
        }
      }
      for (const [index, annotation] of (section.annotations ?? []).entries()) {
        const url = sourceUrl(annotation.url);
        if (!url) continue;
        candidateUrls.add(url);
        // Sonar devuelve también fuentes recuperadas que no usa en la respuesta.
        // Solo atribuir las referencias [n] presentes en el texto visible.
        if (!isPerplexity || numbered.has(index + 1)) urls.add(url);
      }
    }
  }
  const answer = text.join('\n\n').trim();
  if (!answer) throw new Error('Respuesta sin texto visible; no se interpreta como ausencia de marca');
  if (!result.model_name) throw new Error('Respuesta sin identificación del modelo');
  return { text: answer, source_urls: [...urls], available_source_urls: [...candidateUrls], actual_model: result.model_name,
    web_search: typeof result.web_search === 'boolean' ? result.web_search : null };
}

export function classify(answer, config, resolutions = {}) {
  const sources = [];
  const unresolved = [];
  for (const original of answer.source_urls) {
    const url = isGroundingUrl(original) ? sourceUrl(resolutions[original]?.url) : original;
    if (!url || isGroundingUrl(url)) unresolved.push(original);
    else sources.push(url);
  }
  const uniqueSources = [...new Set(sources)];
  const entities = Object.fromEntries(config.entities.map((entity) => {
    const citations = uniqueSources.filter((url) => entity.domains.some((d) => domainMatches(url, d)));
    return [entity.id, { mention: isMention(answer.text, entity.aliases),
      citation: citations.length > 0 ? true : unresolved.length ? null : false, citation_urls: citations }];
  }));
  return { ...answer, sources: uniqueSources, unresolved_sources: unresolved, entities };
}

export function measurementSignature(config) {
  const { methodology_version, market, system_message, max_output_tokens, providers, prompts, entities } = config;
  return createHash('sha256').update(JSON.stringify({ methodology_version, market, system_message,
    max_output_tokens, providers, prompts, entities })).digest('hex');
}

export function validateConfig(config) {
  for (const field of ['prompts', 'providers', 'entities']) {
    if (!Array.isArray(config[field]) || !config[field].length) throw new Error(`Configuración sin ${field}`);
    const ids = config[field].map((v) => v.id);
    if (new Set(ids).size !== ids.length || ids.some((id) => !/^[a-z0-9_-]+$/.test(id))) throw new Error(`IDs inválidos en ${field}`);
  }
  if (!config.entities.some((e) => e.id === 'fran')) throw new Error('Falta la entidad principal fran');
  if (!(config.max_cost_usd > 0 && config.call_reserve_usd > 0)) throw new Error('Presupuesto inválido');
  for (const p of config.prompts) {
    if (!p.text || p.text.length > 500 || typeof p.branded !== 'boolean') throw new Error(`Prompt inválido: ${p.id}`);
    if (!p.branded && config.entities.some((e) => isMention(p.text, e.aliases) || e.domains.some((d) => p.text.includes(d)))) {
      throw new Error(`Prompt declarado sin marca contiene una marca medida: ${p.id}`);
    }
  }
}

function rates(cells, entityId) {
  const mentionCells = cells.filter((c) => c.entities?.[entityId]);
  const citationCells = mentionCells.filter((c) => c.entities[entityId].citation !== null);
  const mentions = mentionCells.filter((c) => c.entities[entityId].mention).length;
  const citations = citationCells.filter((c) => c.entities[entityId].citation).length;
  return { mentions, mention_denominator: mentionCells.length, citations, citation_denominator: citationCells.length };
}

export function summarize(run) {
  const valid = run.cells.filter((c) => c.status === 'ok');
  const discoveryIds = new Set(run.config.prompts.filter((p) => !p.branded).map((p) => p.id));
  const discovery = valid.filter((c) => discoveryIds.has(c.prompt_id));
  const domains = new Map();
  const pages = new Map();
  for (const c of discovery) {
    for (const domain of new Set(c.sources.map((u) => new URL(u).hostname.replace(/^www\./, '')))) {
      domains.set(domain, (domains.get(domain) ?? 0) + 1);
    }
    for (const url of new Set(c.sources)) pages.set(url, (pages.get(url) ?? 0) + 1);
  }
  const top = (map) => [...map].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).map(([value, count]) => ({ value, count }));
  return {
    planned: run.config.prompts.length * run.config.providers.length, measured: valid.length,
    failed: run.cells.filter((c) => ['error', 'uncertain'].includes(c.status)).length,
    with_sources: valid.filter((c) => c.sources.length).length,
    unresolved: valid.reduce((n, c) => n + c.unresolved_sources.length, 0),
    cost_usd: Number(run.cells.reduce((sum, c) => sum + (c.cost_usd ?? 0), 0).toFixed(6)),
    unknown_cost_calls: run.cells.filter((c) => c.cost_usd == null).length,
    entities: Object.fromEntries(run.config.entities.map((e) => [e.id, rates(discovery, e.id)])),
    providers: run.config.providers.map((p) => {
      const cells = valid.filter((c) => c.provider === p.id);
      return { ...p, measured: cells.length, actual_models: [...new Set(cells.map((c) => c.actual_model))].sort(),
        with_sources: cells.filter((c) => c.sources.length).length,
        web_search_used: cells.filter((c) => c.web_search === true).length,
        entities: Object.fromEntries(run.config.entities.map((e) => [e.id, rates(cells.filter((c) => discoveryIds.has(c.prompt_id)), e.id)])) };
    }),
    topics: [...new Set(run.config.prompts.map((p) => p.topic))].map((topic) => {
      const ids = new Set(run.config.prompts.filter((p) => p.topic === topic && !p.branded).map((p) => p.id));
      const cells = discovery.filter((c) => ids.has(c.prompt_id));
      return { topic, planned: ids.size * run.config.providers.length, measured: cells.length,
        entities: Object.fromEntries(run.config.entities.map((e) => [e.id, rates(cells, e.id)])) };
    }),
    top_domains: top(domains), top_pages: top(pages),
  };
}

export function comparable(previous, current) {
  if (!previous || previous.signature !== current.signature) return false;
  const fingerprint = (run) => run.cells.filter((c) => c.status === 'ok')
    .map((c) => `${c.id}:${c.actual_model}:${c.web_search}:${c.unresolved_sources.length > 0}`).sort().join('|');
  // No comparar porcentajes de muestras distintas ni de modelos sustituidos.
  return previous.summary.measured === previous.summary.planned && current.summary.measured === current.summary.planned
    && fingerprint(previous) === fingerprint(current);
}

const cellText = (text) => String(text).replace(/\|/g, '\\|').replace(/\n/g, ' ');
const ratio = (n, d) => d ? `${n}/${d} (${(100 * n / d).toFixed(1)} %)` : 'N/D';
const metric = (r, kind) => ratio(r[kind], r[kind === 'mentions' ? 'mention_denominator' : 'citation_denominator']);

export function renderReport(run, previous = null, compact = false) {
  const s = run.summary;
  const status = { complete: 'completa', partial: 'parcial', running: 'en curso', budget_stopped: 'detenida por presupuesto' }[run.status] ?? run.status;
  let out = `# Visibilidad en IA de Fran Lledó · ${run.period}\n\n`;
  out += `Medición: ${run.started_at}. Mercado: ${run.config.market}. Estado: **${status}**.\n\n`;
  out += `**${s.measured}/${s.planned} respuestas válidas**, ${s.with_sources} con fuentes verificables. Coste registrado: **${s.cost_usd.toFixed(4)} USD**`;
  if (s.unknown_cost_calls) out += `; ${s.unknown_cost_calls} llamadas con coste pendiente de confirmar`;
  out += `. Enlaces de fuentes sin resolver: ${s.unresolved}.\n\n`;
  out += `Se miden respuestas de modelos vía DataForSEO LLM Responses API, no las interfaces de consumo. Es una muestra fija sin personalización. Las preguntas sin marca forman los indicadores; las de marca quedan fuera.\n\n`;
  out += `Las menciones se cuentan por nombre/alias exacto, ignorando tildes y mayúsculas; las erratas pueden quedar fuera y requieren revisión del original.\n\n`;
  out += `| Entidad | Menciones por alias | Citas con enlace |\n|---|---:|---:|\n`;
  for (const e of run.config.entities) out += `| ${e.label} | ${metric(s.entities[e.id], 'mentions')} | ${metric(s.entities[e.id], 'citations')} |\n`;
  out += `\n## Por asistente: Fran Lledó\n\n| Asistente / modelo observado | Respuestas | Usó búsqueda web | Con fuentes | Menciones | Citas |\n|---|---:|---:|---:|---:|---:|\n`;
  for (const p of s.providers) out += `| ${p.label} · ${p.actual_models.join(', ') || p.model} | ${p.measured}/${run.config.prompts.length} | ${p.web_search_used} | ${p.with_sources} | ${metric(p.entities.fran, 'mentions')} | ${metric(p.entities.fran, 'citations')} |\n`;
  out += '\n';
  if (comparable(previous, run)) {
    const a = previous.summary.entities.fran;
    const b = s.entities.fran;
    out += `Comparación con ${previous.period}: menciones ${a.mentions} → ${b.mentions}; citas ${a.citations} → ${b.citations}. Misma muestra, modelos y disponibilidad de fuentes.\n\n`;
  } else out += previous ? 'Sin tendencia comparable: cambió la muestra, el modelo, la metodología o la disponibilidad de fuentes.\n\n' : 'Primera medición de esta serie; todavía no hay tendencia comparable.\n\n';
  if (compact) {
    out += `Informe y respuestas: \`reports/ai-visibility/${run.period}/report.md\` y \`responses/\`. La muestra se renueva una vez por mes mediante el informe semanal.\n`;
    return out;
  }
  out += '## Por tema: Fran Lledó\n\n| Tema | Respuestas | Menciones | Citas |\n|---|---:|---:|---:|\n';
  for (const t of s.topics) out += `| ${t.topic} | ${t.measured}/${t.planned} | ${metric(t.entities.fran, 'mentions')} | ${metric(t.entities.fran, 'citations')} |\n`;
  out += '\n';
  out += `## Preguntas y resultados\n\nM = mención, C = cita con enlace, — = ausencia en la respuesta, ? = cita indeterminada, N/D = respuesta no disponible. Todas las celdas se refieren a Fran.\n\n`;
  out += `| Pregunta exacta | ${run.config.providers.map((p) => p.label).join(' | ')} |\n|---|${run.config.providers.map(() => '---').join('|')}|\n`;
  for (const prompt of run.config.prompts) {
    const values = run.config.providers.map((p) => {
      const c = run.cells.find((c) => c.provider === p.id && c.prompt_id === prompt.id);
      if (c?.status !== 'ok') return 'N/D';
      const e = c.entities.fran;
      return `${e.mention ? 'M' : '—'} / ${e.citation === null ? '?' : e.citation ? 'C' : '—'}`;
    });
    out += `| ${prompt.id} · ${cellText(prompt.text)}${prompt.branded ? ' [marca]' : ''} | ${values.join(' | ')} |\n`;
  }
  out += '\n## Fuentes citadas\n\nFrecuencia = respuestas distintas que citan el dominio o la página; no repeticiones del enlace dentro de una respuesta.\n\n| Dominio | Respuestas |\n|---|---:|\n';
  for (const d of s.top_domains.slice(0, 20)) out += `| ${d.value} | ${d.count} |\n`;
  out += '\n| Página | Respuestas |\n|---|---:|\n';
  for (const p of s.top_pages.slice(0, 20)) out += `| ${cellText(p.value)} | ${p.count} |\n`;
  out += '\n## Cómo usar esta medición\n\n';
  const gaps = run.config.prompts.filter((p) => !p.branded).filter((p) => {
    const cells = run.cells.filter((c) => c.prompt_id === p.id && c.status === 'ok');
    return cells.length === run.config.providers.length && cells.every((c) => !c.entities.fran.mention && c.entities.fran.citation === false);
  });
  out += `- Preguntas con ausencia medida en los cuatro asistentes: ${gaps.map((p) => p.id).join(', ') || 'ninguna con cobertura completa'}. Revisar sus respuestas antes de proponer contenido.\n`;
  out += '- Revisar las páginas más citadas para identificar el dato, ejemplo o tipo de recurso que responde a la pregunta. El recuento por sí solo no prueba por qué las cita un modelo.\n';
  out += '- Evaluar las fuentes editoriales relevantes como posibles lugares donde conseguir presencia; una plataforma o un competidor citado no implica una oportunidad de colaboración.\n';
  out += '- Cruzar cualquier propuesta de artículo con el contenido ya publicado, el banco de keywords y el gate de autoridad. Este informe no encola ni publica contenido.\n';
  out += '\n## Método y límites\n\n';
  out += '- Cada pregunta se consulta una vez por proveedor. La variación entre respuestas impide interpretar un cambio aislado como causalidad o visibilidad total.\n';
  out += '- Mención: nombre o alias completo en el texto visible, sin contar razonamiento ni coincidencias dentro de otra palabra. Fran y Cazatarjetas se miden por separado.\n';
  out += '- Cita: URL de anotación o enlace Markdown explícito cuyo hostname coincide con el dominio o un subdominio. Un dominio escrito sin enlace no cuenta. No se comprueba el HTTP 200 de cada fuente.\n';
  out += '- Las redirecciones de grounding de Gemini se resuelven antes de atribuirlas. Si quedan fuentes sin resolver, una ausencia de cita se marca indeterminada y sale del denominador.\n';
  out += '- Perplexity puede devolver fuentes recuperadas que no cita: solo se cuentan las referencias [n] utilizadas en el texto o los enlaces explícitos. La lista completa permanece en el JSON original.\n';
  out += '- Errores y respuestas vacías son N/D, nunca ceros. Las respuestas válidas sin fuentes sí pueden tener menciones; se muestra su cobertura de fuentes.\n';
  out += '- Se solicita búsqueda web cuando la API lo permite (Sonar la incluye). Solo ChatGPT y Claude reciben el parámetro de país; todos reciben el mismo contexto español. Esto no reproduce una sesión de navegador ni garantiza geolocalización uniforme.\n';
  out += '- Modelos fijados en configuración y modelo efectivo guardado. No se mezclan resultados del dataset agregado de EE. UU./inglés ni Google AI Overviews.\n';
  out += '- Coste: suma de `cost` de DataForSEO, que ya incluye el proveedor. No se suma otra vez `money_spent`. El umbral de parada puede sobrepasarse por las llamadas en curso; la API no ofrece un límite monetario por respuesta.\n';
  out += '\n## Evidencia por respuesta\n\n| ID | Estado | Fuentes | Coste USD | Respuesta original |\n|---|---|---:|---:|---|\n';
  for (const c of run.cells) out += `| ${c.id} | ${cellText(c.error || c.status)} | ${c.sources?.length ?? 'N/D'} | ${c.cost_usd ?? 'N/D'} | [JSON](responses/${c.id}.json) |\n`;
  out += '\nReferencias: [plantilla de DataForSEO](https://dataforseo.com/templates/ai-visibility-report-with-dataforseo-claude-code/), [LLM Responses](https://docs.dataforseo.com/v3/ai_optimization/chat_gpt/llm_responses/live/), [tarifas](https://dataforseo.com/pricing/ai-optimization/llm-responses).\n';
  return out;
}
