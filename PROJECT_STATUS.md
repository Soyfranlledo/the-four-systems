# Estado del proyecto SEO

Última actualización: 2026-07-02

Este documento es la fotografía operativa para comenzar una sesión. El detalle
histórico está en [`docs/session-log.md`](docs/session-log.md).

## Resumen

- **Publicación automática BLOQUEADA desde ~1 de julio.** `context/publishing.json`
  apunta a un `repo_path` que ya no existe. Ver "Incidencias conocidas": es la
  acción más urgente antes del próximo run de content-writer.
- **Fix CLI 2026-06-25:** el binario `claude` no estaba en el PATH del
  coordinador. Solucionado con symlink `~/.local/bin/claude` → binario nativo de
  la extensión VSCode. Los runs automáticos de launchd también se benefician.
- El blog tiene **31 artículos publicados** en producción. Los tres últimos son:
  - `/blog/ia-agentica-que-es-y-como-usarla/` (2026-06-30, ~1.800 palabras)
  - `/blog/agentes-de-ia-para-solopreneurs/` (2026-06-28, ~2.150 palabras)
  - `/blog/claude-code-sin-programar/` (2026-06-25, ~2.010 palabras)
- Hay **1 post redactado con lint OK pendiente de publicar** por el bloqueo de
  arriba: `output/posts/2026-07-02-funnel-de-captacion.md` (1.621 palabras).
