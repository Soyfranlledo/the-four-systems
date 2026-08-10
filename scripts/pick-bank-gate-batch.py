#!/usr/bin/env python3
"""Bank gatekeeper, layer 1: pick which backlog keywords deserve a SERP check.

El gate de autoridad (Step 5b del keyword-researcher) solo corre sobre los P1
del run en curso. Resultado medido el 2026-08-06: 273 keywords en el banco y
`serp_checked` en 0. Todo el backlog sigue puntuado solo por KD, que es
justo la metrica que el analisis del 28/07 demostro insuficiente
("marketing funnel" figura con KD 4 y es un muro de mediana top-5 ~615).

Esta capa NO llama a ninguna API. Selecciona, deduplica y ordena el lote de
keywords que merece la pena medir, y lo deja en state/bank-gate-batch.json
para que la capa 2 (prompt bank-gatekeeper.md) gaste las llamadas de
DataForSEO solo donde importa.

Criterios de seleccion (todos deben cumplirse):
  - volumen >= --min-volume (por defecto 100/mes): el gate mide si se puede
    ganar, no si vale la pena ganarlo. El suelo de volumen es lo que evita
    repetir el caso "asuntos de email": ganable y con 10 busquedas/mes.
  - serp_checked falso o ausente: no re-medir lo ya medido.
  - covered_by nulo: si ya hay un post apuntando ahi, no es backlog.
  - primary_keyword no presente en content-queue.json (ni queued ni written).
  - priority en --priorities (por defecto 1 y 2; los P3 estan aparcados a
    proposito, normalmente por encaje tematico).

Deduplicacion por SERP: "que es una landing page", "que es el landing page" y
"landing page que es" son la misma pagina de resultados. Se agrupan por firma
(sin acentos, sin stopwords, tokens ordenados) y solo sobrevive la de mas
volumen del grupo. Las demas quedan listadas como `aliases` y heredaran el
veredicto sin gastar una llamada extra.

Usage:
  python3 scripts/pick-bank-gate-batch.py
  python3 scripts/pick-bank-gate-batch.py --min-volume 250 --limit 20
  python3 scripts/pick-bank-gate-batch.py --priorities 1,2,3 --json
"""

from __future__ import annotations

import argparse
import json
import sys
import unicodedata
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
BANK = REPO / "state" / "keyword-bank.json"
QUEUE = REPO / "state" / "content-queue.json"
OUT = REPO / "state" / "bank-gate-batch.json"

# Palabras que no cambian la SERP: la intencion y el resultado son los mismos.
STOPWORDS = {
    "que", "es", "el", "la", "los", "las", "un", "una", "unos", "unas",
    "de", "del", "para", "por", "en", "y", "o", "a", "al", "con", "como",
    "cual", "cuales", "significa", "son",
}


def strip_accents(s: str) -> str:
    return "".join(
        c for c in unicodedata.normalize("NFD", s) if unicodedata.category(c) != "Mn"
    )


def serp_signature(keyword: str) -> str:
    """Firma de SERP: dos keywords con la misma firma comparten resultados."""
    norm = strip_accents(keyword.lower().strip())
    tokens = [t for t in norm.replace("-", " ").split() if t and t not in STOPWORDS]
    return " ".join(sorted(tokens)) or norm


