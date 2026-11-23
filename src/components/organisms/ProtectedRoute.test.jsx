import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import { AuthContext } from '../../context/AuthContext';

const renderAt = (path, user) =>
  render(
    <AuthContext.Provider value={{ user }}>
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route path="/login" element={<p>Login page</p>} />
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<p>Dashboard</p>} />
            <Route element={<ProtectedRoute roles={['hr']} />}>
              <Route path="/employees" element={<p>Employees page</p>} />
            </Route>
          </Route>
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>,
  );

describe('ProtectedRoute', () => {
  it('sends guests to the login page', () => {
    renderAt('/', null);
    expect(screen.getByText('Login page')).toBeInTheDocument();
  });

  it('lets signed-in users through', () => {
    renderAt('/', { id: 'E002', systemRole: 'employee' });
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  it('keeps regular employees out of HR-only pages', () => {
    renderAt('/employees', { id: 'E002', systemRole: 'employee' });
    expect(screen.queryByText('Employees page')).not.toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  it('lets HR into HR-only pages', () => {
    renderAt('/employees', { id: 'E001', systemRole: 'hr' });
    expect(screen.getByText('Employees page')).toBeInTheDocument();
  });
});
