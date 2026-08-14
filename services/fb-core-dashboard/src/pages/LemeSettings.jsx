import React, { useState, useEffect } from 'react';
import {
  TIERS,
  TIER_LABELS,
  entryKey,
  entryEnabledKey,
  entryRegimesKey,
  GUARDIAN_KEYS,
  settingValue,
} from '../lib/settingsKeys';

const TIER_COLORS = {
  Major: { border: 'rgba(234,179,8,0.3)', glow: 'rgba(234,179,8,0.1)' },
  'Strong Alt': { border: 'rgba(99,102,241,0.3)', glow: 'rgba(99,102,241,0.1)' },
  'High Volatility': { border: 'rgba(239,68,68,0.3)', glow: 'rgba(239,68,68,0.1)' },
};

const sectionStyle = {
  background: 'rgba(15,23,42,0.6)',
  border: '1px solid rgba(71,85,105,0.3)',
  borderRadius: '16px',
  padding: '24px',
  marginBottom: '24px',
};

const inputStyle = {
  background: '#0f172a',
  color: '#f1f5f9',
  border: '1px solid rgba(71,85,105,0.6)',
  borderRadius: '8px',
  padding: '8px 12px',
  width: '100%',
  fontSize: '14px',
  outline: 'none',
  boxSizing: 'border-box',
};

const labelStyle = {
  color: '#94a3b8',
  fontSize: '12px',
  fontWeight: 500,
  marginBottom: '6px',
  display: 'block',
};

