import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { isMention, domainMatches, extractResponse, classify, validateConfig,
  summarize, comparable, measurementSignature } from './lib/ai-visibility.mjs';
import { requestFor, remainingCells, committedCost, monthInMadrid } from './ai-visibility-report.mjs';

const config = JSON.parse(fs.readFileSync(new URL('../state/ai-visibility-config.json', import.meta.url)));
const clone = (value) => structuredClone(value);
const envelope = (items) => ({ status_code: 20000, tasks: [{ status_code: 20000,
  result: [{ model_name: 'modelo-fijo', web_search: true, items }] }] });
const message = (text, urls = []) => ({ type: 'message', sections: [{ type: 'text', text,
  annotations: urls.map((url) => ({ url })) }] });
const cell = (text, urls = []) => ({ id: 'email-01--chat_gpt', provider: 'chat_gpt', prompt_id: 'email-01',
  status: 'ok', cost_usd: 0.03, ...classify(extractResponse(envelope([message(text, urls)])), config) });
const run = (cells, customConfig = config) => {
  const value = { config: customConfig, cells, signature: measurementSignature(customConfig) };
  value.summary = summarize(value);
  return value;
};

test('valida la muestra sin marcas y rechaza contaminación o IDs duplicados', () => {
  validateConfig(config);
  const contaminated = clone(config);
  contaminated.prompts[0].text = '¿Qué enseña Fran Lledó?';
  assert.throws(() => validateConfig(contaminated), /contiene una marca/);
  const repeated = clone(config);
  repeated.prompts.push(repeated.prompts[0]);
  assert.throws(() => validateConfig(repeated), /IDs/);
});

test('normaliza tildes sin confundir fragmentos ni otras personas', () => {
  assert.ok(isMention('Recomiendo a FRAN LLEDÓ.', ['Fran Lledo']));
  assert.equal(isMention('Fran Lledosa y Cazatarjetass', ['Fran Lledó', 'Cazatarjetas']), false);
  assert.equal(isMention('Fran', ['Fran Lledó']), false);
});

test('una cita requiere el hostname real, no una coincidencia de texto', () => {
  assert.ok(domainMatches('https://ensayos.franlledo.com/p/articulo', 'franlledo.com'));
  for (const url of ['https://franlledo.com.evil.test', 'https://evilfranlledo.com',
    'https://evil.test/?q=franlledo.com', 'https://franlledo.com@evil.test', 'javascript:franlledo.com']) {
    assert.equal(domainMatches(url, 'franlledo.com'), false);
  }
  assert.equal(cell('Mira franlledo.com').entities.fran.citation, false);
  assert.equal(cell('Mira [esta guía](https://franlledo.com/blog/guia/)').entities.fran.citation, true);
});

test('procesa todos los mensajes y excluye el razonamiento', () => {
  const answer = extractResponse(envelope([
    { type: 'reasoning', sections: [{ text: 'Fran Lledó', annotations: [{ url: 'https://franlledo.com/' }] }] },
    message('Primera parte'), message('Cazatarjetas', ['https://cazatarjetas.com/']),
  ]));
  const result = classify(answer, config);
  assert.equal(result.entities.fran.mention, false);
  assert.equal(result.entities.fran.citation, false);
  assert.ok(result.entities.cazatarjetas.mention);
  assert.equal(answer.text, 'Primera parte\n\nCazatarjetas');
});

test('estado de tarea fallido y cuerpo vacío son errores, nunca ceros', () => {
  const data = envelope([message('')]);
  assert.throws(() => extractResponse(data), /sin texto/);
  data.tasks[0].status_code = 40501;
  assert.throws(() => extractResponse(data), /40501/);
});

