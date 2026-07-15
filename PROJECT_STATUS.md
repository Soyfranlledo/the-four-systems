# Estado del proyecto SEO

Última actualización: 2026-07-15

Este documento es la fotografía operativa para comenzar una sesión. El detalle
histórico está en [`docs/session-log.md`](docs/session-log.md).

## Resumen

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
- El blog tiene **33 artículos publicados** en producción. Último:
  `/blog/funnel-de-lanzamiento/` (2026-07-09, 2.276 palabras, PUBLISHED_LIVE,
  HTTP 200, con dato propio citable ya integrado).
- Cola: **2 items `queued`** (`2026-07-13-que-es-el-copywriting`,
  `2026-07-15-que-es-una-landing-page`) tras el run del keyword-researcher
  del 15 de julio. `agentes-ia-sin-codigo-para-emprendedores` sigue en
  `needs_review` (solapamiento con dos posts de IA). Quedan 4 de las 6
  semillas nuevas del 09 sin investigar (vender cursos online, prompts para
  negocio, monetizar con ia, automatizar ventas): el keyword-researcher las
  procesará una por run. Ver `state/content-queue.json`.
- **Regla nueva de redacción:** todo post lleva `seoTitle` ≤47 caracteres con
  número/dato (el layout añade " — Fran Lledó", 13 car.). Exigido en
  `prompts/content-writer.md` y verificado por `scripts/lint-post.py` (Regla 8:
  título SERP ≤60, description 120-160).
- Todas las semillas de `state/seed-keywords.txt` están investigadas. Próxima
  acción: añadir semillas nuevas o iniciar segunda vuelta de las más antiguas.
- Los ensayos duplicados con Substack usan `noindex, follow` y no aparecen en
  el sitemap.

## Rendimiento observado

Última lectura del informe semanal automático: semana 13-19 de junio de 2026.

| Métrica | 13-19 jun | 6-12 jun | 30 may-5 jun |
| --- | ---: | ---: | ---: |
| Impresiones del sitio | 845 | 500 | 77 |
| Clics del sitio | 11 | 10 | 5 |
| CTR | 1,30% | 2,00% | 6,49% |
| Posición media | 17,1 | — | — |
| Sesiones orgánicas (GA4) | 15 | 8 | 8 |

Las impresiones crecen con claridad (×11 en tres semanas). El post estrella
es `/blog/como-escribir-asuntos-de-email/` (337 imp, posición 13, CTR 0,3%).

GEO: ChatGPT reconoce "Fran Lledó" y "Cazatarjetas" en consultas directas,
pero aún no cita franlledo.com en queries de nicho.

## CTR

Diagnóstico 2026-07-03 (GSC 28 días): CTR global 1,1%, pero **no-marca 0,24%**
(9 de los 12 clics por query son de "fran lledo"). Causa raíz: titles de 64-109
caracteres sin número que Google truncaba, frente a SERPs donde el 100% de los
títulos ganadores lleva cifra. Caso extremo: #1 orgánico en "cómo escribir
mejores asuntos de email" (198 impr, pos 5,7) con 0 clics.

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

Estado a 2026-07-03 (URL Inspection API, ver informe de auditoría):

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

- **Content-writer no-op / autonomía (RESUELTO 2026-07-09, CONFIRMADO
  2026-07-11 y 2026-07-13):** los runs programados del 4, 7 y 9 de julio
  salieron en `no-op` porque el agente preguntaba en vez de ejecutar, pese al
  `MODE: AUTO`. `coordinator.sh` ahora antepone una cabecera no-interactiva
  explícita (aplicada a content-writer y keyword-researcher). El run del
  sábado 2026-07-11 (content-writer) y el del lunes 2026-07-13
  (keyword-researcher) confirman el fix en ambos lados: ejecutaron el
  workflow completo sin preguntar nada. Incidencia cerrada.
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

1. **Indexación (Fran, manual en GSC):** la tabla de "Indexación" de arriba,
   en orden. La P1 (URL vieja de marketing-funnel) es la que más equity
   recupera.
2. **Imágenes OG para los 21 posts con `og-default.jpg`** (incluye
   funnel-de-captacion): `scripts/og/generate-og.mjs` del repo web exige
   Playwright aparte. Integrarlo en el pipeline de publicación tolerante a
   fallos.
3. **seoTitle en batch para los ~20 posts restantes** (sin impresiones aún);
   los 12 con tráfico ya lo tienen.
4. **Sección "asuntos para correos: 25 ejemplos listos para copiar"** en
   asuntos-de-email, con tasas de apertura reales: captura la intención
   "ejemplos" que domina esa SERP (contenido para content-writer o Fran).
5. **Decidir sobre `agentes-ia-sin-codigo-para-emprendedores` (`needs_review`):**
   retirar, fusionar o replantear (ver `reports/2026-07-02-content-writer.md`).
6. ~~Confirmar el lado keyword-researcher de la autonomía~~ — **cerrado
   2026-07-13**, ver bitácora.
7. Keyword researcher: procesar las **4 semillas nuevas restantes** del lote
   del 09 (`vender cursos online`, `prompts para negocio`, `monetizar con
   ia`, `automatizar ventas`), una por run.
7b. **Content-writer: revisar por qué no corrió el martes 2026-07-14** (no
   hay commit en el historial). La cola tiene 2 items `queued` esperando:
   `2026-07-13-que-es-el-copywriting` y
   `2026-07-15-que-es-una-landing-page`.
8. Verificar en los próximos posts que el **dato propio citable (GEO)** se está
   integrando de forma efectiva y extraíble.
8. **Medir CTR de los snippets del 3 de julio a partir del ~17 de julio.**
9. Semana: pivotar vibe-coding a guía práctica; capturas con alt en
   newsletter-ejemplos; diagrama propio en funnel-de-captacion (los packs de
   imágenes salen 2-3 veces en esas SERPs).

## Últimos commits relevantes

Repo SEO:

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

- `88c0ebf` (2026-07-03): auditoría SEO — 12 seoTitles/metas, lastmod en
  sitemap, absolute_redirect off, favicons, .htaccess eliminado.
- (2026-07-03): post: funnel-de-captacion.
- `ef4ec00`: post + enlaces: ia-agentica-que-es-y-como-usarla (2026-06-30).
- `f5d37e9`: seo: enlaces internos hacia agentes-de-ia-para-solopreneurs.
- `401ec50`: post: agentes-de-ia-para-solopreneurs.
- Posts del 25 de junio: `que-es-un-lead`, `claude-code-sin-programar`,
  `como-monetizar-una-newsletter` — publicados y en sitemap.
