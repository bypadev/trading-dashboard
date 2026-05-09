import { Divider, CircularProgress, Alert, TextField, Button, Typography } from "@mui/material";
import { useState, useMemo } from "react";
import { useMarketStore } from "@/store/marketStore";
import { TickerCard } from "../TickerCard";
import { useTickers } from "@/hooks/useTickers";
import { CLIENT_ERRORS, DECIMAL_PRICE_REGEX } from "@/consts";
import {
  StyledContainer,
  StyledSectionLabel,
  StyledListContainer,
  StyledAlertPanel,
  StyledAlertActions,
  StyledAlertStatus,
  StyledRemoveButton,
  StyledLoadingContainer,
} from "./styled";

export function TickerList() {
  const { data: tickers, isLoading, error } = useTickers();
  const tickerStates = useMarketStore((s) => s.tickers);
  const selectedTicker = useMarketStore((s) => s.selectedTicker);
  const selectTicker = useMarketStore((s) => s.selectTicker);
  const wsConnected = useMarketStore((s) => s.wsConnected);
  const alerts = useMarketStore((s) => s.alerts);
  const addAlert = useMarketStore((s) => s.addAlert);
  const removeAlert = useMarketStore((s) => s.removeAlert);

  const [alertInput, setAlertInput] = useState("");

  const alertsMap = useMemo(() => {
    return new Map(alerts.map((a) => [a.symbol, a]));
  }, [alerts]);

  const activeAlert = selectedTicker ? alertsMap.get(selectedTicker) : null;

  const handleSetAlert = () => {
    if (!selectedTicker || !alertInput) return;
    const threshold = Number.parseFloat(alertInput);
    if (Number.isNaN(threshold) || threshold <= 0) return;
    addAlert({ symbol: selectedTicker, threshold });
    setAlertInput("");
  };

  if (isLoading) {
    return (
      <StyledLoadingContainer>
        <CircularProgress size={28} />
      </StyledLoadingContainer>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ borderRadius: 2 }}>
        {CLIENT_ERRORS.SERVER_UNREACHABLE}
      </Alert>
    );
  }

  return (
    <StyledContainer>
      <StyledSectionLabel variant="subtitle1" color="text.secondary">
        Markets
      </StyledSectionLabel>
      <Divider sx={{ mb: 1.5 }} />

      <StyledListContainer>
        {tickers?.map((symbol) => (
          <TickerCard
            key={symbol}
            symbol={symbol}
            state={tickerStates[symbol]}
            selected={selectedTicker === symbol}
            loading={!wsConnected && !tickerStates[symbol]}
            alert={alertsMap.get(symbol)}
            onClick={() => selectTicker(symbol)}
          />
        ))}
      </StyledListContainer>

      {selectedTicker && (
        <StyledAlertPanel>
          <Typography variant="caption" color="text.secondary" fontWeight={600}>
            PRICE ALERT — {selectedTicker}
          </Typography>

          {activeAlert ? (
            <StyledAlertStatus>
              <Typography variant="body2" color="warning.main">
                Alert set: {activeAlert.direction} ${activeAlert.threshold}
                {activeAlert.triggered && " ✓ Triggered"}
              </Typography>
              <StyledRemoveButton
                size="small"
                color="error"
                onClick={() => removeAlert(selectedTicker)}
              >
                Remove
              </StyledRemoveButton>
            </StyledAlertStatus>
          ) : (
            <StyledAlertActions>
              <TextField
                size="small"
                placeholder="Target price"
                value={alertInput}
                onChange={(e) => {
                  const val = e.target.value;
                  if (DECIMAL_PRICE_REGEX.test(val)) setAlertInput(val);
                }}
                onKeyDown={(e) => e.key === "Enter" && handleSetAlert()}
                sx={{ flex: 1 }}
                inputProps={{ style: { fontSize: 13 }, inputMode: "decimal" }}
              />
              <Button size="small" variant="outlined" onClick={handleSetAlert}>
                Set
              </Button>
            </StyledAlertActions>
          )}
        </StyledAlertPanel>
      )}
    </StyledContainer>
  );
}