- Cola: `funnel-de-lanzamiento` (`queued`, siguiente tras publicar captación) y
  `agentes-ia-sin-codigo-para-emprendedores` en `needs_review` (solapamiento
  fuerte detectado con dos posts de IA ya publicados, ver "Incidencias
  conocidas"). Ver `state/content-queue.json`.
- Todas las semillas de `state/seed-keywords.txt` están investigadas. Próxima
  acción: añadir semillas nuevas o iniciar segunda vuelta de las más antiguas
  (>30 días: embudos de venta 2026-05-21, email marketing 2026-05-22).
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

Cambios ya desplegados (no tocar hasta finales de junio-julio):

- `/blog/como-escribir-asuntos-de-email/`: título SEO corto y descripción revisada.
- `/blog/automatizacion-con-ia-para-solopreneurs/`: título SEO y descripción más concreta.

## Indexación

Estado a 2026-06-25 (refresh-recommender corrió hoy, 35 URLs analizadas):

| Prioridad | URL | Estado GSC | Acción |
| --- | --- | --- | --- |
| ✅ | `/blog/mejor-modelo-de-negocio-online-para-empezar/` | **Indexada** (confirmado GSC 2026-06-26) | — |
| P2 | `/blog/etiqueta/email-marketing/` | Discovered - not indexed | Solicitar indexación |
| P3 | `/blog/claude-code-sin-programar/` | Unknown (publicado 2026-06-25) | Solicitar indexación |
| P3 | `/blog/como-monetizar-una-newsletter/` | Unknown (publicado 2026-06-25) | Solicitar indexación |
| P3 | `/blog/que-es-un-lead/` | Unknown (publicado 2026-06-25) | Solicitar indexación |
| P3 | `/blog/agentes-de-ia-para-solopreneurs/` | Unknown (publicado 2026-06-28) | Solicitar indexación |
| P3 | `/blog/ia-agentica-que-es-y-como-usarla/` | Unknown (publicado 2026-06-30) | Solicitar indexación |

Nota: `/blog/newsletter-guia-para-solopreneurs/` y
`/blog/newsletter-ejemplos-que-venden/` no aparecen en los flagged del refresh,
lo que sugiere que ya están indexadas. Confirmar en GSC.

## Programación activa

| Job | Frecuencia |
| --- | --- |
| Keyword researcher | lunes y miércoles, 09:00 |
| Content writer | martes, jueves y sábado, 10:00 |
| Refresh recommender | día 1 de cada mes, 07:00 |
| Informe semanal | lunes, 08:00 |

Zona horaria del equipo: `Europe/Madrid`.

## Incidencias conocidas

- **`context/publishing.json` con `repo_path` obsoleto (detectado 2026-07-02,
  BLOQUEANTE):** apunta a `~/Documents/Claude/franlledo-web`, que ya no
  existe. El repo web real vive ahora en `~/Projects/franlledo-web` (mismo
  historial de commits, confirmado incluyendo `ef4ec00` del 30 de junio). La
  carpeta se movió aparentemente el 1 de julio. `scripts/publish-to-astro.py`
  falla con `ERROR: content dir does not exist` hasta que se corrija.
  Ya se había detectado una vez (nota técnica en
  `reports/2026-06-30-content-writer.md`) pero no llegó a este documento y se
  perdió; de ahí que el run de hoy se topara otra vez con el bloqueo.
  **Acción:** editar `context/publishing.json`, campo `repo_path` →
  `/Users/franlledo/Projects/franlledo-web`. Es una sesión con permiso para
  tocar `context/` (el content-writer tiene prohibido hacerlo dentro de su
  propio run). Después, publicar `output/posts/2026-07-02-funnel-de-captacion.md`
  con `scripts/publish-to-astro.py`.
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

1. **Corregir `context/publishing.json`** (ver Incidencias conocidas) y
   publicar `funnel-de-captacion`. Es el bloqueo más urgente: sin esto no hay
   publicación automática para ningún post futuro.
2. **Indexación (Fran, manual en GSC):** `mejor-modelo-de-negocio-online-para-empezar`
   ya indexada (confirmado 2026-06-26). Quedan: `/etiqueta/email-marketing/` (P2)
   y los 3 posts del 25 de junio (P3). Cuando se publique `funnel-de-captacion`,
   añadirla a la cola de indexación manual también.
3. **Decidir sobre `agentes-ia-sin-codigo-para-emprendedores` (`needs_review`):**
   retirar de la cola, fusionar como sección ampliada de un post existente, o
   replantear con ángulo no cubierto (ver detalle en
   `reports/2026-07-02-content-writer.md`).
4. Content writer: siguiente item limpio en cola es `funnel-de-lanzamiento`
   (conecta explícitamente con `funnel-de-captacion`).
5. Keyword researcher: añadir nuevas semillas a `state/seed-keywords.txt`
   (candidatas: `monetizar con ia`, `prompts para negocio`, `automatizar ventas`)
   o iniciar segunda vuelta de las más antiguas.
6. Medir CTR de los snippets modificados a finales de junio.
7. Confirmar en GSC si `newsletter-guia` y `newsletter-ejemplos` ya están indexadas.

## Últimos commits relevantes

Repo SEO:

- (este run): content-writer 2026-07-02: `funnel-de-captacion` redactado (lint
  OK), publicación bloqueada por `repo_path` obsoleto. `agentes-ia-sin-codigo`
  pasado a `needs_review` por solapamiento.
- content-writer 2026-06-30: `ia-agentica-que-es-y-como-usarla`.
- `bf74a47`: keyword-researcher run 2026-06-29.
- content-writer 2026-06-28: `agentes-de-ia-para-solopreneurs`.
- `b7de3e7`: indexación de mejor-modelo-de-negocio confirmada (GSC 2026-06-26).
- `4e47088`: estado y bitácora tras run completo 2026-06-25.
- `a51e91e`: refresh-recommender run 2026-06-25.
- `ba192a4`, `bd11a49`, `2b47392`: content-writer run 2026-06-25 (3 posts).

Repo web:

- `ef4ec00`: post + enlaces: ia-agentica-que-es-y-como-usarla (2026-06-30).
- `f5d37e9`: seo: enlaces internos hacia agentes-de-ia-para-solopreneurs.
- `401ec50`: post: agentes-de-ia-para-solopreneurs.
- Posts del 25 de junio: `que-es-un-lead`, `claude-code-sin-programar`,
  `como-monetizar-una-newsletter` — publicados y en sitemap.
