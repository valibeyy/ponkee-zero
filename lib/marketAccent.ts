export type MarketAccent = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

export const MARKET_ACCENTS: MarketAccent[] = [0, 1, 2, 3, 4, 5, 6, 7];

export function accentStyle(accent: MarketAccent) {
  // Tailwind-safe explicit class strings (no dynamic class composition)
  switch (accent) {
    case 0:
      return { tile: "bg-[#E53935] text-white", ring: "ring-white/20" };
    case 1:
      return { tile: "bg-[#111827] text-white", ring: "ring-white/15" };
    case 2:
      return { tile: "bg-[#2563EB] text-white", ring: "ring-white/15" };
    case 3:
      return { tile: "bg-[#16A34A] text-white", ring: "ring-white/15" };
    case 4:
      return { tile: "bg-[#F59E0B] text-black", ring: "ring-black/10" };
    case 5:
      return { tile: "bg-[#7C3AED] text-white", ring: "ring-white/15" };
    case 6:
      return { tile: "bg-[#EC4899] text-white", ring: "ring-white/15" };
    case 7:
    default:
      return { tile: "bg-[#0EA5E9] text-white", ring: "ring-white/15" };
  }
}

export function nextAccent(existing: MarketAccent[]): MarketAccent {
  const used = new Set(existing);
  for (const a of MARKET_ACCENTS) {
    if (!used.has(a)) return a;
  }
  return ((existing.length ?? 0) % MARKET_ACCENTS.length) as MarketAccent;
}
