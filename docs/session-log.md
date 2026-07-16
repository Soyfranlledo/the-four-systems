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

## 2026-07-03 — Auditoría SEO integral + implementación mismo día

Sesión a petición de Fran: entender la marca, auditar el proyecto, implementar
hoy lo que acelere el posicionamiento de las URLs que se van indexando, y
atacar el CTR (<1% en sus últimos análisis). Informe completo:
[`reports/2026-07-03-auditoria-seo.md`](../reports/2026-07-03-auditoria-seo.md).

### Desbloqueo previo

- `context/publishing.json` corregido (`repo_path` → `~/Projects/franlledo-web`)
  y publicado `funnel-de-captacion` (build OK, IndexNow 200, HTTP 200 en
  producción). Item de cola marcado `written`. Commit SEO `d54b53d`.

### Método

- Auditoría multi-agente (24 agentes): marca/ICP desde la web pública, análisis
  GSC 28 días (por página, query, página+query, dispositivo), SERPs reales de
  6 queries prioritarias con DataForSEO, autoridad del dominio, auditoría del
  repo web, verificación en producción de redirects/sitemap/robots/llms, y
  verificación adversarial de cada hallazgo implementable hoy (reproduciendo
  evidencia con curl/Read). Datos frescos de GSC vía OAuth de `.env.local`;
  inspección de URLs vía URL Inspection API (solo lectura).

### Diagnóstico clave

- CTR no-marca real: 0,24% (el 1,1% global lo sostiene la query de marca).
- Somos #1 orgánico en "cómo escribir mejores asuntos de email" (198 impr,
  pos 5,7, 0 clics): title calco de la query, único de la SERP sin número,
  bajo AI Overview + vídeos.
- 9 de 12 titles >60 caracteres (el layout añade " — Fran Lledó"): el gancho
  se truncaba. Cero rich results en el sitio (byAppearance vacío).
- Par roto de indexación: la URL VIEJA `/blog/2026-05-21-marketing-funnel-…/`
  sigue indexada con canonical a sí misma (crawl anterior a los 301):
  canibaliza a la limpia. El AI Overview de "infoproductos con ia" cita la URL
  vieja (consolidada el 28-jun; debería corregirse sola).
- Redirect de barra final degradaba a http y encadenaba 2 saltos (301→307).

### Implementado y verificado en producción (repo web `88c0ebf`)

- seoTitle ≤47 car. con número/prueba en los 12 posts con impresiones +
  6 descriptions reescritas + meta_description propia de la home +
  `updatedDate: 2026-07-03` en los retocados.
- Sitemap con `<lastmod>` (updatedDate ?? pubDate, solo /blog/); nginx
  `absolute_redirect off` + cabeceras de seguridad en location html/xml;
  enlaces internos de navegación con barra final; robots
  `max-image-preview:large`; og:site_name + og:image:width/height;
  favicon.ico + apple-touch-icon (daban 404); enlace interno
  asuntos-de-email → newsletter-ejemplos.
- `public/.htaccess` ELIMINADO (muerto; era la trampa del próximo incidente).
- IndexNow: batch de 19 URLs (pares vieja/nueva) + 14 tras el deploy.

### Prevención de regresión (repo SEO)

- `lint-post.py` Regla 8: título SERP ≤60 (seoTitle ?? title + sufijo 13) y
  description 120-160. `prompts/content-writer.md`: seoTitle obligatorio.
- Artefacto local de funnel-de-captacion sincronizado con su seoTitle.

### Pendiente de Fran (manual, GSC)

Solicitar indexación por este orden: (1) la URL VIEJA de marketing-funnel,
(2) funnel-de-captacion, (3) como-escribir-asuntos-de-email, (4) la limpia de
marketing-funnel, (5) los pendientes de junio. Lista en PROJECT_STATUS.md.

### Verificaciones al cierre

- `npm run build` OK; título nuevo servido en producción; redirect sin barra
  = 1 salto relativo; 32 `<lastmod>` en sitemap vivo; favicons 200; cero URLs
  con fecha en sitemap/llms.
- No tocar los snippets del 3 de julio hasta ~17 de julio (ventana de medición).

## 2026-07-09 — Desatasco del pipeline + aplicación de aprendizajes SEO (Villanueva)

