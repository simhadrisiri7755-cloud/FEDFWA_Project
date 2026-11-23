import { Suspense, useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Drawer from '@mui/material/Drawer';
import Icon from '../atoms/Icon';
import { PageSkeleton } from '../atoms/Skeleton';
import ThemeToggle from '../molecules/ThemeToggle';
import ErrorBoundary from '../organisms/ErrorBoundary';
import Sidebar, { BrandMark } from '../organisms/Sidebar';
import { fetchEmployees } from '../../store/employeesSlice';
import { fetchLeaves } from '../../store/leavesSlice';
import { fetchAttendance } from '../../store/attendanceSlice';
import { formatLongDate, todayISO } from '../../utils/date';

/** Shell for every signed-in page: sidebar (drawer on mobile), top bar, skip link, and the routed content area. */
export default function AppLayout() {
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchEmployees());
    dispatch(fetchLeaves());
    dispatch(fetchAttendance());
  }, [dispatch]);

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[17.5rem_1fr]">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-xl focus:bg-card focus:px-4 focus:py-2 focus:font-semibold focus:text-link focus:shadow-pop"
      >
        Skip to main content
      </a>

      <aside aria-label="Sidebar" className="no-print sticky top-0 hidden h-screen lg:block">
        <Sidebar />
      </aside>

      <div className="flex min-w-0 flex-col">
        {/* Mobile bar */}
        <header className="no-print sticky top-0 z-20 flex items-center justify-between bg-sidebar/95 px-4 py-3 text-white backdrop-blur lg:hidden">
          <BrandMark />
          <div className="flex items-center gap-1">
            <ThemeToggle onDark />
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              aria-label="Open navigation menu"
              aria-expanded={drawerOpen}
              className="rounded-xl p-2 transition hover:bg-white/10"
            >
              <Icon name="menu" className="h-6 w-6" />
            </button>
          </div>
        </header>

        {/* Desktop bar */}
        <div className="no-print sticky top-0 z-10 hidden items-center justify-between border-b border-line bg-surface/80 px-8 py-3.5 backdrop-blur-xl lg:flex">
          <p className="flex items-center gap-2 text-sm font-semibold text-muted">
            <Icon name="calendar" className="h-4 w-4" />
            <time dateTime={todayISO()}>{formatLongDate(todayISO())}</time>
          </p>
          <ThemeToggle />
        </div>

        <main id="main" className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-8 sm:py-10">
          {/* key={pathname}: a crashed page recovers as soon as the user navigates elsewhere */}
          <ErrorBoundary key={pathname}>
            <Suspense fallback={<PageSkeleton />}>
              <Outlet />
            </Suspense>
          </ErrorBoundary>
        </main>
      </div>

      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        slotProps={{ paper: { sx: { width: 288, backgroundColor: '#0a1f1c' } } }}
        sx={{ display: { lg: 'none' } }}
      >
        <Sidebar onNavigate={() => setDrawerOpen(false)} />
      </Drawer>
    </div>
  );
}
