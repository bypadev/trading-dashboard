import type { TickerState } from "@/types";

export interface TickerVisualProps {
  state?: TickerState;
  loading?: boolean;
  isUp: boolean;
  color: "success" | "error";
}