Sesión a petición de Fran: "no se publica nada desde el 2 de julio, no sé qué
pasa a nivel SEO, y no capto suscriptores nuevos por la web". Además pidió
destilar una entrevista de YouTube a un SEO y aplicar sus consejos.

### Diagnóstico: por qué no se publicaba desde el 2 de julio

El content-writer programado SÍ se disparaba puntual (sáb 4, mar 7, jue 9 a las
10:00) pero cada run era un `no-op` de 11-37s. Los informes lo delataban: el
agente leía el contexto de sesión y luego **preguntaba "¿qué quieres hacer?"** en
vez de escribir el post en cola. El 2 jul aún funcionó en modo autónomo (escribió
funnel-de-captacion en 88 min). Regresión de comportamiento, no de datos:
`pick-next-queue-item.py` devolvía correctamente `funnel-de-lanzamiento` con
exit 0. Causa raíz: el marco "de sesión colaborativa con humano" que impone
`CLAUDE.md`/`AGENTS.md` pisaba el `MODE: AUTO` que inyecta el coordinador. El
keyword-researcher hacía lo mismo (además ni recibía cabecera AUTO).

### Acciones

1. **`coordinator.sh` blindado:** la inyección de cabecera para runs programados
   pasa de un simple `MODE: AUTO` a un preámbulo no-interactivo contundente
   ("run no interactivo, no hay humano, no preguntes, ejecuta de principio a
   fin"), aplicado a **content-writer y keyword-researcher**. Mantiene el token
   `MODE: AUTO` que el prompt del content-writer detecta. `bash -n` OK.
2. **Cola resembrada:** 6 semillas nuevas en `state/seed-keywords.txt` que abren
   clústers no cubiertos (copywriting para vender, pagina de ventas que
   convierte, vender cursos online, prompts para negocio, monetizar con ia,
   automatizar ventas).
3. **Publicado `funnel-de-lanzamiento`** (subagente siguiendo el prompt en Modo
   B): `/blog/funnel-de-lanzamiento/`, 2.276 palabras, seoTitle
   "Funnel de lanzamiento: 4 fases, 10.000 €" (40 car.), lint OK, build OK,
   PUBLISHED_LIVE + IndexNow 200, HTTP 200 en producción, cero URLs con fecha en
   sitemap. Cifra 10-12k€ verificada contra `experience-notes.md` (líneas 6-7,
   es real). Diferenciado de funnel-de-captacion y campanas-email-marketing.
   3 enlaces internos entrantes tejidos. Commit web: `post:` + `seo: enlaces
   internos hacia funnel-de-lanzamiento`. Commit SEO: `42f024f`.

### Entrevista a Luis Villanueva (Webpositer) — aplicación

Destilada la transcripción completa (Ep. #141 de Píldoras del Conocimiento,
1h27). Fran pidió aplicar **solo los consejos SEO, no los de negocio**. Aplicados
al `prompts/content-writer.md` (Paso 3 Outline + checklist Paso 5):

- **Cobertura de microtemática/subpreguntas del clúster** (la IA descompone la
  query en 5-7 subpreguntas antes de citar a 2-3; cubrirlas todas = aparecer
  como candidato repetido).
- **Dato propio y citable en cada post** (≥1 cifra/resultado real de
  `experience-notes.md`, presentado como afirmación autónoma extraíble, que
  fuerce la cita por IAs generativas; nunca inventado).

Validado (ya lo hacíamos): medir SEO no-marca vs marca, formato cápsula
pregunta/respuesta, priorizar keywords comerciales conectadas al comprador, no
inventar cifras. Descartado por decisión de Fran (consejos de negocio):
ultraespecialización del posicionamiento, plan de email (checkout vs carrito,
compradores vs no compradores), diferenciar la captación web (quiz), repurposing
a vídeo/redes.

### MailerLite / captación

El formulario de la web está vivo y bien cableado (cuenta 1064872, form
184373354165175805). El motivo de "no llegan suscriptores de la web" es de
embudo, no de formulario: con ~15 sesiones orgánicas/semana la conversión es
≈0-1/semana. El cuello de botella es tráfico (rankings en página 2), no la
captación. Sin cambios en la web esta sesión (era consejo de negocio).

### Pendiente

- **Fran (manual, GSC):** solicitar indexación según la lista priorizada
  (sigue pendiente desde el 3 de julio; P1 = URL vieja de marketing-funnel).
- Confirmar en `agent-log.json` que el próximo keyword-researcher (lunes) y
  content-writer (sábado) vuelven a `committed`, no `no-op`.
- Keyword-researcher: procesar las 6 semillas nuevas para reponer la cola.
- Medir el fix de CTR del 3 de julio a partir del ~17 de julio.

## 2026-07-11 — Content-writer (sábado, MODE: AUTO): no-op confirmado, cola vacía

Run programado (sábado 10:00). `pick-next-queue-item.py` → `NO_QUEUED_ITEMS`
(exit 2). De los 23 items de `state/content-queue.json`, 22 están `written` y
1 (`agentes-ia-sin-codigo-para-emprendedores`) sigue en `needs_review` desde el
2 de julio, pendiente de una decisión que no le corresponde tomar al
content-writer en auto-pilot. No había ningún item `queued`.

**Confirma el fix de autonomía del 2026-07-09:** este era el "próximo
content-writer (sábado)" que quedó pendiente de verificar. El run ejecutó el
workflow completo sin preguntar nada y terminó en un no-op con motivo
explícito, no en el bug anterior (preguntar "¿qué quieres hacer?"). Lado
keyword-researcher aún pendiente: su última ejecución registrada es del
2026-07-08, anterior a las 6 semillas sembradas el 09; el próximo run real es
el lunes 2026-07-13 09:00.

Sin cambios en `output/`, `state/content-queue.json` ni el repo web.

## 2026-07-13: keyword-researcher (lunes, MODE: AUTO) — semilla "copywriting para vender", cola repuesta

Run programado (lunes 09:00). Confirma el lado keyword-researcher del fix de
autonomía del 2026-07-09: ejecutó el workflow completo sin preguntar nada,
pendiente #6 de `PROJECT_STATUS.md` queda cerrado.

### Selección de semilla

Ninguna de las 6 semillas nuevas sembradas el 09 (`copywriting para vender`,
`pagina de ventas que convierte`, `vender cursos online`, `prompts para
negocio`, `monetizar con ia`, `automatizar ventas`) tenía entrada en
`seeds_researched`. Por la regla "primera línea sin cubrir" se eligió
`copywriting para vender`, la primera de las nuevas en `seed-keywords.txt`.

### Fan-out y hallazgo de calidad de datos

`dataforseo_labs_google_keyword_ideas` con la frase completa como seed devolvió
mayoritariamente ruido no relacionado (vender coche, moto, chalet, catalizador):
el algoritmo de "misma categoría" agrupó "copywriting para vender" con anuncios
genéricos de venta de objetos de segunda mano. Se pivotó a
`dataforseo_labs_google_keyword_suggestions` con la semilla corta "copywriting"
(100 resultados) más la frase completa (7 resultados), que sí dio señal útil.
158 variaciones evaluadas en total; ~137 descartadas por ruido de categoría,
intención de empleo/freelance ("copywriting jobs", "trabajar de copywriting")
o detección de idioma inglés/portugués en el mercado España.

### Cluster "qué es el copywriting" y decisión anti-canibalización

5 variantes casi idénticas del mismo cluster definicional ("copywriting que
es" 720/kd2, "que es un copywriting" 390/kd2, "que es el copywriting" 260/kd3,
"que es copywriting" 210, "copywriting" desnudo 4400/kd7) más "qué es el
copywriting" (260/kd15, elegida como grafía natural). Mecánicamente varias
superan el umbral P1, pero se marcó solo una (`qué es el copywriting`) como
priority 1 y las demás priority 2 para no generar 5 items de cola casi
duplicados sobre el mismo post — coherente con la práctica de comprobar
canibalización antes de encolar. Verificado contra el sitemap en vivo
(`franlledo.com/sitemap-0.xml`): no existe ninguna URL de "copywriting"
todavía. El post más cercano, `como-escribir-emails-que-vendan`, se confirmó
(vía WebFetch) que es táctico y específico de email, sin frameworks AIDA/PAS/
BAB: sin solapamiento con el nuevo post, que cubre el concepto general +
ejemplos multi-formato.

Descartadas a priority 3 por encaje débil con la estrategia del sitio (nunca
enlaza a producto directo, sin reviews comparativas): "servicios/servicio de
copywriting" y "cursos/curso de copywriting" (intención de contratar/comparar
terceros), "agencia de copywriting" (kd 46), "el libro de copywriting" (nicho,
bajo volumen).

