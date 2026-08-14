-- =============================================================
-- Finanças Crypto Bot — Schema Inicial
-- =============================================================
-- Executado automaticamente na primeira inicialização do PostgreSQL.
-- Arquivos em /docker-entrypoint-initdb.d/ só rodam quando o
-- volume está vazio (primeira vez).
-- =============================================================

-- Tabela principal de trades
CREATE TABLE IF NOT EXISTS trades (
    id              SERIAL PRIMARY KEY,
    symbol          VARCHAR(20) NOT NULL,
    strategy        VARCHAR(50),
    side            VARCHAR(10) DEFAULT 'buy',
    entry_price     NUMERIC(18, 8) NOT NULL,
    exit_price      NUMERIC(18, 8),
    stop_loss       NUMERIC(18, 8),
    take_profit     NUMERIC(18, 8),
    position_value  NUMERIC(18, 2),
    pnl             NUMERIC(18, 8),
    pnl_percent     NUMERIC(8, 4),
    exit_reason     VARCHAR(30),
    exchange_order_id VARCHAR(100),
    executed_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    closed_at       TIMESTAMP,
    status          VARCHAR(20) DEFAULT 'open'
);

-- Índices para queries frequentes
CREATE INDEX IF NOT EXISTS idx_trades_symbol ON trades(symbol);
CREATE INDEX IF NOT EXISTS idx_trades_status ON trades(status);
CREATE INDEX IF NOT EXISTS idx_trades_executed_at ON trades(executed_at);

-- Tabela de métricas diárias (analytics)
CREATE TABLE IF NOT EXISTS daily_metrics (
    id              SERIAL PRIMARY KEY,
    date            DATE NOT NULL UNIQUE,
    total_trades    INTEGER DEFAULT 0,
    winning_trades  INTEGER DEFAULT 0,
    losing_trades   INTEGER DEFAULT 0,
    total_pnl       NUMERIC(18, 8) DEFAULT 0,
    win_rate        NUMERIC(5, 2) DEFAULT 0,
    max_drawdown    NUMERIC(8, 4) DEFAULT 0,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de modelos de ML (versionamento)
CREATE TABLE IF NOT EXISTS ml_models (
    id              SERIAL PRIMARY KEY,
    model_name      VARCHAR(100) NOT NULL,
    version         INTEGER NOT NULL,
    accuracy        NUMERIC(5, 4),
    backtest_pnl    NUMERIC(18, 8),
    status          VARCHAR(20) DEFAULT 'candidate',
    trained_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    promoted_at     TIMESTAMP,
    model_path      TEXT
);

-- Log de eventos do sistema (auditoria)
CREATE TABLE IF NOT EXISTS system_log (
    id              SERIAL PRIMARY KEY,
    service_name    VARCHAR(50) NOT NULL,
    event_type      VARCHAR(30) NOT NULL,
    message         TEXT,
    payload         JSONB,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_system_log_service ON system_log(service_name);
CREATE INDEX IF NOT EXISTS idx_system_log_created ON system_log(created_at);

COMMENT ON TABLE trades IS 'Registro de todos os trades executados pelo bot';
COMMENT ON TABLE daily_metrics IS 'Métricas agregadas por dia para dashboard';
COMMENT ON TABLE ml_models IS 'Versionamento dos modelos de ML treinados';
COMMENT ON TABLE system_log IS 'Log de auditoria de eventos dos serviços';
