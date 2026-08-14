export const TIERS = ['Major', 'Strong Alt', 'High Volatility'];

export const TIER_LABELS = {
  Major: 'Major (BTC, ETH)',
  'Strong Alt': 'Strong Alt (SOL, BNB, etc.)',
  'High Volatility': 'High Volatility (PEPE, TRX, etc.)',
};

export function tierSlug(tier) {
  return tier.toLowerCase().replace(/ /g, '_');
}

/** v2 block_settings key, e.g. entry.long_major_min_score */
export function entryKey(direction, tier, suffix) {
  return `entry.${direction.toLowerCase()}_${tierSlug(tier)}_${suffix}`;
}

export function entryEnabledKey(direction, tier) {
  return entryKey(direction, tier, 'enabled');
}

export function entryRegimesKey(direction, tier) {
  return entryKey(direction, tier, 'allowed_regimes');
}

export const GUARDIAN_KEYS = {
  maxConsecutiveSl: 'guardian.max_consecutive_sl',
  minWinRate: 'guardian.min_win_rate',
  cooldownHours: 'guardian.cooldown_hours',
  shadowMinTrades: 'guardian.shadow_min_trades',
  shadowMinWinrate: 'guardian.shadow_min_winrate',
};

export const DEFAULTS = {
  [entryKey('long', 'Major', 'min_score')]: 0.65,
  [entryKey('long', 'Strong Alt', 'min_score')]: 0.65,
  [entryKey('long', 'High Volatility', 'min_score')]: 0.70,
  [entryKey('short', 'Major', 'min_score')]: 0.85,
  [entryKey('short', 'Strong Alt', 'min_score')]: 0.85,
  [entryKey('short', 'High Volatility', 'min_score')]: 0.85,
  [entryKey('long', 'Major', 'max_rsi')]: 38,
  [entryKey('long', 'Strong Alt', 'max_rsi')]: 38,
  [entryKey('long', 'High Volatility', 'max_rsi')]: 38,
  [entryKey('short', 'Major', 'min_rsi')]: 65,
  [entryKey('short', 'Strong Alt', 'min_rsi')]: 65,
  [entryKey('short', 'High Volatility', 'min_rsi')]: 65,
  [entryKey('long', 'Major', 'sl')]: 3.0,
  [entryKey('long', 'Major', 'tp')]: 3.0,
  [entryKey('long', 'Strong Alt', 'sl')]: 3.0,
  [entryKey('long', 'Strong Alt', 'tp')]: 3.0,
  [entryKey('long', 'High Volatility', 'sl')]: 4.0,
  [entryKey('long', 'High Volatility', 'tp')]: 4.0,
  [entryKey('short', 'Major', 'sl')]: 5.0,
  [entryKey('short', 'Major', 'tp')]: 3.0,
  [entryKey('short', 'Strong Alt', 'sl')]: 5.0,
  [entryKey('short', 'Strong Alt', 'tp')]: 3.0,
  [entryKey('short', 'High Volatility', 'sl')]: 5.0,
  [entryKey('short', 'High Volatility', 'tp')]: 3.0,
  [entryKey('long', 'Major', 'lev_2x_pct')]: 0.20,
  [entryKey('long', 'Major', 'lev_3x_pct')]: 0.50,
  [entryKey('long', 'Major', 'lev_5x_pct')]: 0.80,
  [entryRegimesKey('long', 'Major')]: ['bull'],
  [entryRegimesKey('long', 'Strong Alt')]: ['bull'],
  [entryRegimesKey('long', 'High Volatility')]: ['bull'],
  [entryRegimesKey('short', 'Major')]: ['bear', 'neutral'],
  [entryRegimesKey('short', 'Strong Alt')]: ['bear', 'neutral'],
  [entryRegimesKey('short', 'High Volatility')]: ['bear', 'neutral'],
  [GUARDIAN_KEYS.maxConsecutiveSl]: 3,
  [GUARDIAN_KEYS.minWinRate]: 40,
  [GUARDIAN_KEYS.cooldownHours]: 24,
  [GUARDIAN_KEYS.shadowMinTrades]: 5,
  [GUARDIAN_KEYS.shadowMinWinrate]: 60,
};

export function settingValue(settings, key) {
  if (settings == null) return DEFAULTS[key] ?? '';
  if (settings[key] !== undefined && settings[key] !== null) return settings[key];
  return DEFAULTS[key] ?? '';
}
