#!/bin/bash
# Trigger Vercel deploy via API
# Precisa do VERCEL_TOKEN: vercel token generate

VercelProjectId="prj_..."  # Pegar em https://vercel.com/samuelfmedeiros/mission-control/settings

echo "🚀 Triggering Vercel deploy..."

curl -X POST "https://api.vercel.com/v13/deployments" \
  -H "Authorization: Bearer $VERCEL_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "mission-control",
    "project": "'"$VercelProjectId"'",
    "target": "production",
    "gitSource": {
      "type": "github",
      "ref": "main",
      "repoId": "...",
      "org": {
        "login": "Samuelfmedeiros"
      }
    }
  }'

echo ""
echo "✅ Deploy triggered! Check: https://vercel.com/samuelfmedeiros/mission-control/activity"