test('grounding no resuelto es indeterminado; resuelto permite atribución', () => {
  const redirect = 'https://vertexaisearch.cloud.google.com/grounding-api-redirect/test';
  const answer = extractResponse(envelope([message('Una guía', [redirect])]));
  assert.equal(classify(answer, config).entities.fran.citation, null);
  assert.ok(classify(answer, config, { [redirect]: { url: 'https://franlledo.com/blog/guia/' } }).entities.fran.citation);
  assert.equal(classify(answer, config, { [redirect]: { url: 'https://otro.test/' } }).entities.fran.citation, false);
});

test('Perplexity: fuente recuperada sin referencia [n] no es cita', () => {
  const data = envelope([message('Recomiendo este recurso [1].', ['https://otro.test/', 'https://franlledo.com/'])]);
  data.tasks[0].result[0].model_name = 'sonar-pro';
  const answer = extractResponse(data);
  assert.equal(answer.available_source_urls.length, 2);
  assert.deepEqual(answer.source_urls, ['https://otro.test/']);
  assert.equal(classify(answer, config).entities.fran.citation, false);
  data.tasks[0].result[0].items[0].sections[0].text += ' También sirve este [2].';
  assert.equal(classify(extractResponse(data), config).entities.fran.citation, true);
});

test('no cuenta enlaces repetidos como respuestas distintas ni errores como ausencias', () => {
  const good = cell('Fran Lledó', ['https://franlledo.com/a/', 'https://franlledo.com/a/?utm_source=x', 'https://franlledo.com/b/']);
  const result = run([good, { id: 'email-01--gemini', status: 'error', cost_usd: 0.02 }]).summary;
  assert.equal(result.entities.fran.mention_denominator, 1);
  assert.equal(result.entities.fran.citations, 1);
  assert.equal(result.top_domains[0].count, 1);
  assert.equal(result.top_pages.length, 2);
  assert.equal(result.cost_usd, 0.05);
});

test('preguntas de marca quedan fuera de todos los indicadores de descubrimiento', () => {
  const branded = clone(config);
  branded.prompts[0].branded = true;
  const result = run([cell('Fran Lledó', ['https://franlledo.com/'])], branded).summary;
  assert.equal(result.entities.fran.mention_denominator, 0);
  assert.equal(result.providers[0].entities.fran.mention_denominator, 0);
  assert.equal(result.top_domains.length, 0);
});

test('comparación rechaza cambio de modelo, pregunta o cobertura', () => {
  const small = clone(config);
  small.prompts = small.prompts.slice(0, 1);
  small.providers = small.providers.slice(0, 1);
  const a = run([cell('Respuesta')], small);
  assert.ok(comparable(a, clone(a)));
  const b = clone(a);
  b.cells[0].actual_model = 'otro-modelo';
  assert.equal(comparable(a, b), false);
  const c = clone(a);
  c.summary.measured = 0;
  assert.equal(comparable(a, c), false);
  const changed = clone(small);
  changed.prompts[0].text += ' Otra pregunta.';
  assert.equal(comparable(a, run([cell('Respuesta')], changed)), false);
});

test('reanudación omite tanto éxitos como POST de coste incierto', () => {
  const attempted = [cell('Respuesta'), { id: 'email-01--gemini', status: 'uncertain', cost_usd: null }];
  const remaining = remainingCells(config, attempted);
  assert.equal(remaining.length, 46);
  assert.equal(remaining.some((c) => attempted.some((a) => a.id === c.id)), false);
  assert.equal(committedCost(attempted, 0.5), 0.53);
});

test('mes de Madrid y parámetros adecuados a cada API', () => {
  assert.equal(monthInMadrid(new Date('2026-09-30T22:30:00Z')), '2026-10');
  const requests = config.providers.map((p) => requestFor(config, p, config.prompts[0]));
  assert.ok(requests.every((r) => r.user_prompt === config.prompts[0].text));
  assert.equal(requests[0].web_search_country_iso_code, 'ES');
  assert.equal(requests[1].web_search_country_iso_code, undefined);
  assert.equal(requests[3].web_search, undefined);
});
