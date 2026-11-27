#!/usr/bin/env python3
"""design-guard.py — exige decisão de design antes de mexer em UI.

Regra do vídeo KIX9IL1jP8Y: três direções visuais + before/after antes do código.
Aqui o gate só bloqueia quando há UI alterada; sem UI alterada, passa com skip.

Uso:
  python3 design-guard.py --config .ci/design.json
  python3 design-guard.py --config .ci/design.json --local

Config JSON:
  {
    "name": "portifolio",
    "base": "origin/master",
    "ui_paths": ["^src/(components|app)/", "^src/.*\\.tsx$"],
    "record": "docs/DECISAO_DE_DESIGN.md",
    "min_variants": 2,
    "required_sections": ["antes", "depois", "variante a", "variante b"]
  }

Exit: 0 = limpo/skip; 1 = UI alterada sem registro válido; 2 = config/erro (fail-closed).
"""
from __future__ import annotations

import argparse
import json
import os
import re
import subprocess
import sys


def carregar(caminho: str) -> dict:
    with open(caminho, encoding="utf-8") as fh:
        cfg = json.load(fh)
    for chave in ("name", "base", "ui_paths", "record", "min_variants", "required_sections"):
        if chave not in cfg:
            raise ValueError(f"config sem '{chave}'")
    for padrao in cfg["ui_paths"]:
        re.compile(padrao)
    if not isinstance(cfg["required_sections"], list):
        raise ValueError("required_sections deve ser lista")
    return cfg


def arquivos_ui(cfg: dict, local: bool) -> list[str]:
    if local:
        cmd = ["git", "diff", "--name-only"]
    else:
        cmd = ["git", "diff", "--name-only", f"{cfg['base']}...HEAD", "--"]
    res = subprocess.run(cmd, capture_output=True, text=True, timeout=60)
    if res.returncode != 0:
        raise RuntimeError(f"git diff falhou: {res.stderr.strip()}")
    todos = [l.strip() for l in res.stdout.splitlines() if l.strip()]
    return [p for p in todos if any(re.search(rx, p) for rx in cfg["ui_paths"])]


def checar_registro(cfg: dict, ui: list[str]) -> dict:
    falhas: list[dict] = []
    caminho = cfg["record"]
    if not os.path.isfile(caminho):
        falhas.append({"rule": "registro_existe", "evidence": f"{caminho} AUSENTE"})
    else:
        texto = open(caminho, encoding="utf-8").read().lower()
        for secao in cfg["required_sections"]:
            if secao.lower() not in texto:
                falhas.append({"rule": "secao_obrigatoria", "evidence": f"'{secao}' ausente em {caminho}"})
        variantes = len(re.findall(r"^#{1,4}\s*variante\b|^\s*[-*]\s*variante\b", texto, re.M))
        if variantes < int(cfg["min_variants"]):
            falhas.append({"rule": "min_variantes",
                           "evidence": f"{variantes} variantes, minimo {cfg['min_variants']} em {caminho}"})
        for arquivo in ui:
            if arquivo.lower() not in texto:
                falhas.append({"rule": "arquivo_citado",
                               "evidence": f"{arquivo} nao citado em {caminho}"})
    return {
        "ok": not falhas,
        "name": cfg["name"],
        "ui_alterados": ui,
        "registro": caminho,
        "violations": falhas,
    }


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--config", required=True)
    ap.add_argument("--local", action="store_true", help="compara working tree com HEAD")
    ap.add_argument("--json", action="store_true")
    args = ap.parse_args()
    try:
        cfg = carregar(args.config)
        ui = arquivos_ui(cfg, args.local)
        if ui:
            rel = checar_registro(cfg, ui)
        else:
            rel = {"ok": True, "name": cfg["name"], "ui_alterados": [],
                   "registro": cfg["record"], "violations": [],
                   "skipped": "nenhum arquivo de UI alterado — gate nao exige registro"}
    except Exception as exc:
        print(f"DESIGN-GUARD FAIL-CLOSED: {type(exc).__name__}: {exc}", file=sys.stderr)
        return 2
    texto = json.dumps(rel, ensure_ascii=False, indent=2)
    if args.json or not rel["ok"] or rel.get("skipped"):
        print(texto)
    return 0 if rel["ok"] else 1


if __name__ == "__main__":
    sys.exit(main())
