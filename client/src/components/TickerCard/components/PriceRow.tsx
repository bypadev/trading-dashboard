import { memo } from "react";
import { Typography, Skeleton } from "@mui/material";

import type { TickerVisualProps } from "../types";
import { formatPriceFull } from "@/utils/format";

export const PriceRow = memo(
  ({ state, loading, color }: TickerVisualProps) => {
    if (loading) {
      return (
        <Skeleton
          variant="text"
          width="70%"
          height={32}
          sx={{ mt: 0.5 }}
        />
      );
    }

    return (
      <Typography
        variant="h6"
        fontWeight={700}
        sx={{
          color: state ? `${color}.main` : "text.secondary",
          transition: "color 0.3s",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {state ? formatPriceFull(state.price) : "---"}
      </Typography>
    );
  }
);

PriceRow.displayName = "PriceRow";