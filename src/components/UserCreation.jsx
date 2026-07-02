import { useState } from 'react';

function UserCreation({ onUserCreated }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const apiBaseUrl = import.meta.env.VITE_API_URL || '/api';

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');
    setError('');

    const emailTrimmed = email.trim();

    if (!emailTrimmed || !password || !confirmPassword) {
      setError('Completa todos los campos.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');

      const res = await fetch(`${apiBaseUrl}/api/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ email: emailTrimmed, password })
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.message || 'Error creando usuario');
      }

      setMessage(`Usuario ${emailTrimmed} creado.`);
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      try { window.dispatchEvent(new CustomEvent('home-data-refresh')); } catch (e) {}
      try { window.dispatchEvent(new CustomEvent('system-audit-updated')); } catch (e) {}

      if (onUserCreated) onUserCreated();
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
            <p className="text-xs uppercase tracking-[0.28em] text-cyan-300">Gestión de accesos</p>
            <h3 className="mt-2 text-2xl font-semibold text-white">Crear credenciales de usuario</h3>
          </div>
          <span className="rounded-3xl bg-[#09191f]/90 px-3 py-2 text-xs uppercase tracking-[0.2em] text-cyan-200">Control interno</span>
        </div>

        <form className="grid gap-6 lg:grid-cols-2" onSubmit={handleSubmit}>
          <label className="space-y-2 text-sm text-slate-300">
            Correo institucional
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              className="w-full rounded-2xl border border-white/10 bg-[#0b1117]/90 px-4 py-3 text-white outline-none"
              required
            />
          </label>

          <label className="space-y-2 text-sm text-slate-300">
            Contraseña
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
              {loading ? 'Creando...' : 'Crear credenciales'}
            </button>
          </div>
        </form>

        {error && <p className="mt-4 rounded-2xl bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</p>}
        {message && <p className="mt-4 rounded-2xl bg-cyan-500/10 px-4 py-3 text-sm text-cyan-100">{message}</p>}
      </div>
    </section>
  );
}

export default UserCreation;

