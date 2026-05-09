import { useState } from 'react';
import {
  Typography,
  TextField,
  Button,
  Alert,
  Divider,
  CircularProgress,
} from '@mui/material';
import { useAuthStore } from '@/store/authStore';
import { StyledPage, StyledCard, StyledLogoRow, StyledLogoBox } from './styled';

export function LoginPage() {
  const { login, error, isLoading } = useAuthStore();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(username, password);
  };

  return (
    <StyledPage>
      <StyledCard>
        <StyledLogoRow>
          <StyledLogoBox>
            <Typography fontSize="0.65rem" fontWeight={900} color="#fff">
              MB
            </Typography>
          </StyledLogoBox>
          <Typography variant="h6" fontWeight={800} letterSpacing={-0.5}>
            Trading Dashboard
          </Typography>
        </StyledLogoRow>

        <Divider />

        <Typography variant="body2" color="text.secondary">
          Sign in to access live market data.
        </Typography>

        {error && <Alert severity="error">{error}</Alert>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <TextField
            label="Username"
            size="small"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            autoFocus
            required
          />
          <TextField
            label="Password"
            type="password"
            size="small"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
          <Button
            type="submit"
            variant="contained"
            disabled={isLoading || !username || !password}
            sx={{ mt: 1 }}
          >
            {isLoading ? <CircularProgress size={20} color="inherit" /> : 'Sign in'}
          </Button>
        </form>

        <Typography variant="caption" color="text.disabled" textAlign="center">
          admin / password123 &nbsp;·&nbsp; trader / trading456
        </Typography>
      </StyledCard>
    </StyledPage>
  );
}
