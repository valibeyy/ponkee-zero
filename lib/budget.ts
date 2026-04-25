export function formatMoney(n: number) {
  const v = Number.isFinite(n) ? n : 0;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(v);
}

export function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}
