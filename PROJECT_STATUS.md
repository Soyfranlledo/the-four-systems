# Estado del proyecto SEO

Última actualización: 2026-06-15, 14:32 CEST

Este documento es la fotografía operativa para comenzar una sesión. El detalle
histórico está en [`docs/session-log.md`](docs/session-log.md).

## Resumen

- El sistema está operativo. Los cuatro jobs programados (investigación,
  redacción, refresh e informe) están cargados en `launchd`; la auditoría
  on-site se ejecuta manualmente.
- El fallo de los agentes por el modelo inválido `claude-fable-5[1m]` está
  corregido. El coordinador usa `sonnet` por defecto.
- El blog tiene 23 artículos publicados. El último es
  `/blog/automatizacion-con-ia-para-solopreneurs/`.
- Hay dos artículos en cola: `newsletter` y `newsletter ejemplos`.
- Las solicitudes manuales de indexación de las dos URLs pendientes se enviaron
  en Search Console el 15 de junio de 2026. No volver a solicitarlas salvo que
  siga sin haber rastreo tras varios días.
- Los ensayos duplicados con Substack permanecen accesibles, pero usan
  `noindex, follow` y no aparecen en el sitemap.

## Rendimiento observado

Última comparación verificada: 6-12 de junio de 2026 frente a 30 de mayo-5 de
junio de 2026.

| Métrica | Periodo actual | Periodo anterior |
| --- | ---: | ---: |
| Impresiones del sitio | 500 | 77 |
| Clics del sitio | 10 | 5 |
| Impresiones del blog | 466 | 40 |
| Clics del blog | 4 | 0 |
| URLs de contenido con visibilidad | 18 | 3 |
| Sesiones orgánicas en GA4 | 8 | 8 |

Lectura: la visibilidad está creciendo con claridad, pero todavía no se ha
traducido en más sesiones orgánicas. Se identificó al menos una alta probable
desde Google el 11 de junio, con entrada por
`/blog/como-hacer-email-marketing-que-venda/` y paso a `/falta-confirmar/`.

La web ya emite el evento GA4 `newsletter_signup`. El informe semanal incluye
altas por canal, de modo que las próximas sesiones no dependerán de inferencias.

## CTR

Cambios ya desplegados:

- `/blog/como-escribir-asuntos-de-email/`: título SEO corto
  `Cómo escribir mejores asuntos de email` y descripción revisada. Era la
  oportunidad inmediata: 241 impresiones en 28 días, posición media 10,8.
- `/blog/automatizacion-con-ia-para-solopreneurs/`: título SEO
  `Automatización con IA para negocios pequeños`, descripción más concreta,
  fuentes primarias y eliminación de cifras personales no medidas.

No volver a cambiar estos snippets hasta acumular al menos 2-4 semanas de datos,
salvo error evidente.

## Indexación

Solicitudes enviadas manualmente el 15 de junio de 2026:

1. `https://franlledo.com/blog/automatizacion-con-ia-para-solopreneurs/`
2. `https://franlledo.com/blog/mejor-modelo-de-negocio-online-para-empezar/`

En la comprobación previa ambas figuraban como `URL is unknown to Google`.
Próxima acción: comprobar de nuevo entre el 18 y el 22 de junio. Solicitar
indexación no garantiza inclusión; evaluar rastreo, canonical y cobertura antes
de repetir la solicitud.

`state/refresh-candidates.json` fue generado el 11 de junio y puede estar
desactualizado respecto a las solicitudes recientes. Regenerarlo antes de usar
sus totales como estado actual.

## Contenido

Cola actual:

| Orden | Keyword | Volumen | KD | Título de trabajo |
| ---: | --- | ---: | ---: | --- |
| 1 | `newsletter` | 12.100 | 12 | Newsletter: qué es, cómo crearla y usarla para vender |
| 2 | `newsletter ejemplos` | 320 | sin dato | Newsletter ejemplos: qué enviar para que tu lista compre |

El primer artículo está previsto para el siguiente run del redactor. Las notas
de cola prohíben inventar asuntos, métricas individuales o ventas atribuidas.

Nuevas semillas disponibles:

- `lista de suscriptores` (investigada el 15 de junio)
- `lead magnet`
- `monetizar newsletter`
- `claude code`
- `agentes de ia`

## Programación activa

| Job | Frecuencia |
| --- | --- |
| Keyword researcher | lunes y miércoles, 09:00 |
| Content writer | martes, jueves y sábado, 10:00 |
| Refresh recommender | día 1 de cada mes, 07:00 |
| Informe semanal | lunes, 08:00 |

Zona horaria del equipo: `Europe/Madrid`.

## Incidencias conocidas

- El informe automático del 15 de junio no pudo conectarse a OAuth/Internet
  (`EADDRNOTAVAIL`). Después se hizo una consulta manual correcta de GSC y GA4.
  Si vuelve a ocurrir, revisar red y entorno de `launchd`, no las credenciales a
  ciegas.
- Los informes HTML históricos de `output/keywords/` pueden contener URLs con
  fecha del incidente del 8 de junio. Son snapshots, no fuentes activas.
- Algunos artefactos locales antiguos de `output/posts/` también conservan
  enlaces históricos. La web publicada y la cola activa apuntan a URLs finales.

## Próximos hitos

1. Verificar el resultado de las dos solicitudes de indexación entre el 18 y el
   22 de junio.
2. Revisar el artículo automático de `newsletter` tras su publicación: fuentes,
   afirmaciones personales, enlaces entrantes, canonical, sitemap y título.
3. Medir CTR de los snippets modificados a partir de finales de junio.
4. Medir sesiones y suscripciones orgánicas con una ventana de 6-8 semanas.
5. Regenerar `state/refresh-candidates.json` antes de la próxima revisión manual
   de indexación.

## Últimos commits relevantes

Repo SEO:

- `e13d92e`: investigación de `lista de suscriptores` y cola de newsletter.
- `7359a66`: enlaces finales sin fechas en la cola.
- `7b2dafa`: protección contra cifras personales inferidas.
- `fdc657e`: modelo válido para agentes automáticos.
- `174cd14`: suscripciones por canal en el informe semanal.

Repo web:

- `c2fc583`: rigor y snippet del artículo de automatización.
- `8a8f188`: enlaces entrantes al artículo de automatización.
- `1ea5aef`: publicación del artículo de automatización.
- `416c8b9`: mejora del snippet de asuntos de email.
- `84bdec1`: evento GA4 para altas de newsletter.
- `117db1d`: `noindex` para ensayos duplicados en Substack.