def load_json(path: Path):
    if not path.exists():
        sys.exit(f"ERROR: no existe {path}")
    with path.open(encoding="utf8") as fh:
        return json.load(fh)


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--min-volume", type=int, default=100,
                    help="suelo de volumen mensual (por defecto 100)")
    ap.add_argument("--limit", type=int, default=0,
                    help="maximo de SERPs a medir; 0 = sin limite")
    ap.add_argument("--priorities", default="1,2",
                    help="prioridades a incluir, separadas por coma")
    ap.add_argument("--json", action="store_true",
                    help="volcar el lote por stdout ademas de escribirlo")
    args = ap.parse_args()

    prios = {int(p) for p in args.priorities.split(",") if p.strip()}

    bank = load_json(BANK)
    queue = load_json(QUEUE)

    queued_kw = {
        (i.get("primary_keyword") or "").lower().strip()
        for i in queue.get("items", [])
    }
    queued_kw.discard("")

    stats = {"total": 0, "sin_volumen": 0, "ya_medida": 0, "cubierta": 0,
             "en_cola": 0, "prioridad": 0, "candidatas": 0}

    # Higiene del banco: `covered_by` debe apuntar a una pagina publica, ya sea
    # URL absoluta (https://franlledo.com/blog/<slug>/) o ruta del sitio
    # (/blog/<slug>/). Ambas conviven en el banco y las dos son validas.
    # Lo que NO vale es una ruta al artefacto local (./output/posts/<fecha>-<slug>.md,
    # aparecido el 2026-08-10): no es una URL, no resuelve, y arrastra el
    # prefijo de fecha del incidente de junio que la invariante 1 prohibe.
    # Un covered_by asi esconde backlog: la keyword cuenta como cubierta pero
    # ninguna comprobacion por URL la reconoce. Se reporta, no se corrige aqui.
    def coverage_ok(value: str) -> bool:
        v = str(value).strip()
        return v.startswith("http") or v.startswith("/blog/")

    malformed = []

    candidates = []
    for k in bank.get("keywords", []):
        stats["total"] += 1
        kw = (k.get("keyword") or "").strip()
        if not kw:
            continue
        cov = k.get("covered_by")
        if cov and not coverage_ok(cov):
            malformed.append({"keyword": kw, "covered_by": cov,
                              "volume": k.get("volume")})
        vol = k.get("volume") or 0
        if vol < args.min_volume:
            stats["sin_volumen"] += 1
            continue
        if k.get("serp_checked"):
            stats["ya_medida"] += 1
            continue
        if cov:
            stats["cubierta"] += 1
            continue
        if kw.lower() in queued_kw:
            stats["en_cola"] += 1
            continue
        if k.get("priority") not in prios:
            stats["prioridad"] += 1
            continue
        stats["candidatas"] += 1
        candidates.append(k)

    # Agrupar por SERP y quedarse con la de mas volumen de cada grupo.
    groups: dict[str, list] = {}
    for k in candidates:
        groups.setdefault(serp_signature(k["keyword"]), []).append(k)

    batch = []
    for sig, members in groups.items():
        members.sort(key=lambda m: -(m.get("volume") or 0))
        head, rest = members[0], members[1:]
        batch.append({
            "keyword": head["keyword"],
            "volume": head.get("volume"),
            "kd": head.get("kd"),
            "intent": head.get("intent"),
            "priority": head.get("priority"),
            "seed": head.get("seed"),
            "serp_signature": sig,
            "aliases": [
                {"keyword": m["keyword"], "volume": m.get("volume")} for m in rest
            ],
        })

    batch.sort(key=lambda b: -(b.get("volume") or 0))
    truncated = 0
    if args.limit and len(batch) > args.limit:
        truncated = len(batch) - args.limit
        batch = batch[: args.limit]

    payload = {
        "generated_for": "bank-gatekeeper",
        "source_bank": str(BANK.relative_to(REPO)),
        "criteria": {
            "min_volume": args.min_volume,
            "priorities": sorted(prios),
            "limit": args.limit or None,
        },
        "stats": stats,
        "serps_to_measure": len(batch),
        "aliases_covered": sum(len(b["aliases"]) for b in batch),
        "truncated_by_limit": truncated,
        "malformed_covered_by": malformed,
        "batch": batch,
    }

    OUT.write_text(json.dumps(payload, indent=2, ensure_ascii=False), encoding="utf8")

    print(f"Banco: {stats['total']} keywords")
    print(f"  descartadas por volumen < {args.min_volume}: {stats['sin_volumen']}")
    print(f"  ya medidas (serp_checked):                  {stats['ya_medida']}")
    print(f"  ya cubiertas por un post:                   {stats['cubierta']}")
    print(f"  ya en la cola de contenido:                 {stats['en_cola']}")
    print(f"  fuera de las prioridades {sorted(prios)}:          {stats['prioridad']}")
    print(f"  candidatas:                                 {stats['candidatas']}")
    print()
    print(f"SERPs a medir tras deduplicar: {len(batch)}"
          f"  (+{payload['aliases_covered']} keywords heredan veredicto)")
    if truncated:
        print(f"AVISO: {truncated} SERPs quedan fuera por --limit {args.limit}. "
              f"Se procesaran en el siguiente run.")
    print(f"Lote escrito en {OUT.relative_to(REPO)}")

    if malformed:
        print()
        print(f"AVISO: {len(malformed)} keywords con `covered_by` malformado "
              f"(no es una URL publica). Cuentan como cubiertas pero ninguna "
              f"comprobacion por URL las reconoce:")
        for m in malformed:
            print(f"  - {m['keyword']} (vol {m['volume']}) -> {m['covered_by']}")

    if batch:
        print()
        print(f"{'keyword':<44}{'vol':>7}{'kd':>5}{'P':>3}  alias")
        print("-" * 72)
        for b in batch:
            kd = "-" if b["kd"] is None else b["kd"]
            print(f"{b['keyword'][:43]:<44}{b['volume']:>7}{str(kd):>5}"
                  f"{b['priority']:>3}  {len(b['aliases'])}")

    if args.json:
        print()
        print(json.dumps(payload, indent=2, ensure_ascii=False))

    return 0 if batch else 2


if __name__ == "__main__":
    sys.exit(main())
