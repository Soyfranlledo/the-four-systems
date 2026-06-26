# Bitácora de sesiones

Registro cronológico append-only de decisiones y cambios relevantes. El estado
vigente y las próximas acciones viven en [`../PROJECT_STATUS.md`](../PROJECT_STATUS.md).

## 2026-06-26: indexación confirmada + investigación FAQ schema + CTR

### Contexto

Continuación de sesión del día anterior. Fran revisó en GSC las URLs flagged
y preguntó por formas de mejorar el CTR.

### Acciones

- **Indexación confirmada:** `/blog/mejor-modelo-de-negocio-online-para-empezar/`
  aparece como "La URL está en Google" en GSC. Llevaba 37 días como
  "Discovered - not indexed". Probablemente se desbloqueó gracias al enlace
  interno añadido desde `lead-magnet` el 20 de junio.

- **Investigación FAQ schema:** Se auditó el repo web para evaluar si valía la
  pena añadir marcado FAQ. Hallazgos:
  - El sistema YA emite FAQPage automáticamente desde `src/lib/faq.ts`: cualquier
    H2 que termine en "?" se extrae como pregunta y la siguiente párrafo como
    respuesta. Si hay ≥2 FAQs, se emite el schema.
  - HowTo schema también funciona: listas numeradas con ≥3 items.
  - **No hay nada que implementar.** La infraestructura está construida y activa.
  - Google dejó de mostrar FAQ rich results para la mayoría de sitios en
    septiembre de 2023 (solo los muestra para salud y gobierno). El schema se
    emite y Google lo lee, pero las expansiones visuales en SERP no aparecen.

### Decisiones

- **CTR:** El 1,3% no es ridículo dado que la posición media es 17,1.
  A esa posición el CTR esperado es 0,5-1,5%. La palanca no es reescribir
  títulos — es subir a posiciones 1-5, que se consigue con tiempo y contenido.
  El único post donde el snippet importa ya (`asuntos-de-email`, posición 13)
  tiene el título actualizado desde mediados de junio; hay que esperar datos.
- **FAQ schema:** descartado como acción — ya está implementado y Google no lo
  muestra para sitios como franlledo.com desde 2023.
- **Próxima palanca real:** los posts de `agentes de ia` que entran en cola
  tienen KD estimado 10-20 y Fran tiene prueba de primera mano con el repo
  seo-franlledo. Son los candidatos a llegar a top 5 y generar CTR estructural.

### Pendiente al cerrar sesión

- Fran: solicitar indexación en GSC para `/etiqueta/email-marketing/` (P2) y
  los 3 posts del 25 de junio (P3). Los 3 post puede que ya los haya indexado
  IndexNow, pero conviene confirmar.
- Sistema automático: content writer procesará los 3 items en cola
  (`agentes-de-ia`, `ia-agentica`, `agentes-ia-sin-codigo`) en los próximos
  runs de launchd (martes, jueves, sábado a las 10:00).
- Cuando DataForSEO vuelva: verificar volúmenes reales de `agentes de ia`
  (estimado 1.000-2.000/mo) — si confirma, es el cluster más importante del
  momento.

---

## 2026-06-25: keyword research completo + 3 posts + refresh

### Contexto

Fran preguntó por el estado general del SEO. El sistema llevaba 5 días sin
correr agentes. La cola estaba vacía y 3 semillas sin investigar.

### Fix previo necesario

El coordinador fallaba con `ERROR: claude CLI not authenticated` porque el
binario `claude` no estaba en el PATH. La causa: `claude` solo existía como
binario nativo de la extensión VSCode en una ruta no estándar. Solución:
`ln -s ~/.vscode/extensions/anthropic.claude-code-*/resources/native-binary/claude ~/.local/bin/claude`.
El coordinador ya incluye `$HOME/.local/bin` en su PATH. Esto también arregla
los runs automáticos de launchd.

### Acciones

**Keyword researcher × 3** (semillas pendientes):
- `monetizar newsletter` → 20 keywords al banco, 1 item en cola:
  `como-monetizar-una-newsletter` (escrito y publicado en el mismo run).
