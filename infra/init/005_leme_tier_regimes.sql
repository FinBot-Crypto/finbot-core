-- FinBot v2 — regimes permitidos por tier + direção (Leme)

INSERT INTO block_settings (block_id, key, value)
SELECT 'leme', 'entry.long_major_allowed_regimes',
    COALESCE((SELECT value FROM block_settings WHERE block_id = 'leme' AND key = 'entry.long_allowed_regimes'), '["bull"]'::jsonb)
WHERE NOT EXISTS (SELECT 1 FROM block_settings WHERE block_id = 'leme' AND key = 'entry.long_major_allowed_regimes');

INSERT INTO block_settings (block_id, key, value)
SELECT 'leme', 'entry.long_strong_alt_allowed_regimes',
    COALESCE((SELECT value FROM block_settings WHERE block_id = 'leme' AND key = 'entry.long_allowed_regimes'), '["bull"]'::jsonb)
WHERE NOT EXISTS (SELECT 1 FROM block_settings WHERE block_id = 'leme' AND key = 'entry.long_strong_alt_allowed_regimes');

INSERT INTO block_settings (block_id, key, value)
SELECT 'leme', 'entry.long_high_volatility_allowed_regimes',
    COALESCE((SELECT value FROM block_settings WHERE block_id = 'leme' AND key = 'entry.long_allowed_regimes'), '["bull"]'::jsonb)
WHERE NOT EXISTS (SELECT 1 FROM block_settings WHERE block_id = 'leme' AND key = 'entry.long_high_volatility_allowed_regimes');

INSERT INTO block_settings (block_id, key, value)
SELECT 'leme', 'entry.short_major_allowed_regimes',
    COALESCE((SELECT value FROM block_settings WHERE block_id = 'leme' AND key = 'entry.short_allowed_regimes'), '["bear","neutral"]'::jsonb)
WHERE NOT EXISTS (SELECT 1 FROM block_settings WHERE block_id = 'leme' AND key = 'entry.short_major_allowed_regimes');

INSERT INTO block_settings (block_id, key, value)
SELECT 'leme', 'entry.short_strong_alt_allowed_regimes',
    COALESCE((SELECT value FROM block_settings WHERE block_id = 'leme' AND key = 'entry.short_allowed_regimes'), '["bear","neutral"]'::jsonb)
WHERE NOT EXISTS (SELECT 1 FROM block_settings WHERE block_id = 'leme' AND key = 'entry.short_strong_alt_allowed_regimes');

INSERT INTO block_settings (block_id, key, value)
SELECT 'leme', 'entry.short_high_volatility_allowed_regimes',
    COALESCE((SELECT value FROM block_settings WHERE block_id = 'leme' AND key = 'entry.short_allowed_regimes'), '["bear","neutral"]'::jsonb)
WHERE NOT EXISTS (SELECT 1 FROM block_settings WHERE block_id = 'leme' AND key = 'entry.short_high_volatility_allowed_regimes');

-- Garante valores atuais mesmo se já existiam chaves legadas globais
INSERT INTO block_settings (block_id, key, value) VALUES
    ('leme', 'entry.long_major_allowed_regimes', '["bull"]'),
    ('leme', 'entry.long_strong_alt_allowed_regimes', '["bull"]'),
    ('leme', 'entry.long_high_volatility_allowed_regimes', '["bull"]'),
    ('leme', 'entry.short_major_allowed_regimes', '["bear","neutral"]'),
    ('leme', 'entry.short_strong_alt_allowed_regimes', '["bear","neutral"]'),
    ('leme', 'entry.short_high_volatility_allowed_regimes', '["bear","neutral"]')
ON CONFLICT (block_id, key) DO UPDATE SET
    value = CASE
        WHEN block_settings.value = '[]'::jsonb OR block_settings.value IS NULL
        THEN EXCLUDED.value
        ELSE block_settings.value
    END,
    updated_at = CURRENT_TIMESTAMP;
