# Estado del proyecto SEO

Última actualización: 2026-09-22 (keyword-researcher, primer run que pasa el
check de auth desde el 2026-09-05; seed `ia para negocios pequeños`, 1 item
encolado).

Este documento es la fotografía operativa para comenzar una sesión. El detalle
histórico está en [`docs/session-log.md`](docs/session-log.md).

## Resumen

- **Pipeline desatascado (2026-09-22): el bloqueo de autenticación de 17 días
  (2026-09-05 → 2026-09-22) parece resuelto.** `state/agent-log.json` registra
  `auth failure` en casi todos los runs programados de ese periodo (última
  ocurrencia: keyword-researcher de hoy a las 14:57 UTC, dos horas antes de
  este run). Este run es el primero que pasa el check de `coordinator.sh` en
  ese tramo; no se tocó nada de autenticación en esta sesión, así que la
  causa raíz de por qué empezó a fallar el 05/09 ni de por qué se resolvió
  hoy sigue sin investigar (ver `ESTADO.md` SEO-001). Vigilar el próximo run
  programado (content-writer, jueves 2026-09-24) para confirmar que no fue
  un caso aislado.
- **Keyword-researcher, run martes 2026-09-22 (MODE: AUTO), seed `ia para
  negocios pequeños`: 1 item encolado (`ia para pymes`, gate de autoridad
  superado).** Bank sweep (Step 0): 0 candidatas que medir. Fan-out del seed:
  150 variaciones únicas evaluadas, 8 duplicados del banco, resto mayormente
  ruido de categoría (coches de segunda mano, GTA V, Sims 4) vía
  `keyword_ideas`; pivotado a listas curadas por `keyword_overview` +
  `keyword_suggestions`, patrón ya usado con éxito en runs anteriores.
  **`ia para pymes`** (90/mes, commercial) pasa el gate `Step 5b`: mediana
  top-5 279 vs umbral SITE_RANK(227)+200=427, con 2 rivales desplazables
  (`internacional.camaramadrid.es` rank 187, `formacom.es` rank 172). SERP
  dominada por un AI Overview (cita BBVA, Google Workspace, SoftDoit,
  Upliora) y por comparativas de herramientas fuera de alcance por
  site-config; el ángulo obligatorio en la nota de cola es el playbook
  práctico de Fran, no un listicle. **Aviso de tendencia:** el volumen medio
  de 12 meses es 90 pero el último mes real (agosto 2026) fue 40, con
  tendencia claramente descendente (-43% mensual, -56% trimestral, -20%
  anual); si sigue cayendo, no debería volver a encolarse una variante de
  este cluster. Un segundo candidato con volumen nominal en el umbral
  (`inteligencia artificial en los negocios`, 50/mes) se dejó en P2 sin
  gastar el gate porque su promedio está inflado por un pico anómalo de
  marzo 2026 (260/mes); los últimos 3 meses reales son 10/mes constante. 11
  keywords nuevas al banco (351 total). Esta era la semilla más antigua sin
  refrescar (primera vez 2026-06-10); con el run de hoy, 5 de las 17
  semillas tienen ya una segunda vuelta completa, quedan 12 solo con su
  primera investigación. Informe completo:
  `reports/2026-09-22-keyword-researcher.md`. CSV:
  `output/keywords/2026-09-22-ia-para-negocios-pequenos.csv`.

- **Tráfico, consulta 2026-09-15 (16/08–12/09 vs 19/07–15/08): el SEO del
  blog mejora, el total de GA4 requiere depuración.** Blog: 32→53 lectores
  registrados, 41→57 páginas vistas, 12→24 clics de Google y 3.560→5.295
  impresiones. Web completa: 30→41 clics de Google. GA4 bruto registra 322
  sesiones, pero 93 proceden de `trafficheap.cc`, todas el 23/08 hacia `/`;
  fuente sospechosa de referral spam. La consulta excluyéndola da **230 sesiones
  frente a 303**, y 202 usuarios frente a 217. El blog no cambia con esa exclusión.
  La comparación cruza el cambio de consentimiento del 03/09 (`b64aebe` web):
  GA4 solo carga con aceptación de analytics; no inferir una caída equivalente
  de visitas reales. Canal newsletter/email: 85→6 sesiones. Captación registrada:
  23 eventos en ambos periodos, 15 usuarios frente a 17; son envíos, no altas
  confirmadas. Informe y datos: `reports/2026-09-15-trafico-web-blog.md` y
  `reports/2026-09-15-traffic-data.json`. No se cambiaron filtros de la cuenta
  ni el informe automático; la exclusión es solo de esta consulta. Pendiente
  incorporar ese criterio al reporting y revisar trazabilidad del canal email.
- **Auth de agentes aún fallando:** researcher del 14/09 y writer del 15/09
  vuelven a registrar `auth failure`; cola 0 `queued` (26 `written`, 1
  `needs_review`). La mejora de clics no implica que la publicación automática
  se haya recuperado. Sigue pendiente revisar esa autenticación.
- **Visibilidad en IA integrada (2026-09-14): 48/48 respuestas, 4 con citas a
  franlledo.com, coste 2,471085 USD.** El informe semanal sustituye sus ocho
  consultas a GPT-4o por una muestra mensual fija de 12 preguntas sin marca a
  ChatGPT, Gemini, Claude y Perplexity. Fran y Cazatarjetas se miden por separado;
  se guardan respuestas originales, modelos efectivos, costes y fuentes, sin
  convertir errores en ceros. Conteo automático de nombre/alias: 2/48; revisión
  manual detecta otras dos menciones con erratas de apellido en Perplexity.
  Las 4 URLs citadas responden 200: tres artículos y `/suscribir/`, que ChatGPT
  recomienda directamente. IA para solopreneurs queda en 0/16 citas en esta
  muestra; no es una conclusión sobre toda la visibilidad del sitio.
  `state/ai-visibility-config.json` fija el experimento y
  `state/ai-visibility-latest.json` guarda el resumen. El job semanal existente
  está cargado y renovará la muestra en su primera ejecución de octubre; durante
  septiembre reutiliza los datos sin repetir consultas. No hay job nuevo.
  Informe: `reports/ai-visibility/2026-09/report.md`; lectura y acciones:
  `reports/ai-visibility/2026-09/analysis.md`; operación:
  `docs/05-ai-visibility.md`. Validación: 12 pruebas locales, idempotencia sin
  acceso a red, cuatro URLs en producción y ejecución del informe semanal completo.
- **Incidencia ajena a la medición de IA, observada el 14/09:** el log registra
  nuevamente `auth failure` en keyword-researcher (09/09) y content-writer
  (10/09 y 12/09). La cola sigue en 0 `queued` (26 `written`, 1 `needs_review`).
  Pendiente revisar la autenticación de Claude Code antes de atribuir la falta
  de publicaciones solo a semillas agotadas. No se cambió autenticación ni el
  coordinator en esta sesión; la nueva medición de IA llama a DataForSEO directamente.
- **Content-writer, run jueves 2026-09-03 (MODE: AUTO): no-op anticipado,
  cola sin resembrar desde el 26/08 (8 días consecutivos).**
  `pick-next-queue-item.py` → `NO_QUEUED_ITEMS` (exit 2).
  `state/content-queue.json`: 27 items, 26 `written`, 1 `needs_review`, 0
  `queued` — mismo conteo que los no-ops del 29/08 y 01/09. Causa ya
  diagnosticada en la sesión anterior: el keyword-researcher del 31/08 falló
  por `auth failure` y el del 02/09, aunque corrió sano, tuvo el seed
  asignado por rotación (`secuencias de email`) agotado. No hay nada nuevo
  que investigar; el próximo keyword-researcher (lunes 2026-09-07, seed `ia
  para negocios pequeños`) es quien puede resolver la hambruna. Sin cambios
  en `output/` ni en el repo web. Informe: `reports/2026-09-03-content-writer.md`.
  Ver bitácora 2026-09-03.
- **Keyword-researcher, run miércoles 2026-09-02 (MODE: AUTO): la auth ya no
  falla, pero el seed asignado por rotación ("secuencias de email") resultó
  agotado — 0 items nuevos a la cola.** Auth confirmada sana
  (`claude auth status` → `loggedIn: true`), así que el fallo del
  keyword-researcher del 31/08 fue efectivamente transitorio y no se repitió.
  Bank sweep (Step 0) no tuvo nada que medir (0 candidatas). El seed elegido
  por rotación (más antiguo sin refrescar, `secuencias de email`,
  2026-06-08) confirmó con datos frescos lo que ya sospechaba desde esa
  fecha: sin masa crítica de búsqueda en español (variantes nuevas entre 10 y
  70 búsquedas/mes). `dataforseo_labs_google_keyword_ideas` repitió el
  patrón de ruido de categoría ya documentado (50 resultados genéricos sobre
  "email", descartados); se pivotó a `keyword_suggestions` +
  `keyword_overview` sobre una lista curada a mano, patrón ya usado con éxito
  en runs anteriores. 8 keywords nuevas al banco (332→340), todas priority 3;
  5 duplicados detectados y descartados; ninguna alcanzó priority 1, así que
  el gate de autoridad (Step 5b) no se ejecutó. **La cola sigue en 0
  `queued`, ahora 6 días consecutivos.** No es un fallo de este run (siguió
  el protocolo de rotación de semillas correctamente), pero la hambruna de
  cola sigue sin resolverse. El próximo keyword-researcher programado (lunes
  2026-09-07) tomará la siguiente semilla más antigua por rotación, "ia para
  negocios pequeños" (2026-06-10), un tema más amplio con más probabilidad de
  producir candidatas viables. Informe: `reports/2026-09-02-keyword-researcher.md`.
  CSV: `output/keywords/2026-09-02-secuencias-de-email.csv`. Ver bitácora
  2026-09-02.
