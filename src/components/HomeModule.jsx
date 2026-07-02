import { useEffect, useState } from 'react';
import { Database, ShieldAlert, Clock3 } from 'lucide-react';

function HomeModule() {
  const [assetsCount, setAssetsCount] = useState(0);
  const [todayAccessLogs, setTodayAccessLogs] = useState([]);
  const [todayAudits, setTodayAudits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const apiBaseUrl = import.meta.env.VITE_API_URL || '/api';

    async function loadHomeData() {
      setLoading(true);
      setError('');
      try {
        const [assetsRes, logsRes, auditsRes] = await Promise.all([
          fetch(`${apiBaseUrl}/api/assets`, {
            method: 'GET',
            cache: 'no-store',
            headers: { Authorization: `Bearer ${token}`, 'Cache-Control': 'no-cache' }
          }),
          fetch(`${apiBaseUrl}/api/access-logs?today=true`, {
            method: 'GET',
            cache: 'no-store',
            headers: { Authorization: `Bearer ${token}`, 'Cache-Control': 'no-cache' }
          }),
          fetch(`${apiBaseUrl}/api/system-audit?today=true`, {
            method: 'GET',
            cache: 'no-store',
            headers: { Authorization: `Bearer ${token}`, 'Cache-Control': 'no-cache' }
          })
        ]);

        const assetsData = await assetsRes.json().catch(() => ({}));
        const logsData = await logsRes.json().catch(() => ({}));
        const auditsData = await auditsRes.json().catch(() => ({}));

        if (!assetsRes.ok) throw new Error(assetsData?.message || 'Error obteniendo activos');
        if (!logsRes.ok) throw new Error(logsData?.message || 'Error obteniendo bitácora');
        if (!auditsRes.ok) throw new Error(auditsData?.message || 'Error obteniendo auditoría');

        setAssetsCount(Array.isArray(assetsData.assets) ? assetsData.assets.length : 0);
        setTodayAccessLogs(Array.isArray(logsData.logs) ? logsData.logs : []);
        setTodayAudits(Array.isArray(auditsData.audits) ? auditsData.audits : []);
      } catch (err) {
        setError(String(err?.message || err));
      } finally {
        setLoading(false);
      }
    }

    loadHomeData();

    const refreshHomeData = () => {
      loadHomeData();
    };

    const systemAuditListener = () => refreshHomeData();
    const accessLogListener = () => refreshHomeData();

    window.addEventListener('system-audit-updated', systemAuditListener);
    window.addEventListener('access-log-updated', accessLogListener);

    const interval = setInterval(() => {
      loadHomeData();
    }, 10000);

    return () => {
      window.removeEventListener('system-audit-updated', systemAuditListener);
      window.removeEventListener('access-log-updated', accessLogListener);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="space-y-6">
      <section className="rounded-[30px] border border-white/10 bg-[#06121c]/80 p-6 shadow-glass backdrop-blur-xl">
        <div className="mb-8 flex items-center justify-between gap-4 rounded-[30px] border border-white/10 bg-[#0b1320]/90 p-6 shadow-[inset_0_0_30px_rgba(0,242,255,0.06)]">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-cyan-300">Inicio</p>
            <h2 className="mt-3 text-3xl font-semibold text-white">Resumen del día</h2>
            <p className="mt-3 text-sm leading-6 text-slate-400">Vistas rápidas de los activos registrados, la bitácora de accesos y los eventos de auditoría de hoy.</p>
          </div>
          <span className="rounded-3xl bg-[#09191f]/90 px-3 py-2 text-xs uppercase tracking-[0.2em] text-cyan-200">Hoy</span>
        </div>

        {error && <p className="mb-4 rounded-2xl bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</p>}

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-[30px] border border-white/10 bg-[#0b1320]/90 p-6 shadow-[inset_0_0_30px_rgba(0,242,255,0.06)]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-cyan-300">Activos totales</p>
                <p className="mt-3 text-5xl font-semibold text-white">{loading ? '...' : assetsCount}</p>
              </div>
              <div className="rounded-3xl bg-cyan-500/10 p-4 text-cyan-300">
                <Database size={24} />
              </div>
            </div>
            <p className="mt-6 text-sm text-slate-400">Cantidad de activos registrados en el módulo de gestión de contenido.</p>
          </div>

          <div className="rounded-[30px] border border-white/10 bg-[#0b1320]/90 p-6 shadow-[inset_0_0_30px_rgba(0,242,255,0.06)]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-cyan-300">Bitácora</p>
                <p className="mt-3 text-5xl font-semibold text-white">{loading ? '...' : todayAccessLogs.length}</p>
              </div>
              <div className="rounded-3xl bg-indigo-500/10 p-4 text-indigo-300">
                <Clock3 size={24} />
              </div>
            </div>
            <p className="mt-6 text-sm text-slate-400">Registros de acceso del día desde el módulo de bitácora.</p>
          </div>

          <div className="rounded-[30px] border border-white/10 bg-[#0b1320]/90 p-6 shadow-[inset_0_0_30px_rgba(0,242,255,0.06)]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-cyan-300">Auditoría</p>
                <p className="mt-3 text-5xl font-semibold text-white">{loading ? '...' : todayAudits.length}</p>
              </div>
              <div className="rounded-3xl bg-emerald-500/10 p-4 text-emerald-300">
                <ShieldAlert size={24} />
              </div>
            </div>
            <p className="mt-6 text-sm text-slate-400">Eventos de auditoría del día registrados en el módulo correspondiente.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomeModule;