### Resultado

- 21 keywords nuevas añadidas a `state/keyword-bank.json` (0 duplicados).
- 1 item encolado en `state/content-queue.json`:
  `2026-07-13-que-es-el-copywriting` (informational, vol 260, kd 15), con
  fan_out_cluster de 7 variantes (incluye "copywriting para vender cursos",
  que cruza con la semilla nueva "vender cursos online" aún sin investigar:
  nota dejada en el item para no duplicar cuando se procese esa semilla).
  Angulo GEO obligatorio: apoyar el post en los 1.500+ correos de venta reales
  de `experience-notes.md`, no en teoría de manual.
- CSV en `output/keywords/2026-07-13-copywriting-para-vender.csv` (gitignored,
  como el resto de `output/`).
- `seeds_researched` actualizado con `copywriting para vender` → 2026-07-13.

### Pendiente

- Quedan 5 semillas nuevas del lote del 09 sin investigar: `pagina de ventas
  que convierte`, `vender cursos online`, `prompts para negocio`, `monetizar
  con ia`, `automatizar ventas`. El próximo run (miércoles 2026-07-15)
  procesará la siguiente por orden de `seed-keywords.txt`.
- El content-writer (próximo run: martes 2026-07-14) ya tiene un item
  `queued` disponible tras varios runs en `no-op` por cola vacía.

