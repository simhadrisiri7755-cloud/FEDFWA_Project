import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

/** Guards nested routes: redirects guests to /login, and users without a matching role to the dashboard. */
export default function ProtectedRoute({ roles }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
  if (roles && !roles.includes(user.systemRole)) return <Navigate to="/" replace />;
  return <Outlet />;
}
