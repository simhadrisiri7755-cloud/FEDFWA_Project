import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import AppLayout from './components/templates/AppLayout';
import ProtectedRoute from './components/organisms/ProtectedRoute';
import ErrorBoundary from './components/organisms/ErrorBoundary';
import { PageSkeleton } from './components/atoms/Skeleton';
import CursorAura from './components/atoms/CursorAura';

// Route-level code splitting: each page is its own chunk, downloaded on first visit.
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Employees = lazy(() => import('./pages/Employees'));
const EmployeeEditor = lazy(() => import('./pages/EmployeeEditor'));
const Attendance = lazy(() => import('./pages/Attendance'));
const Leaves = lazy(() => import('./pages/Leaves'));
const Performance = lazy(() => import('./pages/Performance'));
const Payslips = lazy(() => import('./pages/Payslips'));
const Profile = lazy(() => import('./pages/Profile'));
const NotFound = lazy(() => import('./pages/NotFound'));

export default function App() {
  return (
    <ErrorBoundary>
      <CursorAura />
      <Suspense fallback={<div className="p-8"><PageSkeleton /></div>}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="attendance" element={<Attendance />} />
              <Route path="leaves" element={<Leaves />} />
              <Route path="payslips" element={<Payslips />} />
              <Route path="profile" element={<Profile />} />

              {/* HR-only area */}
              <Route element={<ProtectedRoute roles={['hr']} />}>
                <Route path="employees" element={<Employees />} />
                <Route path="employees/new" element={<EmployeeEditor />} />
                <Route path="employees/:id/edit" element={<EmployeeEditor />} />
                <Route path="performance" element={<Performance />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFound standalone />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}
