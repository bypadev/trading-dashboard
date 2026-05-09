export function formatPriceFull(price: number): string {
  return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function formatPriceCompact(price: number): string {
  return price >= 1000 ? `$${(price / 1000).toFixed(1)}k` : `$${price.toFixed(2)}`;
}

export function formatChangePercent(changePercent: number, isUp: boolean): string {
  return `${isUp ? '+' : ''}${changePercent.toFixed(2)}%`;
}

export function formatChange(change: number, isUp: boolean): string {
  return `${isUp ? '+' : ''}${change.toFixed(2)}`;
}
