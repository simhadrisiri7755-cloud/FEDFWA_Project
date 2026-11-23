import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { buildTheme } from '../theme';
import useLocalStorage from '../hooks/useLocalStorage';

export const ThemeModeContext = createContext(null);

const query = () => (typeof window !== 'undefined' && window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null);

/**
 * Light / dark mode. The choice is saved in localStorage; until the user picks one we follow the OS.
 * Toggles the `dark` class on <html> (drives the CSS variables) and feeds MUI the matching palette.
 */
export function ThemeModeProvider({ children }) {
  const [stored, setStored] = useLocalStorage('ems.theme', null);
  const [systemDark, setSystemDark] = useState(() => query()?.matches ?? false);

  useEffect(() => {
    const mq = query();
    if (!mq) return undefined;
    const onChange = (e) => setSystemDark(e.matches);
    mq.addEventListener?.('change', onChange);
    return () => mq.removeEventListener?.('change', onChange);
  }, []);

  const mode = stored ?? (systemDark ? 'dark' : 'light');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', mode === 'dark');
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', mode === 'dark' ? '#060f0e' : '#0a1f1c');
  }, [mode]);

  const toggle = useCallback(() => setStored(mode === 'dark' ? 'light' : 'dark'), [mode, setStored]);
  const muiTheme = useMemo(() => buildTheme(mode), [mode]);
  const value = useMemo(() => ({ mode, toggle }), [mode, toggle]);

  return (
    <ThemeModeContext.Provider value={value}>
      <MuiThemeProvider theme={muiTheme}>
        {children}
      </MuiThemeProvider>
    </ThemeModeContext.Provider>
  );
}
