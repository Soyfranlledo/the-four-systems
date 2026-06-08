#!/usr/bin/env python3
"""Publish a markdown post to an Astro repo, if context/publishing.json is configured.

This is a no-op if context/publishing.json does not exist. Most users skip this
and upload markdown by hand. For users on Astro+Cloudflare it commits the post
to a draft branch (or main, per their config) and pushes.

Contract (post-refactor):
  The content-writer writes the .md with frontmatter that already matches the
  destination Astro content-collection schema (eg `keyword`, not
  `primary_keyword`). Workflow metadata lives in a sidecar <slug>.meta.json
  next to the .md, which this script does NOT copy.

  Before pushing, this script runs `npm run build` in the destination repo as
  a fail-fast guard. If the build rejects the frontmatter (Zod schema mismatch,
  invalid date, unknown tag, etc.) the publish aborts WITHOUT pushing, leaving
  the queue item ready for `mark-queue-item.py --status needs_review`.

  Set publishing.json `prepublish_build: false` to skip the build guard (faster
  but loses the schema check; only use for low-stakes drafts).

Usage:
  publish-to-astro.py <markdown-path>

Returns:
  exit 0 + prints the published URL on success
  exit 0 + prints "SKIPPED" on no-publishing-config
  exit 1 on error (build failed, schema mismatch, git push failed, etc.)
"""

from __future__ import annotations

import json
import re
import subprocess
import sys
import urllib.error
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CONTEXT = ROOT.parent.parent / "context"  # expects user's context/ at project root


def find_context_dir() -> Path | None:
    """Walk up from script dir looking for a sibling context/ directory."""
    for candidate in [
        ROOT.parent / "context",
        ROOT.parent.parent / "context",
        Path.cwd() / "context",
    ]:
        if candidate.is_dir():
            return candidate
    return None