- `claude code` → 20 keywords al banco (4 dedup), 1 item en cola:
  `claude-code-sin-programar` (escrito y publicado en el mismo run).
- `agentes de ia` → 24 keywords al banco (7 dedup), 3 items en cola:
  `agentes-de-ia-para-solopreneurs`, `ia-agentica`, `agentes-ia-sin-codigo`.

**Content writer × 3**:
1. `que-es-un-lead` — 1.450 palabras — https://franlledo.com/blog/que-es-un-lead/ (IndexNow OK)
2. `claude-code-sin-programar` — 2.010 palabras — https://franlledo.com/blog/claude-code-sin-programar/ (IndexNow OK)
3. `como-monetizar-una-newsletter` — 1.800 palabras — https://franlledo.com/blog/como-monetizar-una-newsletter/ (IndexNow OK)

**Refresh recommender** (35 URLs, 5 flagged):

| Prioridad | URL | Estado |
|---|---|---|
| P2 ⚠️ | `/blog/mejor-modelo-de-negocio-online-para-empezar/` | Discovered - not indexed (37d) |
| P2 | `/blog/etiqueta/email-marketing/` | Discovered - not indexed |
| P3 | `/blog/claude-code-sin-programar/` | Unknown (publicado hoy) |
| P3 | `/blog/como-monetizar-una-newsletter/` | Unknown (publicado hoy) |
| P3 | `/blog/que-es-un-lead/` | Unknown (publicado hoy) |

### Decisiones

- El post `claude-code-sin-programar` usa el propio repo seo-franlledo como
  prueba de primera persona. Ángulo deliberado: el SERP en español está lleno
  de guías técnicas para programadores; Fran es el único solopreneur con un
  sistema de agentes funcionando y documentado.
- `como-monetizar-una-newsletter`: título directo con cifra real (100K con
  2.000 suscriptores). La SERP son listicles de SaaS. El diferenciador es la
  prueba verificable de primera mano.
- Todas las semillas de `seed-keywords.txt` agotadas. El keyword-researcher
  automático de launchd volverá a rotar, pero conviene añadir semillas nuevas
  o pedir segunda vuelta de las más antiguas (>30d).

### Pendiente

- Fran debe solicitar indexación en GSC para las 5 URLs flagged, empezando por
  `mejor-modelo-de-negocio-online-para-empezar` (P2, 37 días sin indexar).
- Content writer: 3 items en cola (`agentes-de-ia`, `ia-agentica`,
  `agentes-ia-sin-codigo`).
- Añadir semillas nuevas a `state/seed-keywords.txt`.

## 2026-06-25: keyword-researcher — semilla "agentes de ia"

### Acciones

- Semilla investigada: `agentes de ia` (primera vez; última semilla de la lista de `seed-keywords.txt`).
- DataForSEO no disponible (tercera sesión seguida). Fallback a WebSearch: 6 búsquedas (definicion, negocios pequeños, emprendedores, ia agentica, sin codigo, email marketing).
- Sitemap de franlledo.com verificado: 26 posts publicados, ninguno cubre "agentes de ia" como primary keyword.
- 32 variaciones evaluadas. 7 dropped (duplicados banco: ia para solopreneurs, ia para autonomos, herramientas ia marketing, automatizacion ia negocios, chatgpt para negocios, inteligencia artificial para emprendedores, ia para negocios pequeños). 1 dropped (out-of-scope: mejores agentes ia = comparativa). 24 keywords añadidas al banco.
- 3 items añadidos a cola: `2026-06-25-agentes-de-ia-para-solopreneurs`, `2026-06-25-ia-agentica-que-es-y-como-usarla`, `2026-06-25-agentes-ia-sin-codigo-para-emprendedores`.
- CSV generado: `output/keywords/2026-06-25-agentes-de-ia.csv`.
- `state/keyword-bank.json` actualizado: semilla registrada, 24 entradas nuevas.
- `PROJECT_STATUS.md` y esta bitácora actualizados.

