function Sidebar({ modules, activeModule, onSelectModule, collapsed, onToggleCollapse }) {
  return (
    <aside
      className={`flex min-h-screen flex-col justify-between rounded-[30px] border border-cyan-500/10 bg-[#0d0d0d]/95 p-4 shadow-[0_0_40px_rgba(0,0,0,0.25)] transition-all duration-300 ${
        collapsed ? 'w-20' : 'w-72'
      }`}
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-3 rounded-3xl border border-cyan-500/10 bg-[#090909]/90 px-3 py-3">
          <div className="flex items-center gap-3">
            <div className="h-3 w-3 rounded-full bg-cyan-400" />
            {!collapsed && <span className="text-sm uppercase tracking-[0.24em] text-cyan-200">Táctica</span>}
          </div>
          <button
            onClick={onToggleCollapse}
            className="inline-flex h-10 w-10 items-center justify-center rounded-3xl border border-cyan-500/20 bg-[#0a0a0a] text-cyan-200 transition hover:border-cyan-300/50"
            aria-label="Colapsar barra lateral"
          >
            <span className="text-lg">{collapsed ? '»' : '«'}</span>
          </button>
        </div>

        <nav className="flex flex-col gap-3">
          {modules.map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => onSelectModule(id)}
              className={`flex items-center gap-4 rounded-3xl border px-4 py-4 text-left transition ${
                activeModule === id
                  ? 'border-cyan-400 bg-[#061425] text-cyan-100 shadow-[0_0_25px_rgba(0,242,255,0.25)]'
                  : 'border-transparent bg-[#0c0c0c]/90 text-cyan-200 hover:border-cyan-300/40 hover:bg-[#08111a]'
              } ${collapsed ? 'justify-center px-3' : ''}`}
            >
              <Icon size={20} className={activeModule === id ? 'text-cyan-300' : 'text-cyan-200'} />
              {!collapsed && <span className="flex-1 text-sm uppercase tracking-[0.16em]">{label}</span>}
            </button>
          ))}
        </nav>
      </div>

      <div className="space-y-4">
        <div className="rounded-3xl border border-cyan-500/10 bg-[#091011]/90 p-4 text-sm text-slate-300">
          {!collapsed ? (
            <>
              <p className="font-medium uppercase tracking-[0.2em] text-cyan-200">Estatus</p>
              <p className="mt-2 text-xs">Operacional | En línea</p>
            </>
          ) : (
            <span className="block h-2 w-full rounded-full bg-cyan-400/20" />
          )}
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
