const eventLogs = [
  { time: '08:15:12', message: 'Enlace de comando establecido con Unidad TX-09.' },
  { time: '08:17:44', message: 'Alerta de intrusión en sector bravo, análisis en curso.' },
  { time: '08:19:03', message: 'Estado de batería recibido de MK-23: 78%.' },
  { time: '08:20:28', message: 'Sistema de vigilancia activo en cuadrante 7.' }
];

function LogsPanel() {
  return (
    <section className="rounded-[30px] border border-white/10 bg-white/5 p-6 shadow-glass backdrop-blur-xl">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-cyan-300">Logs de Eventos</p>
          <h3 className="mt-2 text-xl font-semibold text-white">Actividad en tiempo real</h3>
        </div>
        <span className="rounded-3xl bg-[#09191f]/90 px-3 py-2 text-xs uppercase tracking-[0.2em] text-cyan-200">Últimos 4 eventos</span>
      </div>
      <div className="space-y-4">
        {eventLogs.map((event) => (
          <div key={event.time} className="rounded-3xl border border-white/10 bg-[#06121c]/80 px-4 py-4 text-sm text-slate-200">
            <div className="flex items-center justify-between gap-4">
              <span className="font-mono text-cyan-200">[{event.time}]</span>
              <p className="text-sm text-slate-300">{event.message}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default LogsPanel;
