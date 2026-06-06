const assets = [
  { id: 'TX-09', status: 'Activo', battery: '94%' },
  { id: 'MK-23', status: 'Patrulla', battery: '78%' },
  { id: 'QZ-51', status: 'Reserva', battery: '62%' }
];

function TelemetryPanel() {
  return (
    <aside className="space-y-6 rounded-[30px] border border-white/10 bg-white/5 p-6 shadow-glass backdrop-blur-xl">
      <div className="mb-4 rounded-3xl border border-cyan-300/15 bg-[#08131a]/90 px-4 py-3 text-sm uppercase tracking-[0.18em] text-cyan-200">
        Telemetría de Activos
      </div>
      <div className="space-y-4">
        {assets.map((asset) => (
          <div key={asset.id} className="rounded-3xl border border-white/10 bg-[#06121c]/80 p-4 text-sm text-slate-200">
            <div className="flex items-center justify-between gap-4">
              <span className="font-semibold text-white">{asset.id}</span>
              <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs text-cyan-200">{asset.status}</span>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
              <span>Batería</span>
              <span className="font-mono text-white">{asset.battery}</span>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}

export default TelemetryPanel;
