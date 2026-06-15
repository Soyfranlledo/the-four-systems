# AGENTS.md — seo-franlledo (Sistema SEO/GEO de franlledo.com)

Instrucciones únicas para **todos** los agentes IA (Claude, Codex, Gemini,
Cursor, Aider, etc.). `CLAUDE.md` y `GEMINI.md` son symlinks a este archivo:
edita siempre AQUÍ.

Repo de tooling y agentes que generan y mantienen el SEO de **franlledo.com**
(proyecto principal de Fran Lledó). Investigación de keywords, redacción de
posts, auditoría on-site, recomendador de refresh, e informe semanal. Publica al
repo web `~/Documents/Claude/franlledo-web` (Astro SSG → Docker/nginx → Coolify).

El objetivo no es "hacer SEO decente". Es ser **excepcionalmente buenos**: cada
post, cada URL, cada decisión técnica tiene que estar al nivel del mejor SEO en
español del nicho. Fran lo considera su proyecto principal.

---

## Memoria operativa obligatoria

Este repositorio conserva memoria entre sesiones. Ningún agente debe empezar a
trabajar basándose solo en el chat actual.

### Al comenzar una sesión

Leer, en este orden:

1. `AGENTS.md`: reglas e invariantes.
2. `PROJECT_STATUS.md`: fotografía actual, tareas pendientes y próximos hitos.
3. Las últimas entradas de `docs/session-log.md`: decisiones y contexto reciente.
4. `git status` y los últimos commits de este repo y del repo web
   `~/Documents/Claude/franlledo-web`.
5. Los JSON de `state/` que afecten a la tarea. Son la fuente de verdad
   operativa para cola, keywords, auditoría e indexación.

### Al cerrar una sesión con cambios relevantes

1. Actualizar `PROJECT_STATUS.md`: debe describir el estado que queda, no narrar
   todo lo ocurrido.
2. Añadir una entrada fechada a `docs/session-log.md` con decisiones, acciones,
   verificaciones, commits y trabajo pendiente.
3. No duplicar informes automáticos completos: enlazarlos desde la bitácora.
4. No guardar secretos, tokens, credenciales ni datos personales.
5. Validar y hacer commit/push de la documentación junto con el estado final.

### Jerarquía de fuentes

- Reglas permanentes: `AGENTS.md`.
- Estado humano actual y siguiente acción: `PROJECT_STATUS.md`.
- Estado estructurado de los agentes: `state/*.json`.
- Historial de decisiones entre sesiones: `docs/session-log.md`.
- Salidas detalladas de ejecuciones: `reports/` y `output/`.
- Historial técnico definitivo: commits de Git en ambos repositorios.

---

## ⛔ INVARIANTES SEO — nunca violar

Estas reglas son no-negociables. Un fallo aquí degrada el SEO de forma difícil
de revertir (requiere 301, re-indexación y semanas de espera). Antes de publicar
cualquier cosa, verifícalas.

### 1. Las URLs del blog van SIN FECHA. Nunca.

La URL pública de un post es `https://franlledo.com/blog/<slug>/`, donde `<slug>`
son **solo keywords en minúscula separadas por guiones**. Nada de prefijos de
fecha (`2026-06-08-`), números, ni tokens que no sean keyword.

**Por qué importa:** en Astro el nombre del fichero `.md` en `src/content/blog/`
se convierte en `post.id`, que es a la vez la URL **y** el `<link rel=canonical>`.
Una fecha en una URL evergreen le dice a Google "esto caduca", diluye el slug, y
solo se deshace con un 301.

**Cómo está garantizado:** el artefacto local en `output/posts/` SÍ se llama
`<YYYY-MM-DD>-<slug>.md` (para ordenar cronológicamente en el editor), pero
`scripts/publish-to-astro.py` **elimina el prefijo de fecha** al copiar al repo
web. Ese strip es la única línea de defensa: no lo toques sin entenderlo.

> **Incidente 2026-06-08:** 9 posts se publicaron con URLs tipo
> `/blog/2026-05-29-infoproductos-con-ia/`. Se migraron a slug limpio con `git mv`
> + 9 redirects 301 en `docker/nginx.conf` del repo web. Causa raíz: el nombre de
> fichero con fecha llegaba intacto a la URL. Corregido en `publish-to-astro.py`.
> **Esto no puede volver a pasar.**

### 2. Los redirects 301 viven en `docker/nginx.conf` del repo web.

El sitio se sirve con **nginx** (Docker en Coolify), no Apache. El `public/.htaccess`
del repo web está MUERTO — nginx no lo lee. Cualquier 301 va al bloque
`map $uri $r301` de `docker/nginx.conf`. Push a `main` → Coolify reconstruye en
~1-2 min → 301 reales de servidor.

### 3. Enlaces internos: apuntar al destino final, nunca a una URL que redirige.

Si renombras/migras una URL, busca y corrige los enlaces internos que apuntaban a
la vieja (`grep -rn "blog/2026-" src/`). Un enlace interno que pasa por un 301
desperdicia crawl budget y equity.

### 4. Verificar antes de cantar victoria.

Tras cualquier cambio de URLs: `npm run build` en el repo web (valida esquema Zod
y regenera el sitemap), y confirma que NO queda ninguna URL con fecha en
`dist/sitemap*.xml` ni en `dist/llms*.txt`. En producción, comprueba que la URL
vieja da 301 y la nueva 200.

### 5. Los ensayos duplicados en Substack no se indexan en franlledo.com.

Los ensayos individuales de `https://franlledo.com/ensayos/<slug>/` se publican
con el mismo contenido en Substack y en la web. La copia de franlledo.com debe
seguir accesible para lectores, pero lleva `noindex, follow` y queda fuera del
sitemap XML. No usar canonical externo ni añadir enlaces automáticos a Substack.
La portada `/ensayos/` sí puede indexarse porque es una página original de
navegación.

---

## Arquitectura (los cuatro sistemas)

- **keyword-researcher** (`prompts/keyword-researcher.md`): descubre keywords,
  llena `state/keyword-bank.json` y `state/content-queue.json`.
- **content-writer** (`prompts/content-writer.md`): coge el siguiente item
  `queued`, escribe el post en `output/posts/<YYYY-MM-DD>-<slug>.md` + sidecar
  `.meta.json`, lintea, marca la cola, y publica vía `publish-to-astro.py`.
- **onsite-audit** (`prompts/onsite-audit.md`): Lighthouse + on-page, escribe
  `state/onsite-audit.json`.
- **refresh-recommender** (`prompts/refresh-recommender.md`): lee GSC (URL
  Inspection API), puntúa decay e indexación, escribe `state/refresh-candidates.json`.

Orquestación: `coordinator.sh <agente>` (locking, logging, git auto-commit,
breadcrumbs). Informe semanal: `scripts/weekly-seo-report.mjs`.

## Publicación

`context/publishing.json` define el destino (modo `astro`, repo
`~/Documents/Claude/franlledo-web`, push directo a `main`, auto-deploy). Coolify
detecta el push y deploya. Sin validación humana intermedia: Fran prefiere editar
a posteriori. IndexNow se pinga automáticamente al publicar (acelera Bing →
ChatGPT Search).

## Search Console / indexación

GSC vía service account / OAuth. La acción manual recurrente de Fran: abrir GSC,
inspeccionar las URLs que `state/refresh-candidates.json` marca como
`not_indexed` / `index_warning`, y pulsar "Solicitar indexación". El sistema
detecta y prioriza; el clic de "Request Indexing" lo da Fran (o se automatiza si
se configura la Indexing API).
