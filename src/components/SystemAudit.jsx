import { useEffect, useState } from 'react';

function SystemAudit() {
  const [audits, setAudits] = useState([]);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);

  const PAGE_SIZE = 10;

  useEffect(() => {
    const token = localStorage.getItem('token');
    const apiBaseUrl = import.meta.env.VITE_API_URL || '/api';

    fetch(`${apiBaseUrl}/api/system-audit`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(async (res) => {
        if (!res.ok) {
          const data = await res.json().catch(() => null);
          throw new Error(data?.message || 'Error obteniendo system audit');
        }
        return res.json();
      })
      .then((data) => {
        setAudits(data.audits || []);
      })
      .catch((e) => setError(String(e?.message || e)));
  }, []);

  useEffect(() => {
    setPage(0);
  }, [audits.length]);

  const visibleAudits = audits.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  return (
    <section className="rounded-[30px] border border-white/10 bg-[#06121c]/80 p-6 shadow-glass backdrop-blur-xl">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-cyan-300">Auditoría de Sistema</p>
          <h3 className="mt-2 text-2xl font-semibold text-white">Registro de acciones críticas</h3>
        </div>
        <span className="rounded-3xl bg-[#09191f]/90 px-3 py-2 text-xs uppercase tracking-[0.2em] text-cyan-200">Seguridad</span>
      </div>

      {error && <p className="mb-4 rounded-2xl bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</p>}

      <div className="space-y-4">
        {visibleAudits.map((entry, index) => (
          <div
            key={entry._id || index}
            className="rounded-3xl border border-white/10 bg-[#0b1320]/90 px-5 py-4 text-sm text-slate-200 shadow-[inset_0_0_20px_rgba(0,242,255,0.05)]"
          >
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <span className="font-mono text-cyan-300">[{entry.time}]</span>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  entry.severity === 'Crítico'
                    ? 'bg-red-500/15 text-red-300'
                    : entry.severity === 'Alerta'
                      ? 'bg-cyan-500/10 text-cyan-200'
                      : 'bg-cyan-500/10 text-cyan-200'
                }`}
              >
                {entry.severity}
              </span>
            </div>
            <p className="mt-3 text-sm text-slate-300">{entry.event}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setPage((p) => Math.max(0, p - 1))}
          disabled={page <= 0}
          className="rounded-2xl bg-[#0b1117]/90 px-4 py-2 text-sm font-semibold text-slate-200 disabled:opacity-40"
        >
          Atrás
        </button>

        <div className="text-sm text-slate-400">
          Página {page + 1} / {Math.max(1, Math.ceil(audits.length / PAGE_SIZE))}
        </div>

        <button
          type="button"
          onClick={() => setPage((p) => p + 1)}
          disabled={page >= Math.max(0, Math.ceil(audits.length / PAGE_SIZE) - 1)}
          className="rounded-2xl bg-cyan-400 px-4 py-2 text-sm font-semibold text-[#050505] disabled:opacity-40"
        >
          Siguiente
        </button>
      </div>
    </section>
  );
}

export default SystemAudit;

