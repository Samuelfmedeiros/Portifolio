#!/bin/bash
# Deploy script para Portifolio Samuel
# Usage: ./deploy.sh

set -e

cd /mnt/f/SAMUEL/PROJETOS/portifolio

echo "📁 Directory: $(pwd)"
echo ""

echo "=== GIT STATUS ==="
git status --short
echo ""

echo "=== PUSHING TO GITHUB ==="
git push origin master
echo ""

echo "✅ PUSH COMPLETE! Check Vercel dashboard:"
echo "   https://vercel.com/samuelfmedeiros/portifolio"
echo ""

echo "=== LAST COMMIT ==="
git log -1 --oneline