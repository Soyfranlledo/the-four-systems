# Estado del proyecto SEO

Última actualización: 2026-06-20, 10:10 CEST

Este documento es la fotografía operativa para comenzar una sesión. El detalle
histórico está en [`docs/session-log.md`](docs/session-log.md).

## Resumen

- El sistema está operativo. Los cuatro jobs programados (investigación,
  redacción, refresh e informe) están cargados en `launchd`; la auditoría
  on-site se ejecuta manualmente.
- El fallo de los agentes por el modelo inválido `claude-fable-5[1m]` está
  corregido. El coordinador usa `sonnet` por defecto.
- El blog tiene 26 artículos publicados. El último es
  `/blog/lead-magnet-que-es-y-como-crear-uno/` (publicado 2026-06-20, ~2.000 palabras).
- La cola tiene items pendientes. Ver `state/content-queue.json`.
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

El post `lead-magnet-que-es-y-como-crear-uno` ha sido marcado como `written` y publicado en vivo. Ver cola para el siguiente item.

Las notas de cola prohíben inventar asuntos, métricas individuales o ventas atribuidas.

Semillas pendientes de investigar:

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

1. Verificar el resultado de las dos solicitudes de indexación enviadas el 15 de junio
   (automatizacion-con-ia y mejor-modelo-de-negocio).
2. Solicitar indexación de `/blog/lead-magnet-que-es-y-como-crear-uno/` en Search Console.
3. Solicitar indexación de `/blog/newsletter-guia-para-solopreneurs/` y
   `/blog/newsletter-ejemplos-que-venden/` si todavía no están indexadas.
4. Ejecutar keyword-researcher para las semillas restantes (monetizar newsletter,
   claude code, agentes de ia).
5. Medir CTR de los snippets modificados a partir de finales de junio.
6. Regenerar `state/refresh-candidates.json` antes de la próxima revisión manual
   de indexación.

## Últimos commits relevantes

Repo SEO:

- `(este run)`: publicación de lead-magnet-que-es-y-como-crear-uno, estado y bitácora.
- `7f406b0`: publicación de newsletter-ejemplos-que-venden.
- `e13d92e`: investigación de `lista de suscriptores` y cola de newsletter.

Repo web:

- `254a9b4`: enlaces entrantes desde email-marketing, newsletter y lead-nurturing hacia lead-magnet.
- `66f2e82`: publicación de lead-magnet-que-es-y-como-crear-uno (por publish-to-astro.py).
- `fae0112`: enlaces entrantes desde newsletter-guia y email-marketing-ejemplos.
