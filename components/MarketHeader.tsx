"use client";

import Link from "next/link";
import { ChevronLeft, Store } from "lucide-react";
import { formatMoney } from "@/lib/budget";
import { useCart } from "@/context/CartContext";
import type { Item } from "@/context/CartContext";
import { t } from "@/lib/i18n";
import { accentStyle } from "@/lib/marketAccent";

function estimateOpenTotal(items: Item[]) {
  let sum = 0;
  for (const it of items ?? []) {
    if (it.purchased) continue;
    const est = typeof it.estimatedPrice === "number" ? it.estimatedPrice : 0;
    sum += est;
  }
  return sum;
}

export default function MarketHeader({ marketId }: { marketId: string }) {
  const { state } = useCart();
  const market = state.markets.find((m) => m.id === marketId);
  const items = state.itemsByMarket[marketId] ?? [];
  const est = estimateOpenTotal(items);
  const accent = market ? accentStyle(market.accent) : accentStyle(0);

  return (
    <div className="-mx-4">
      <div className="rounded-b-[28px] bg-brand-primary text-white px-4 pt-[max(10px,env(safe-area-inset-top))] pb-4 shadow-card">
        <div className="flex items-center justify-between gap-3">
          <Link href="/lists" className="inline-flex items-center gap-2 text-sm font-semibold text-white/90">
            <ChevronLeft className="h-5 w-5" />
            {t(state.locale, "listsTitle")}
          </Link>
          <div className="text-right">
            <p className="text-[11px] font-semibold text-white/80">{t(state.locale, "estTotal")}</p>
            <p className="text-lg font-semibold tabular-nums">{formatMoney(est)}</p>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-3 min-w-0">
          <div className={[
            "h-11 w-11 rounded-2xl flex items-center justify-center ring-1 shrink-0",
            accent.tile,
            accent.ring,
          ].join(" ")}>
            <Store className="h-5 w-5" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight truncate">{market?.name ?? "Market"}</h1>
        </div>
        <p className="mt-1 text-sm font-semibold text-white/85">{t(state.locale, "tapToBuyHint")}</p>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-white/10 ring-1 ring-white/15 px-3 py-3">
            <p className="text-[11px] font-semibold text-white/75">{t(state.locale, "marketSpent")}</p>
            <p className="mt-1 text-xl font-semibold tabular-nums">{formatMoney(market?.spent ?? 0)}</p>
          </div>
          <div className="rounded-2xl bg-white/10 ring-1 ring-white/15 px-3 py-3">
            <p className="text-[11px] font-semibold text-white/75">{t(state.locale, "budgetRemainingShort")}</p>
            <p className="mt-1 text-xl font-semibold tabular-nums">
              {formatMoney(state.budget - state.markets.reduce((a, m) => a + m.spent, 0))}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
