---
proyecto: SEO franlledo
prefijo: SEO
siguiente_id: 13
estado_proyecto: activo
responsable: Fran
personas: agentes programados (keyword-researcher, content-writer, refresh-recommender); GSC, GA4, DataForSEO
actualizado: 2026-09-22
actualizado_por: Agente (keyword-researcher run)
ultima_sync_pm: 2026-09-22
---

# ESTADO — SEO franlledo

<!-- Interfaz proyecto ⇄ Project Manager. Formato y reglas: ~/Projects/Project Manager/docs/plantilla-estado.md
     No cambies el orden ni el nombre de las columnas. No reutilices IDs. Sin secretos: solo punteros. -->

## Pendientes

| ID | Tarea | P | Deadline | Resp. | Estado | Notion |
|---|---|---|---|---|---|---|
| SEO-001 | Confirmar de forma duradera la autenticación de Claude Code: pasó el check hoy tras 17 días de auth failure, pero la causa raíz no se investigó | P1 | — | Fran | [~] | [↗](https://app.notion.com/p/3deb9c50d57c8165b023e0a9121408e7) |
| SEO-003 | Ejecutar en GSC las solicitudes de indexación manuales en el orden de la tabla «Indexación» (P1: URL vieja de marketing-funnel) | P1 | — | Fran | [ ] | [↗](https://app.notion.com/p/3deb9c50d57c81f4a6bed03509d79775) |
| SEO-004 | Investigar por qué launchd no dispara algunos runs (2 ocurrencias sin resolver; a la tercera revisar config) | P1 | — | Fran | [ ] | [↗](https://app.notion.com/p/3deb9c50d57c81f785d9d6c10cbb67b8) |
| SEO-005 | Excluir trafficheap.cc de los informes recurrentes y revisar la trazabilidad del canal email (85→6 sesiones) | P2 | — | Agente | [ ] | [↗](https://app.notion.com/p/3deb9c50d57c81af994fca4a62ed8cca) |
| SEO-006 | Generar imágenes OG para los 21 posts con og-default.jpg e integrar generate-og.mjs en el pipeline | P2 | — | Agente | [ ] | [↗](https://app.notion.com/p/3deb9c50d57c81108881ec41809d75a6) |
| SEO-007 | Decidir qué hacer con el artículo de agentes de IA sin código: retirarlo, fusionarlo o replantearlo | P2 | — | Fran | [ ] | [↗](https://app.notion.com/p/3deb9c50d57c814db818dc78fbe2ea31) |
| SEO-008 | Añadir semillas nuevas a state/seed-keywords.txt fuera del temario cubierto (12 sin segunda vuelta) | P2 | — | Fran | [ ] | [↗](https://app.notion.com/p/3deb9c50d57c8127a65bef226c00799f) |
| SEO-009 | Instruir al researcher para comprobar anuncios recientes de Anthropic/OpenAI por semilla antes de darla por agotada | P2 | — | Agente | [ ] | [↗](https://app.notion.com/p/3deb9c50d57c814ab255ff1588d65564) |
| SEO-010 | Comparar la muestra de visibilidad IA de octubre con la referencia de septiembre (48/48, 2,47 USD) | P2 | 2026-10-07 | Agente | [ ] | [↗](https://app.notion.com/p/3deb9c50d57c810f894cd461ee1c649c) |
| SEO-011 | Decidir si merece la pena revisar las guías de IA y las fuentes del informe de visibilidad de septiembre | P3 | — | Fran | [ ] | [↗](https://app.notion.com/p/3deb9c50d57c81e6a249e5f19e4d776d) |

Leyenda Estado: `[ ]` pendiente · `[~]` en curso · `[!]` bloqueada · `[x]` hecha · `[-]` cancelada. Deadline con `!` = duro (externo, no se mueve).

### Detalle

- **SEO-001** — El run de keyword-researcher del 2026-09-22 pasó el check de auth de `coordinator.sh` por primera vez desde el 05/09 (17 días de `auth failure` en el log), sin que nadie tocara la autenticación. Causa raíz de la caída y de la recuperación sin investigar; vigilar el próximo run programado (content-writer, 24/09) para confirmar que no es un caso aislado. Nota: PROJECT_STATUS.md:1-30; state/agent-log.json; docs/session-log.md 22-sep.
- **SEO-003** — Necesita: Google Search Console. Nota: PROJECT_STATUS.md:815-817; manual de Fran.
- **SEO-004** — Necesita: launchd/. Nota: PROJECT_STATUS.md:765-778.
- **SEO-005** — Nota: PROJECT_STATUS.md:24-25; session-log 15-sep.
- **SEO-006** — Necesita: Playwright en el repo franlledo-web. Nota: PROJECT_STATUS.md:818-820.
- **SEO-007** — Por qué: es el único contenido que queda marcado como pendiente de revisión y bloquea cerrar la auditoría del blog. Nota: PROJECT_STATUS.md:831-832.
- **SEO-008** — Nota: PROJECT_STATUS.md:853-861; bajó de 14 a 12 tras la segunda vuelta de `ia para negocios pequeños` (22/09).
- **SEO-009** — Nota: PROJECT_STATUS.md:855-861.
- **SEO-010** — Nota: session-log 14-sep §Pendiente; job semanal ya cargado.
- **SEO-011** — Por qué: el informe propone cambios editoriales y hay que decidir si se ejecutan o se descartan, para no dejarlo en el aire. Nota: session-log 14-sep.

## Hechas desde la última sincronización

| ID | Tarea | Fecha | Evidencia | Notion |
|---|---|---|---|---|
| SEO-012 | Medición mensual de visibilidad en IA integrada (48/48) y consulta de tráfico GA4+GSC (blog 12→24 clics) | 2026-09-15 | commits 40fc130, 9aada86 | [↗](https://www.notion.so/3e3b9c50d57c81bb89d4c43a892256a2) |
| SEO-002 | Resembrada la cola con 1 item queued (`ia para pymes`, gate de autoridad superado) tras 17 días de auth failure | 2026-09-22 | reports/2026-09-22-keyword-researcher.md; state/content-queue.json | [↗](https://app.notion.com/p/3deb9c50d57c815fa982df9cc9a172e8) |

## Bloqueos y necesidades

- SEO-005, SEO-006, SEO-009 necesitan que los runs programados sigan
  pasando el check de auth (SEO-001 sigue sin causa raíz confirmada).

## Para el PM

- Este ESTADO.md resume PROJECT_STATUS.md (fuente detallada); no duplicar allí.

## Del PM

- 2026-09-17 · creado por el PM en el bootstrap desde PROJECT_STATUS.md; confirmar filas.
