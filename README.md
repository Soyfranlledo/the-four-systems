# SEO/GEO de franlledo.com

Sistema autónomo de investigación, publicación, auditoría y seguimiento SEO para
`franlledo.com`. Este repositorio coordina los agentes; el sitio publicado vive
en `~/Documents/Claude/franlledo-web`.

## Empieza aquí

Antes de tocar nada:

1. Lee [`AGENTS.md`](AGENTS.md): invariantes y protocolo de trabajo.
2. Lee [`PROJECT_STATUS.md`](PROJECT_STATUS.md): estado actual y próximos hitos.
3. Revisa las últimas entradas de
   [`docs/session-log.md`](docs/session-log.md): memoria cronológica.

## Sistemas

| Sistema | Función | Estado principal |
| --- | --- | --- |
| `keyword-researcher` | Descubre oportunidades y alimenta la cola | `state/keyword-bank.json`, `state/content-queue.json` |
| `content-writer` | Investiga, redacta, lintea y publica | `output/posts/`, repo web |
| `onsite-audit` | Revisa Lighthouse y SEO on-page | `state/onsite-audit.json` |
| `refresh-recommender` | Comprueba indexación y decay | `state/refresh-candidates.json` |
| Informe semanal | Compara GSC, GA4 y suscripciones | `reports/*-seo-weekly.md` |

Todos se ejecutan mediante:

```bash
./coordinator.sh <keyword-researcher|content-writer|onsite-audit|refresh-recommender>
```

## Publicación

El redactor genera primero un artefacto local:

```text
output/posts/YYYY-MM-DD-slug.md
```

Después `scripts/publish-to-astro.py` elimina la fecha y publica:

```text
https://franlledo.com/blog/slug/
```

El repo web se despliega al hacer push a `main` mediante Coolify. Lee los
invariantes de URL y redirects en `AGENTS.md` antes de cambiar la publicación.

## Automatización

Las tareas reales de Fran están en `launchd/com.franlledo.*.plist`. Para ver qué
agentes están cargados:

```bash
launchctl list | rg 'com\.franlledo\.seo-'
```

Los ficheros `com.example.*` son ejemplos y no describen necesariamente la
programación activa.

## Comprobaciones útiles

```bash
# Validar un artículo
python3 scripts/lint-post.py output/posts/YYYY-MM-DD-slug.md

# Construir y validar el sitio publicado
cd ~/Documents/Claude/franlledo-web
npm run build

# Detectar URLs antiguas con fecha
rg 'blog/2026-[0-9]{2}-[0-9]{2}-' src dist/sitemap*.xml dist/llms*.txt

# Ver el siguiente contenido pendiente
node -e "const q=require('./state/content-queue.json'); console.log(q.items.filter(x=>x.status==='queued'))"
```

## Documentación

- `docs/00-prerequisites.md`: dependencias y credenciales.
- `docs/01-keyword-research.md`: investigación.
- `docs/02-content-writer.md`: redacción y publicación.
- `docs/03-onsite-audit.md`: auditoría.
- `docs/04-refresh-recommender.md`: indexación y refresh.
- `docs/session-log.md`: historial de sesiones y decisiones.

## Seguridad

Los secretos viven en archivos ignorados como `.env.local` y `.mcp.json`.
Nunca deben copiarse a documentación, informes ni commits.