function RegimeToggle({ settings, onChange, regimeKey, accent }) {
  const current = settingValue(settings, regimeKey);
  const regimes = Array.isArray(current) ? current : [];

  return (
    <div className="flex gap-2 mt-2">
      {['bull', 'bear', 'neutral'].map((reg) => {
        const active = regimes.includes(reg);
        return (
          <button
            key={reg}
            type="button"
            onClick={() => {
              const next = active ? regimes.filter((r) => r !== reg) : [...regimes, reg];
              onChange(regimeKey, next);
            }}
            style={{
              flex: 1,
              background: active ? accent.bg : 'transparent',
              color: active ? accent.text : '#64748b',
              border: `1px solid ${active ? accent.border : 'rgba(71,85,105,0.3)'}`,
              borderRadius: '6px',
              padding: '6px 4px',
              fontSize: '11px',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            {reg === 'bull' ? '🐂 Bull' : reg === 'bear' ? '🐻 Bear' : '➖ Lateral'}
          </button>
        );
      })}
    </div>
  );
}

export default function LemeSettings() {
  const [settings, setSettings] = useState(null);
  const [lemeHistory, setLemeHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const fetchHistory = () => {
    fetch('/api/leme/history')
      .then((res) => res.json())
      .then(setLemeHistory)
      .catch(() => {});
  };

  useEffect(() => {
    fetch('/api/settings/block/leme')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setSettings(data);
        setLoading(false);
      })
      .catch((err) => {
        setFeedback({ type: 'error', text: err.message });
        setLoading(false);
      });
    fetchHistory();
  }, []);

  const handleChange = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    const cleaned = {};
    for (const [k, v] of Object.entries(settings || {})) {
      if (k.startsWith('_')) continue;
      let val = v;
      if (typeof val === 'string' && val !== '' && !isNaN(Number(val)) && !k.includes('allowed_regimes')) {
        val = Number(val);
      }
      cleaned[k] = val;
    }

    setSaving(true);
    setFeedback(null);
    fetch('/api/settings/block/leme', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cleaned),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Falha ao salvar');
        return res.json();
      })
      .then(() => {
        setFeedback({ type: 'success', text: 'Configurações do Leme salvas.' });
        setSaving(false);
        fetchHistory();
        setTimeout(() => setFeedback(null), 4000);
      })
      .catch((err) => {
        setFeedback({ type: 'error', text: err.message });
        setSaving(false);
      });
  };

  if (loading) {
    return <div className="p-6 text-slate-400">Carregando configurações do Leme...</div>;
  }

  return (
    <div style={{ padding: '24px', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ marginBottom: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <p className="text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">Estratégia</p>
          <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#f1f5f9', margin: 0 }}>Leme — Mean Reversion</h1>
          <p style={{ color: '#64748b', fontSize: '14px', margin: '8px 0 0' }}>
            Scan, entradas por tier, guardian e risco. Não afeta o core de execução.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
            color: '#fff',
            border: 'none',
            borderRadius: '10px',
            padding: '12px 24px',
            fontWeight: 700,
            fontSize: '14px',
            cursor: 'pointer',
            opacity: saving ? 0.7 : 1,
          }}
        >
          {saving ? 'Gravando...' : 'Salvar Leme'}
        </button>
      </div>

      {feedback && (
        <div
          style={{
            background: feedback.type === 'success' ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
            border: `1px solid ${feedback.type === 'success' ? '#10b981' : '#ef4444'}`,
            borderRadius: '12px',
            padding: '14px 20px',
            color: feedback.type === 'success' ? '#6ee7b7' : '#fca5a5',
            marginBottom: '24px',
          }}
        >
          {feedback.text}
        </div>
      )}

      {/* Guardian */}
      <div style={{ ...sectionStyle, border: '1px solid rgba(99, 102, 241, 0.3)' }}>
        <h2 style={{ color: '#e2e8f0', fontSize: '18px', fontWeight: 800, marginTop: 0 }}>
          Guardian (piloto autônomo)
        </h2>
        <p style={{ color: '#64748b', fontSize: '12px', marginBottom: '16px' }}>
          Pausa tiers com base em perdas reais e shadow.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
          {[
            [GUARDIAN_KEYS.maxConsecutiveSl, 'Stop Losses consecutivos (max)', 1, 20, 1],
            [GUARDIAN_KEYS.minWinRate, 'Win-rate mínimo real (%)', 0, 100, 1],
            [GUARDIAN_KEYS.cooldownHours, 'Cooldown (horas)', 1, 720, 1],
            [GUARDIAN_KEYS.shadowMinTrades, 'Mín. trades shadow', 1, 50, 1],
            [GUARDIAN_KEYS.shadowMinWinrate, 'Win-rate recuperação shadow (%)', 0, 100, 1],
          ].map(([key, label, min, max, step]) => (
            <div key={key}>
              <label style={labelStyle}>{label}</label>
              <input
                type="number"
                min={min}
                max={max}
                step={step}
                value={settingValue(settings, key)}
                onChange={(e) => handleChange(key, e.target.value)}
                style={inputStyle}
              />
            </div>
          ))}
        </div>

        <div style={{ marginTop: '24px' }}>
          <h3 style={{ color: '#e2e8f0', fontSize: '14px', fontWeight: 700, marginBottom: '12px' }}>
            Histórico de decisões
          </h3>
          {lemeHistory.length === 0 ? (
            <p style={{ color: '#64748b', fontSize: '13px' }}>Nenhuma decisão registrada ainda.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', fontSize: '13px', color: '#cbd5e1' }}>
                <thead>
                  <tr style={{ color: '#94a3b8', textAlign: 'left' }}>
                    <th style={{ padding: '8px' }}>Data</th>
                    <th style={{ padding: '8px' }}>Escopo</th>
                    <th style={{ padding: '8px' }}>Ação</th>
                    <th style={{ padding: '8px' }}>Motivo</th>
                  </tr>
                </thead>
                <tbody>
                  {lemeHistory.map((h) => (
                    <tr key={h.id} style={{ borderTop: '1px solid rgba(71,85,105,0.3)' }}>
                      <td style={{ padding: '8px' }}>
                        {h.created_at ? new Date(h.created_at).toLocaleString('pt-BR') : '-'}
                      </td>
                      <td style={{ padding: '8px' }}>{h.group_name || h.scope}</td>
                      <td style={{ padding: '8px' }}>{h.action}</td>
                      <td style={{ padding: '8px' }}>{h.reason}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Tiers */}
      {TIERS.map((tier) => {
        const colors = TIER_COLORS[tier];
        return (
          <div
            key={tier}
            style={{
              ...sectionStyle,
              border: `1px solid ${colors.border}`,
              boxShadow: `0 4px 20px ${colors.glow}`,
            }}
          >
            <h2 style={{ color: '#e2e8f0', fontSize: '18px', fontWeight: 800, marginTop: 0, marginBottom: '20px' }}>
              {TIER_LABELS[tier]}
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
              {/* LONG */}
              <div style={{ background: 'rgba(99,102,241,0.03)', border: '1px solid rgba(99,102,241,0.1)', borderRadius: '12px', padding: '18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <h3 style={{ color: '#818cf8', fontSize: '15px', fontWeight: 700, margin: 0 }}>LONG</h3>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={!!settingValue(settings, entryEnabledKey('long', tier))}
                      onChange={(e) => handleChange(entryEnabledKey('long', tier), e.target.checked)}
                    />
                    <span style={{ color: '#f1f5f9', fontSize: '13px' }}>Ativo</span>
                  </label>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  {[
                    [entryKey('long', tier, 'min_score'), 'Score mínimo', '0.01', '0', '1'],
                    [entryKey('long', tier, 'max_rsi'), 'RSI máximo', '1', '10', '60'],
                    [entryKey('long', tier, 'sl'), 'SL (%)', '0.1', '0.5', '20'],
                    [entryKey('long', tier, 'tp'), 'TP (%)', '0.1', '0.5', '50'],
                  ].map(([key, label, step, min, max]) => (
                    <div key={key}>
                      <label style={labelStyle}>{label}</label>
                      <input
                        type="number"
                        step={step}
                        min={min}
                        max={max}
                        value={settingValue(settings, key)}
                        onChange={(e) => handleChange(key, e.target.value)}
                        style={inputStyle}
                      />
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: '14px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '10px' }}>
                  <label style={labelStyle}>Regimes permitidos (BTC)</label>
                  <RegimeToggle
                    settings={settings}
                    onChange={handleChange}
                    regimeKey={entryRegimesKey('long', tier)}
                    accent={{ bg: 'rgba(99,102,241,0.2)', text: '#a5b4fc', border: 'rgba(99,102,241,0.5)' }}
                  />
                </div>
              </div>

              {/* SHORT */}
              <div style={{ background: 'rgba(239,68,68,0.03)', border: '1px solid rgba(239,68,68,0.1)', borderRadius: '12px', padding: '18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <h3 style={{ color: '#f87171', fontSize: '15px', fontWeight: 700, margin: 0 }}>SHORT</h3>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={!!settingValue(settings, entryEnabledKey('short', tier))}
                      onChange={(e) => handleChange(entryEnabledKey('short', tier), e.target.checked)}
                    />
                    <span style={{ color: '#f1f5f9', fontSize: '13px' }}>Ativo</span>
                  </label>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  {[
                    [entryKey('short', tier, 'min_score'), 'Score mínimo', '0.01', '0', '1'],
                    [entryKey('short', tier, 'min_rsi'), 'RSI mínimo', '1', '50', '95'],
                    [entryKey('short', tier, 'sl'), 'SL (%)', '0.1', '0.5', '20'],
                    [entryKey('short', tier, 'tp'), 'TP (%)', '0.1', '0.5', '50'],
                  ].map(([key, label, step, min, max]) => (
                    <div key={key}>
                      <label style={labelStyle}>{label}</label>
                      <input
                        type="number"
                        step={step}
                        min={min}
                        max={max}
                        value={settingValue(settings, key)}
                        onChange={(e) => handleChange(key, e.target.value)}
                        style={inputStyle}
                      />
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: '14px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '10px' }}>
                  <label style={labelStyle}>Regimes permitidos (BTC)</label>
                  <RegimeToggle
                    settings={settings}
                    onChange={handleChange}
                    regimeKey={entryRegimesKey('short', tier)}
                    accent={{ bg: 'rgba(239,68,68,0.15)', text: '#fca5a5', border: 'rgba(239,68,68,0.4)' }}
                  />
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
