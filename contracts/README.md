# Contratos do FinBot

O Core é o dono dos contratos de integração. Estratégias podem publicar sinais e ordens, mas somente `fb-core-exec` consome `trade.order.v1` e executa na exchange.

Eventos estáveis:

- `market.universe.v1`
- `strategy.signal.v1`
- `trade.order.v1`
- `trade.opened.v1`
- `trade.close.v1`
- `trade.closed.v1`

Durante a transição, os subjects antigos (`trade.order`, `trade.opened`, etc.) continuam aceitos. A migração para os subjects versionados será gradual e compatível.

