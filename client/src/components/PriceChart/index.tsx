import { useEffect, useState, useMemo } from "react";
import {
  Typography,
  CircularProgress,
  Alert,
  Chip,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  TimeScale,
  type ScriptableContext,
  type Plugin,
  type ChartType,
} from "chart.js";
import { Line, Chart } from "react-chartjs-2";
import "chartjs-adapter-date-fns";
import { CandlestickController, CandlestickElement } from "chartjs-chart-financial";
import { useMarketStore } from "@/store/marketStore";
import { useTickerHistory } from "@/hooks/useTickerHistory";
import type { PricePoint } from "@/types";
import { MAX_POINTS, CANDLE_MS } from "@/consts";
import {
  formatPriceFull,
  formatPriceCompact,
  formatChangePercent,
  formatChange,
} from "@/utils/format";
import {
  StyledContainer,
  StyledHeader,
  StyledPriceRow,
  StyledControls,
  StyledChartPaper,
  StyledChartBox,
  StyledEmptyState,
  StyledLoadingBox,
} from "./styled";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  TimeScale,
  CandlestickController,
  CandlestickElement,
);

type ChartMode = "area" | "candle";
interface OhlcBar {
  x: number;
  o: number;
  h: number;
  l: number;
  c: number;
}

function buildCandles(points: PricePoint[], ms: number): OhlcBar[] {
  const buckets = new Map<number, number[]>();
  for (const p of points) {
    const k = Math.floor(p.timestamp / ms) * ms;
    if (!buckets.has(k)) buckets.set(k, []);
    buckets.get(k)!.push(p.price);
  }
  return [...buckets.entries()]
    .sort(([a], [b]) => a - b)
    .map(([x, px]) => ({
      x,
      o: px[0],
      h: Math.max(...px),
      l: Math.min(...px),
      c: px[px.length - 1],
    }));
}

function makeAlertPlugin(threshold: number | null): Plugin<ChartType> {
  return {
    id: "alertLine",
    afterDraw(chart) {
      if (!threshold) return;
      const { ctx, chartArea, scales } = chart;
      if (!scales["y"]) return;
      const y = scales["y"].getPixelForValue(threshold);
      if (y < chartArea.top || y > chartArea.bottom) return;
      ctx.save();
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = "#f59e0b";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(chartArea.left, y);
      ctx.lineTo(chartArea.right, y);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = "#f59e0b";
      ctx.font = "11px sans-serif";
      ctx.textAlign = "right";
      ctx.fillText(`Alert ${formatPriceCompact(threshold)}`, chartArea.right, y - 4);
      ctx.restore();
    },
  };
}

const timeScaleBase = {
  type: "time" as const,
  time: { unit: "second" as const, displayFormats: { second: "HH:mm:ss" } },
  ticks: { color: "#6b7280", font: { size: 10 }, maxTicksLimit: 6 },
  grid: { display: false },
  border: { display: false },
};

const yScaleBase = {
  ticks: {
    color: "#6b7280",
    font: { size: 10 },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    callback: (v: any) => formatPriceCompact(v as number),
  },
  grid: { color: "rgba(255,255,255,0.05)" },
  border: { display: false },
};