- **Content-writer, run martes 2026-09-01 (MODE: AUTO): no-op, cola vacía —
  causa confirmada, no solo sospechada.** `pick-next-queue-item.py` →
  `NO_QUEUED_ITEMS` (exit 2). `state/content-queue.json`: 27 items, 26
  `written`, 1 `needs_review`, 0 `queued` — mismo conteo que el 29/08. Esta
  sesión confirma la sospecha que dejó el informe del refresh-recommender de
  esta misma mañana: el keyword-researcher programado del lunes 2026-08-31
  falló con `status: "error"`, `message: "auth failure"`,
  `duration_seconds: 0` (el check de auth de `coordinator.sh` abortó antes de
  invocar el prompt), así que nunca sembró la cola. `claude auth status`
  vuelve a dar `loggedIn: true` en esta sesión, igual que en la del
  refresh-recommender, así que el fallo parece transitorio (mismo patrón que
  el corte de 10 días 27/07→06/08), pero ha costado un ciclo completo: sin
  siembra exitosa desde el 26/08, la cola lleva 6 días a 0 `queued`. No es un
  run fantasma (`launchctl list` confirma el job disparado a su hora, y este
  proceso es el `coordinator.sh` que lo orquesta). Sin cambios en `output/`
  ni en el repo web. **Próxima acción fuera de este agente:** el
  keyword-researcher del miércoles 2026-09-02 debe resembrar; si también
  falla con `auth failure`, el patrón deja de ser transitorio. Informe:
  `reports/2026-09-01-content-writer.md`. Ver bitácora 2026-09-01.
- **Refresh-recommender, run mensual 2026-09-01: no-op, las 55 URLs
  evaluadas están sanas.** `scripts/refresh-scorer.py` (layer 1) barrió
  sitemap + video-sitemap, filtró a `/blog/` (55 URLs tras el filtro) y
  consultó GSC URL Inspection para cada una: **0 flags** en las 55
  (`not_indexed`, `index_warning`, `stale_12mo`, `aging` todos en 0).
  Verdict `PASS`, `coverage_state: "Submitted and indexed"`,
  `indexing_state: INDEXING_ALLOWED` en el 100%. La más antigua sin refrescar,
  `funnel-de-conversion-etapas-que-importan`, está en 60 días (muy por debajo
  del umbral `aging` de 305). El `refresh-queue.json` anterior (generado
  2026-06-25, 5 items `request_indexing` en `queued`) se sobrescribe a 0
  items: ninguna de esas 5 URLs sigue flageada hoy y ninguna estaba en
  `in_progress`/`completed`, así que no aplica la regla de preservación.
  franlledo.com no tiene páginas comerciales propias (`context/services.md`:
  los productos viven en cazatarjetas.com y nunca se enlazan desde el blog),
  así que tampoco hay money pages que priorizar. Informe:
  `reports/2026-09-01-refresh-recommender.md`. **Hallazgo aparte sin acción
  de este agente:** `state/agent-log.json` registra el keyword-researcher
  programado del lunes 2026-08-31 en `status: "error"`, `message: "auth
  failure"` (mismo patrón que el corte del 27/07→06/08); la sesión actual
  confirma `claude auth status` con `loggedIn: true`, así que parece
  transitorio, pero si el content-writer del martes 01/09 también sale en
  no-op por cola vacía, esta es la causa raíz a revisar primero (no la falta
  de keywords). Ver bitácora 2026-09-01.
- **Content-writer, run sábado 2026-08-29 (MODE: AUTO): no-op, cola sin
  items `queued`.** `pick-next-queue-item.py` → `NO_QUEUED_ITEMS` (exit 2).
  `state/content-queue.json`: 27 items, 26 `written`, 1 `needs_review`, 0
  `queued`. Causa: ningún keyword-researcher ha corrido desde el 26/08 (el
  siguiente programado es el lunes 31/08); es justo lo que el informe del
  27/08 anticipaba. No es un run fantasma (`git status` limpio al arrancar).
  Sin cambios en `output/` ni en el repo web. **Primer no-op tras la racha
  rota el 27/08** (la anterior había sido de 8 no-ops consecutivos,
  08/08→25/08). Hallazgo aparte sin acción requerida: la entrada de
  `state/agent-log.json` del 27/08 quedó mal etiquetada como `"message":
  "no-op"` pese a que ese run sí publicó un post; causa identificada en
  `coordinator.sh:93-102` (mira si queda algo sin commitear en *este* repo al
  final, y el agente ya había commiteado durante el run). No se tocó
  `coordinator.sh` (regla dura de no modificar scripts del coordinator desde
  un run). Ver bitácora 2026-08-29.
