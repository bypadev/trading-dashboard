import { QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { queryClient } from './queryClient';
import { theme } from './theme';
import { DashboardPage } from './pages/Dashboard';
import { LoginPage } from './pages/Login';
import { useAuthStore } from './store/authStore';

export function App() {
  const isAuthenticated = useAuthStore((state) => Boolean(state.token));

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {isAuthenticated ? <DashboardPage /> : <LoginPage />}
      </ThemeProvider>
    </QueryClientProvider>
  );
}
