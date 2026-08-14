# finbot-core

Plataforma central do ecossistema FinBot.

Responsabilidades:

- execução de ordens de qualquer estratégia;
- monitoramento e fechamento de posições;
- dashboard operacional;
- PostgreSQL, NATS/JetStream e contratos de integração;
- todas as migrations de banco e deploy da plataforma.

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

`MAX_ORDER_NOTIONAL_USDT` é o teto defensivo final do executor para cada ordem,
independentemente do produtor. O valor inicial recomendado é `25` e deve ser
alterado conscientemente conforme o capital e o risco aprovados.

O Core é o dono do PostgreSQL compartilhado e aplica, em ordem, as migrations
de todos os serviços (`002` a `006`). Leme e Maré carregam cópias das suas
migrations apenas como referência de desenvolvimento; seus deploys não criam
nem alteram o schema de produção.
