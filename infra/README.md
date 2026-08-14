# 🏗️ Infraestrutura — Finanças Crypto Bot

Stack de infraestrutura que roda **independente** dos serviços de aplicação.

## Stack

| Componente | Imagem | Papel |
|------------|--------|-------|
| **PostgreSQL 16** | `postgres:16-alpine` | Persistência (trades, métricas, modelos ML) |
| **NATS 2 + JetStream** | `nats:2-alpine` | Mensageria confiável + KV Store (estado/cache) |

### Retenção do JetStream

O stream `PIPELINE` **não é arquivo morto** — é fila de eventos do pipeline. Mensagens antigas são descartadas automaticamente pelo `fb-market-selection`:

| Política | Valor padrão | Efeito |
|----------|--------------|--------|
| `max_age` | 48 horas | Remove mensagens já processadas |
| `max_bytes` | 256 MB | Teto de segurança dentro do limite global de 1 GB |
| `discard` | `old` | Descarta as mais antigas ao atingir o limite |

Histórico de trades e avaliações fica no **PostgreSQL**, não no NATS.

### Schema v2 (FinBot v2)

Migrations em `init/`:

| Arquivo | Uso |
|---------|-----|
| `001_create_schema.sql` | Schema legado (init automático) |
| `002_v2_schema.sql` | Schema v2 (positions, block_settings, …) |
| `003_v2_seed.sql` | Seed Leme 100% |

As migrations de produção são aplicadas pelo workflow do `finbot-core`, em
`../scripts/migrations/`, incluindo as migrations específicas de Leme e Maré.

> **Por que não tem Redis?**
> NATS JetStream inclui um **Key-Value Store** nativo que substitui o Redis para cache de estado (posições ativas, top assets, status do sistema). Menos um componente para gerenciar = menos complexidade em produção.

## Setup na VPS

```bash
ssh oracle

# Estrutura de produção
cd ~/finbot-core/infra

# Configurar variáveis
cp .env.example .env
nano .env   # Alterar POSTGRES_PASSWORD

# Subir infraestrutura
docker compose up -d

# Verificar saúde (ambos devem estar "healthy")
docker compose ps
```

## Verificação

### PostgreSQL
```bash
docker exec -it crypto-postgres psql -U crypto_admin -d crypto_bot -c "SELECT 1;"
docker exec -it crypto-postgres psql -U crypto_admin -d crypto_bot -c "\dt"
```

### NATS
```bash
# Health check
curl http://localhost:8222/healthz

# Info do servidor
curl http://localhost:8222/varz

# JetStream habilitado
curl http://localhost:8222/jsz
```

## Segurança

- Portas expostas apenas em `127.0.0.1` (não acessíveis externamente)
- Os serviços se comunicam via rede Docker interna `crypto-network`
- Senha do PostgreSQL deve ser forte e única

## Volumes Persistentes

| Volume | Descrição |
|--------|-----------|
| `crypto-postgres-data` | Dados do banco |
| `crypto-nats-data` | Streams e KV JetStream |

Dados sobrevivem a `docker compose down`. Para apagar tudo (⚠️):
```bash
docker compose down -v
```

## Schema do Banco

`init/001_create_schema.sql` executa automaticamente no primeiro boot:

| Tabela | Descrição |
|--------|-----------|
| `trades` | Registro de trades (entry, exit, PnL) |
| `daily_metrics` | Métricas diárias (win rate, drawdown) |
| `ml_models` | Versionamento de modelos ML |
| `system_log` | Auditoria de eventos |
