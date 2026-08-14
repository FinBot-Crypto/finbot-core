#!/bin/bash
# Script de validação da infraestrutura
set -e

echo "============================================"
echo "  VALIDAÇÃO DA INFRAESTRUTURA"
echo "  $(date)"
echo "============================================"
echo ""

# 1. PostgreSQL
echo ">>> POSTGRESQL"
docker exec crypto-postgres psql -U crypto_admin -d crypto_bot -At -c \
  "SELECT tablename FROM pg_tables WHERE schemaname='public' ORDER BY tablename;"
echo ""

# 2. NATS Health
echo ">>> NATS HEALTH"
curl -s http://localhost:8222/healthz
echo ""

# 3. NATS JetStream
echo ">>> NATS JETSTREAM"
curl -s http://localhost:8222/jsz | grep -E '"(max_memory|max_storage|store_dir|streams|messages)"'
echo ""

# 4. Containers
echo ">>> CONTAINERS"
cd ~/crypto-bot/infra && docker compose ps --format "table {{.Name}}\t{{.Status}}\t{{.Ports}}"
echo ""

# 5. Resources
echo ">>> RESOURCES"
echo "RAM: $(free -h | awk '/^Mem:/ {print $3 "/" $2}')"
echo "Disk: $(df -h / | awk 'NR==2 {print $3 "/" $2 " (" $5 " used)"}')"
echo ""

echo "============================================"
echo "  ✅ VALIDAÇÃO COMPLETA"
echo "============================================"
