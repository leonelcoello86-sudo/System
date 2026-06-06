import ProfileMenu from './ProfileMenu.jsx';

function Header({ currentUser, currentTime, onSelectProfileAction, onLogout }) {
  return (
    <header className="flex flex-col gap-4 rounded-[30px] border border-white/10 bg-white/5 p-6 shadow-glass backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.3em] text-cyan-300">Operador Táctico</p>
        <h2 className="text-2xl font-semibold tracking-[0.02em] text-white">{currentUser?.email}</h2>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="rounded-3xl border border-cyan-300/20 bg-[#06121a]/90 px-4 py-3 text-sm text-cyan-100 shadow-[inset_0_0_20px_rgba(0,242,255,0.08)]">
          <p className="text-xs uppercase tracking-[0.28em] text-cyan-200">Reloj de Misión</p>
          <p className="mt-1 font-mono text-lg text-white">{currentTime}</p>
        </div>
        <ProfileMenu currentUser={currentUser} onSelectProfileAction={onSelectProfileAction} onLogout={onLogout} />
      </div>
    </header>
  );
}

export default Header;