## 2026-07-15: keyword-researcher (miércoles, MODE: AUTO) — semilla "pagina de ventas que convierte", hallazgo "landing page"

Run programado (miércoles 09:00), ejecutado end-to-end sin preguntar
(confirma de nuevo el fix de autonomía del 2026-07-09).

### Selección de semilla

Primera sin cubrir en `seed-keywords.txt` tras `copywriting para vender`
(13/07): `pagina de ventas que convierte`. No estaba en `seeds_researched`.

### Fan-out y problema de calidad de dato (repetido del 13/07)

`dataforseo_labs_google_keyword_ideas` con la frase completa como seed volvió
a fallar: agrupó la keyword con "pagina web" genérico (crear web, traducir
web, precio de una web), 0 resultados relevantes salvo "pagina de ventas"
(70/mo) y "pagina de ventas gratis" (10/mo). `dataforseo_labs_google_keyword_suggestions`
sobre "pagina de ventas" tampoco sirvió: en es-ES esa frase se mezcla
mayoritariamente con marketplaces de segunda mano (coches, motos, casas,
ropa), no con el sentido de "landing page de un embudo" que interesa a Fran.
`dataforseo_labs_google_related_keywords` sobre la frase completa de 4
palabras devolvió `items: []` (sin datos).

Se pivotó a `dataforseo_labs_google_keyword_overview` con una lista curada de
35 variantes candidatas (bypassa el algoritmo de "misma categoría" que causa
el ruido) y a `related_keywords`/`keyword_suggestions` sobre "landing page"
directamente. Esto reveló el hallazgo real del run: en es-ES la demanda de
este tema vive casi enteramente bajo el préstamo inglés "landing page"
(6.600/mo la cabecera desnuda, kd 6) y no bajo "página de ventas" (70/mo).
344 variaciones únicas evaluadas en total entre todas las llamadas.

### Cluster "qué es una landing page" y decisión anti-canibalización

Igual que el 13/07 con "copywriting": 6 variantes casi idénticas del cluster
definicional comparten volumen alto ("qué es una landing page" 1000/kd6,
"qué es el landing page" 1000/kd6, "qué es la landing page" 1000/kd6,
"landing page que es" 720/kd7, "qué significa landing page" 720/kd8, "qué es
un landing page" 260/kd6). Se marcó solo "qué es una landing page" (grafía
más natural) como priority 1 y encoló un único post; las demás quedan en
priority 2 como material de `fan_out_cluster`, no como items de cola
separados. Verificado contra el sitemap en vivo (`franlledo.com/sitemap-0.xml`):
cero URLs con "landing" o "pagina-de-ventas" en producción, sin riesgo de
canibalización con los posts de funnel existentes
(`funnel-de-captacion`, `funnel-de-conversion-etapas-que-importan`,
`sales-funnel-para-solopreneurs`, `como-montar-embudo-de-ventas-sencillo`).

