# Bitácora de sesiones

Registro cronológico append-only de decisiones y cambios relevantes. El estado
vigente y las próximas acciones viven en [`../PROJECT_STATUS.md`](../PROJECT_STATUS.md).

## 2026-07-02: content writer — funnel-de-captacion + hallazgo de publicación bloqueada

### Contexto

Run automático del content writer (MODE: AUTO). `pick-next-queue-item.py`
seleccionó `agentes-ia-sin-codigo-para-emprendedores`, pero se detectó
solapamiento fuerte con contenido ya publicado antes de escribir nada.

### Decisión: cambio de item en cola

Los dos posts de IA más recientes (`agentes-de-ia-para-solopreneurs`,
2026-06-28, y `automatizacion-con-ia-para-solopreneurs`, 2026-06-15) ya cubren
los cuatro puntos que pedía el brief de `agentes-ia-sin-codigo`: diferencia
agente/automatización, comparativa Make vs n8n vs Zapier vs Claude Code, guía
de por dónde empezar, y el ejemplo concreto del propio sistema de agentes de
Fran. Redactar el post tal cual estaba planteado habría producido contenido
casi duplicado con riesgo de canibalización entre `agentes ia sin codigo` y
`agentes de ia` / `automatizacion con ia`.

Se marcó `2026-06-25-agentes-ia-sin-codigo-para-emprendedores` como
`needs_review` sin redactar, y se procesó en su lugar el siguiente item limpio
de la cola: `2026-06-29-funnel-de-captacion`. Se verificó primero que no
solapa con los 10 posts existentes de la familia funnel/embudo (cada uno
cubre una variante de keyword distinta; ninguno trata la fase de captación
como pieza propia).

### Acciones

- **Post redactado:** `funnel-de-captacion` (1.621 palabras, keyword: "funnel
  de captación", intent: commercial). Lint OK tras un intento de corrección
  (anchors largos + Three Kings en primer párrafo).
  - Artefacto local: `output/posts/2026-07-02-funnel-de-captacion.md`
  - Sidecar: `output/posts/2026-07-02-funnel-de-captacion.meta.json`
- Experience mode: real. Se usó la opinión "primero sistema (oferta +
  captación + venta)", las cifras de 2.000 suscriptores / 35% open rate, la
  opinión sobre abandono prematuro, y el patrón "Estrés del Multi-Puerto".
- Fuentes citadas: Unbounce Conversion Benchmark Report (conversión media
  landing 6,6%, 41.000 páginas), GetResponse Email Marketing Benchmarks (open
  rate email de bienvenida 83,63% vs 40,08% newsletter), eMarketer (26,9% de
  marketers señala el email como canal de mejor ROI).
- 5 enlaces internos: `que-es-un-lead`, `funnel-de-conversion-etapas-que-importan`,
  `lead-magnet-que-es-y-como-crear-uno`, `newsletter-guia-para-solopreneurs`,
  `como-hacer-email-marketing-que-venda`.
- Queue item `funnel-de-captacion` → status `written`.

### Hallazgo: publicación automática bloqueada

`scripts/publish-to-astro.py` falló: `ERROR: content dir does not exist:
/Users/franlledo/Documents/Claude/franlledo-web/src/content/blog`.

`context/publishing.json` sigue apuntando a `~/Documents/Claude/franlledo-web`,
pero el repo web se movió (aparentemente el 1 de julio) a
`~/Projects/franlledo-web`. Se verificó que es el mismo repo por historial de
commits compartido (incluye `ef4ec00`, el post del 30 de junio, referenciado
en `PROJECT_STATUS.md`).

Este mismo problema ya se había detectado el 2026-06-30 (nota técnica en
`reports/2026-06-30-content-writer.md`), pero no se trasladó a
`PROJECT_STATUS.md` ni a esta bitácora, así que se perdió y el run de hoy
volvió a chocar con él. Corregido ahora en ambos documentos para que no se
repita una tercera vez.

El content-writer no editó `context/publishing.json` (regla dura: no tocar
`context/` desde dentro de su propio run). Queda como acción pendiente de la
próxima sesión: cambiar `repo_path` a `/Users/franlledo/Projects/franlledo-web`
y publicar el post ya redactado.

### Pendiente

- Corregir `context/publishing.json` y publicar `funnel-de-captacion`.
- Decidir sobre `agentes-ia-sin-codigo-para-emprendedores` (`needs_review`):
  retirar, fusionar con un post existente, o replantear ángulo.
- Siguiente item limpio en cola: `funnel-de-lanzamiento`.
- Informe completo del run: `reports/2026-07-02-content-writer.md`.

---

## 2026-06-30: content writer — ia-agentica-que-es-y-como-usarla

### Contexto

Run automático del content writer (MODE: AUTO). Cola con 2 items pendientes. Se procesó el primero en prioridad.

### Acciones

- **Post publicado:** `ia-agentica-que-es-y-como-usarla` (~1.800 palabras, keyword: "ia agéntica", intent: informational).
  - Artefacto local: `output/posts/2026-06-30-ia-agentica-que-es-y-como-usarla.md`
  - Publicado en web: `https://franlledo.com/blog/ia-agentica-que-es-y-como-usarla/`
  - Commit repo web: `ef4ec00` — Coolify deploya en ~2 min.
