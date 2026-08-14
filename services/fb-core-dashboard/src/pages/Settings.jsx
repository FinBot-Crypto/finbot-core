import React, { useState, useEffect } from 'react';

const GLOBAL_KEYS = ['dry_run', 'monitor.interval_sec', 'bnb.min_balance_usdt'];

export default function Settings() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    fetch('/api/settings/global')
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
  }, []);

  const handleChange = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    const payload = {};
    for (const key of GLOBAL_KEYS) {
      if (settings[key] !== undefined) payload[key] = settings[key];
    }

    setSaving(true);
    setFeedback(null);
    fetch('/api/settings/global', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Falha ao salvar');
        return res.json();
      })
      .then(() => {
        setFeedback({ type: 'success', text: 'Configurações do sistema salvas.' });
        setSaving(false);
        setTimeout(() => setFeedback(null), 4000);
      })
      .catch((err) => {
        setFeedback({ type: 'error', text: err.message });
        setSaving(false);
      });
  };

  if (loading) {
    return <div className="p-6 text-slate-400">Carregando configurações do sistema...</div>;
  }

  const inputClass =
    'bg-slate-900 text-slate-100 border border-slate-600 rounded-lg px-3 py-2 w-full text-sm focus:outline-none focus:border-indigo-500';

  return (
    <div className="p-6 max-w-2xl">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Configurações do Sistema</h1>
          <p className="text-slate-400 text-sm">
            Parâmetros globais do core (monitor, dry-run, taxas). Estratégias ficam em Estratégias → Leme.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-5 py-2.5 rounded-lg disabled:opacity-60"
        >
          {saving ? 'Salvando...' : 'Salvar'}
        </button>
      </div>

      {feedback && (
        <div
          className={`mb-6 px-4 py-3 rounded-lg text-sm font-medium ${
            feedback.type === 'success'
              ? 'bg-emerald-900/30 text-emerald-300 border border-emerald-700'
              : 'bg-red-900/30 text-red-300 border border-red-700'
          }`}
        >
          {feedback.text}
        </div>
      )}

      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 space-y-5">
        <div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={!!settings?.dry_run}
              onChange={(e) => handleChange('dry_run', e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-white font-medium">Dry Run (simulação, sem ordens reais)</span>
          </label>
        </div>

        <div>
          <label className="block text-slate-400 text-xs font-medium mb-1">Intervalo do Monitor (segundos)</label>
          <input
            type="number"
            min="5"
            max="300"
            step="1"
            value={settings?.['monitor.interval_sec'] ?? 10}
            onChange={(e) => handleChange('monitor.interval_sec', Number(e.target.value))}
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-slate-400 text-xs font-medium mb-1">Saldo mínimo BNB para taxas (USDT)</label>
          <input
            type="number"
            min="1"
            max="100"
            step="1"
            value={settings?.['bnb.min_balance_usdt'] ?? 5}
            onChange={(e) => handleChange('bnb.min_balance_usdt', Number(e.target.value))}
            className={inputClass}
          />
        </div>
      </div>
    </div>
  );
}
