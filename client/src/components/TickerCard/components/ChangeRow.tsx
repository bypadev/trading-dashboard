import { memo } from "react";
import { Typography, Skeleton } from "@mui/material";

import type { TickerVisualProps } from "../types";
import { formatChange } from "@/utils/format";

export const ChangeRow = memo(
  ({ state, loading, isUp }: TickerVisualProps) => {
    if (loading) {
      return <Skeleton variant="text" width="40%" height={16} />;
    }

    if (!state) return null;

    return (
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ fontVariantNumeric: "tabular-nums" }}
      >
        {formatChange(state.change, isUp)} today
      </Typography>
    );
  }
);

ChangeRow.displayName = "ChangeRow";