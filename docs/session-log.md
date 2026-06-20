# Bitácora de sesiones

Registro cronológico append-only de decisiones y cambios relevantes. El estado
vigente y las próximas acciones viven en [`../PROJECT_STATUS.md`](../PROJECT_STATUS.md).

## 2026-06-20: publicación de "lead magnet" (keyword vol 1000, intent commercial)

### Acciones

- Artículo redactado: `output/posts/2026-06-20-lead-magnet-que-es-y-como-crear-uno.md` (~2.000 palabras).
- Publicado en `https://franlledo.com/blog/lead-magnet-que-es-y-como-crear-uno/`. IndexNow OK.
- 3 enlaces entrantes tejidos: `como-hacer-email-marketing-que-venda.md`, `newsletter-guia-para-solopreneurs.md`, `lead-nurturing-con-email-marketing.md`. Build OK (44 páginas), push a main (`254a9b4`).
- Queue item marcado como `written`, published-url actualizada.
- Dashboard regenerado.

### Decisiones

- Ángulo: "de 0 a 2.000 suscriptores con lead magnets reales, no PDFs genéricos". La competencia (Mailchimp, MailerLite, Raiola) cubre el qué; el post de Fran cubre el cuándo y el por qué según el momento del negocio.
- SERP tiene AI Overview activo en España (el queue item lo marcó como vacío, pero ya ha aparecido). No bloquea el objetivo; Fran ya tiene un vídeo YouTube propio en el SERP ("COMO crear un LEAD MAGNET que FUNCIONE", oct 2025).
- Experience mode: semi-research. Se usó "el descubrimiento de la promesa" (adaptada al contexto del lead magnet) y datos reales verificados (2.000 suscriptores, 35% OR).
- Fan-out completo: 6 variantes cubiertas (que es, tipos, ejemplos, como crear, efectivo, para newsletter). 0 dropped.
- Tags: "Email marketing", "Embudos".
- Lint: 1 fallo inicial (4 anclas >3 palabras), corregido en un paso, lint OK en segunda pasada.

## 2026-06-18: publicación de "newsletter ejemplos" (keyword vol 320, KD low 19)

### Acciones

- Artículo redactado: `output/posts/2026-06-18-newsletter-ejemplos-que-venden.md` (~1.700 palabras).
- Publicado en `https://franlledo.com/blog/newsletter-ejemplos-que-venden/`. IndexNow OK.
- 2 enlaces entrantes tejidos: `newsletter-guia-para-solopreneurs.md` y `email-marketing-ejemplos-de-correos-que-venden.md`. Build OK, push a main (`fae0112`).
- Dashboard regenerado.

### Decisiones

