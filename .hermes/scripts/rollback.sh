#!/usr/bin/env bash
# ─── ROLLBACK SYSTEM ───
# Uso: bash .hermes/scripts/rollback.sh [comando]

set -e
PROJECT_DIR="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$PROJECT_DIR"

PREFIX="rollback/"

case "${1:-help}" in
  snapshot)
    NAME="${2:-$(date +%Y%m%d_%H%M%S)}"
    TAG="${PREFIX}${NAME}"
    if git rev-parse "$TAG" >/dev/null 2>&1; then
      echo "⚠️  Checkpoint '$NAME' já existe. Use outro nome."
      exit 1
    fi
    STASH_MSG="rollback_${NAME}"
    if ! git diff --quiet || ! git diff --cached --quiet || [ -n "$(git ls-files --others --exclude-standard)" ]; then
      git stash push -u -m "$STASH_MSG" 2>/dev/null || true
    fi
    git tag -f "$TAG" HEAD
    echo "✅ Checkpoint '$NAME' criado (tag: $TAG)"
    git log --oneline -1
    ;;
  list)
    echo "📋 Checkpoints disponíveis:"
    git tag -l "${PREFIX}*" | sort -t/ -k2 | while read -r tag; do
      name="${tag#${PREFIX}}"
      date="$(git log -1 --format=%ci "$tag" 2>/dev/null | cut -d' ' -f1-2)"
      msg="$(git log -1 --format=%s "$tag" 2>/dev/null)"
      echo "  ▸ $name  ($date) $msg"
    done
    echo ""
    echo "💡 Últimos commits:"
    git log --oneline -10
    ;;
  restore)
    if [ -z "$2" ]; then
      echo "❌ Especifique o nome do checkpoint."
      echo "   Use: bash .hermes/scripts/rollback.sh list"
      exit 1
    fi
    TAG="${PREFIX}${2}"
    if ! git rev-parse "$TAG" >/dev/null 2>&1; then
      echo "❌ Checkpoint '$2' não encontrado."
      exit 1
    fi
    BACKUP_NAME="_backup_$(date +%Y%m%d_%H%M%S)_antes_restore"
    if ! git diff --quiet || ! git diff --cached --quiet || [ -n "$(git ls-files --others --exclude-standard)" ]; then
      git stash push -u -m "backup_${BACKUP_NAME}"
      git tag -f "${PREFIX}${BACKUP_NAME}" HEAD
      echo "💾 Backup automático: '$BACKUP_NAME'"
    fi
    git checkout "$TAG" -- .
    echo "✅ Restaurado para checkpoint '$2'"
    ;;
  diff)
    if [ -z "$2" ]; then echo "❌ Especifique o nome."; exit 1; fi
    TAG="${PREFIX}${2}"
    if ! git rev-parse "$TAG" >/dev/null 2>&1; then echo "❌ Não encontrado."; exit 1; fi
    git diff HEAD "$TAG" --stat
    echo "---"
    git diff HEAD "$TAG"
    ;;
  *)
    echo "╔══════════════════════════════╗"
    echo "║   🚀 MISSÃO: ROLLBACK       ║"
    echo "╠══════════════════════════════╣"
    echo "║ snapshot <nome> → checkpoint ║"
    echo "║ list           → listar      ║"
    echo "║ restore <nome> → restaurar   ║"
    echo "║ diff <nome>    → comparar    ║"
    echo "╚══════════════════════════════╝"
    echo ""
    echo "Exemplo:"
    echo "  bash .hermes/scripts/rollback.sh snapshot antes_da_feature"
    echo "  bash .hermes/scripts/rollback.sh restore antes_da_feature"
    ;;
esac
