import { useEffect, useState } from 'react';

function AccessLog() {
  const [entries, setEntries] = useState([]);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);

  const PAGE_SIZE = 10;

  useEffect(() => {
    const token = localStorage.getItem('token');
    const apiBaseUrl = import.meta.env.VITE_API_URL || '/api';

    fetch(`${apiBaseUrl}/api/access-logs`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(async (res) => {
        if (!res.ok) {
          const data = await res.json().catch(() => null);
          throw new Error(data?.message || 'Error cargando access logs');
        }
        return res.json();
      })
      .then((data) => {
        setEntries(data.logs || []);
      })
      .catch((e) => setError(String(e?.message || e)));
  }, []);

  useEffect(() => {
    setPage(0);
  }, [entries.length]);

  const visibleEntries = entries.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  return (
    <section className="rounded-[30px] border border-white/10 bg-[#06121c]/80 p-6 shadow-glass backdrop-blur-xl">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-cyan-300">Bitácora de Acceso</p>
          <h3 className="mt-2 text-2xl font-semibold text-white">Historial de logins</h3>
        </div>
        <span className="rounded-3xl bg-[#09191f]/90 px-3 py-2 text-xs uppercase tracking-[0.2em] text-cyan-200">Registro en vivo</span>
      </div>

      {error && <p className="mb-4 rounded-2xl bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</p>}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-white/10 text-sm text-slate-200">
          <thead>
            <tr>
              <th className="whitespace-nowrap px-4 py-3 text-left uppercase tracking-[0.2em] text-cyan-300">IP</th>
              <th className="whitespace-nowrap px-4 py-3 text-left uppercase tracking-[0.2em] text-cyan-300">Usuario</th>
              <th className="whitespace-nowrap px-4 py-3 text-left uppercase tracking-[0.2em] text-cyan-300">Fecha</th>
              <th className="whitespace-nowrap px-4 py-3 text-left uppercase tracking-[0.2em] text-cyan-300">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {visibleEntries.map((entry, index) => (
              <tr key={index} className="hover:bg-white/5">
                <td className="whitespace-nowrap px-4 py-3 font-mono text-cyan-100">{entry.ip}</td>
                <td className="px-4 py-3">{entry.user}</td>
                <td className="px-4 py-3">{entry.date ? new Date(entry.date).toLocaleString('es-VE') : ''}</td>
                <td className={`px-4 py-3 font-semibold ${entry.status === 'Concedido' ? 'text-cyan-300' : 'text-red-400'}`}>
                  {entry.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
          Página {page + 1} / {Math.max(1, Math.ceil(entries.length / PAGE_SIZE))}
        </div>

        <button
          type="button"
          onClick={() => setPage((p) => p + 1)}
          disabled={page >= Math.max(0, Math.ceil(entries.length / PAGE_SIZE) - 1)}
          className="rounded-2xl bg-cyan-400 px-4 py-2 text-sm font-semibold text-[#050505] disabled:opacity-40"
        >
          Siguiente
        </button>
      </div>
    </section>
  );
}

export default AccessLog;