def main() -> int:
    if len(sys.argv) != 2:
        print("Usage: publish-to-astro.py <markdown-path>", file=sys.stderr)
        return 1

    md_path = Path(sys.argv[1]).resolve()
    if not md_path.exists():
        print(f"ERROR: markdown file not found: {md_path}", file=sys.stderr)
        return 1

    ctx = find_context_dir()
    if ctx is None:
        print("SKIPPED (no context/ directory found)")
        return 0
    cfg_path = ctx / "publishing.json"
    if not cfg_path.exists():
        print("SKIPPED (no publishing.json, defaulting to markdown-only)")
        return 0

    cfg = json.loads(cfg_path.read_text())
    if cfg.get("mode") != "astro":
        print(f"SKIPPED (publishing mode is '{cfg.get('mode')}', not astro)")
        return 0

    repo_path = Path(cfg["repo_path"]).expanduser()
    content_dir = repo_path / cfg.get("content_dir", "src/content/blog")
    if not content_dir.is_dir():
        print(f"ERROR: content dir does not exist: {content_dir}", file=sys.stderr)
        return 1

    # CRITICAL: the destination filename IS the public URL slug AND the canonical
    # (Astro's glob loader derives post.id from the filename, and the blog route
    # builds both `params.slug` and `<link rel=canonical>` from post.id).
    #
    # The local artifact in output/posts/ is named "<YYYY-MM-DD>-<slug>.md" so
    # posts sort chronologically in the editor. But that date prefix must NEVER
    # reach the published filename: a date in an evergreen URL signals "stale
    # content", bloats the slug with non-keyword characters, and is irreversible
    # without a 301. So we strip a leading ISO date here, at the publish boundary.
    # This keeps local sorting AND clean public URLs. (Incident 2026-06-08.)
    clean_slug = re.sub(r"^\d{4}-\d{2}-\d{2}-", "", md_path.stem)
    dest_name = f"{clean_slug}.md"

    target = content_dir / dest_name
    target.write_bytes(md_path.read_bytes())
    print(f"Copied: {md_path.name} -> {target} (public slug: {clean_slug})")

    branch_strategy = cfg.get("branch_strategy", "draft")
    branch_prefix = cfg.get("draft_branch_prefix", "claude/post-")
    slug = clean_slug

    def run(cmd: list[str], check: bool = True, cwd: Path | None = None) -> str:
        r = subprocess.run(cmd, cwd=cwd or repo_path, capture_output=True, text=True)
        if check and r.returncode != 0:
            print(f"ERROR ({' '.join(cmd)}): {r.stderr.strip()}", file=sys.stderr)
            sys.exit(1)
        return r.stdout.strip()

    if branch_strategy == "draft":
        branch = f"{branch_prefix}{slug}"
        run(["git", "checkout", "-B", branch])
    else:
        run(["git", "checkout", "main"])

    run(["git", "add", str(target.relative_to(repo_path))])

    # Fail-fast guard: run the destination's build to catch schema mismatches
    # (Zod validation, invalid tags, malformed dates) BEFORE we commit/push.
    # The 404 on 2026-05-29 happened because we skipped this step.
    if cfg.get("prepublish_build", True):
        build_cmd = cfg.get("prepublish_build_cmd", ["npm", "run", "build"])
        print(f"Pre-publish build: {' '.join(build_cmd)} ...")
        result = subprocess.run(build_cmd, cwd=repo_path, capture_output=True, text=True)
        if result.returncode != 0:
            # Revert the staged file before bailing so we don't leave the repo
            # in a half-staged state.
            run(["git", "reset", "HEAD", str(target.relative_to(repo_path))], check=False)
            target.unlink(missing_ok=True)
            print(
                f"PUBLISH_ABORTED: prepublish build failed. The post was NOT "
                f"committed. Mark the queue item as needs_review and review the "
                f"build output:\n{result.stderr.strip() or result.stdout.strip()}",
                file=sys.stderr,
            )
            return 1
        print("Pre-publish build: OK")

    run(["git", "commit", "-m", f"post: {slug}"], check=False)
    run(["git", "push", "-u", "origin", "HEAD"], check=False)

    if branch_strategy == "draft":
        print(f"PUBLISHED_DRAFT branch={branch} (open a PR to ship to main)")
    else:
        site = cfg.get("public_url_base", "").rstrip("/")
        url = f"{site}/blog/{slug}/" if site else f"published to main as {slug}"
        print(f"PUBLISHED_LIVE {url}")

        # IndexNow ping: notifica a Bing, Yandex y demás motores compatibles
        # de la URL nueva sin esperar al crawl natural. ChatGPT Search se
        # alimenta de Bing, así que esto acelera la visibilidad en LLMs.
        # Si el ping falla no abortamos: el deploy ya está hecho, IndexNow es
        # un "best effort" que retrying complica más de lo que aporta.
        indexnow_cfg = cfg.get("indexnow")
        if indexnow_cfg and site:
            key = indexnow_cfg.get("key")
            host = indexnow_cfg.get("host") or site.replace("https://", "").replace("http://", "").rstrip("/")
            key_location = indexnow_cfg.get("key_location") or f"{site}/{key}.txt"
            if key:
                payload = json.dumps({
                    "host": host,
                    "key": key,
                    "keyLocation": key_location,
                    "urlList": [url],
                }).encode("utf-8")
                req = urllib.request.Request(
                    "https://api.indexnow.org/IndexNow",
                    data=payload,
                    headers={"Content-Type": "application/json; charset=utf-8"},
                    method="POST",
                )
                try:
                    with urllib.request.urlopen(req, timeout=10) as resp:
                        code = resp.getcode()
                        print(f"INDEXNOW ok ({code}) for {url}")
                except urllib.error.HTTPError as exc:
                    print(f"INDEXNOW http_error ({exc.code}) for {url}: {exc.reason}", file=sys.stderr)
                except (urllib.error.URLError, OSError) as exc:
                    print(f"INDEXNOW network_error for {url}: {exc}", file=sys.stderr)

    return 0


if __name__ == "__main__":
    sys.exit(main())