Se marcó "cómo hacer una landing page" (110/mo, kd4) priority 2, no P1, por
riesgo de derivar en tutorial de constructor/herramienta (fuera de alcance
explícito en `site-config.md`). Va como sección de estructura dentro del post
definicional, no como pieza independiente. "Landing page" desnudo (6.600/mo,
kd6) se aparcó en priority 3: cabecera dominada por HubSpot/Unbounce/Semrush/
Landingi, autoridad inalcanzable a corto plazo, superada conceptualmente por
la cola larga.

Corrección silenciosa de un dato de junio: el banco ya tenía "página de
ventas" (con tilde, priority 3, añadido el 29/06 vía WebSearch fallback con
`kd: null` y una nota "KD est. 50+"). El dato real de DFS de hoy para la
variante sin tilde es kd 4. No se añadió como entrada nueva (casi duplicado,
solo difiere en la tilde) para no generar bloat; se deja constancia aquí en
vez de perder la corrección silenciosamente.

### Resultado

- 18 keywords nuevas añadidas a `state/keyword-bank.json` (0 duplicados
  exactos; 258 en banco).
- 1 item encolado en `state/content-queue.json`:
  `2026-07-15-que-es-una-landing-page` (informational, vol 1000, kd 6), con
  fan_out_cluster de 8 variantes. Ángulo GEO obligatorio: diferenciar landing
  page de página de ventas dentro de un embudo real (no explicación genérica
  de manual/herramienta), apoyado en funnel-de-captacion y
  funnel-de-lanzamiento con datos propios de `experience-notes.md`.
- CSV en `output/keywords/2026-07-15-pagina-de-ventas-que-convierte.csv`
  (gitignored).
- `seeds_researched` actualizado con `pagina de ventas que convierte` →
  2026-07-15.

### Observación fuera de alcance de este agente

`2026-07-13-que-es-el-copywriting` sigue en estado `queued`: no hay ningún
commit de content-writer del martes 14 de julio en el historial de git (el
job estaba programado para las 10:00). No investigado a fondo porque excede
el alcance del keyword-researcher (no debe invocar otros agentes ni tocar
`prompts/`/`coordinator.sh`). Queda anotado en `PROJECT_STATUS.md` para que
se revise en el próximo run de content-writer o por Fran directamente.

### Pendiente

- Quedan 4 semillas nuevas del lote del 09 sin investigar: `vender cursos
  online`, `prompts para negocio`, `monetizar con ia`, `automatizar ventas`.
  El próximo run de keyword-researcher procesará `vender cursos online`.
- Revisar por qué el content-writer no corrió el 14/07 y confirmar que la
  cola (2 items `queued`) se procesa en el próximo run disponible.

## 2026-07-16: content-writer (jueves, MODE: AUTO) — publicado "qué es el copywriting"

Run programado (jueves 10:00), ejecutado end-to-end sin preguntar nada
(confirma otra vez el fix de autonomía del 2026-07-09).

### Selección del item

`pick-next-queue-item.py` devolvió `2026-07-13-que-es-el-copywriting`, el
primero en FIFO y el mismo que quedó anotado como pendiente en
`PROJECT_STATUS.md` desde el 15/07 (el run programado del martes 14/07 nunca
se disparó: no hay commit ni entrada de log de ese día). Marcado
`in_progress` de inmediato.

### Brief y contexto

Keyword primaria "qué es el copywriting" (informational, vol 260, kd 15),
fan_out_cluster de 7 variantes. Leídos los 8 ficheros de `context/` completos
antes de escribir. Nota del propio queue item (dejada por el
keyword-researcher el 13/07): diferenciar explícitamente de
`como-escribir-emails-que-vendan` (táctico, sin frameworks) y apoyar el post
en el dato propio de 1.500+ correos de venta / 300+ clientes de
`experience-notes.md`.

### Investigación

