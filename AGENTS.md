# AGENTS.md

Este repo usa **`CLAUDE.md`** como única fuente de verdad para agentes (Codex,
Claude, Cursor, Aider, etc.). Léelo antes de tocar nada.

## Lo crítico, en una línea

**Las URLs del blog van SIN FECHA.** El slug es solo keywords. La fecha del nombre
de fichero local (`output/posts/<YYYY-MM-DD>-<slug>.md`) NUNCA llega a la URL
pública: `scripts/publish-to-astro.py` la elimina al publicar. Si tocas el flujo
de publicación, preserva ese strip. (Incidente 2026-06-08 — ver `CLAUDE.md`.)

Todo lo demás (invariantes SEO, arquitectura de los 4 sistemas, dónde van los
301, cómo se publica) está en [`CLAUDE.md`](./CLAUDE.md).
