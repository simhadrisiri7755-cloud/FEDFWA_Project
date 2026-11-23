import { createContext, useCallback, useMemo } from 'react';
import { api } from '../api/mockApi';
import useLocalStorage from '../hooks/useLocalStorage';

export const AuthContext = createContext(null);

/** Holds the signed-in user (persisted so a refresh keeps you logged in). */
export function AuthProvider({ children }) {
  const [user, setUser] = useLocalStorage('ems.session', null);

  const login = useCallback(
    async (credentials) => {
      const loggedIn = await api.login(credentials);
      setUser(loggedIn);
      return loggedIn;
    },
    [setUser],
  );

  const register = useCallback(
    async (details) => {
      const created = await api.register(details);
      setUser(created);
      return created;
    },
    [setUser],
  );

  const logout = useCallback(() => setUser(null), [setUser]);

  const value = useMemo(
    () => ({ user, login, register, logout, updateUser: setUser, isHR: user?.systemRole === 'hr' }),
    [user, login, register, logout, setUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