9 fuentes aceptadas, ninguna de dominios de `competitors.md` (se descartaron
deliberadamente resultados de SERP de educadores de copywriting en español
con solapamiento de audiencia, p. ej. Maïder Tomasena e Ivo Fiz, aunque no
estén en la lista formal de competidores directos, por prudencia): Wikipedia
ES, HubSpot ES, Domestika, AulaCM y Webpositer (los dos últimos eran los
`external_authority_candidates` que dejó el keyword-researcher) para las
fórmulas AIDA/PAS/BAB, Copyblogger y Swipe File Archive para la cita y el
anuncio de Rolls-Royce de David Ogilvy, WordStream para el benchmark de tasa
de conversión de landing pages, e InboundCycle para los principios de
Cialdini. Consultado `serp_organic_live_advanced` para la keyword primaria:
sin sorpresas, dominan definiciones genéricas (Wikipedia, HubSpot, Payoneer,
Salesforce) sin ángulo de experiencia propia, hueco que confirma la
diferenciación planeada.

### Draft y ángulo GEO

Post de 2.039 palabras (objetivo 1.800, +13,3%, dentro del ±15%). Estructura
de 9 H2 (66,7% cápsulas) con 3 H3 anidados para AIDA/PAS/BAB. Cubiertas las 7
variantes del `fan_out_cluster` (ninguna dropeada). Dato propio citable:
"1.500+ correos de venta enviados" en el TL;DR y la intro. Dos historias
reales de `experience-notes.md` reutilizadas donde encajaban de forma
natural sin fabricar nada nuevo: "el descubrimiento de la promesa" (por qué
el copywriting no es escribir bonito) y "el lanzamiento desastre por
escuchar al público" (el error más caro: escribir a partir de lo que el
público dice que quiere, no de lo que compra). Un uso del término de marca
"Datafonazo", contextualizado sin definirlo defensivamente, fuera del primer
párrafo.

### Lint, publicación y enlazado

`lint-post.py` → `LINT OK` a la primera pasada (sin necesidad del intento de
arreglo). Revisión manual adicional de la lista negra de frases prohibidas
(el parser de `lint-post.py` no cubre el formato numerado de esa lista
concreta) y de nombres de competidores: sin coincidencias. Publicado con
`publish-to-astro.py`: build previo OK, `PUBLISHED_LIVE` en
`/blog/que-es-el-copywriting/`, IndexNow 200. La URL en producción tardó
~5 minutos en devolver 200 (dos comprobaciones a 404 antes de confirmar),
más que los ~1-2 minutos habituales de Coolify; sin acción tomada, solo
anotado por si se repite.

Enlazado entrante (paso 6, solo posible porque `PUBLISHED_LIVE`): añadido un
enlace contextual a `/blog/que-es-el-copywriting/` en cada uno de
`como-escribir-emails-que-vendan`, `lead-magnet-que-es-y-como-crear-uno` y
`funnel-de-conversion-etapas-que-importan` (ninguno lo enlazaba todavía),
siempre fuera del primer párrafo y de encabezados, máximo un enlace por
párrafo. `npm run build` OK en el repo web tras los tres cambios. Commit
`seo: enlaces internos hacia que-es-el-copywriting` y push a `main`.

### Resultado

- `state/content-queue.json`: item `2026-07-13-que-es-el-copywriting` →
  `written`, con `published_url` a la URL en vivo.
- Dashboard regenerado (`scripts/render-html-report.py`).
- Cola: queda 1 item `queued` (`2026-07-15-que-es-una-landing-page`) para el
  próximo run.

### Pendiente

- Investigar la causa del run que no se disparó el 14/07 (cron/launchd) si
  vuelve a fallar un martes o sábado; ver nota en `PROJECT_STATUS.md`.
- Próximo content-writer (sábado): procesará `que-es-una-landing-page`.
- Medir el fix de CTR del 3 de julio (ventana ya cumplida desde el 17 de
  julio, pendiente de leer el próximo informe semanal).

## 2026-07-16 (tarde): implementación de la auditoría SEO del 2026-07-15 (sesión con Fran)

Fran pidió analizar la auditoría de `reports/2026-07-15-auditoria-seo/`
(generada el 15/07 con una skill externa de auditoría) y corregir lo accionable.
Se ejecutó el plan de acción completo de prioridad ALTA + la mayor parte de la
MEDIA en una sesión. Commit del repo web: `ec49ae3`.

