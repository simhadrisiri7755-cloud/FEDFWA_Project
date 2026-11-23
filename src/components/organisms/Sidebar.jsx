import { NavLink } from 'react-router-dom';
import Avatar from '../atoms/Avatar';
import Icon from '../atoms/Icon';
import ThemeToggle from '../molecules/ThemeToggle';
import useAuth from '../../hooks/useAuth';

const NAV = [
  { to: '/', label: 'Dashboard', icon: 'home', end: true },
  { to: '/employees', label: 'Employees', icon: 'users', roles: ['hr'] },
  { to: '/attendance', label: 'Attendance', icon: 'clock' },
  { to: '/leaves', label: 'Leave', icon: 'calendar' },
  { to: '/performance', label: 'Performance', icon: 'star', roles: ['hr'] },
  { to: '/payslips', label: 'Payslips', icon: 'card' },
  { to: '/profile', label: 'My profile', icon: 'user' },
];

export function BrandMark({ className = '' }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <img src="/favicon.svg" alt="" className="h-9 w-9 drop-shadow-[0_4px_10px_rgba(20,163,146,0.45)]" />
      <span className="text-xl font-extrabold tracking-tight">Staffly</span>
    </div>
  );
}

export default function Sidebar({ onNavigate }) {
  const { user, logout } = useAuth();
  const items = NAV.filter((item) => !item.roles || item.roles.includes(user.systemRole));

  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-linear-to-b from-[#0c2a26] via-sidebar to-[#071714] px-4 py-6 text-white">
      <div aria-hidden="true" className="pointer-events-none absolute -left-20 -top-24 h-64 w-64 rounded-full bg-brand-500/25 blur-3xl" />

      <BrandMark className="relative px-2" />

      <p className="relative mt-9 px-3 text-[0.6875rem] font-bold uppercase tracking-[0.16em] text-white/50">Workspace</p>
      <nav aria-label="Main" className="relative mt-3 flex-1">
        <ul className="space-y-1">
          {items.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.end}
                onClick={onNavigate}
                className={({ isActive }) =>
                  `spotlight spotlight-light group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-linear-to-r from-white/15 to-white/5 text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]'
                      : 'text-white/75 hover:translate-x-0.5 hover:bg-white/8 hover:text-white'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span
                      aria-hidden="true"
                      className={`absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-accent transition-all duration-200 ${
                        isActive ? 'opacity-100' : 'h-0 opacity-0'
                      }`}
                    />
                    <Icon name={item.icon} className={`h-[18px] w-[18px] transition-colors ${isActive ? 'text-[#7ee8d8]' : 'group-hover:text-[#7ee8d8]'}`} />
                    {item.label}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="spotlight spotlight-light relative mt-6 rounded-2xl bg-white/8 p-3 ring-1 ring-white/10 backdrop-blur">
        <div className="flex items-center gap-3">
          <Avatar name={user.name} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{user.name}</p>
            <p className="truncate text-xs text-white/70">{user.systemRole === 'hr' ? 'HR administrator' : user.jobTitle}</p>
          </div>
          <ThemeToggle onDark />
        </div>
        <button
          type="button"
          onClick={logout}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-white/20 px-3 py-2 text-sm font-semibold text-white/90 transition hover:bg-white/10"
        >
          <Icon name="logout" className="h-4 w-4" />
          Sign out
        </button>
      </div>
    </div>
  );
}
