import React, { useEffect, useState } from 'react';

const stateColor = (state) => ({
  bull: 'text-emerald-400', bear: 'text-red-400', neutral: 'text-slate-400',
  pullback: 'text-amber-300', extended: 'text-orange-400', up: 'text-emerald-400', down: 'text-red-400',
}[state] || 'text-slate-300');

export default function Mare() {
  const [signals, setSignals] = useState([]);
  const [error, setError] = useState('');

  const load = () => fetch('/api/mare/signals?limit=100')
    .then((response) => response.json())
    .then(setSignals)
    .catch(() => setError('Não foi possível carregar os sinais da Maré.'));

  useEffect(() => { load(); const timer = setInterval(load, 15000); return () => clearInterval(timer); }, []);

  const accepted = signals.filter((signal) => signal.accepted).length;
  const live = signals.filter((signal) => signal.live_orders_enabled).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Maré</h1>
        <p className="text-slate-400 mt-2">Maré 4h · Onda 1h · Marola 15m — sinais e observabilidade</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-800 rounded-xl p-5 border border-slate-700"><p className="text-slate-400 text-sm">Análises recentes</p><p className="text-2xl text-white font-bold mt-2">{signals.length}</p></div>
        <div className="bg-slate-800 rounded-xl p-5 border border-slate-700"><p className="text-slate-400 text-sm">Sinais aceitos</p><p className="text-2xl text-emerald-400 font-bold mt-2">{accepted}</p></div>
        <div className="bg-slate-800 rounded-xl p-5 border border-slate-700"><p className="text-slate-400 text-sm">Ordens live liberadas</p><p className="text-2xl text-amber-300 font-bold mt-2">{live}</p></div>
      </div>
      {error && <p className="text-red-400">{error}</p>}
      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-auto">
        <table className="w-full text-sm"><thead className="text-slate-400 border-b border-slate-700"><tr>
          {['Horário', 'Moeda', 'Score', 'Maré', 'Onda', 'Marola', 'Decisão', 'Modo'].map((heading) => <th key={heading} className="text-left px-4 py-3">{heading}</th>)}
        </tr></thead><tbody>
          {signals.map((signal) => <tr key={signal.id} className="border-b border-slate-700/50 text-slate-300">
            <td className="px-4 py-3">{signal.evaluated_at ? new Date(signal.evaluated_at).toLocaleString('pt-BR') : '-'}</td>
            <td className="px-4 py-3 font-semibold text-white">{signal.symbol}</td>
            <td className="px-4 py-3">{signal.score.toFixed(3)}</td>
            <td className={`px-4 py-3 font-semibold ${stateColor(signal.tide)}`}>{signal.tide}</td>
            <td className={`px-4 py-3 font-semibold ${stateColor(signal.wave)}`}>{signal.wave}</td>
            <td className={`px-4 py-3 font-semibold ${stateColor(signal.ripple)}`}>{signal.ripple}</td>
            <td className={signal.accepted ? 'px-4 py-3 text-emerald-400' : 'px-4 py-3 text-slate-400'}>{signal.accepted ? 'ACEITO' : signal.reason}</td>
            <td className="px-4 py-3">{signal.live_orders_enabled ? 'LIVE' : 'SHADOW'}</td>
          </tr>)}
        </tbody></table>
        {!signals.length && <p className="p-8 text-center text-slate-500">Nenhuma análise registrada ainda.</p>}
      </div>
    </div>
  );
}