export function PriceChart() {
  const selectedTicker = useMarketStore((s) => s.selectedTicker);
  const liveState = useMarketStore((s) =>
    selectedTicker ? s.tickers[selectedTicker] : null,
  );
  const alertForSelected = useMarketStore((s) =>
    s.alerts.find((a) => a.symbol === selectedTicker),
  );

  const { data: history, isLoading, error } = useTickerHistory(selectedTicker);
  const [points, setPoints] = useState<PricePoint[]>([]);
  const [mode, setMode] = useState<ChartMode>("area");

  useEffect(() => {
    setPoints([]);
  }, [selectedTicker]);

  useEffect(() => {
    if (history) setPoints(history);
  }, [history]);

  useEffect(() => {
    if (!liveState) return;
    setPoints((prev) =>
      [...prev, { price: liveState.price, timestamp: liveState.timestamp }].slice(-MAX_POINTS),
    );
  }, [liveState]);

  const isUp = (liveState?.changePercent ?? 0) >= 0;
  const chartColor = isUp ? "#4ade80" : "#f87171";
  const alertThreshold =
    alertForSelected && !alertForSelected.triggered ? alertForSelected.threshold : null;

  const alertPlugin = useMemo(() => makeAlertPlugin(alertThreshold), [alertThreshold]);

  const areaData = useMemo(
    () => ({
      datasets: [
        {
          data: points.map((p) => ({ x: p.timestamp, y: p.price })),
          borderColor: chartColor,
          borderWidth: 2,
          pointRadius: 0,
          fill: true,
          tension: 0.1,
          backgroundColor: (ctx: ScriptableContext<"line">) => {
            const { ctx: c, chartArea } = ctx.chart;
            if (!chartArea) return `${chartColor}30`;
            const g = c.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
            g.addColorStop(0, `${chartColor}50`);
            g.addColorStop(1, `${chartColor}00`);
            return g;
          },
        },
      ],
    }),
    [points, chartColor],
  );

  const candleData = useMemo(
    () => ({
      datasets: [
        {
          type: "candlestick" as const,
          data: buildCandles(points, CANDLE_MS),
          color: { up: "#4ade80", down: "#f87171", unchanged: "#94a3b8" },
        },
      ],
    }),
    [points],
  );

  const areaOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      animation: false as const,
      interaction: { mode: "index" as const, intersect: false },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            label: (ctx: any) => `Price: ${formatPriceCompact(ctx.parsed.y as number)}`,
          },
        },
      },
      scales: { x: timeScaleBase, y: yScaleBase },
    }),
    [],
  );

  const candleOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      animation: false as const,
      plugins: { legend: { display: false } },
      scales: { x: timeScaleBase, y: yScaleBase },
    }),
    [],
  );

  if (!selectedTicker) {
    return (
      <StyledEmptyState>
        <div>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Select a ticker
          </Typography>
          <Typography variant="body2" color="text.disabled">
            Click any market on the left to view its live chart
          </Typography>
        </div>
      </StyledEmptyState>
    );
  }

  if (isLoading) {
    return (
      <StyledLoadingBox>
        <CircularProgress />
      </StyledLoadingBox>
    );
  }

  if (error) {
    return <Alert severity="error">Failed to load chart data</Alert>;
  }

  return (
    <StyledContainer>
      <StyledHeader>
        <div>
          <Typography variant="h5" fontWeight={800} letterSpacing={-0.5}>
            {selectedTicker}
          </Typography>
          {liveState && (
            <StyledPriceRow>
              <Typography
                variant="h3"
                fontWeight={800}
                sx={{
                  color: isUp ? "success.main" : "error.main",
                  fontVariantNumeric: "tabular-nums",
                  lineHeight: 1,
                }}
              >
                {formatPriceFull(liveState.price)}
              </Typography>
              <Chip
                size="small"
                label={formatChangePercent(liveState.changePercent, isUp)}
                color={isUp ? "success" : "error"}
                sx={{ fontWeight: 700 }}
              />
            </StyledPriceRow>
          )}
          {liveState && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {formatChange(liveState.change, isUp)} today
            </Typography>
          )}
        </div>

        <StyledControls>
          <ToggleButtonGroup
            value={mode}
            exclusive
            onChange={(_, v: ChartMode | null) => v && setMode(v)}
            size="small"
          >
            <ToggleButton value="area" sx={{ fontSize: 12, px: 1.5, py: 0.5 }}>
              Area
            </ToggleButton>
            <ToggleButton value="candle" sx={{ fontSize: 12, px: 1.5, py: 0.5 }}>
              Candle
            </ToggleButton>
          </ToggleButtonGroup>
          <Typography variant="caption" color="text.disabled">
            {points.length} pts
          </Typography>
        </StyledControls>
      </StyledHeader>

      <StyledChartPaper>
        <StyledChartBox>
          {mode === "area" ? (
            <Line data={areaData} options={areaOptions} plugins={[alertPlugin as Plugin<"line">]} />
          ) : (
            <Chart
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              type={"candlestick" as any}
              data={candleData}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              options={candleOptions as any}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              plugins={[alertPlugin] as any}
            />
          )}
        </StyledChartBox>
      </StyledChartPaper>
    </StyledContainer>
  );
}
