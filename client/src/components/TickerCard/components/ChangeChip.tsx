import { memo } from "react";
import { Chip, Skeleton } from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";

import type { TickerVisualProps } from "../types";
import { formatChangePercent } from "@/utils/format";

export const ChangeChip = memo(
  ({ state, loading, isUp, color }: TickerVisualProps) => {
    if (loading) {
      return <Skeleton variant="rounded" width={52} height={20} />;
    }

    if (!state) return null;

    return (
      <Chip
        size="small"
        icon={isUp ? <TrendingUpIcon /> : <TrendingDownIcon />}
        label={formatChangePercent(state.changePercent, isUp)}
        color={color}
        sx={{ fontSize: "0.65rem", height: 20 }}
      />
    );
  }
);

ChangeChip.displayName = "ChangeChip";