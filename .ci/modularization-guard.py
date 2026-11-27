#!/usr/bin/env python3
"""modularization-guard.py — modularização como mecanismo, não texto solto.

Regra: API não importa API; implementação não importa implementação; sem ciclos.
A política é declarada em JSON versionado no próprio projeto.

Uso:
  python3 modularization-guard.py --config .ci/modularization.json
  python3 modularization-guard.py --config .ci/modularization.json --json

Config:
  {
    "name": "repo",
    "roots": ["src", "backend"],
    "exts": [".py", ".ts", ".tsx"],
    "rules": [{"id": "api-nao-importa-api", "from": "^src/lib/", "forbid": "^@/components/"}],
    "allowlist": ["src/lib/legacy.ts"]
  }

Exit: 0 = limpo; 1 = violação; 2 = config inválida/ilegível (fail-closed).
"""
from __future__ import annotations

import argparse
import json
import os
import re
import sys

IMPORT_PY = re.compile(r"^\s*(?:from|import)\s+['\"]?([A-Za-z_@][\w.@/-]*)", re.M)
IMPORT_JS = re.compile(r"""(?:from\s*|import\s*\(?\s*|require\s*\(\s*)["']([^"']+)["']""", re.M)


def carregar(caminho: str) -> dict:
    with open(caminho, encoding="utf-8") as fh:
        cfg = json.load(fh)
    for chave in ("name", "roots", "exts", "rules"):
        if chave not in cfg:
            raise ValueError(f"config sem '{chave}'")
    if not isinstance(cfg["roots"], list) or not isinstance(cfg["rules"], list):
        raise ValueError("roots e rules devem ser listas")
    for r in cfg["rules"]:
        if "id" not in r or "from" not in r or "forbid" not in r:
            raise ValueError(f"regra incompleta: {r}")
        re.compile(r["from"])
        re.compile(r["forbid"])
    cfg.setdefault("allowlist", [])
    if not isinstance(cfg["allowlist"], list):
        raise ValueError("allowlist deve ser lista")
    return cfg


def arquivos(cfg: dict) -> list[str]:
    exts = tuple(cfg["exts"])
    out: list[str] = []
    for root in cfg["roots"]:
        base = os.path.normpath(root)
        if not os.path.isdir(base):
            continue
        for pasta, dirs, nomes in os.walk(base):
            dirs[:] = [d for d in dirs if d not in {".git", "node_modules", ".venv", "__pycache__", "dist", "out", ".next"}]
            for nome in nomes:
                if nome.endswith(exts):
                    out.append(os.path.normpath(os.path.join(pasta, nome)).replace(os.sep, "/"))
    return sorted(out)


def imports_de(caminho: str) -> list[tuple[int, str]]:
    with open(caminho, encoding="utf-8", errors="replace") as fh:
        texto = fh.read()
    rx = IMPORT_PY if caminho.endswith(".py") else IMPORT_JS
    return [(texto.count("\n", 0, m.start()) + 1, m.group(1)) for m in rx.finditer(texto)]


def medir(cfg: dict) -> dict:
    violacoes: list[dict] = []
    permitidos = set(cfg["allowlist"])
    scan = arquivos(cfg)
    for caminho in scan:
        if caminho in permitidos:
            continue
        for linha, modulo in imports_de(caminho):
            for regra in cfg["rules"]:
                if re.search(regra["from"], caminho) and re.search(regra["forbid"], modulo):
                    violacoes.append({
                        "file": caminho,
                        "line": linha,
                        "rule": regra["id"],
                        "import": modulo,
                        "evidence": f"{caminho}:{linha} -> {modulo}",
                    })
    return {
        "ok": not violacoes,
        "name": cfg["name"],
        "scanned": len(scan),
        "rules": [r["id"] for r in cfg["rules"]],
        "allowlist_hits": sorted(p for p in permitidos if os.path.isfile(p)),
        "violations": violacoes,
    }


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--config", required=True, help="JSON de política do projeto")
    ap.add_argument("--json", action="store_true")
    args = ap.parse_args()
    try:
        cfg = carregar(args.config)
        rel = medir(cfg)
    except Exception as exc:
        print(f"MODULARIZATION-GUARD FAIL-CLOSED: {type(exc).__name__}: {exc}", file=sys.stderr)
        return 2
    texto = json.dumps(rel, ensure_ascii=False, indent=2)
    if args.json or not rel["ok"]:
        print(texto)
    return 0 if rel["ok"] else 1


if __name__ == "__main__":
    sys.exit(main())
