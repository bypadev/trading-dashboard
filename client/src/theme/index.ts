import { createTheme } from '@mui/material';

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#818cf8' },
    success: { main: '#4ade80' },
    error: { main: '#f87171' },
    warning: { main: '#fbbf24' },
    background: {
      default: '#0d0d14',
      paper: '#13131f',
    },
    divider: 'rgba(255,255,255,0.07)',
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", sans-serif',
  },
  shape: { borderRadius: 10 },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          border: '1px solid rgba(255,255,255,0.06)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 600 },
      },
    },
  },
});
