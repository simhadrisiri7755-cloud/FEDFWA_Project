import { createTheme } from '@mui/material/styles';

// MUI handles behaviour-heavy primitives (Dialog, Drawer, Snackbar); this theme
// keeps them visually in step with the Tailwind design tokens in both colour modes.
export const buildTheme = (mode = 'light') => {
  const dark = mode === 'dark';
  return createTheme({
    palette: {
      mode,
      primary: { main: dark ? '#2fbfad' : '#0b6f65', contrastText: dark ? '#03211d' : '#ffffff' },
      error: { main: dark ? '#ff8d80' : '#b42318' },
      success: { main: dark ? '#4cc27d' : '#1b6b3a' },
      background: { default: dark ? '#081311' : '#f2f6f4', paper: dark ? '#0e1b18' : '#ffffff' },
      text: { primary: dark ? '#e8f2ef' : '#0f1c1a', secondary: dark ? '#bccbc7' : '#3d4f4b' },
      divider: dark ? '#1e312d' : '#e0e8e5',
    },
    shape: { borderRadius: 16 },
    typography: { fontFamily: '"Plus Jakarta Sans Variable", system-ui, sans-serif' },
    components: {
      MuiPaper: { styleOverrides: { root: { backgroundImage: 'none' } } },
      MuiDialog: { styleOverrides: { paper: { borderRadius: 20 } } },
    },
  });
};

export const theme = buildTheme('light');
