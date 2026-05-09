import { useWebSocket } from '@/hooks/useWebSocket';
import { useMarketStore } from '@/store/marketStore';
import { useAuthStore } from '@/store/authStore';
import { TickerList } from '@/components/TickerList';
import { PriceChart } from '@/components/PriceChart';

import {
  Grid,
  Chip,
  Typography,
  Snackbar,
  Alert,
  Button,
} from "@mui/material";
import {
  StyledPage,
  StyledHeader,
  StyledLogoBox,
  StyledContent,
  StyledPanelPaper,
  StyledLiveDotIcon,
  StyledHeaderContainer,
  StyledLogoText,
} from "./styled";

export function DashboardPage() {
  useWebSocket();

  const wsConnected = useMarketStore((s) => s.wsConnected);
  const notification = useMarketStore((s) => s.notification);
  const dismissNotification = useMarketStore((s) => s.dismissNotification);
  const username = useAuthStore((s) => s.username);
  const logout = useAuthStore((s) => s.logout);

  return (
    <StyledPage>
      <StyledHeader>
        <StyledHeaderContainer>
          <StyledLogoBox>
            <StyledLogoText>MB</StyledLogoText>
          </StyledLogoBox>
          <Typography variant="h6" fontWeight={800} letterSpacing={-0.5} sx={{ display: { xs: 'none', sm: 'block' } }}>
            Trading Dashboard
          </Typography>
        </StyledHeaderContainer>

        <StyledHeaderContainer>
          <Chip
            icon={
              <StyledLiveDotIcon active={wsConnected} color={wsConnected ? "success" : "warning"} />
            }
            label={wsConnected ? "Live" : "Reconnecting…"}
            color={wsConnected ? "success" : "warning"}
            size="small"
            variant="outlined"
          />
          <Typography variant="caption" color="text.secondary" sx={{ display: { xs: 'none', sm: 'block' } }}>
            {username}
          </Typography>
          <Button size="small" color="inherit" onClick={() => void logout()} sx={{ opacity: 0.6 }}>
            Sign out
          </Button>
        </StyledHeaderContainer>
      </StyledHeader>

      <StyledContent>
        <Grid container spacing={2} sx={{ height: "100%" }}>
          <Grid item xs={12} md={3} lg={2.5} sx={{ height: { xs: 'auto', md: '100%' } }}>
            <StyledPanelPaper>
              <TickerList />
            </StyledPanelPaper>
          </Grid>
          <Grid item xs={12} md={9} lg={9.5} sx={{ height: { xs: 'auto', md: '100%' } }}>
            <StyledPanelPaper>
              <PriceChart />
            </StyledPanelPaper>
          </Grid>
        </Grid>
      </StyledContent>

      <Snackbar
        open={Boolean(notification)}
        autoHideDuration={6000}
        onClose={dismissNotification}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={dismissNotification}
          severity={notification?.severity ?? "info"}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {notification?.message}
        </Alert>
      </Snackbar>
    </StyledPage>
  );
}
