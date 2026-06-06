import MapPlaceholder from './MapPlaceholder.jsx';
import TelemetryPanel from './TelemetryPanel.jsx';

function MapView() {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[2.2fr_0.8fr] xl:grid-cols-[2.6fr_0.6fr]">
        <MapPlaceholder />
        <TelemetryPanel />
      </div>
      <section className="rounded-[30px] border border-white/10 bg-[#06121c]/80 p-6 shadow-glass backdrop-blur-xl">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-cyan-300">Panel de Misión</p>
              <h3 className="mt-2 text-xl font-semibold text-white">Resumen táctico</h3>
            </div>
            <span className="rounded-3xl bg-[#09191f]/90 px-3 py-2 text-xs uppercase tracking-[0.2em] text-cyan-200">Activo</span>
          </div>
          <p className="text-sm leading-6 text-slate-300">
            El módulo Mapa integra telemetría de activos en tiempo real y proporciona el acceso inmediato al sistema de control táctico. Los datos de ubicación están listos para su integración con la base de datos MongoDB.
          </p>
        </div>
      </section>
    </div>
  );
}

export default MapView;
