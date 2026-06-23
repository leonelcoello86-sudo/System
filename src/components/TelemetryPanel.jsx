function TelemetryPanel({ assets = [], loading, error }) {
  return (
    <aside className="space-y-6 rounded-[30px] border border-white/10 bg-white/5 p-6 shadow-glass backdrop-blur-xl">
      <div className="mb-4 rounded-3xl border border-cyan-300/15 bg-[#08131a]/90 px-4 py-3 text-sm uppercase tracking-[0.18em] text-cyan-200">
        Telemetría de Activos
      </div>
      {loading && <p className="text-sm text-slate-300">Cargando telemetría...</p>}
      {error && <p className="text-sm text-red-300">{error}</p>}
      {!loading && !error && assets.length === 0 && (
        <p className="text-sm text-slate-300">No hay activos cargados. Agrega uno desde Gestión de Contenido.</p>
      )}
      <div className="space-y-4">
        {assets.map((asset) => (
          <div key={asset._id} className="rounded-3xl border border-white/10 bg-[#06121c]/80 p-4 text-sm text-slate-200">
            <div className="flex items-center justify-between gap-4">
              <span className="font-semibold text-white">{asset.name}</span>
              <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs text-cyan-200">{asset.status}</span>
            </div>
            <div className="mt-3 grid gap-2 text-xs text-slate-400">
              <div className="flex items-center justify-between">
                <span>Tipo</span>
                <span className="font-mono text-white">{asset.type}</span>
              </div>
              {asset.type === 'UAV' && (
                <div className="flex items-center justify-between">
                  <span>Batería</span>
                  <span className="font-mono text-white">{asset.battery ?? 'N/A'}%</span>
                </div>
              )}
              {asset.type === 'Vehículo' && (
                <div className="flex items-center justify-between">
                  <span>Combustible</span>
                  <span className="font-mono text-white">{asset.fuel ?? 'N/A'}%</span>
                </div>
              )}
              {asset.type === 'Personal' && (
                <div className="flex items-center justify-between">
                  <span>Efectivos</span>
                  <span className="font-mono text-white">{asset.personnel ?? 'N/A'}</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span>Ubicación</span>
                <span className="font-mono text-white">{asset.latitude?.toFixed(4) ?? '-'}, {asset.longitude?.toFixed(4) ?? '-'}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}

export default TelemetryPanel;