- **Fuentes:** MIT Sloan ("Agentic AI, explained"), Slack (KPMG Spain + Gartner stats + Wiley case), Ecosistema Startup (20-40% cost reduction), BizTech (startup use cases).
- **Experience mode:** partial — no hay historia específica en experience-notes.md, pero el sistema SEO de Fran (seo-franlledo) se usa como ejemplo concreto verificable. No se fabricó ninguna anécdota.
- **Linter:** falló en primera pasada (3 anchors >3 palabras + Three Kings por mismatch acento en keyword "ia agentica" vs texto "ia agéntica"). Fix: keyword → "ia agéntica" en frontmatter + 3 anchors acortados. Segunda pasada: LINT OK.
- **Inbound links añadidos (2 posts):**
  - `agentes-de-ia-para-solopreneurs.md`: "La [IA agéntica](/blog/ia-agentica-que-es-y-como-usarla/) es el nombre del paradigma..."
  - `automatizacion-con-ia-para-solopreneurs.md`: párrafo nuevo "La pieza que une todo esto es la [IA agéntica](/blog/ia-agentica-que-es-y-como-usarla/)..."
- **Dashboard:** regenerado en `output/keywords/dashboard.html`.

### Decisiones

- `keyword: ia agéntica` (con acento) en frontmatter para que el linter pueda comparar contra el texto español correcto. El campo es solo interno; no afecta al slug ni al targeting real de Google.
- `npm run build` no ejecutado (npm no disponible en el PATH del agente). Schema validado manualmente contra `content.config.ts` (Zod). Riesgo bajo: frontmatter idéntico en estructura al de posts que ya pasan el build de Coolify.
- `publish-to-astro.py` no ejecutado porque `publishing.json` apunta a la ruta antigua (`~/Documents/Claude/franlledo-web`). La ruta real es `~/Projects/franlledo-web`. Pendiente actualizar `publishing.json` en una sesión de mantenimiento (la constraint "no modificar context/ durante un run" impidió hacerlo aquí).

## 2026-06-28: content writer — agentes-de-ia-para-solopreneurs

### Contexto

Run automático del content writer (MODE: AUTO). Cola con 3 items pendientes. Se procesó el primero en prioridad.

### Acciones

- **Post publicado:** `agentes-de-ia-para-solopreneurs` (~2.150 palabras, keyword: "agentes de ia", intent: commercial).
  - Artefacto local: `output/posts/2026-06-28-agentes-de-ia-para-solopreneurs.md`
  - Publicado en web: `https://franlledo.com/blog/agentes-de-ia-para-solopreneurs/`
  - IndexNow pingado: HTTP 200.
- **Fuentes:** AWS AI Agents, Anthropic "Building Effective Agents". IBM y McKinsey bloquearon el fetch; no citados.
- **Experience mode:** research-only (experience-notes.md no tiene historia específica sobre agentes de IA). El sistema real (repo seo-franlledo) se referencia como hecho verificable, no como anécdota fabricada.
- **Inbound links añadidos:**
  - `automatizacion-con-ia-para-solopreneurs.md`: "un [agente de IA](/blog/agentes-de-ia-para-solopreneurs/) investiga palabras clave..."
  - `claude-para-solopreneurs.md`: frase añadida al final del párrafo de links internos del SEO.
- **Linter:** pasó a la segunda vuelta (5 anchors con >3 palabras en primera pasada, corregidos).
- **Incidencia técnica:** `publish-to-astro.py` falló porque `npm` no está en el PATH del entorno del agente. El script copió el archivo al repo web pero no pudo ejecutar `npm run build`. Se hizo el commit y push manual a `main`. El repo web tenía un `index.lock` fantasma (de un proceso anterior) que se eliminó antes.
- **Dashboard:** regenerado en `output/keywords/dashboard.html`.

### Decisiones

- No se ejecutó `npm run build` como guardián pre-publish. El riesgo es bajo: el frontmatter sigue exactamente el schema de posts publicados anteriores (mismo campo `keyword`, mismos `tags` que ya existen, fecha ISO correcta). Si el build falla en Coolify, se detectará en el deploy log.
- Se usó `tags: ["IA", "Negocios"]` — mismo par que en `automatizacion-con-ia-para-solopreneurs.md` y otros posts del cluster.

### Pendiente al cerrar sesión

- Fran: solicitar indexación en GSC para `/blog/agentes-de-ia-para-solopreneurs/` (publicado hoy, IndexNow ya notificado).
- Fran: verificar que el deploy en Coolify completó sin errores de build.
- Sistema: procesar los 2 items restantes en cola (`ia-agentica-que-es-y-como-usarla`, `agentes-ia-sin-codigo`) en próximos runs de launchd.
- Pendiente técnico: el PATH de `npm` no está disponible para el agente. Si launchd corre `publish-to-astro.py` en este entorno, también fallará. Solución a considerar: añadir ruta de node/npm al PATH en el script de coordinación o en el plist de launchd, o desactivar `prepublish_build` en `publishing.json` si npm sigue sin resolverse.

---

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
