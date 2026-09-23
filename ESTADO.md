---
proyecto: SEO franlledo
prefijo: SEO
siguiente_id: 18
estado_proyecto: activo
responsable: Fran
personas: agentes programados (keyword-researcher, content-writer, refresh-recommender); GSC, GA4, DataForSEO
actualizado: 2026-09-23
actualizado_por: Agente (sesión con Fran: token headless configurado y verificado)
ultima_sync_pm: 2026-09-23
---

# ESTADO — SEO franlledo

<!-- Interfaz proyecto ⇄ Project Manager. Formato y reglas: ~/Projects/Project Manager/docs/plantilla-estado.md
     No cambies el orden ni el nombre de las columnas. No reutilices IDs. Sin secretos: solo punteros. -->

## Pendientes

| ID | Tarea | P | Deadline | Resp. | Estado | Notion |
|---|---|---|---|---|---|---|
| SEO-016 | Fijar a mano la URL de confirmación de los dos formularios nuevos de MailerLite (la API ignora el campo) | P3 | — | Fran | [ ] | [↗](https://www.notion.so/3e4b9c50d57c81d4895bf7a6e7c5cae5) |
| SEO-014 | Rehacer o borrar el symlink roto ~/.local/bin/claude (apunta a una extensión de VSCode que ya no existe) | P3 | — | Fran | [ ] | [↗](https://www.notion.so/3e4b9c50d57c81d28debdd4540ae1cf0) |
| SEO-003 | Ejecutar en GSC las solicitudes de indexación manuales en el orden de la tabla «Indexación» (P1: URL vieja de marketing-funnel) | P1 | — | Fran | [ ] | [↗](https://app.notion.com/p/3deb9c50d57c81f4a6bed03509d79775) |
| SEO-004 | Investigar por qué launchd no dispara algunos runs (2 ocurrencias sin resolver; a la tercera revisar config) | P1 | — | Fran | [ ] | [↗](https://app.notion.com/p/3deb9c50d57c81f785d9d6c10cbb67b8) |
| SEO-005 | Excluir trafficheap.cc de los informes recurrentes y revisar la trazabilidad del canal email (85→6 sesiones) | P2 | — | Agente | [ ] | [↗](https://app.notion.com/p/3deb9c50d57c81af994fca4a62ed8cca) |
| SEO-006 | Generar imágenes OG para los 21 posts con og-default.jpg e integrar generate-og.mjs en el pipeline | P2 | — | Agente | [ ] | [↗](https://app.notion.com/p/3deb9c50d57c81108881ec41809d75a6) |
| SEO-007 | Decidir qué hacer con el artículo de agentes de IA sin código: retirarlo, fusionarlo o replantearlo | P2 | — | Fran | [ ] | [↗](https://app.notion.com/p/3deb9c50d57c814db818dc78fbe2ea31) |
| SEO-009 | Instruir al researcher para comprobar anuncios recientes de Anthropic/OpenAI por semilla antes de darla por agotada | P2 | — | Agente | [ ] | [↗](https://app.notion.com/p/3deb9c50d57c814ab255ff1588d65564) |
| SEO-010 | Comparar la muestra de visibilidad IA de octubre con la referencia de septiembre (48/48, 2,47 USD) | P2 | 2026-10-07 | Agente | [ ] | [↗](https://app.notion.com/p/3deb9c50d57c810f894cd461ee1c649c) |
| SEO-011 | Decidir si merece la pena revisar las guías de IA y las fuentes del informe de visibilidad de septiembre | P3 | — | Fran | [ ] | [↗](https://app.notion.com/p/3deb9c50d57c81e6a249e5f19e4d776d) |

Leyenda Estado: `[ ]` pendiente · `[~]` en curso · `[!]` bloqueada · `[x]` hecha · `[-]` cancelada. Deadline con `!` = duro (externo, no se mueve).

### Detalle

- **SEO-016** — Nota: Opcional. Los formularios nuevos (199325656470783872 y 199325684573668805) no tienen URL de agradecimiento, así que usan la página por defecto de MailerLite. Los viejos apuntaban a una OTO de cazatarjetas; puede ser venta cruzada deliberada, lo decide Fran. Panel → Forms → ajustes de double opt-in. Nota: docs/session-log.md 22-sep (tercera entrada).
- **SEO-014** — Nota: Cosmético, no afecta a los runs: el PATH de los plists resuelve a /opt/homebrew/bin/claude. Nota: docs/session-log.md 22-sep.
- **SEO-003** — Necesita: Google Search Console. Nota: PROJECT_STATUS.md:815-817; manual de Fran.
- **SEO-004** — Necesita: launchd/. Nota: PROJECT_STATUS.md:765-778.
- **SEO-005** — Nota: PROJECT_STATUS.md:24-25; session-log 15-sep.
- **SEO-006** — Necesita: Playwright en el repo franlledo-web. Nota: PROJECT_STATUS.md:818-820.
- **SEO-007** — Por qué: es el único contenido que queda marcado como pendiente de revisión y bloquea cerrar la auditoría del blog. Nota: PROJECT_STATUS.md:831-832.
- **SEO-009** — Nota: PROJECT_STATUS.md:855-861.
- **SEO-010** — Nota: session-log 14-sep §Pendiente; job semanal ya cargado.
- **SEO-011** — Por qué: el informe propone cambios editoriales y hay que decidir si se ejecutan o se descartan, para no dejarlo en el aire. Nota: session-log 14-sep.

## Hechas desde la última sincronización

| ID | Tarea | Fecha | Evidencia | Notion |
|---|---|---|---|---|
| SEO-012 | Medición mensual de visibilidad en IA integrada (48/48) y consulta de tráfico GA4+GSC (blog 12→24 clics) | 2026-09-15 | commits 40fc130, 9aada86 | [↗](https://www.notion.so/3e3b9c50d57c81bb89d4c43a892256a2) |
| SEO-001 | Causa raíz de la auth confirmada (token del llavero caducado por no refrescarse nunca en headless) y pipeline blindado: token de larga duración, centinela en el informe semanal y encadenado researcher→writer | 2026-09-22 | commit e7e9ea8; docs/session-log.md 22-sep | [↗](https://app.notion.com/p/3deb9c50d57c8165b023e0a9121408e7) |
| SEO-013 | Token de larga duración (1 año) en .env.local, verificado: autentica solo con el token y HOME limpio (authMethod oauth_token) y coordinator.sh lo exporta sin arrastrar las credenciales de Google | 2026-09-23 | verificación en sesión; coordinator.sh cabecera | [↗](https://www.notion.so/3e4b9c50d57c81168971df0bcfb1c9ec) |
| SEO-008 | Añadidas 5 semillas nuevas a seed-keywords.txt en temas de cobertura cero (SEO como canal, pricing, tripwire, bloqueo, contenido con IA) | 2026-09-22 | state/seed-keywords.txt; docs/session-log.md 22-sep | [↗](https://app.notion.com/p/3deb9c50d57c8127a65bef226c00799f) |
| SEO-015 | Altas bot en MailerLite diagnosticadas (399 el 17-18/09, subscription bombing; 0 confirmadas de 7.343 activos gracias al doble opt-in) e IDs de formulario rotados | 2026-09-22 | commit c50df2f del repo web; docs/session-log.md 22-sep | [↗](https://www.notion.so/3e4b9c50d57c81e99992f82ceba1b31d) |
| SEO-002 | Resembrada la cola con 1 item queued (`ia para pymes`, gate de autoridad superado) tras 17 días de auth failure | 2026-09-22 | reports/2026-09-22-keyword-researcher.md; state/content-queue.json | [↗](https://app.notion.com/p/3deb9c50d57c815fa982df9cc9a172e8) |

## Bloqueos y necesidades

- Decisión de Fran (22/09): no rotar los 6 lead magnets restantes ni tocar nada en cazatarjetas.com. No reabrir salvo que el bot pivote a esos formularios.

- Desbloqueado: con SEO-001 (causa raíz) y SEO-013 (token de un año) cerradas, los runs programados ya no dependen de una sesión interactiva. Primer run automático sano el 2026-09-23 a las 09:00, tras 25 runs perdidos por `auth failure` desde junio.

## Para el PM

- Este ESTADO.md resume PROJECT_STATUS.md (fuente detallada); no duplicar allí.

## Del PM

- 2026-09-17 · creado por el PM en el bootstrap desde PROJECT_STATUS.md; confirmar filas.
