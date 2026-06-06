import { useState } from 'react';

function Login({ onLoginSuccess }) {
  // Lectura simple desde localStorage (token) no necesaria aquí
  // Importante: el login se valida contra el backend, no contra credenciales hardcodeadas.

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    const trimmedEmail = email.trim();
    try {
      const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await fetch(`${apiBaseUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmedEmail, password })
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.message || 'Credenciales inválidas.');
        return;
      }

      const data = await res.json();
      // Persistencia simple (localStorage)
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      onLoginSuccess({
        email: data.user.email,
        role: data.user.role,
        isAdmin: data.user.role === 'admin'
      });
    } catch (err) {
      setError('Error conectando al servidor.');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(0,242,255,0.14),_transparent_40%),_#050505] px-4 py-8">
      <div className="w-full max-w-xl rounded-[28px] border border-white/10 bg-white/5 p-8 shadow-glass backdrop-blur-xl">
        <div className="mb-8 rounded-3xl border border-cyan-400/20 bg-[#08101a]/80 p-6 text-center shadow-[inset_0_0_40px_rgba(0,242,255,0.08)]">
          <p className="text-sm uppercase tracking-[0.35em] text-cyan-300">SISTEMA DE CONTROL TÁCTICO</p>
          <h1 className="mt-4 text-3xl font-semibold leading-tight text-white">ACCESO RESTRINGIDO</h1>
          <p className="mt-3 text-sm text-slate-300">Solo personal autorizado puede entrar al Dashboard Táctico.</p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="mb-3 block text-sm font-medium uppercase tracking-[0.15em] text-cyan-200" htmlFor="email">
              Correo Institucional
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="usuario@comando.mil.ve"
              className="w-full rounded-2xl border border-white/10 bg-[#0b1117]/90 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/20"
              required
            />
          </div>

          <div>
            <label className="mb-3 block text-sm font-medium uppercase tracking-[0.15em] text-cyan-200" htmlFor="password">
              Clave de Acceso
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="********"
              className="w-full rounded-2xl border border-white/10 bg-[#0b1117]/90 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/20"
              required
            />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            className="w-full rounded-2xl bg-cyan-400 px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#050505] transition hover:bg-cyan-300"
          >
            ACCEDER
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
