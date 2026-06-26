# Estado del proyecto SEO

Última actualización: 2026-06-26

Este documento es la fotografía operativa para comenzar una sesión. El detalle
histórico está en [`docs/session-log.md`](docs/session-log.md).

## Resumen

- El sistema está operativo. Los cuatro jobs programados (investigación,
  redacción, refresh e informe) están cargados en `launchd`.
- **Fix CLI 2026-06-25:** el binario `claude` no estaba en el PATH del
  coordinador. Solucionado con symlink `~/.local/bin/claude` → binario nativo de
  la extensión VSCode. Los runs automáticos de launchd también se benefician.
- El blog tiene **29 artículos publicados**. Los tres últimos son:
  - `/blog/que-es-un-lead/` (2026-06-25, ~1.450 palabras)
  - `/blog/claude-code-sin-programar/` (2026-06-25, ~2.010 palabras)
  - `/blog/como-monetizar-una-newsletter/` (2026-06-25, ~1.800 palabras)
- La cola tiene **3 items pendientes**: `agentes-de-ia-para-solopreneurs`,
  `ia-agentica-que-es-y-como-usarla`, `agentes-ia-sin-codigo`. Ver
  `state/content-queue.json`.
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

- **CLI PATH (resuelto 2026-06-25):** `claude` no estaba instalado como comando
  global (solo existía como binario nativo de la extensión VSCode). Se creó
  `~/.local/bin/claude` → symlink al binario nativo. El coordinador ya lo
  encuentra a través de `$HOME/.local/bin` en su PATH.
- Los informes HTML históricos de `output/keywords/` pueden contener URLs con
  fecha del incidente del 8 de junio. Son snapshots, no fuentes activas.
- DataForSEO (`mcp__dfs-mcp`) no disponible en ningún run de keyword-researcher
  desde el 17 de junio. Los volúmenes y KD son estimaciones por WebSearch.
  Cuando vuelva, priorizar verificación de `agentes de ia` (vol estimado
  1000-2000/mo) y `claude code en español`.

## Próximos hitos

1. **Indexación (Fran, manual en GSC):** `mejor-modelo-de-negocio-online-para-empezar`
   ya indexada (confirmado 2026-06-26). Quedan: `/etiqueta/email-marketing/` (P2)
   y los 3 posts del 25 de junio (P3).
2. Content writer: procesar los 3 items en cola (`agentes-de-ia`,
   `ia-agentica`, `agentes-ia-sin-codigo`).
3. Keyword researcher: añadir nuevas semillas a `state/seed-keywords.txt`
   (candidatas: `monetizar con ia`, `prompts para negocio`, `automatizar ventas`)
   o iniciar segunda vuelta de las más antiguas.
4. Medir CTR de los snippets modificados a finales de junio.
5. Confirmar en GSC si `newsletter-guia` y `newsletter-ejemplos` ya están indexadas.

## Últimos commits relevantes

Repo SEO:

- `b7de3e7`: indexación de mejor-modelo-de-negocio confirmada (GSC 2026-06-26).
- `4e47088`: estado y bitácora tras run completo 2026-06-25.
- `a51e91e`: refresh-recommender run 2026-06-25.
- `ba192a4`, `bd11a49`, `2b47392`: content-writer run 2026-06-25 (3 posts).
- `306856a`, `871b94d`, `6db5e27`: keyword-researcher run 2026-06-25 (3 semillas).

Repo web (actualizado por publish-to-astro.py):

- Posts del 25 de junio: `que-es-un-lead`, `claude-code-sin-programar`,
  `como-monetizar-una-newsletter` — publicados y en sitemap.
