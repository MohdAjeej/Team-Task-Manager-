import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut } from 'lucide-react';

function NavItem({ to, label, count, active, onClick, disabled }) {
  const base =
    'group flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-sm transition-colors duration-150 cursor-pointer';
  const state = disabled
    ? 'text-fog cursor-not-allowed'
    : active
    ? 'bg-orchid-tint text-orchid'
    : 'text-slate hover:bg-fog/30 hover:text-ink';

  const inner = (
    <>
      <span
        className={`w-1 h-1 rounded-full ${
          active ? 'bg-orchid' : disabled ? 'bg-fog' : 'bg-slate-soft'
        }`}
      />
      <span className="flex-1">{label}</span>
      {count !== undefined && count !== null && (
        <span className="font-mono text-[10px] tracking-micro text-slate">
          {String(count).padStart(2, '0')}
        </span>
      )}
    </>
  );

  if (disabled || !to) {
    return (
      <span className={`${base} ${state}`} onClick={onClick}>
        {inner}
      </span>
    );
  }
  return (
    <Link to={to} className={`${base} ${state}`} onClick={onClick}>
      {inner}
    </Link>
  );
}

export default function Layout() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');
  const initial = (user?.name || '?').trim().charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-cream eq-grain">
      <div className="grid grid-cols-[240px_1fr] min-h-screen">
        {/* === sidebar === */}
        <aside
          className="sticky top-0 h-screen border-r border-fog flex flex-col gap-8 px-5 py-7 bg-cream"
        >
          {/* brand */}
          <Link to="/dashboard" className="flex items-baseline gap-2">
            <span className="w-2 h-2 rounded-full bg-orchid -translate-y-0.5 inline-block" />
            <span className="serif-italic text-[26px] text-ink leading-none">Taskflow</span>
            <span className="font-mono text-[9px] uppercase tracking-micro text-slate ml-1">
              v1
            </span>
          </Link>

          {/* workspace */}
          <div className="flex flex-col gap-1">
            <div className="font-mono text-[10px] uppercase tracking-micro text-slate-soft px-2.5 pb-2">
              Workspace
            </div>
            <NavItem to="/dashboard" label="Dashboard" active={isActive('/dashboard')} />
            <NavItem to="/projects" label="Projects" active={isActive('/projects')} />
            <NavItem to="/my-tasks" label="My Tasks" active={isActive('/my-tasks')} />
            <NavItem to="/team" label="Team" active={isActive('/team')} />
          </div>

          {/* insights */}
          <div className="flex flex-col gap-1">
            <div className="font-mono text-[10px] uppercase tracking-micro text-slate-soft px-2.5 pb-2">
              Insights
            </div>
            <NavItem label="Velocity" disabled />
            <NavItem label="Overdue" disabled />
            <NavItem label="Archive" disabled />
          </div>

          {/* user card */}
          <div className="mt-auto flex flex-col gap-3">
            <hr className="eq-rule-soft" />
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-orchid flex items-center justify-center serif-italic text-cloud text-base">
                {initial}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-medium text-ink truncate">
                  {user?.name || 'You'}
                </div>
                <div className="font-mono text-[9px] uppercase tracking-micro text-slate">
                  {user?.role || 'Member'}
                </div>
              </div>
              <button
                onClick={logout}
                title="Sign out"
                className="text-slate hover:text-revops-red transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </aside>

        {/* === main === */}
        <main className="px-12 py-8 max-w-[1280px]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
