import { createPortal } from 'react-dom';
import { useEffect, useRef, useState } from 'react';
import { ChevronDown, LogOut, UserCircle2 } from 'lucide-react';

function ProfileMenu({ currentUser, onSelectProfileAction, onLogout }) {
  const [open, setOpen] = useState(false);
  const [dropdownCoords, setDropdownCoords] = useState({ top: 0, left: 0, right: undefined, width: 360 });
  const menuRef = useRef(null);
  const buttonRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const clickedInsideMenu = menuRef.current?.contains(event.target);
      const clickedInsideDropdown = dropdownRef.current?.contains(event.target);

      if (!clickedInsideMenu && !clickedInsideDropdown) {
        setOpen(false);
      }
    };

    window.addEventListener('mousedown', handleClickOutside);
    return () => window.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const updatePosition = () => {
      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        const width = Math.min(360, window.innerWidth - 32);
        const top = rect.bottom + 8;
        let left = rect.left;
        let right;

        if (rect.left + width + 16 > window.innerWidth) {
          left = undefined;
          right = 16;
        }

        setDropdownCoords({ top, left, right, width });
      }
    };

    if (open) {
      updatePosition();
      window.addEventListener('resize', updatePosition);
      window.addEventListener('scroll', updatePosition, true);
    }

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [open]);

  const handleOptionClick = (action) => {
    setOpen(false);
    onSelectProfileAction(action);
  };

  return (
    <div className="relative overflow-visible" ref={menuRef}>
      <button
        type="button"
        ref={buttonRef}
        onClick={() => setOpen((prev) => !prev)}
        className="inline-flex items-center gap-2 rounded-3xl border border-cyan-300/20 bg-[#120f19]/90 px-4 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-cyan-100 transition hover:border-cyan-300/40"
      >
        <UserCircle2 size={18} />
        Perfil
        <ChevronDown size={18} className={`${open ? 'rotate-180' : ''} transition-transform`} />
      </button>

      {open && createPortal(
        <div
          ref={dropdownRef}
          className="fixed z-[999999] rounded-[30px] border border-white/10 bg-[#0a0c11]/95 p-5 shadow-[0_35px_120px_rgba(0,0,0,0.35)] backdrop-blur-xl"
          style={{
            top: dropdownCoords.top,
            left: dropdownCoords.left,
            right: dropdownCoords.right,
            width: dropdownCoords.width
          }}
        >
          <div className="mb-4 flex items-center justify-between gap-3 rounded-3xl border border-cyan-500/10 bg-[#06121b]/90 px-4 py-3 text-sm text-cyan-200">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-cyan-300">Administrador</p>
              <p className="mt-1 font-mono text-white">{currentUser.email}</p>
            </div>
            <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs uppercase tracking-[0.18em] text-cyan-200">Privilegios totales</span>
          </div>

          <div className="mb-4 grid grid-cols-1 gap-2">
            <button
              type="button"
              onClick={() => handleOptionClick('ADMIN_CRED')}
              className="rounded-3xl border border-white/10 bg-[#07131c]/90 px-4 py-3 text-left text-sm uppercase tracking-[0.18em] text-cyan-200 transition hover:border-cyan-300/40 hover:text-cyan-100"
            >
              Cambiar credenciales
            </button>
            <button
              type="button"
              onClick={() => handleOptionClick('USER_CREATE')}
              className="rounded-3xl border border-white/10 bg-[#07131c]/90 px-4 py-3 text-left text-sm uppercase tracking-[0.18em] text-cyan-200 transition hover:border-cyan-300/40 hover:text-cyan-100"
            >
              Crear nuevo usuario
            </button>
          </div>

          <div className="mt-4 rounded-3xl border border-white/10 bg-[#07101a]/90 p-4 text-sm text-slate-300">
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                onLogout();
              }}
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#120508] px-4 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-red-400 transition hover:bg-[#1e0d13]"
            >
              <LogOut size={16} />
              Cerrar sesión
            </button>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

export default ProfileMenu;
