export function calcPriceChange(
  currentPrice: number,
  previousPrice: number,
): { change: number; changePercent: number } {
  const change = Number.parseFloat((currentPrice - previousPrice).toFixed(2));
  const changePercent =
    previousPrice === 0
      ? 0
      : Number.parseFloat((((currentPrice - previousPrice) / previousPrice) * 100).toFixed(4));
  return { change, changePercent };
}