- **Content-writer, run jueves 2026-08-27 (MODE: AUTO): publicado `claude
  cowork precio`.** Único item `queued` (sembrado el 26/08). La investigación
  encontró que la premisa de las notas de cola (comparar si compensa subir de
  Pro a Max para tener Cowork) ya no era cierta: Cowork se lanzó en enero de
  2026 solo para Max, pero Anthropic amplió el acceso a Pro (20€/mes) después;
  varias guías indexadas (DataCamp de abril y sitios tipo
  coworkerai.io/claudecowork.im/appropia.com) siguen repitiendo el dato de
  lanzamiento. El post se reorientó a esa corrección ("el precio real hoy es
  20€, no 100€") como dato propio/síntesis GEO, sin fabricar experiencia
  práctica con Cowork que Fran no tiene documentada. 1.566 palabras (objetivo
  1.700), lint OK a la primera. Publicado y confirmado con `curl` (HTTP 200):
  `franlledo.com/blog/claude-cowork-precio/`. 3 enlaces internos entrantes
  añadidos desde `claude-para-solopreneurs`, `claude-code-sin-programar` y
  `automatizacion-con-ia-para-solopreneurs`. Complicación menor: el repo web
  estaba 1 commit por detrás de `origin/main` (push automático no relacionado
  de republicación de un ensayo) cuando `publish-to-astro.py` intentó el
  `git push`; el script falló alto tal y como se corrigió el 10/08 (ver
  incidencias conocidas), y el `git rebase origin/main` + reintento manual
  del push y del ping IndexNow lo resolvió sin conflictos. Cola vuelve a 0
  `queued` (26 `written`, 1 `needs_review`). Informe completo:
  `reports/2026-08-27-content-writer.md`. Ver bitácora 2026-08-27.
- **Keyword-researcher, run miércoles 2026-08-26 (MODE: AUTO): semilla
  `claude para solopreneurs`, 1 item encolado.** Semilla elegida por
  `last_researched` más antiguo (2026-06-03, ~12 semanas), fuera de la
  ventana de 30 días de dedup. Bank sweep (`Step 0`): nada que medir (exit
  2). El fan-out directo de la semilla repitió el patrón de ruido de
  categoría ya documentado (`keyword_ideas` 48 variaciones, mayoría ajenas al
  negocio; `related_keywords` 0 resultados) y la semilla en sí ya está
  cubierta por `/blog/claude-para-solopreneurs/` (01/06, actualizado 07/08).
  Pivotando a una lista curada de 30 candidatos de negocio vía
  `keyword_overview`, solo 3 tuvieron volumen medible, y 2 de ellos apuntaban
  a **Claude Cowork**, un producto de Anthropic sin cobertura previa en el
  sitio. Expandido el cluster con `keyword_suggestions` (39 variaciones):
  **`claude cowork precio`** (170/mes, commercial, KD~0) pasa el gate de
  autoridad (`Step 5b`, mediana top-5 rank 382 vs SITE_RANK 227, umbral 427,
  dos rivales desplazables) y queda **encolado**. La variante puramente
  informacional `que es claude cowork` (210/mes) sí choca con el muro
  (mediana 466: Xataka, DataCamp, Wired, soporte oficial de Anthropic) y
  queda en P2, pero su contenido se cubre como sección de apoyo dentro del
  mismo post. 9 keywords nuevas al banco en total (1 P1, 3 P2, 5 P3). Informe
  completo: `reports/2026-08-26-keyword-researcher.md`. **Rompe la racha de
  3 runs consecutivos de keyword-researcher sin nada encolable** (17/08,
  19/08, 24/08): el patrón que funcionó fue no quedarse en el fan-out
  genérico de una semilla ya cubierta, sino perseguir el sub-cluster de un
  producto/feature nuevo aparecido desde la última vez que se investigó esa
  semilla. Ver bitácora 2026-08-26.
- **Content-writer, run martes 2026-08-25 (MODE: AUTO): no-op, cola sin items
  `queued`.** `pick-next-queue-item.py` → `NO_QUEUED_ITEMS` (exit 2).
  `state/content-queue.json`: mismo conteo que el 22/08 (26 items, 25
  `written`, 1 `needs_review`), 0 `queued`. Causa: el keyword-researcher del
  lunes 24/08 (segunda vuelta, semilla `lanzamientos infoproductos`) añadió
  15 keywords al banco pero las 15 en P3, ninguna P1; sin run de
  keyword-researcher entre el 24/08 y hoy (próximo programado: lunes 31/08).
  Misma inanición de backlog de bajo esfuerzo del hito 7. No es un run
  fantasma (`git status` limpio al arrancar). Sin cambios en `output/` ni en
  el repo web. **Octavo no-op consecutivo** (08/08, 11/08, 13/08, 15/08,
  18/08, 20/08, 22/08, 25/08). Ver bitácora 2026-08-25.
- **Keyword-researcher, run lunes 2026-08-24 (MODE: AUTO): semilla
  `lanzamientos infoproductos`, 0 items encolados.** Bank sweep (`Step 0`): 1
  SERP medida (`email marketing que es`, ya P2), confirmado muro (mediana
  top-5 516 vs SITE_RANK 227+200), verdict heredado a sus 2 alias; backlog
  queda en 0. Fan-out de la semilla: 73 variaciones únicas evaluadas (50 de
  `keyword_ideas`, mayoría ruido de categoría ajeno al negocio: Huawei,
  Nintendo Switch, VR, NFTs, AWS re:Invent), 3 duplicados del banco, 55
  descartadas por ser off-topic o sin volumen medible en DataForSEO, **15
  nuevas al banco, las 15 en P3**. Ninguna alcanzó el umbral P1 (todas 10-30
  búsquedas/mes en es/Spain, contra ≥50 commercial/≥100 informational).
  Hallazgo relevante: **6 de las 15 ya están cubiertas** por 2 posts
  publicados (`que-son-los-infoproductos` y `funnel-de-lanzamiento`) cuyo
  `fan_out_cluster` resultó más completo de lo que reflejaba el banco;
  `covered_by` corregido para esas 6. El resto tiene volumen real
  insuficiente para justificar pieza dedicada. `Step 5b` no se ejecutó (sin
  supervivientes P1 que medir). No es un run fantasma (`git status` limpio al
  arrancar). Informe completo: `reports/2026-08-24-keyword-researcher.md`.
  **Segundo run consecutivo de keyword-researcher sin nada encolable** (el
  del 19/08 tampoco dejó nada). El próximo content-writer (martes 25/08)
  saldrá en no-op otra vez por la misma causa. Ver bitácora 2026-08-24.
- **Content-writer, run sábado 2026-08-22 (MODE: AUTO): no-op, cola sin items
  `queued`.** `pick-next-queue-item.py` → `NO_QUEUED_ITEMS` (exit 2).
  `state/content-queue.json`: mismo conteo que el 20/08 (26 items, 25
  `written`, 1 `needs_review`), 0 `queued`. Causa: ningún keyword-researcher
  ha corrido desde el no-op del 19/08 (el ciclo lunes/miércoles no tuvo
  ejecución entre el 20/08 y hoy); el siguiente programado es el lunes
  24/08. No hay causa nueva que investigar, es la misma inanición de
  backlog de bajo esfuerzo documentada en el hito 0/7. No es un run
  fantasma (`git status` limpio al arrancar). Sin cambios en `output/` ni en
  el repo web. **Séptimo no-op consecutivo** (08/08, 11/08, 13/08, 15/08,
  18/08, 20/08, 22/08). Ver bitácora 2026-08-22.
- **Content-writer, run jueves 2026-08-20 (MODE: AUTO): no-op, cola sin items
  `queued`.** `pick-next-queue-item.py` → `NO_QUEUED_ITEMS` (exit 2).
  `state/content-queue.json`: 26 items, 25 `written`, 1 `needs_review`
  (`agentes-ia-sin-codigo-para-emprendedores`), 0 `queued`. Causa directa: el
  keyword-researcher del 19/08 (segunda vuelta sobre `email marketing`, la
  semilla más antigua de `state/seed-keywords.txt`) añadió 17 keywords al
  banco pero ninguna llegó a P1 (cluster definicional degradado a P2 por
  falta de ángulo diferenciador; la única commercial con volumen nominal
  bajó por tendencia real decreciente), así que el gate de autoridad
  (`Step 5b`) ni siquiera se ejecutó. El propio informe del 19/08 predijo
  este resultado. **Sexto no-op consecutivo** (08/08, 11/08, 13/08, 15/08,
  18/08, 20/08). No es un run fantasma (`git status` limpio al arrancar). Sin
  cambios en `output/` ni en el repo web. El pipeline sigue sin trabajo de
  bajo esfuerzo que resembrar solo: las 17 semillas están en su segunda
  vuelta y el bank sweep en 0 candidatas — hace falta que Fran añada semillas
  nuevas o decida una segunda vuelta con ángulos distintos. Ver bitácora
  2026-08-20.
- **Content-writer, run martes 2026-08-18 (MODE: AUTO): no-op, cola sin items
  `queued`.** `pick-next-queue-item.py` → `NO_QUEUED_ITEMS` (exit 2).
  `state/content-queue.json`: 26 items, 25 `written`, 1 `needs_review`
  (`agentes-ia-sin-codigo-para-emprendedores`), 0 `queued`. **Distinto de los
  cuatro no-ops anteriores:** esta vez el keyword-researcher del lunes 17/08
  sí corrió (commit `630981d`) e hizo trabajo real — semilla nueva
  `automatizar ventas` investigada (8 keywords al banco) y el `Step 0: Bank
  sweep` completo, drenando su backlog de 3 SERPs a 0 — pero ningún candidato
  sobrevivió el gate de autoridad (`Step 5b`): la única P1
  (`automatizacion de ventas`, vol 70) fue degradada a P2 por el mismo patrón
  de "autoridad, no contenido" del 28/07 (mediana top-5 616 vs SITE_RANK 227,
  SERP de CRMs enterprise). El propio informe del 17/08 predijo exactamente
  este resultado. No es un run fantasma (`git status` limpio al arrancar).
  Sin cambios en `output/` ni en el repo web. **Quinto no-op consecutivo**
  (08/08, 11/08, 13/08, 15/08, 18/08). **Hallazgo relevante:** con esta
  semilla las 6 semillas nuevas del lote del 09/07 quedan todas investigadas
  y el backlog del bank sweep queda en 0 — es la primera vez que el pipeline
  se queda sin trabajo de bajo esfuerzo que resembrar automáticamente; hace
  falta una segunda vuelta sobre semillas antiguas o semillas nuevas de Fran
  (ver hito 7 e hito 0 actualizados abajo). Ver bitácora 2026-08-18.
- **Content-writer, run sábado 2026-08-15 (MODE: AUTO): no-op, cola sin items
  `queued`.** `pick-next-queue-item.py` → `NO_QUEUED_ITEMS` (exit 2).
  `state/content-queue.json`: 26 items, 25 `written`, 1 `needs_review`
  (`agentes-ia-sin-codigo-para-emprendedores`), 0 `queued` — mismo conteo que
  el 13/08. Causa: no ha corrido ningún keyword-researcher desde el 12/08
  (no-op por `dfs-mcp` caído); el siguiente programado es el lunes 17/08, con
  el pin `dataforseo-mcp-server@2.9.13` ya aplicado. No es un run fantasma
  (`git status` limpio al arrancar, el run se disparó y ejecutó con
  normalidad). Sin cambios en `output/` ni en el repo web. Cuarto no-op de
  content-writer por cola vacía (08/08, 11/08, 13/08, 15/08) desde que la cola
  dejó de resembrarse con margen. Ver bitácora 2026-08-15.
- **Content-writer, run jueves 2026-08-13 (MODE: AUTO): no-op, cola sin items
  `queued`.** `pick-next-queue-item.py` → `NO_QUEUED_ITEMS` (exit 2).
  `state/content-queue.json`: 26 items, 25 `written`, 1 `needs_review`
  (`agentes-ia-sin-codigo-para-emprendedores`), 0 `queued`. Causa directa: el
  keyword-researcher del miércoles 12/08 fue el que debía resembrar la cola
  antes de este run y salió en no-op genuino (`dfs-mcp` caído, ver bullet de
  abajo), así que no hay ningún item nuevo desde el 10/08. No es un run
  fantasma: el run de hoy se disparó y ejecutó con normalidad, simplemente no
  había trabajo. Sin cambios en `output/` ni en el repo web. Tercer no-op de
  content-writer por cola vacía en cinco runs (08/08, 11/08, 13/08); el fix del
  pin de `dfs-mcp@2.9.13` (12/08) debería desatascarlo en el próximo
  keyword-researcher (lunes 17/08). Ver bitácora 2026-08-13.
- **Keyword-researcher, run miércoles 2026-08-12 (MODE: AUTO): no-op, `dfs-mcp`
  no conectó.** `claude mcp list` mostró `dfs-mcp: ✘ Failed to connect —
  connection timed out after 30000ms`. Causa raíz encontrada: `npx -y
  dataforseo-mcp-server` (sin pin de versión en `.mcp.json`) instaló
  `3.0.0` (publicada el 2026-08-11, un día antes de este run), que **rompe
  dos cosas a la vez**: (1) arranca en modo `http` por defecto (bind a
  `:3000`) en vez de hablar MCP por stdio, así que el handshake con Claude
  Code nunca completa; (2) aunque se fuerce `--mode stdio`, esa versión solo
  expone 4 herramientas genéricas (`docs_index`, `docs_list_sections`,
  `docs_search`, `api_request`) y ha eliminado las ~89 herramientas por
  endpoint (`serp_organic_live_advanced`, `backlinks_bulk_ranks`,
  `dataforseo_labs_google_keyword_ideas`, etc.) que **todos** los prompts de
  este repo llaman directamente. No es el mismo patrón que la caída
  17-30/06/2026 (esa vez el servidor sí respondía, solo devolvía datos
  incompletos); esta vez la interfaz completa cambió de forma incompatible.
  **Fix aplicado:** `.mcp.json` ahora fija `dataforseo-mcp-server@2.9.13`
  (última release de la serie 2.9.x, publicada horas antes que la 3.0.0 el
  mismo día) en vez de `dataforseo-mcp-server` a secas. Verificado a mano por
  fuera del cliente MCP: handshake stdio OK, 89 herramientas listadas
  (incluidas las 6 que usa el keyword-researcher), y una llamada real a
  `backlinks_bulk_ranks(["franlledo.com"])` devuelve rank 227 (coincide con
  el SITE_RANK ya documentado del 28/07). El fix no pudo desbloquear **este**
  run (la conexión de esta sesión ya había fallado antes de tocar el
  fichero), así que sigue siendo no-op, pero el próximo run programado
  (keyword-researcher, próximo lunes/miércoles) debería conectar limpio.
  **Pendiente de vigilar:** `npx -y` sin pin de versión seguirá siendo
  frágil ante la próxima release mayor de `dataforseo-mcp-server`; si vuelve
  a pasar, es la primera sospecha. Cero cambios en `state/keyword-bank.json`
  ni `state/content-queue.json` (no se fabricó ningún dato de volumen/KD sin
  la API, por regla del prompt). Ver bitácora 2026-08-12.
- **Content-writer, run martes 2026-08-11 (MODE: AUTO): no-op, cola sin
  items `queued`.** `pick-next-queue-item.py` → `NO_QUEUED_ITEMS` (exit 2).
  `state/content-queue.json`: 26 items, 25 `written` (incluye `ganar dinero
  con ia`, publicado ayer) y 1 `needs_review`
  (`agentes-ia-sin-codigo-para-emprendedores`), 0 `queued`. Causa: el bank
  sweep del keyword-researcher del 10/08 solo encoló 1 item y el
  content-writer de ese mismo día lo consumió, así que la cola llegó vacía
  al run de hoy sin que medie ningún run fantasma. Sin cambios en `output/`
  ni en el repo web. Ver bitácora 2026-08-11.
- **Content-writer, run lunes 2026-08-10 (MODE: AUTO): publicado `ganar
  dinero con ia`, y corregido un bug real de publicación silenciosa.**
  Cogió el único item `queued` (`ganar dinero con ia`, comercial, vol 260,
  encolado el mismo día por el bank sweep del keyword-researcher). Ángulo
  obligatorio de la cola cumplido: nada de listicle genérico tipo "50 formas"
  (los 3 competidores orgánicos principales hacen justo eso); en su lugar,
  pilar honesto con dato propio citable: el propio pipeline de agentes de
  este repo (35 posts publicados sin que Fran escriba el primer borrador, el
  36 es este mismo) como prueba de la vía "automatizar tu negocio", separada
  explícitamente de "ganar dinero" (el blog no vende, es captación). 4 vías
  cubiertas (servicios, automatización, audiencia/newsletter, infoproductos)
  con 3 fuentes externas verificadas (Upwork +109% demanda de skills de IA,
  Anthropic Economic Index 57/43 aumentación vs automatización, Mordor
  Intelligence tamaño de mercado freelance) y 4 enlaces internos. 1.821
  palabras, 6/6 variantes del fan-out cubiertas, lint OK a la primera.
  Publicado en `/blog/ganar-dinero-con-ia/` (HTTP 200 confirmado). 3 enlaces
  internos entrantes añadidos desde `automatizacion-con-ia-para-solopreneurs`,
  `infoproductos-con-ia` y `como-monetizar-una-newsletter`.
  **Bug encontrado y corregido:** `scripts/publish-to-astro.py` llamaba a
  `git commit`/`git push` con `check=False`, así que un push rechazado
  (non-fast-forward) se tragaba el error en silencio y el script igualmente
  imprimía `PUBLISHED_LIVE` y disparaba el ping de IndexNow a una URL que
  devolvía 404. Pasó exactamente eso hoy: el repo web llevaba 6 commits de
  atraso frente a origin (trabajo ajeno de republicación de ensayos e
  integración de vídeos de YouTube, sin relación con este run) desde antes de
  empezar la sesión. Detectado verificando con `curl` en vez de fiarse del
  stdout del script (invariante 4, "verificar antes de cantar victoria").
  Solución aplicada: quitar `check=False` de esas dos llamadas para que
  fallen alto en vez de mentir. El post se rebaseó sobre los 6 commits
  ajenos sin conflicto y se publicó de verdad en el segundo intento.
  **Nota aparte:** el repo web tenía además un `stash` sin resolver de una
  migración de `CLAUDE.md` → `AGENTS.md` (trabajo de otra sesión, no de
  este run) que entra en conflicto con cambios recientes de `CLAUDE.md` en
  origin (`git stash list` en `franlledo-web` muestra la entrada). No se
  tocó: es una decisión de contenido de Fran, no algo que un run de
  content-writer deba resolver. Cola: 0 items `queued` de nuevo.
- **Content-writer, run sábado 2026-08-08 (MODE: AUTO): no-op, cola sin
  items `queued`.** `pick-next-queue-item.py` → `NO_QUEUED_ITEMS` (exit 2).
  Mismos 25 items que el 06/08 (24 `written`, 1 `needs_review`), ninguno
  `queued`. Esperado: la bitácora del 06/08 ya anticipaba este resultado
  porque el keyword-researcher no ha vuelto a encolar nada desde el
  21/07 (los runs de `vender cursos online` 20/07 y `prompts para negocio`
  06/08 dieron 0 items encolados, ver hito 0). No es el patrón de "run
  fantasma" (el run sí se disparó); es cola vacía por falta de resiembra.
  Sin cambios en `output/` ni en el repo web. Ver bitácora 2026-08-08.
- **Pipeline parado 10 días por auth (2026-07-27 → 2026-08-06, RESUELTO).** 9
  runs consecutivos en `error / auth failure`: `claude auth status` daba
  `loggedIn: false` y el check de `coordinator.sh:118` abortaba antes de
  ejecutar. Último post publicado: 21/07. **El informe semanal siguió llegando**
  (usa su propia OAuth de `.env.local`, no el CLI), lo que enmascara el fallo:
  para vigilar la salud del pipeline hay que mirar `state/agent-log.json`, no la
  bandeja de entrada. Reautenticado; run manual OK (commit `95235ae`).
- **El enlazado interno NO es la palanca (2026-08-06). Cierra como no-procede la
  acción del 28/07.** El sitio tiene **204 enlaces internos de cuerpo** en 35
  posts (5,8/post) y **cero huérfanos**. Correlación entrantes vs impresiones
  28d: **r = +0,15**, nula. Las dos páginas más enlazadas del sitio
  (`como-montar-embudo-de-ventas-sencillo` 15 entrantes,
  `como-hacer-email-marketing-que-venda` 13) tienen 6 y 4 impresiones. Ojo al
  medirlo: el sitio usa enlaces relativos **y absolutos** (contar solo
  `](/blog/...)` da la mitad y huérfanos falsos), y el campo `internal_links`
  del frontmatter **no se renderiza** (no está en el schema Zod de
  `src/content.config.ts`), es metadato, no enlaces.
- **La página estrella apunta a una keyword de 10 búsquedas/mes (2026-08-06).**
  `como-escribir-asuntos-de-email` (1.368 impr, 2 clics, pos 14,5): su keyword
  objetivo está **por debajo del suelo de detección** de Google Ads; el término
  con dato más cercano, `asuntos de email`, son **10/mes**. Las 1.368
  impresiones son Google repartiéndola por 36+ microvariantes de intención
  **"correo formal de trabajo"** (`asuntos para correos formales` 10/mes pos 33,
  `ejemplos de asuntos para correos de trabajo` 40/mes pos 28). El post es del
  lanzamiento del 19/05, reciclado de emails de Notion: **no aparece en
  `keyword-bank.json` ni en `content-queue.json`**, nunca pasó por el pipeline y
  nadie miró su volumen. Su CTR de 0,15% no se arregla con snippet y sus
  impresiones dejan de ser un KPI.
- **El nicho no es pequeño; lo que falta es medir el banco (2026-08-06).**
  Volumen real es/Spain: newsletter **12.100**, email marketing **8.100**,
  landing page **6.600**, copywriting **4.400**, funnel de ventas 1.300, embudo
  de ventas 1.000, lead magnet 1.000. La demanda existe, pero esas cabeceras son
  muros con rank 227. Y el banco tiene **273 keywords con `serp_checked: 0`**: el
  gate del 28/07 solo corre sobre P1 del run en curso y el único run posterior no
  tuvo ninguno, así que todo el backlog sigue puntuado **solo por KD** — la
  métrica que el propio 28/07 demostró insuficiente (`marketing funnel` KD 4 es
  un muro de ≈615; `qué es una landing page` KD 6 es un muro de ≈480).
  *(Corregido 2026-08-10: aquí dije "45 keywords de banda media sin cubrir y sin
  medir" y estaba inflado — no descontaba las 17 ya presentes en
  `content-queue.json` ni las P3 aparcadas a propósito, y 16 de las restantes
  eran huecos de `covered_by`, no oportunidad. El backlog real son **3 SERPs**
  con P1/P2. Ver hito 0.)*
- **Bank sweep automatizado y cola desatascada (2026-08-10).** El
  keyword-researcher del 10/08 barrió el banco, arregló 16 `covered_by`, midió
  `ejemplos de landing page` (muro, 463 vs 227) y encoló **1 item**:
  `ganar dinero con ia` (260/mes, gate **PASA**: mediana top-5 315 contra umbral
  427, con rival desplazable en rank 188). Primera keyword del proyecto que pasa
  el gate con volumen real. La pasada se ha convertido en `Step 0: Bank sweep`
  del prompt + `scripts/pick-bank-gate-batch.py` (selección determinista, 0
  llamadas a API, dedup por SERP y suelo de volumen 100).
- **Análisis de rendimiento + autoridad competitiva (2026-07-28): el cuello de
  botella es AUTORIDAD, no contenido. Implementado un gate de winnability en el
  keyword-researcher.** GSC 28d (28 jun–25 jul vs previo): impresiones **+47%**
  (2.327→3.430) pero **clics planos** (28, y ~16 son de la home/marca) y posición
  media 16,1→18,1 — el sitio gana visibilidad y se atasca en página 2-3. Causa
  medida con DataForSEO: rank de franlledo.com **227**, la mitad/un tercio del
  típico competidor de página 1 (400-700). **cazatarjetas.com es MÁS DÉBIL (162)**,
  así que el enlace cazatarjetas→franlledo es menor (hacerlo y olvidarlo, no era
  la palanca). De 5 SERPs medidas, la única ganable es **asuntos de email** (ya
  #5 orgánico, con rival débil desplazable de rank 139); marketing funnel
  (mediana top-5 ≈615), landing page (≈480), newsletter ejemplos (≈480) y vibe
  coding son muros de marcas. **Acción implementada:** `Step 5b` en
  `prompts/keyword-researcher.md` — antes de encolar, mide la mediana de
  autoridad del top-5 orgánico contra el SITE_RANK vivo y degrada a P2 las
  SERPs-muro (regla: `mediana top-5 > SITE_RANK+200 y sin rival desplazable`),
  con válvula de escape para candidatas GEO-citables. Ver bitácora 2026-07-28
  (tarde).
- **Emails GSC del 18/07 ("Error de redirección" + "No se ha encontrado (404)"
  en un sitemap) diagnosticados el 2026-07-28: transitorios de la ventana de
  deploy del 16/07, ya resueltos.** Verificado en producción (sitemap 59/59 a
  200; los 9 redirects con fecha + ensayos 301→200 en 1 salto) y con la GSC URL
  Inspection API en tiempo real: `pageFetchState`=SUCCESSFUL en todas las URLs
  sospechosas (ni un `REDIRECT_ERROR` ni un `NOT_FOUND`); la vieja de
  marketing-funnel re-rastreada 17/07 (sana, "Page with redirect"),
  `que-es-el-copywriting` indexada (rastreo 18/07). Causa: Googlebot rastreó
  durante el reinicio del contenedor nginx (2 deploys + 44 pings IndexNow ese
  día); GSC detecta el 16, envía el 18, pero los re-rastreos del 17-18 ya daban
  200 — el correo describía un problema ya resuelto. **Sin acción de código.**
  El tercer email era de cazatarjetas.com (otro sitio). Ver bitácora 2026-07-28.
- **Content-writer, run jueves 2026-07-23 (MODE: AUTO): no-op, cola sin
  items `queued`.** `pick-next-queue-item.py` → `NO_QUEUED_ITEMS` (exit 2).
  De los 25 items de `state/content-queue.json`, 24 están `written` y 1
  (`agentes-ia-sin-codigo-para-emprendedores`) sigue en `needs_review`; ninguno
  `queued`. La resiembra que el hito 7c pedía para el keyword-researcher del
  miércoles 22/07 no ocurrió: no hay commit ni entrada en
  `state/agent-log.json` de ese run, mismo patrón que la incidencia del
  martes 14/07 (nunca investigada). Sin cambios en `output/` ni en el repo
  web. Ver bitácora 2026-07-23.
- **Content-writer, run martes 2026-07-21 (MODE: AUTO): publicado `qué es
  una landing page`.** Cogió el único item `queued`
  (`2026-07-15-que-es-una-landing-page`, en espera desde el 15/07). Ángulo
  diferenciador obligatorio por notas de cola: landing page vs página de
  ventas (toda página de ventas es una landing page de formato largo, pero no
  al revés), con dato propio citable de los 2 tipos que Fran usa en su propio
  funnel (squeeze page en captación con los ~2.000 suscriptores/35% open
  rate documentados, página de pago simple en lanzamiento con los
  10.000-12.000 € ya documentados en `funnel-de-lanzamiento`). 1.643 palabras,
  8/8 variantes del fan-out cubiertas, lint OK a la primera. Publicado en
  `/blog/que-es-una-landing-page/` (HTTP 200 confirmado). 3 enlaces internos
  entrantes añadidos desde `funnel-de-captacion`, `marketing-funnel-para-solopreneurs`
  y `sales-funnel-para-solopreneurs` (build OK, push `72ec9a9`). Cola: **0
  items `queued`**, keyword-researcher deberá resembrarla. Ver bitácora
  2026-07-21.
- **Keyword-researcher, run lunes 2026-07-20, semilla `vender cursos online`**
  (tercera de las 4 nuevas del 09): 194 variaciones evaluadas (50 de
  `keyword_ideas` descartadas por ruido de categoría total: Excel, SEPE,
  ciberseguridad, sin relación con el sitio), 8 keywords nuevas al banco (4 en
  P2, 4 en P3), **0 items encolados**. Hallazgo: el cluster real de "vender
  cursos online" está dominado por comparativas de plataformas (Hotmart,
  Udemy, Teachable), fuera de alcance por `site-config.md` (nunca comparativas
  de herramientas). Las queries de estrategia pura (sin marca de plataforma)
  tienen volumen real de 10-30/mes, por debajo del umbral P1 informacional
  (100/mes). El propio seed (90/mes) baja a P3 por el desajuste de intención
  SERP, no por volumen. Quedan 3 semillas nuevas sin investigar (`prompts para
  negocio`, `monetizar con ia`, `automatizar ventas`), una por run. Ver
  bitácora 2026-07-20.
- **Plan de aceleración ejecutado (2026-07-16 noche, commit web `b280e89`):**
  refresh de los 4 posts striking-distance (asuntos-de-email con 34 ejemplos
  reales del export de MailerLite, monetizar como listicle de 7 formas,
  marketing-funnel con etapas/vs-sales-funnel, vibe-coding pivotado a
  práctico) + 9 enlaces internos nuevos. Revisión adversarial de 3 agentes
  antes de publicar: 13 hallazgos corregidos (incluido un asunto que exponía
  datos de un cliente). IndexNow 200 ×13 URLs. **OJO informe del lunes:**
  asuntos-de-email y monetizar-newsletter salen de la medición de snippets
  del 03-07; ventana nueva desde 16/07. La palanca pendiente es de Fran
  (autoridad): enlace cazatarjetas→franlledo (hoy NO existe), YouTube/
  Substack→blog, 5-10 enlaces editoriales. Análisis completo en
  `reports/2026-07-16-plan-aceleracion.md` (local). Ver bitácora.
- **Auditoría SEO del 15/07 implementada (2026-07-16, sesión con Fran,
  commit web `ec49ae3`):** seoTitle ≤47c con dato real en los **20 posts
  pendientes** (ya no queda ningún post con título SERP >60c; cierra el
  antiguo hito 3), 8 descriptions >160c recortadas, HSTS en nginx, alt en
  avatar de header/landings, y JSON-LD nuevo en 11 páginas estáticas
  (Breadcrumb+Person en landings, CollectionPage en /proyectos/). La
  congelación de snippets del 03/07 se respetó (los 12 posts con impresiones
  no se tocaron). IndexNow 200 con 31 URLs. Dos findings de la auditoría
  resultaron inflados: los "82 alt que faltan" eran casi todos `alt=""`
  decorativo legítimo, y /consultoria/ ya tenía schema Service. Pendiente de
  la auditoría: OG images (hito 2), CSP con pruebas, CrUX de campo. Ver
  bitácora 2026-07-16 (tarde).
- **Content-writer, run jueves 2026-07-16 (MODE: AUTO): publicado
  `qué es el copywriting`.** Cogió el item `2026-07-13-que-es-el-copywriting`
  (el que llevaba desde el 13/07 en `queued` porque el run programado del
  martes 14/07 nunca se disparó, ver bitácora 2026-07-15). Post de 2.039
  palabras con las fórmulas AIDA/PAS/BAB, dato propio (1.500+ correos de
  venta) y las 7 variantes del `fan_out_cluster` cubiertas. Lint OK a la
  primera. Publicado en `/blog/que-es-el-copywriting/` (confirmado HTTP 200
  en producción, con retraso de ~5 min en el deploy de Coolify frente a los
  ~1-2 min habituales). 3 enlaces internos entrantes añadidos desde
  `como-escribir-emails-que-vendan`, `lead-magnet-que-es-y-como-crear-uno` y
  `funnel-de-conversion-etapas-que-importan`. Cola: queda 1 item `queued`
  (`2026-07-15-que-es-una-landing-page`) para el próximo run. Ver bitácora
  2026-07-16.
- **Keyword-researcher, run miércoles 2026-07-15, semilla `pagina de ventas
  que convierte`** (segunda de las 6 nuevas del 09): 18 keywords nuevas al
  banco, 1 item encolado (`2026-07-15-que-es-una-landing-page`,
  informational, vol 1000, kd 6). Mismo problema de calidad de dato que el
  13/07 con `dataforseo_labs_google_keyword_ideas` sobre la frase completa
  (ruido de categoría: creación de webs genéricas / marketplaces de segunda
  mano); se resolvió con `keyword_overview` sobre una lista curada +
  `related_keywords`/`keyword_suggestions` sobre "landing page". Hallazgo:
  en es-ES el volumen real de este tema vive en el préstamo inglés "landing
  page" (6600/mo cabecera, "qué es una landing page" 1000/mo kd6), no en
  "página de ventas" (70/mo). Ver bitácora 2026-07-15. Quedan 4 semillas
  nuevas sin investigar. **Observación:** `2026-07-13-que-es-el-copywriting`
  sigue en estado `queued`: no hay commit de content-writer del martes 14 de
  julio en el historial de git. Revisar si el run programado falló o no se
  disparó.
- **Keyword-researcher confirma el fix de autonomía (lunes 2026-07-13):**
  ejecutó el workflow completo en MODE: AUTO sin preguntar. Semilla
  `copywriting para vender` (primera de las 6 nuevas del 09, nunca antes
  investigada): 21 keywords nuevas al banco, 1 item encolado
  (`2026-07-13-que-es-el-copywriting`, informational, vol 260, kd 15). Cola
  vuelve a tener un item `queued` para el content-writer del martes. `dataforseo_labs_google_keyword_ideas`
  con la frase completa devolvió mayoritariamente ruido de categoría (venta de
  coches/motos); se resolvió pivotando a `keyword_suggestions`. Ver bitácora
  2026-07-13. Quedan 5 semillas nuevas sin investigar.
- **Pipeline autónomo desatascado el 2026-07-09.** La publicación llevaba
  parada desde el 2 jul: el content-writer programado se disparaba puntual pero
  cada run era un `no-op` de ~30s (leía el contexto y preguntaba "¿qué quieres
  hacer?" en vez de escribir, ignorando el `MODE: AUTO`). Causa: el marco "de
  sesión con humano" de CLAUDE.md pisaba la orden de auto-pilot. **Corregido en
  `coordinator.sh`** con una cabecera no-interactiva contundente, aplicada
  también al keyword-researcher. Se publicó `funnel-de-lanzamiento` y se
  resembró la cola (6 semillas nuevas). Ver bitácora 2026-07-09.
- **Aprendizajes SEO/GEO de la entrevista a Luis Villanueva (Webpositer)
  aplicados al content-writer (2026-07-09):** cada post debe (1) cubrir la
  microtemática/subpreguntas completas del clúster (no solo variantes de
  keyword) y (2) incluir ≥1 dato propio y extraíble que fuerce la cita por IAs
  generativas. Solo se aplicaron los consejos SEO, no los de negocio (decisión
  de Fran).
- **Auditoría SEO integral + implementación el 2026-07-03** (multi-agente,
  informe completo en `reports/2026-07-03-auditoria-seo.md`): 12 seoTitles/metas
  reescritos y desplegados, sitemap con `<lastmod>`, redirects de barra final a
  1 salto, `.htaccess` muerto eliminado, favicons, IndexNow ×2. La acción
  manual pendiente es de Fran: solicitar indexación en GSC (lista priorizada en
  el informe; la #1 es la URL VIEJA `/blog/2026-05-21-marketing-funnel-para-solopreneurs/`,
  que Google tiene indexada en paralelo a la limpia desde antes de los 301).
- **Publicación automática DESBLOQUEADA** (2026-07-03): `context/publishing.json`
  corregido a `~/Projects/franlledo-web` y publicado
  `/blog/funnel-de-captacion/` (build OK, IndexNow 200, 200 en producción).
- El blog tiene **37 artículos publicados** en producción. Último:
  `/blog/claude-cowork-precio/` (2026-08-27, 1.566 palabras, PUBLISHED_LIVE,
  HTTP 200, con dato propio/síntesis GEO y 3 enlaces internos entrantes).
- Cola: **0 items `queued`** desde el 27/08 (el content-writer de ese día
  consumió `claude cowork precio`, sembrado el 26/08) — **8 días
  consecutivos** a la fecha del no-op del 03/09. El keyword-researcher del
  lunes 31/08 falló con `status: "error"`, `message: "auth failure"` antes
  de sembrar nada; la auth se confirmó sana de nuevo el 02/09
  (`claude auth status` → `loggedIn: true`), pero el seed asignado por
  rotación ese día (`secuencias de email`) resultó agotado (0 items nuevos
  encolables, 8 keywords P3 al banco). `agentes-ia-sin-codigo-para-
  emprendedores` sigue en `needs_review` (solapamiento con dos posts de
  IA). El keyword-researcher del lunes 2026-09-07 (seed por rotación `ia
  para negocios pequeños`, tema más amplio) es quien puede resembrar la
  cola; el content-writer del sábado 2026-09-05 será casi con certeza otro
  no-op. Ver `state/content-queue.json` y bitácora 2026-09-02, 2026-09-03.
- **Regla nueva de redacción:** todo post lleva `seoTitle` ≤47 caracteres con
  número/dato (el layout añade " — Fran Lledó", 13 car.). Exigido en
  `prompts/content-writer.md` y verificado por `scripts/lint-post.py` (Regla 8:
  título SERP ≤60, description 120-160).
- Todas las semillas de `state/seed-keywords.txt` están en su segunda vuelta
  investigadas (empezada 19/08 con `email marketing`). Próxima acción: añadir
  semillas nuevas o profundizar la segunda vuelta con ángulos distintos.
- Los ensayos duplicados con Substack usan `noindex, follow` y no aparecen en
  el sitemap.

## Rendimiento observado

**Última medición (15/09/2026):** 28 días completos 16/08–12/09 frente a
19/07–15/08, filtrando franlledo.com/www (sin subdominio de ensayos). Web:
41 clics GSC (+36,7%), 5.522 impresiones (+45,5%). Blog: 24 clics (+100%),
5.295 impresiones (+48,7%), posición media 13,52 frente a 17,57. GA4 del blog:
53 lectores (+65,6%) y 57 vistas (+39%). GA4 web, excluyendo solo la fuente
sospechosa trafficheap.cc: 230 sesiones (-24,1%) y 202 usuarios (-6,9%).
La comparación GA4 cruza el cambio de consentimiento del 03/09 y no equivale a
una medición completa de tráfico real. Detalle: `reports/2026-09-15-trafico-web-blog.md`.
Las lecturas antiguas que siguen son históricas, no la fotografía actual.

**Lectura fresca 28d (GSC, 2026-07-28) — 28 jun–25 jul vs 31 may–27 jun:**

| Métrica | Actual 28d | Previo 28d | Δ |
| --- | ---: | ---: | --- |
| Impresiones | 3.430 | 2.327 | **+47%** |
| Clics | 28 | 28 | 0% |
| CTR | 0,82% | 1,2% | 🔻 |
| Posición media | 18,1 | 16,1 | 🔻 (peor) |

Diagnóstico: la visibilidad crece con fuerza pero **los clics están clavados** y
~16 de los 28 son de la home (marca). Los clics de contenido llevan planos
porque casi toda la impresión nueva cae en posición 14-30 (página 2-3). No es
problema de contenido sino de **autoridad relativa a la SERP** (ver bullet de
resumen y bitácora 2026-07-28 tarde). La posición media empeora porque el sitio
rankea para muchas más queries nuevas en pos 20-50, que tiran la media abajo
(huella creciendo, no caída). Página con más recorrido:
`/blog/newsletter-ejemplos-que-venden/` (0→3 clics, 62→405 impr, pos 23→18,5).
La estrella `/blog/como-escribir-asuntos-de-email/` sigue con **1.271 impr pero
solo 2 clics** en pos 14,6 (en el término cabecera exacto está #5 orgánico; la
media la bajan las variaciones más duras).

> **Corrección 2026-08-06:** esa lectura de la "estrella" era equivocada. Sus
> impresiones no son una oportunidad atascada: la keyword objetivo está por
> debajo del suelo de detección de Google Ads (el término con dato más cercano,
> `asuntos de email`, son **10 búsquedas/mes**) y las impresiones vienen de 36+
> microvariantes de intención **"correo formal de trabajo"**, no de email
> marketing. Ni las variaciones "más duras" ni el snippet son el problema: el
> lector que las busca no es el nuestro. Ver bitácora 2026-08-06.

Histórico semanal (informe automático, semana 13-19 jun 2026):

| Métrica | 13-19 jun | 6-12 jun | 30 may-5 jun |
| --- | ---: | ---: | ---: |
| Impresiones del sitio | 845 | 500 | 77 |
| Clics del sitio | 11 | 10 | 5 |
| CTR | 1,30% | 2,00% | 6,49% |
| Posición media | 17,1 | — | — |
| Sesiones orgánicas (GA4) | 15 | 8 | 8 |

GEO, medición 2026-09-14: 4/48 respuestas citan franlledo.com (ChatGPT 1/12,
Claude 1/12, Perplexity 2/12, Gemini 0/12). Hay dos menciones por alias exacto y
dos adicionales con erratas verificadas manualmente. Cazatarjetas queda a 0.
Esta serie usa preguntas y modelos nuevos; no es comparable con el tracking
anterior de ocho preguntas a GPT-4o. Ver `state/ai-visibility-latest.json`.

## CTR

Diagnóstico 2026-07-03 (GSC 28 días): CTR global 1,1%, pero **no-marca 0,24%**
(9 de los 12 clics por query son de "fran lledo"). Causa raíz: titles de 64-109
caracteres sin número que Google truncaba, frente a SERPs donde el 100% de los
títulos ganadores lleva cifra. Caso extremo: #1 orgánico en "cómo escribir
mejores asuntos de email" (198 impr, pos 5,7) con 0 clics.

> **Corrección 2026-08-06:** ese "caso extremo" no era un fallo de snippet.
> `cómo escribir mejores asuntos de email` **no tiene volumen registrado** en
> Google Ads (es/Spain): está por debajo del suelo de detección. Una query sin
> demanda medible puede acumular impresiones y no dar un solo clic sin que haya
> nada que arreglar en el título. Antes de diagnosticar CTR en una query,
> comprobar que tiene volumen.

Cambios desplegados 2026-07-03 (**no tocar snippets hasta ~17 de julio**, 2
semanas de datos): seoTitle ≤47 car. con número/prueba en los 12 posts con
impresiones + descriptions ≤155 + `updatedDate` fresco. Tabla completa de
antes/después en `reports/2026-07-03-auditoria-seo.md`. Esta iteración supera
a la de junio en asuntos-de-email (el calco de la query posicionaba pero no
ganaba el clic).

Expectativa realista: recuperar el CTR esperable por posición en las 5 URLs
top-10 son ~15-25 clics/28d adicionales (hoy: 31). Las URLs en pos 20+ no
darán clics hasta subir a página 1: ahí la palanca es ranking, no snippet.

## Indexación

**Actualización 2026-07-28 — emails GSC del 18/07 resueltos.** Google avisó de
"Error de redirección" y "No se ha encontrado (404)" en páginas de un sitemap
(detectados ~16/07, entregados el 18/07). Diagnóstico: transitorios de la
ventana de deploy del 16/07 (2 deploys + 44 pings IndexNow); Googlebot rastreó
durante el reinicio del contenedor. Confirmado sano: sitemap 59/59 a 200, los 9
redirects con fecha 301→200 en 1 salto, y la URL Inspection API da
`pageFetchState`=SUCCESSFUL en todas (URL vieja de marketing-funnel re-rastreada
17/07; `que-es-el-copywriting` indexada, rastreo 18/07). Sin acción de código;
opcional "Validar corrección" en las 2 filas de GSC. Ver bitácora 2026-07-28.

**Verificado en GSC el 2026-07-16 (sesión con Fran, inspección manual de las
8 URLs de la tabla):** la acción manual pendiente quedó COMPLETADA. 6 de las
8 ya estaban indexadas sin intervención (funnel-de-captacion,
como-escribir-asuntos-de-email, etiqueta/email-marketing,
claude-code-sin-programar, que-es-un-lead, agentes-de-ia-para-solopreneurs).
Se solicitó indexación de las 2 restantes: la URL vieja de marketing-funnel
(ya fuera del índice; su último rastreo 16/07 18:00 marcó "error de
redirección" casi seguro transitorio por el deploy — verificado con curl que
el 301 es limpio, 1 salto → 200) e ia-agentica ("Descubierta: sin indexar").
Revisar ambas en ~1 semana. La tabla de abajo queda como histórico del 03-07:

| Prioridad | URL | Estado GSC | Acción |
| --- | --- | --- | --- |
| **P1** | `/blog/2026-05-21-marketing-funnel-para-solopreneurs/` (VIEJA) | **Indexada con canonical a sí misma** (crawl 1 jun, anterior a los 301) — canibaliza a la limpia | Solicitar indexación (fuerza recrawl del 301) |
| P1 | `/blog/funnel-de-captacion/` | Unknown (publicado 2026-07-02) | Solicitar indexación |
| P2 | `/blog/como-escribir-asuntos-de-email/` | Indexada; title nuevo desplegado hoy | Solicitar indexación (acelera snippet nuevo) |
| P2 | `/blog/etiqueta/email-marketing/` | Discovered - not indexed | Solicitar indexación |
| P3 | `/blog/claude-code-sin-programar/`, `/blog/que-es-un-lead/`, `/blog/agentes-de-ia-para-solopreneurs/`, `/blog/ia-agentica-que-es-y-como-usarla/` | Unknown/pendiente desde junio | Solicitar indexación |

Los otros 8 pares fecha→limpia del incidente de junio están consolidados
("Page with redirect") o son desconocidos para Google. `como-monetizar-una-newsletter`
ya está indexada (aparece en GSC con impresiones a pos 9). El AI Overview de
"infoproductos con ia" aún cita la URL vieja (Google consolidó el 28 de junio;
debería corregirse solo — vigilar).

Aceleradores desplegados hoy: `<lastmod>` en sitemap, IndexNow con 19 URLs
(pares vieja/nueva) + 14 (snippets nuevos), `updatedDate` fresco en los posts
retocados.

## Programación activa

| Job | Frecuencia |
| --- | --- |
| Keyword researcher | lunes y miércoles, 09:00 |
| Content writer | martes, jueves y sábado, 10:00 |
| Refresh recommender | día 1 de cada mes, 07:00 |
| Informe semanal | lunes, 08:00 |

Zona horaria del equipo: `Europe/Madrid`.

## Incidencias conocidas

- **`publish-to-astro.py` reportaba éxito falso en push rechazado (RESUELTO
  2026-08-10):** las llamadas a `git commit`/`git push` usaban `check=False`,
  así que un push no-fast-forward (repo web con commits ajenos por delante)
  se tragaba el error, el script imprimía `PUBLISHED_LIVE` igualmente y
  disparaba IndexNow contra una URL en 404. Detectado al verificar con
  `curl` en vez de fiarse del stdout (invariante 4). Corregido quitando
  `check=False` de esas dos líneas para que fallen alto. El repo web puede
  quedar por detrás de origin si otra sesión/automatización empuja commits
  directamente a GitHub (pasó hoy: republicación de ensayos + integración de
  vídeos de YouTube); si `publish-to-astro.py` falla con un error de git
  push, la causa más probable es esa, y el fix es un `git pull --rebase`
  antes de reintentar la publicación.
- **Content-writer no-op / autonomía (RESUELTO 2026-07-09, CONFIRMADO
  2026-07-11 y 2026-07-13):** los runs programados del 4, 7 y 9 de julio
  salieron en `no-op` porque el agente preguntaba en vez de ejecutar, pese al
  `MODE: AUTO`. `coordinator.sh` ahora antepone una cabecera no-interactiva
  explícita (aplicada a content-writer y keyword-researcher). El run del
  sábado 2026-07-11 (content-writer) y el del lunes 2026-07-13
  (keyword-researcher) confirman el fix en ambos lados: ejecutaron el
  workflow completo sin preguntar nada. Incidencia cerrada.
- **Run programado del martes 2026-07-14 no se disparó (sin resolver, fuera
  del alcance de este agente):** `2026-07-13-que-es-el-copywriting` quedó en
  `queued` 3 días en vez de procesarse al día siguiente. No hay commit ni
  entrada de log de un content-writer del 14/07. El run de hoy (2026-07-16)
  procesó el item con normalidad, así que el efecto está mitigado, pero la
  causa (¿cron/launchd no disparó, o disparó y falló silenciosamente antes de
  hacer ningún commit?) no se ha investigado. Revisar la configuración de
  `launchd`/cron si vuelve a pasar un martes o sábado.
- **Segunda ocurrencia del mismo patrón: keyword-researcher del miércoles
  2026-07-22 no se disparó (nuevo, sin resolver):** igual que el 14/07 pero en
  el lado keyword-researcher. No hay commit ni entrada en
  `state/agent-log.json` para esa fecha; el último run registrado es
  content-writer del 21/07. Efecto esta vez SÍ es visible: la cola llegó
  vacía al content-writer del 23/07 (no-op) porque nadie la resembró. Dos
  incidencias del mismo tipo (un martes, un miércoles) apuntan a algo
  sistémico en el disparador de cron/launchd, no a un fallo puntual. Revisar
  la configuración si vuelve a pasar una tercera vez.
- **`context/publishing.json` (RESUELTO 2026-07-03):** `repo_path` corregido a
  `/Users/franlledo/Projects/franlledo-web` y `funnel-de-captacion` publicado.
  `context/` está gitignored: si se cambia de máquina o se mueve el repo web,
  hay que corregirlo a mano otra vez.
- **`public/.htaccess` eliminado (2026-07-03):** nginx no lo leía y contenía
  reglas obsoletas sin ninguno de los 9 redirects reales; era la trampa del
  próximo incidente. Los comentarios de `docker/nginx.conf` y
  `astro.config.mjs` que lo señalaban como fuente de verdad están corregidos.
- **CLI PATH (resuelto 2026-06-25):** `claude` no estaba instalado como comando
  global (solo existía como binario nativo de la extensión VSCode). Se creó
  `~/.local/bin/claude` → symlink al binario nativo. El coordinador ya lo
  encuentra a través de `$HOME/.local/bin` en su PATH.
- Los informes HTML históricos de `output/keywords/` pueden contener URLs con
  fecha del incidente del 8 de junio. Son snapshots, no fuentes activas.
- DataForSEO (`mcp__dfs-mcp`) volvió a estar disponible el 2026-07-02 (se usó
  para SERP de `funnel de captación`). No disponible en ningún run de
  keyword-researcher entre el 17 y el 30 de junio; los volúmenes/KD de esa
  ventana son estimaciones por WebSearch.

## Próximos hitos

0. ~~**PRIORIDAD: pasar el gate por las 45 keywords de banda media**~~ —
   **ejecutado y redimensionado 2026-08-10.** El run del keyword-researcher del
   10/08 leyó este hito y barrió el banco por su cuenta: de 28 candidatas de
   banda media, **16 eran huecos de contabilidad** (ya cubiertas por un post
   publicado, con `covered_by` sin rellenar) y el resto estaban correctamente
   aparcadas. Solo una candidata real llegó al gate (`ejemplos de landing page`:
   **muro**, mediana top-5 463 vs 227). **La cifra de "45" que documenté el
   06/08 estaba inflada**: contaba solo `covered_by`, sin descontar las 17
   keywords ya presentes en `content-queue.json` ni las P3 aparcadas a
   propósito. El backlog real sin medir hoy son **3 SERPs** con P1/P2 (13 si se
   incluyen P3), no 45. Automatizado como `Step 0: Bank sweep` en
   `prompts/keyword-researcher.md` + `scripts/pick-bank-gate-batch.py`, para que
   la pasada sea rutina y no un accidente de un run que leyó el estado. **No se
   construyó un agente aparte**: no lo justifica un backlog de 3.
1. **Indexación (Fran, manual en GSC):** la tabla de "Indexación" de arriba,
   en orden. La P1 (URL vieja de marketing-funnel) es la que más equity
   recupera.
2. **Imágenes OG para los 21 posts con `og-default.jpg`** (incluye
   funnel-de-captacion): `scripts/og/generate-og.mjs` del repo web exige
   Playwright aparte. Integrarlo en el pipeline de publicación tolerante a
   fallos.
3. ~~seoTitle en batch para los ~20 posts restantes~~ — **cerrado
   2026-07-16** (auditoría implementada, ver bitácora): los 34 posts tienen
   título SERP ≤60c. Su ventana de medición CTR empieza el 16/07.
4. ~~**Sección "asuntos para correos: 25 ejemplos listos para copiar"** en
   asuntos-de-email~~ — **revisado 2026-08-06, no procede tal cual**: la SERP de
   "ejemplos" que quería capturar es de intención **"correo formal de trabajo"**
   (oficinistas), no de email marketing, y todo el clúster está en 10-40
   búsquedas/mes. Si se hace, que sea una decisión de contenido consciente de
   que ese lector no convierte, no una jugada de SEO.
5. **Decidir sobre `agentes-ia-sin-codigo-para-emprendedores` (`needs_review`):**
   retirar, fusionar o replantear (ver `reports/2026-07-02-content-writer.md`).
6. ~~Confirmar el lado keyword-researcher de la autonomía~~ — **cerrado
   2026-07-13**, ver bitácora.
7. ~~Keyword researcher: procesar las 3 semillas nuevas restantes del lote
   del 09~~ — **cerrado 2026-08-17**: `prompts para negocio` (06/08),
   `monetizar con ia` (10/08, pivotada a `ganar dinero con ia`) y
   `automatizar ventas` (17/08) ya están las tres investigadas. Las 17
   semillas de `state/seed-keywords.txt` están ahora todas investigadas al
   menos una vez, y el `Step 0: Bank sweep` drenó su backlog a 0 el 17/08.
   La primera segunda vuelta (`email marketing`, 19/08) y la segunda
   (`lanzamientos infoproductos`, 24/08) no dejaron nada encolable — ni un
   candidato llegó a P1 en ninguna de las dos, y en el run del 24/08 el 40%
   de las keywords nuevas ya estaban cubiertas por posts existentes que el
   banco no reflejaba. **Racha rota 2026-08-26:** la tercera segunda vuelta
   (`claude para solopreneurs`) sí dejó 1 item `queued` (`claude cowork
   precio`), pero no fue la rotación mecánica de la semilla la que lo
   consiguió — fue detectar que había aparecido un producto nuevo (Claude
   Cowork) desde la última vez que se investigó esa semilla (01/06) y
   perseguir ese sub-cluster con `keyword_suggestions` en vez de repetir
   `keyword_ideas`/`related_keywords` sobre la frase genérica, que seguía
   devolviendo ruido o contenido ya cubierto. **Cuarta segunda vuelta con
   resultado 2026-09-02** (`secuencias de email`): 0 encolables, seed
   confirmada agotada. **Quinta segunda vuelta con resultado 2026-09-22**
   (`ia para negocios pequeños`, tras el corte de auth que impidió el
   intento del 07/09): 1 item encolado (`ia para pymes`), no por un producto
   nuevo sino por pivotar de la frase genérica del seed a una lista curada de
   variantes "ia para pymes/autónomos/emprendedores" vía `keyword_overview` +
   `keyword_suggestions`. Sigue sin resolverse el problema de fondo:
   **quedan 12 semillas sin una segunda vuelta reciente** y no todas tendrán
   un lanzamiento de producto reciente que perseguir. Fran debería seguir
   valorando añadir semillas nuevas a `state/seed-keywords.txt` fuera del
   temario ya cubierto, y/o instruir al researcher para que compruebe
   rutinariamente anuncios de producto recientes de Anthropic/OpenAI
   relevantes a cada semilla antes de descartarla como agotada.
7b. ~~Content-writer: revisar por qué no corrió el martes 2026-07-14~~ —
   **cerrado 2026-07-21**: ambos items que quedaron pendientes de esa
   incidencia (`que-es-el-copywriting`, `que-es-una-landing-page`) están
   `written` y publicados. La causa raíz del run del 14/07 nunca se
   investigó, pero el efecto está totalmente mitigado y la cola no arrastra
   nada de esa incidencia.
7c. **Cola de content-writer vacía (2026-07-21, AGRAVADO 2026-07-23):** el
   run del content-writer de hoy jueves salió `NO_QUEUED_ITEMS` porque el
   keyword-researcher del miércoles 22/07 no se disparó (ver incidencia
   arriba). Prioridad alta para el próximo keyword-researcher que sí corra:
   dejar al menos 1 item `queued` antes del sábado 25/07 10:00 o el
   content-writer volverá a salir en no-op.
8. Verificar en los próximos posts que el **dato propio citable (GEO)** se está
   integrando de forma efectiva y extraíble.
8. **Medir CTR de los snippets del 3 de julio a partir del ~17 de julio.**
9. Semana: pivotar vibe-coding a guía práctica; capturas con alt en
   newsletter-ejemplos; diagrama propio en funnel-de-captacion (los packs de
   imágenes salen 2-3 veces en esas SERPs).

## Últimos commits relevantes

Repo SEO:

- 2026-09-22: keyword-researcher run — primer run que pasa el check de auth
  desde el 05/09 (17 días de `auth failure` en el log). Seed `ia para
  negocios pequeños` (segunda vuelta), 11 keywords nuevas, 1 item encolado
  (`ia para pymes`, gate de autoridad superado, aviso de tendencia de
  volumen en declive).
- 2026-08-27: content-writer run — `claude cowork precio` publicado, cola
  vaciada (0 `queued`). Corrección de precio (Pro 20€, no Max 100€) frente a
  las notas de cola, usada como dato propio GEO.
- 2026-08-26: keyword-researcher run — semilla `claude para solopreneurs`
  (segunda vuelta), 9 keywords nuevas, 1 item encolado (`claude cowork
  precio`, gate de autoridad superado). Rompe la racha de 3 runs sin nada
  encolable.
- 2026-08-25: content-writer run — no-op, cola vacía (octavo no-op
  consecutivo).
- 2026-08-24: keyword-researcher run — bank sweep (1 SERP, muro confirmado) +
  semilla `lanzamientos infoproductos`, 15 keywords nuevas (todas P3, 6 con
  `covered_by` corregido), 0 items encolados.
- 2026-08-10: content-writer run — `ganar dinero con ia` publicado, cola
  vaciada (0 `queued`); corregido bug de `check=False` en
  `publish-to-astro.py` que reportaba éxito falso en push rechazado.
- 2026-08-10: keyword-researcher run — bank sweep (`Step 0`) + semilla
  `monetizar con ia` pivotada a `ganar dinero con ia`, 1 item encolado.
- 2026-07-21: content-writer run — `qué es una landing page` publicado, cola
  vaciada (0 `queued`).
- 2026-07-20: keyword-researcher run — semilla `vender cursos online`, 8
  keywords nuevas (4 P2, 4 P3), 0 items encolados (cluster dominado por
  comparativas de plataformas, fuera de alcance; queries de estrategia con
  volumen bajo el umbral P1).
- 2026-07-15: keyword-researcher run — semilla `pagina de ventas que
  convierte`, 18 keywords nuevas, 1 item encolado (`que-es-una-landing-page`).
- 2026-07-13: keyword-researcher run — semilla `copywriting para vender`, 21
  keywords nuevas, 1 item encolado (`que-es-el-copywriting`).
- 2026-07-03: auditoría SEO integral + implementación (informe, lint Regla 8,
  prompt content-writer con seoTitle obligatorio, cola marcada, docs).
- `d54b53d`: funnel-de-captacion publicado, item marcado written.
- content-writer 2026-07-02: `funnel-de-captacion` redactado (lint
  OK), publicación bloqueada por `repo_path` obsoleto (resuelto el 03).
  `agentes-ia-sin-codigo` pasado a `needs_review` por solapamiento.
- content-writer 2026-06-30: `ia-agentica-que-es-y-como-usarla`.
- `bf74a47`: keyword-researcher run 2026-06-29.
- content-writer 2026-06-28: `agentes-de-ia-para-solopreneurs`.
- `b7de3e7`: indexación de mejor-modelo-de-negocio confirmada (GSC 2026-06-26).
- `4e47088`: estado y bitácora tras run completo 2026-06-25.
- `a51e91e`: refresh-recommender run 2026-06-25.
- `ba192a4`, `bd11a49`, `2b47392`: content-writer run 2026-06-25 (3 posts).

Repo web:

- `097e6e8` (2026-08-27): seo: enlaces internos hacia claude-cowork-precio.
- `35bb042` (2026-08-27): post: claude-cowork-precio (rebaseado sin
  conflictos sobre un commit ajeno de republicación de ensayo que había
  llegado a origin/main mientras tanto).
- `2d24350` (2026-08-10): seo: enlaces internos hacia ganar-dinero-con-ia.
- `6340ad4` (2026-08-10): post: ganar-dinero-con-ia (rebaseado sobre 6
  commits ajenos que habían llegado a origin/main mientras tanto: RSS de
  ensayos vía n8n, republicación automática de ensayos, integración de
  vídeos de YouTube en el blog).
- `72ec9a9` (2026-07-21): seo: enlaces internos hacia que-es-una-landing-page.
- `8f632cb` (2026-07-21): post: que-es-una-landing-page.
- `88c0ebf` (2026-07-03): auditoría SEO — 12 seoTitles/metas, lastmod en
  sitemap, absolute_redirect off, favicons, .htaccess eliminado.
- (2026-07-03): post: funnel-de-captacion.
- `ef4ec00`: post + enlaces: ia-agentica-que-es-y-como-usarla (2026-06-30).
- `f5d37e9`: seo: enlaces internos hacia agentes-de-ia-para-solopreneurs.
- `401ec50`: post: agentes-de-ia-para-solopreneurs.
- Posts del 25 de junio: `que-es-un-lead`, `claude-code-sin-programar`,
  `como-monetizar-una-newsletter` — publicados y en sitemap.