### Decisiones

- Primary keyword del seed: "agentes de ia" (vol est. 1000-2000/mo por densidad SERP). Pilar del cluster. SERP dominado por tech giants (Google Cloud, AWS, IBM) sin perspectiva solopreneur. El diferenciador de Fran: ha construido y usa un sistema real de agentes (seo-franlledo = proof-of-concept tangible).
- "ia agentica" elegido como post separado: aunque conceptualmente solapado con "agentes de ia", sirve un intent distinto (entender el paradigma vs. entender la herramienta). Vol est. 200-400/mo, KD muy bajo, primer-mover advantage en español.
- "agentes ia sin codigo" elegido como tercer post: companion práctico. SERP con guías técnicas sin perspectiva solopreneur. Bundla "crear agente ia sin programar" + "como crear un agente ia".
- "mejores agentes ia" parkeado (P3) por ser comparativa de herramientas (out-of-scope por site-config).
- Con esto se agota la lista `seed-keywords.txt` completa. Próximo ciclo: renovar semillas o empezar segundo ciclo de las seeds más antiguas (embudos de venta, 2026-05-21, >30 días).

### Pendiente

- DFS no disponible: verificar volúmenes reales de "agentes de ia" e "ia agentica" cuando vuelva la herramienta.
- Content writer: 6 items pendientes en cola (que-es-un-lead, como-monetizar-una-newsletter, claude-code-sin-programar + los 3 nuevos de agentes ia).
- Keyword researcher: todas las semillas agotadas. Opciones: (1) segunda vuelta de semillas antiguas (embudos, email marketing), (2) añadir nuevas semillas a seed-keywords.txt.

## 2026-06-25: keyword-researcher — semilla "claude code"

### Acciones

- Semilla investigada: `claude code` (primera vez; semillas `monetizar newsletter` ya investigada hoy mismo por run anterior).
- DataForSEO no disponible (segunda sesión seguida). Fallback a WebSearch: 4 búsquedas paralelas (que es, solopreneurs, vs cursor, sin programar, precio, automatizacion).
- 28 variaciones evaluadas. 4 dropped (duplicados banco). 2 dropped (out-of-scope: comparativa vs cursor, tutorial instalación). 20 keywords añadidas al banco.
- 1 item añadido a cola: `2026-06-25-claude-code-sin-programar`.
- CSV generado: `output/keywords/2026-06-25-claude-code.csv`.
- `state/keyword-bank.json` actualizado: semilla registrada, 20 entradas nuevas.
- `PROJECT_STATUS.md` y esta bitácora actualizados.

### Decisiones

- Primary keyword elegido: "claude code sin programar" (vol est. 150-300/mo, KD est. 15-20). El ángulo genérico "que es claude code" ya está saturado (10+ artículos en 2026). El gap real es el solopreneur no técnico que quiere usarlo para su negocio.
- Ángulo diferenciador clave: Fran usa Claude Code en el repo seo-franlledo (estos mismos agentes de keyword research y content writer). Es la prueba más tangible en español del uso real por un solopreneur.
- "claude code en español" podría ser P1 (análogo a "vibe coding en español" vol 480 KD 18 que fue P1), pero sin DFS se conserva como P2 pendiente de verificación.
- "claude code vs cursor" parkeado como out-of-scope (comparativa de herramientas, prohibido por site-config).
- El post a escribir debería cubrir: qué es Claude Code vs el chat de Claude, ejemplos reales del sistema SEO de Fran, por qué no hace falta saber programar, y precio honesto (Pro $20 incluye Claude Code).

### Pendiente

- DFS no disponible: en el próximo run con DFS activo, verificar volumen de "claude code en español" y "que es claude code" para posible post standalone.
- Content writer: los 3 items de la cola (`que-es-un-lead`, `como-monetizar-una-newsletter`, `claude-code-sin-programar`) están listos.
- Keyword researcher: investigar semilla `agentes de ia` (última restante de la lista).

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
