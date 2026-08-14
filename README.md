# finbot-core

Plataforma central do ecossistema FinBot.

Responsabilidades:

- execução de ordens de qualquer estratégia;
- monitoramento e fechamento de posições;
- dashboard operacional;
- PostgreSQL, NATS/JetStream e contratos de integração;
- migrations base e deploy da plataforma.

As estratégias não executam ordens diretamente. Elas publicam `trade.order` validado; o Core aplica idempotência, limites de risco e execução.

## Estrutura

```text
services/fb-core-exec
services/fb-core-monitor
services/fb-core-dashboard
packages/finbot-common
contracts/
infra/
scripts/migrations/
```

## Desenvolvimento

```bash
cp .env.example .env
docker compose -f infra/docker-compose.yml --env-file .env up -d
docker compose --env-file .env up -d --build
```

O `.env` do Core contém as credenciais de execução. Não copie esse arquivo para Leme ou Maré.

