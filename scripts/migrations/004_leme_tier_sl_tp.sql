-- FinBot v2 — chaves de entrada faltantes por tier (SL/TP, RSI)
INSERT INTO block_settings (block_id, key, value) VALUES
    ('leme', 'entry.long_strong_alt_max_rsi', '38'),
    ('leme', 'entry.long_high_volatility_max_rsi', '38'),
    ('leme', 'entry.short_strong_alt_min_rsi', '65'),
    ('leme', 'entry.short_high_volatility_min_rsi', '65'),
    ('leme', 'entry.long_strong_alt_sl', '3.0'),
    ('leme', 'entry.long_strong_alt_tp', '3.0'),
    ('leme', 'entry.long_high_volatility_sl', '4.0'),
    ('leme', 'entry.long_high_volatility_tp', '4.0'),
    ('leme', 'entry.short_strong_alt_sl', '5.0'),
    ('leme', 'entry.short_strong_alt_tp', '3.0'),
    ('leme', 'entry.short_high_volatility_sl', '5.0'),
    ('leme', 'entry.short_high_volatility_tp', '3.0')
ON CONFLICT (block_id, key) DO UPDATE SET
    value = EXCLUDED.value,
    updated_at = CURRENT_TIMESTAMP;