- Ángulo: todos los resultados SERP son tool-company listicles (Brevo, HubSpot, MailerLite). Hueco claro para el punto de vista solopreneur que vende con lista pequeña.
- Cuatro tipos de newsletter cubiertos: opinión, historia, enseñanza, secuencia de lanzamiento. Fan-out completo (los 6 términos del cluster están cubiertos).
- Fuente externa: Mailchimp benchmarks (https://mailchimp.com/es/resources/email-marketing-benchmarks/) para open rate. Litmus 404; Campaign Monitor 2022 rechazado.
- Experience mode: real. Se usó "El lanzamiento desastre por escuchar al público" en la sección de error. Perfectamente alineado con el tema.
- Se añadió `newsletter-guia-para-solopreneurs` como 5° enlace interno (no estaba en la lista pre-resuelta pero es el post más relacionado del blog).
- Tags: "Email marketing" y "Negocios" (taxonomía canónica).

### Pendiente

- Solicitar indexación de `/blog/newsletter-ejemplos-que-venden/` en Search Console.
- Ejecutar keyword-researcher: la cola está vacía.

---

## 2026-06-16: publicación de "newsletter" (keyword vol 12.100, KD 12)

### Acciones

- Artículo redactado: `output/posts/2026-06-16-newsletter-guia-para-solopreneurs.md` (2.000 palabras).
- Publicado en `https://franlledo.com/blog/newsletter-guia-para-solopreneurs/`. IndexNow OK.
- 2 enlaces entrantes tejidos: `como-hacer-email-marketing-que-venda.md` y `por-que-hacer-email-marketing.md`. Build OK, push a main.
- Dashboard regenerado.

### Decisiones

- Ángulo: newsletter como canal de venta propio (no guía de herramientas). La SERP está dominada por Mailjet, Mailrelay, EAE, herramientas; el hueco es el punto de vista solopreneur con datos reales.
- Fuente externa única: Litmus State of Email 2025 (ROI stat verificada vía WebFetch). No se usó Mailchimp (404).
- Experience mode: real. Se usó "El descubrimiento de la promesa" en sección de venta y "Efecto Microondas" en sección de error.
- Tags: "Email marketing" y "Negocios" (taxonomía canónica).

### Pendiente

- Solicitar indexación de la nueva URL en Search Console.

---

## 2026-06-15: indexación, CTR, automatización y nueva cola

### Contexto

Fran recibió un aviso de Search Console por una URL duplicada donde Google había
elegido un canonical distinto. Se revisó el informe de indexación y la política
de publicación duplicada de ensayos en Substack.

### Decisiones

- Los ensayos se publican completos tanto en Substack como en franlledo.com.
- La copia de franlledo.com queda accesible, con `noindex, follow`, fuera del
  sitemap y sin canonical externo. La portada `/ensayos/` sí se indexa.
- No se solicita indexación masiva. Solo se actúa sobre URLs nuevas o marcadas
  como problemáticas tras inspeccionarlas.
- Los cambios de snippet se evalúan durante 2-4 semanas; el crecimiento de
  tráfico y suscripciones necesita una ventana de 6-8 semanas.

### Diagnóstico de rendimiento

- Comparación GSC 6-12 de junio frente a 30 de mayo-5 de junio:
  500 vs 77 impresiones del sitio, 10 vs 5 clics.
- El blog pasó de 40 a 466 impresiones y de 0 a 4 clics.
- Las URLs con visibilidad pasaron de 3 a 18.
- GA4 mantuvo 8 sesiones orgánicas semanales.
- Se observó una alta probable desde Google el 11 de junio mediante
  `/blog/como-hacer-email-marketing-que-venda/`.

### Cambios en medición y CTR

- Se añadió el evento GA4 `newsletter_signup` y el informe semanal ahora separa
  suscripciones por canal.
- Se añadió soporte `seoTitle` al schema y plantilla del blog.
- Se optimizó el snippet de `/blog/como-escribir-asuntos-de-email/`.
- Se optimizó el snippet del nuevo artículo de automatización.

Commits web: `84bdec1`, `416c8b9`, `c2fc583`.
Commit SEO: `174cd14`.

### Automatización

- Causa del fallo: el coordinador intentaba usar el modelo inexistente
  `claude-fable-5[1m]`.
- Solución: `sonnet` como modelo por defecto, configurable mediante
  `SEO_CLAUDE_MODEL`.
- Se verificó la ejecución manual del redactor y del investigador.

Commit SEO: `fdc657e`.

### Contenido publicado

Se publicó:

`https://franlledo.com/blog/automatizacion-con-ia-para-solopreneurs/`

Verificaciones realizadas:

- HTTP 200 en producción.
- Canonical autorreferente y sin fecha.
- Build de Astro correcto.
- URL limpia presente en sitemap y ficheros `llms`.
- Dos enlaces entrantes desde artículos relacionados.
- Linter editorial correcto.

Durante la revisión se eliminaron cifras personales no documentadas y una fuente
secundaria débil. Se sustituyeron por fuentes de McKinsey y NBER. El prompt del
redactor prohíbe desde entonces inferir costes, ahorros, ingresos o conversiones
personales y exige fuentes primarias para estadísticas.

Commits web: `1ea5aef`, `8a8f188`, `c2fc583`.
Commits SEO: `6d02c2f`, `7b2dafa`.

### Investigación y cola

Se añadieron cinco semillas nuevas. La investigación de `lista de suscriptores`
descubrió 15 keywords y dos oportunidades prioritarias:

- `newsletter`: volumen 12.100, KD 12.
- `newsletter ejemplos`: volumen 320, KD no disponible.

Se corrigieron sus títulos y notas para no prometer ejemplos o métricas
individuales que no estén documentados. También se eliminaron de la cola activa
dos enlaces internos que todavía apuntaban a URLs antiguas con fecha.

Commits SEO: `7359a66`, `e13d92e`.

### Search Console

El 15 de junio, antes de solicitar indexación, ambas URLs figuraban como
`URL is unknown to Google`:

- `/blog/automatizacion-con-ia-para-solopreneurs/`
- `/blog/mejor-modelo-de-negocio-online-para-empezar/`

Fran confirmó que envió las dos solicitudes manuales ese mismo día. Queda
pendiente comprobar el resultado entre el 18 y el 22 de junio.

### Estado al cerrar

- Ambos repositorios estaban limpios y sincronizados con `origin/main`.
- Los cuatro jobs reales de `launchd` estaban cargados.
- Quedaron dos artículos `queued`, empezando por `newsletter`.
- No hay otra acción manual inmediata aparte de esperar rastreo y acumular datos.

### Memoria entre sesiones

Se formalizó un sistema de memoria duradera:

- `PROJECT_STATUS.md`: estado actual, métricas, pendientes y próximos hitos.
- `docs/session-log.md`: historial append-only de decisiones y verificaciones.
- `AGENTS.md`: protocolo obligatorio de lectura al comenzar y actualización al
  cerrar una sesión relevante.
- `README.md`: mapa específico del proyecto y comandos operativos.

La documentación distingue reglas permanentes, estado humano, estado
estructurado, informes automáticos e historial Git para evitar fuentes de verdad
contradictorias.
