import { memo } from "react";
import { Typography } from "@mui/material";

import type { PriceAlert, TickerState } from "@/types";

import {
  StyledCard,
  StyledCardTop,
  StyledSymbolRow,
} from "./styled";

import { ChangeChip } from "./components/ChangeChip";
import { PriceRow } from "./components/PriceRow";
import { ChangeRow } from "./components/ChangeRow";
import { AlertIndicator } from "./components/AlertIndicator";

interface Props {
  symbol: string;
  state?: TickerState;
  selected: boolean;
  loading?: boolean;
  alert?: PriceAlert;
  onClick: () => void;
}

export const TickerCard = memo(
  ({ symbol, state, selected, loading, alert, onClick }: Props) => {
    const isUp = state ? state.changePercent >= 0 : true;

    const color = isUp ? "success" : "error";

    return (
      <StyledCard selected={selected} loading={loading} onClick={onClick}>
        <StyledCardTop>
          <StyledSymbolRow>
            <Typography
              variant="subtitle2"
              fontWeight={700}
              letterSpacing={0.5}
            >
              {symbol}
            </Typography>

            <AlertIndicator
              visible={Boolean(alert && !alert.triggered)}
            />
          </StyledSymbolRow>

          <ChangeChip
            state={state}
            loading={loading}
            isUp={isUp}
            color={color}
          />
        </StyledCardTop>

        <PriceRow
          state={state}
          loading={loading}
          isUp={isUp}
          color={color}
        />

        <ChangeRow
          state={state}
          loading={loading}
          isUp={isUp}
          color={color}
        />
      </StyledCard>
    );
  }
);

TickerCard.displayName = "TickerCard";