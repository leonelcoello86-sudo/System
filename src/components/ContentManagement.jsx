import { useEffect, useState } from 'react';

const assetTypes = ['UAV', 'Personal', 'Vehículo'];
const statuses = ['Activo', 'Patrulla', 'Reserva', 'Mantenimiento'];

const defaultAsset = {
  type: 'UAV',
  name: '',
  status: 'Activo',
  battery: '100',
  fuel: '100',
  personnel: '1',
  latitude: '10.4806',
  longitude: '-66.9036'
};

function ContentManagement() {
  const [asset, setAsset] = useState(defaultAsset);
  const [editingAssetId, setEditingAssetId] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(false);

  const apiBaseUrl = import.meta.env.VITE_API_URL || '/api';

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

  const resetForm = () => {
    setAsset(defaultAsset);
    setEditingAssetId(null);
    setMessage('');
    setError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');
    setError('');

    const token = localStorage.getItem('token');
    const payload = {
      type: asset.type,
      name: asset.name.trim(),
      status: asset.status,
      latitude: asset.latitude,
      longitude: asset.longitude,
      battery: asset.type === 'UAV' ? asset.battery : undefined,
      fuel: asset.type === 'Vehículo' ? asset.fuel : undefined,
      personnel: asset.type === 'Personal' ? asset.personnel : undefined
    };

    try {
      const url = editingAssetId ? `${apiBaseUrl}/api/assets/${editingAssetId}` : `${apiBaseUrl}/api/assets`;
      const method = editingAssetId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(data?.message || 'Error guardando activo');
      }

      setMessage(data?.message || 'Activo guardado');
      await fetchAssets();
      resetForm();
    } catch (e) {
      setError(String(e?.message || e));
    }
  };

  const handleEdit = (assetItem) => {
    setEditingAssetId(assetItem._id);
    setAsset({
      type: assetItem.type,
      name: assetItem.name,
      status: assetItem.status,
      battery: assetItem.battery?.toString() ?? '100',
      fuel: assetItem.fuel?.toString() ?? '100',
      personnel: assetItem.personnel?.toString() ?? '1',
      latitude: assetItem.latitude?.toString() ?? '10.4806',
      longitude: assetItem.longitude?.toString() ?? '-66.9036'
    });
    setMessage('');
    setError('');
  };

  const handleDelete = async (assetId) => {
    const token = localStorage.getItem('token');
    setMessage('');
    setError('');
    try {
      const res = await fetch(`${apiBaseUrl}/api/assets/${assetId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(data?.message || 'Error eliminando activo');
      }
      setMessage(data?.message || 'Activo eliminado');
      await fetchAssets();
      if (editingAssetId === assetId) resetForm();
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
              onChange={(e) => setAsset({
                ...asset,
                type: e.target.value,
                battery: e.target.value === 'Vehículo' ? '100' : asset.battery,
                fuel: e.target.value === 'UAV' ? '100' : asset.fuel,
                personnel: e.target.value === 'Personal' ? '1' : asset.personnel
              })}
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
            Latitud
            <input
              type="text"
              value={asset.latitude}
              onChange={(e) => setAsset({ ...asset, latitude: e.target.value })}
              placeholder="10.6644 o 10,6644"
              className="w-full rounded-2xl border border-white/10 bg-[#0b1117]/90 px-4 py-3 text-white outline-none"
              required
            />
          </label>

          <label className="space-y-2 text-sm text-slate-300">
            Longitud
            <input
              type="text"
              value={asset.longitude}
              onChange={(e) => setAsset({ ...asset, longitude: e.target.value })}
              placeholder="-69.6675 o -69,6675"
              className="w-full rounded-2xl border border-white/10 bg-[#0b1117]/90 px-4 py-3 text-white outline-none"
              required
            />
          </label>

          {asset.type === 'UAV' && (
            <label className="space-y-2 text-sm text-slate-300">
              Nivel de Batería (%)
              <input
                type="number"
                value={asset.battery}
                onChange={(e) => setAsset({ ...asset, battery: e.target.value })}
                min="0"
                max="100"
                className="w-full rounded-2xl border border-white/10 bg-[#0b1117]/90 px-4 py-3 text-white outline-none"
                required
              />
            </label>
          )}

          {asset.type === 'Vehículo' && (
            <label className="space-y-2 text-sm text-slate-300">
              Combustible (%)
              <input
                type="number"
                value={asset.fuel}
                onChange={(e) => setAsset({ ...asset, fuel: e.target.value })}
                min="0"
                max="100"
                className="w-full rounded-2xl border border-white/10 bg-[#0b1117]/90 px-4 py-3 text-white outline-none"
                required
              />
            </label>
          )}

          {asset.type === 'Personal' && (
            <label className="space-y-2 text-sm text-slate-300">
              Número de efectivos
              <input
                type="number"
                value={asset.personnel}
                onChange={(e) => setAsset({ ...asset, personnel: e.target.value })}
                min="1"
                className="w-full rounded-2xl border border-white/10 bg-[#0b1117]/90 px-4 py-3 text-white outline-none"
                required
              />
            </label>
          )}

          <div className="lg:col-span-2 flex flex-col gap-3">
            <button
              type="submit"
              className="w-full rounded-2xl bg-cyan-400 px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#050505] transition hover:bg-cyan-300"
              disabled={loading}
            >
              {loading ? 'Sincronizando...' : editingAssetId ? 'Actualizar activo' : 'Guardar activo'}
            </button>
            {editingAssetId && (
              <button
                type="button"
                onClick={resetForm}
                className="w-full rounded-2xl border border-white/10 bg-[#0b1117]/90 px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-slate-200 transition hover:bg-white/5"
              >
                Cancelar edición
              </button>
            )}
          </div>
        </form>

        {message && <p className="mt-4 rounded-2xl bg-[#071417]/90 px-4 py-3 text-sm text-cyan-200">{message}</p>}
        {error && <p className="mt-4 rounded-2xl bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</p>}
      </div>

      <div className="rounded-[30px] border border-white/10 bg-[#06121c]/80 p-6 shadow-glass backdrop-blur-xl">
        <div className="mb-3 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-cyan-300">Activos actuales</p>
            <h3 className="mt-2 text-xl font-semibold text-white">{assets.length} registrados</h3>
          </div>
          <span className="rounded-3xl bg-[#09191f]/90 px-3 py-2 text-xs uppercase tracking-[0.2em] text-cyan-200">Actualiza el activo para ver cambios</span>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-white/10 text-sm text-slate-200">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left uppercase tracking-[0.2em] text-cyan-300">Nombre</th>
                <th className="px-4 py-3 text-left uppercase tracking-[0.2em] text-cyan-300">Tipo</th>
                <th className="px-4 py-3 text-left uppercase tracking-[0.2em] text-cyan-300">Estado</th>
                <th className="px-4 py-3 text-left uppercase tracking-[0.2em] text-cyan-300">Ubicación</th>
                <th className="px-4 py-3 text-left uppercase tracking-[0.2em] text-cyan-300">Detalle</th>
                <th className="px-4 py-3 text-left uppercase tracking-[0.2em] text-cyan-300">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {assets.map((a) => (
                <tr key={a._id} className="hover:bg-white/5">
                  <td className="px-4 py-3 font-mono text-cyan-100">{a.name}</td>
                  <td className="px-4 py-3">{a.type}</td>
                  <td className="px-4 py-3">{a.status}</td>
                  <td className="px-4 py-3">{a.latitude?.toFixed(4)}, {a.longitude?.toFixed(4)}</td>
                  <td className="px-4 py-3">
                    {a.type === 'UAV' && `Batería ${a.battery ?? 'N/A'}%`}
                    {a.type === 'Vehículo' && `Combustible ${a.fuel ?? 'N/A'}%`}
                    {a.type === 'Personal' && `Efectivos ${a.personnel ?? 'N/A'}`}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => handleEdit(a)}
                        className="rounded-2xl bg-cyan-500/10 px-3 py-2 text-xs text-cyan-200 transition hover:bg-cyan-500/20"
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(a._id)}
                        className="rounded-2xl bg-red-500/10 px-3 py-2 text-xs text-red-300 transition hover:bg-red-500/20"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
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