### Análisis previo (discrepancias con la auditoría)

- **Imágenes (55/100): finding inflado.** Los "82 de 84 sin alt" son en su
  mayoría `alt=""` explícito en imágenes decorativas (avatares de lectores,
  chrome), que es correcto. Lo único real: el avatar/logo del header y de las
  landings sin alt descriptivo. Corregido con 2 ediciones.
- **JSON-LD: `/consultoria/` ya tenía schema `Service`** en producción (la
  auditoría la listaba entre las 14 páginas sin JSON-LD). El resto de la lista
  sí era correcto.
- **Congelación de snippets hasta ~17/07 respetada:** no se tocó ninguna
  description ni title de los 12 posts retocados el 03/07. Los 20 posts del
  lote de hoy no tenían seoTitle previo (no forman parte de la medición).
- **CSP/Permissions-Policy diferidas:** una CSP mal calibrada rompe GA4 e
  inline scripts; se hará en una sesión con pruebas. Solo se añadió HSTS.

### Cambios desplegados (repo web, push a main → Coolify)

1. **seoTitle ≤47c con dato real del post en los 20 posts pendientes**
   (acción ALTA #1 y también hito 3 de PROJECT_STATUS). Redactados leyendo
   cada post (4 subagentes en paralelo propusieron, se seleccionó
   editorialmente). Todos con número/dato propio y keyword delante.
   `updatedDate: 2026-07-16` en los 20. Resultado verificado en `dist/`:
   **0 posts con título SERP >60c** (antes 27 páginas >60c en el sitio).
2. **Descriptions >160c recortadas** (sin tocar la congelación):
   agentes-de-ia (168→147), claude-code (194→134), marketing-automation
   (227→140), que-es-un-lead (168→127), que-herramienta (162→132),
   /consultoria/ (181→142), /documento/ (166→153),
   /asuntos-que-se-abren/ (165→142). Recorte puro, sin cambiar la voz.
3. **HSTS** en `docker/nginx.conf`, en el bloque server Y en los 3 location
   que redeclaran cabeceras (add_header dentro de location anula los
   heredados). Sin `preload` a propósito.
4. **alt="Fran Lledó"** en el avatar del Header y del LandingLayout.
5. **JSON-LD nuevo** vía `src/lib/jsonld.ts` (Person compacto con el mismo
   `@id` que la home para consolidar entidad + helper de breadcrumbs):
   BreadcrumbList+Person en las 7 landings de lead magnet (`[slug].astro`),
   CollectionPage+ItemList+Breadcrumb en /proyectos/, Breadcrumb+Person en
   /contacto/ y /enlaces/. Legales excluidas a propósito.
6. **Title de /consultoria/ de 73c → 49c** ("ConsultorIA — Te monto el plan
   de IA — Fran Lledó"), conservando la promesa. Quedan 6 páginas en 61-64c
   (home, /blog/, 4 landings): se dejan así a propósito — el exceso solo
   trunca el sufijo de marca y recortarlas implicaría tocar copy de Fran.

### Verificación

- `npm run build` OK; sitemap con 58 URLs, **0 con fecha**; llms.txt y
  llms-full.txt sin URLs con fecha (invariante 1 y 4 OK).
- JSON-LD validado (parse JSON) en documento, proyectos, contacto, enlaces,
  asuntos-que-se-abren; /consultoria/ mantiene su Service.
- IndexNow ping con las **31 URLs cambiadas** → HTTP 200.
- Verificación en producción tras el deploy: HSTS presente, títulos nuevos
  servidos (ver final de la entrada).

### Pendiente que deja esta sesión

- Acciones BAJAS de la auditoría: CrUX de campo, dato propio citable en posts
  antiguos (refresh), lastmod en estáticas, menciones de marca.
- OG images propias para los 22 posts con og-default (hito 2, sin cambios).
- CSP + Permissions-Policy con pruebas.
- Fran (manual): solicitar indexación GSC de la tabla P1/P2 y medir CTR de
  los snippets del 03/07 a partir del ~17/07. **Ojo:** los 20 posts de hoy
  empiezan su propia ventana de medición hoy (16/07).
