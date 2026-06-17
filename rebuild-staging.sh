#!/bin/bash
# Rebuild + restart Portifolio staging
# Uso: ./rebuild-staging.sh

set -e
cd /home/samuel/projetos/portifolio

echo "📦 Pulling latest..."
git pull 2>/dev/null || echo "(no remote to pull)"

echo "🏗️ Building..."
pnpm build

echo "🔄 Restarting staging service..."
systemctl --user restart portifolio-staging

echo "✅ Staging rebuilt and restarted!"
curl -s -o /dev/null -w "Status: %{http_code}\n" http://127.0.0.1:3000/
