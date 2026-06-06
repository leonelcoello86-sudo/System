import { useEffect, useState } from 'react';

const assetTypes = ['UAV', 'Personal', 'Vehículo'];
const statuses = ['Activo', 'Patrulla', 'Reserva', 'Mantenimiento'];

function ContentManagement() {
  const [asset, setAsset] = useState({ type: 'UAV', name: '', status: 'Activo', battery: '100' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(false);

  const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const fetchAssets = async () => {
    const token = localStorage.getItem('token');
    setLoading(true);
    try {
      const res = await fetch(`${apiBaseUrl}/api/assets`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.message || 'Error obteniendo assets');
      }
      const data = await res.json();
      setAssets(data.assets || []);
    } catch (e) {
      setError(String(e?.message || e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');
    setError('');

    const token = localStorage.getItem('token');

    const payload = {
      type: asset.type,
      name: asset.name,
      status: asset.status,
      battery: asset.battery
    };

    try {
      const res = await fetch(`${apiBaseUrl}/api/assets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.message || 'Error guardando asset');
      }

      setMessage(data?.message || 'Activo guardado');
      await fetchAssets();
    } catch (e) {
      setError(String(e?.message || e));
    }
  };

  return (
    <section className="space-y-6">
      <div className="rounded-[30px] border border-white/10 bg-[#06121c]/80 p-6 shadow-glass backdrop-blur-xl">
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-cyan-300">Gestión de Contenido</p>
            <h3 className="mt-2 text-2xl font-semibold text-white">Agregar / editar activos</h3>
          </div>
          <span className="rounded-3xl bg-[#09191f]/90 px-3 py-2 text-xs uppercase tracking-[0.2em] text-cyan-200">Base de datos lista</span>
        </div>

        <form className="grid gap-6 lg:grid-cols-2" onSubmit={handleSubmit}>
          <label className="space-y-2 text-sm text-slate-300">
            Tipo de Activo
            <select
              value={asset.type}
              onChange={(e) => setAsset({ ...asset, type: e.target.value })}
              className="w-full rounded-2xl border border-white/10 bg-[#0b1117]/90 px-4 py-3 text-white outline-none"
            >
              {assetTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </label>

          <label className="space-y-2 text-sm text-slate-300">
            Nombre / Identificador
            <input
              value={asset.name}
              onChange={(e) => setAsset({ ...asset, name: e.target.value })}
              placeholder="UAV-01, Alfa, Vehículo-3"
              className="w-full rounded-2xl border border-white/10 bg-[#0b1117]/90 px-4 py-3 text-white outline-none"
              required
            />
          </label>

          <label className="space-y-2 text-sm text-slate-300">
            Estado Operativo
            <select
              value={asset.status}
              onChange={(e) => setAsset({ ...asset, status: e.target.value })}
              className="w-full rounded-2xl border border-white/10 bg-[#0b1117]/90 px-4 py-3 text-white outline-none"
            >
              {statuses.map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </label>

          <label className="space-y-2 text-sm text-slate-300">
            Nivel de Batería
            <input
              type="number"
              value={asset.battery}
              onChange={(e) => setAsset({ ...asset, battery: e.target.value })}
              min="0"
              max="100"
              className="w-full rounded-2xl border border-white/10 bg-[#0b1117]/90 px-4 py-3 text-white outline-none"
            />
          </label>

          <div className="lg:col-span-2">
            <button
              type="submit"
              className="w-full rounded-2xl bg-cyan-400 px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#050505] transition hover:bg-cyan-300"
              disabled={loading}
            >
              {loading ? 'Sincronizando...' : 'Guardar activo'}
            </button>
          </div>
        </form>

        {message && <p className="mt-4 rounded-2xl bg-[#071417]/90 px-4 py-3 text-sm text-cyan-200">{message}</p>}
        {error && <p className="mt-4 rounded-2xl bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</p>}
      </div>

      <div className="rounded-[30px] border border-white/10 bg-[#06121c]/80 p-6 shadow-glass backdrop-blur-xl">
        <div className="mb-3">
          <p className="text-xs uppercase tracking-[0.28em] text-cyan-300">Activos actuales</p>
          <h3 className="mt-2 text-xl font-semibold text-white">{assets.length} registrados</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-white/10 text-sm text-slate-200">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left uppercase tracking-[0.2em] text-cyan-300">Nombre</th>
                <th className="px-4 py-3 text-left uppercase tracking-[0.2em] text-cyan-300">Tipo</th>
                <th className="px-4 py-3 text-left uppercase tracking-[0.2em] text-cyan-300">Estado</th>
                <th className="px-4 py-3 text-left uppercase tracking-[0.2em] text-cyan-300">Batería</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {assets.map((a) => (
                <tr key={a._id} className="hover:bg-white/5">
                  <td className="px-4 py-3 font-mono text-cyan-100">{a.name}</td>
                  <td className="px-4 py-3">{a.type}</td>
                  <td className="px-4 py-3">{a.status}</td>
                  <td className="px-4 py-3">{a.battery}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export default ContentManagement;

