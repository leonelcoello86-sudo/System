import { useState } from 'react';

function AdminCredentials() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const apiBaseUrl = import.meta.env.VITE_API_URL || '/api';

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');
    setError('');

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('Completa todos los campos.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');

      const res = await fetch(`${apiBaseUrl}/api/admin/admin-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ currentPassword, newPassword, confirmPassword })
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.message || 'Error actualizando credenciales');
      }

      setMessage(data?.message || 'Credenciales administrativas actualizadas.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      try { window.dispatchEvent(new CustomEvent('home-data-refresh')); } catch (e) {}
      try { window.dispatchEvent(new CustomEvent('system-audit-updated')); } catch (e) {}
    } catch (e) {
      setError(String(e?.message || e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="space-y-6">
      <div className="rounded-[30px] border border-white/10 bg-[#06121c]/80 p-6 shadow-glass backdrop-blur-xl">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-cyan-300">Perfil administrativo</p>
            <h3 className="mt-2 text-2xl font-semibold text-white">Actualizar credenciales</h3>
          </div>
          <span className="rounded-3xl bg-[#09191f]/90 px-3 py-2 text-xs uppercase tracking-[0.2em] text-cyan-200">Acceso restringido</span>
        </div>

        <form className="grid gap-6 lg:grid-cols-2" onSubmit={handleSubmit}>
          <label className="space-y-2 text-sm text-slate-300">
            Contraseña actual
            <input
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              type="password"
              className="w-full rounded-2xl border border-white/10 bg-[#0b1117]/90 px-4 py-3 text-white outline-none"
              required
            />
          </label>

          <label className="space-y-2 text-sm text-slate-300">
            Nueva contraseña
            <input
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              type="password"
              className="w-full rounded-2xl border border-white/10 bg-[#0b1117]/90 px-4 py-3 text-white outline-none"
              required
            />
          </label>

          <label className="space-y-2 text-sm text-slate-300">
            Confirmar contraseña
            <input
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              type="password"
              className="w-full rounded-2xl border border-white/10 bg-[#0b1117]/90 px-4 py-3 text-white outline-none"
              required
            />
          </label>

          <div className="lg:col-span-2">
            <button
              type="submit"
              className="w-full rounded-2xl bg-cyan-400 px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#050505] transition hover:bg-cyan-300"
              disabled={loading}
            >
              {loading ? 'Actualizando...' : 'Guardar credenciales'}
            </button>
          </div>
        </form>

        {error && <p className="mt-4 rounded-2xl bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</p>}
        {message && <p className="mt-4 rounded-2xl bg-cyan-500/10 px-4 py-3 text-sm text-cyan-100">{message}</p>}
      </div>
    </section>
  );
}

export default AdminCredentials;

