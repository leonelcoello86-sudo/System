function MapPlaceholder() {
  return (
    <section className="rounded-[30px] border border-white/10 bg-[#06121c]/80 p-6 shadow-glass backdrop-blur-xl">
      <div className="flex h-[520px] flex-col items-center justify-center rounded-3xl border border-cyan-300/10 bg-[#0b1921]/70 text-center text-slate-200 shadow-[inset_0_0_40px_rgba(0,242,255,0.08)]">
        <p className="text-sm uppercase tracking-[0.35em] text-cyan-300">Sistema de Mapa</p>
        <h3 className="mt-4 text-3xl font-semibold text-white">MAPA RADAR ACTIVO</h3>
        <p className="mt-3 max-w-xs text-sm text-slate-400">Panel de control táctico en espera de integración GIS y telemetría en tiempo real.</p>
      </div>
    </section>
  );
}

export default MapPlaceholder;
