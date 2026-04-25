"use client";

import Link from "next/link";
import { ChevronRight, Store, Trash2 } from "lucide-react";
import { formatMoney } from "@/lib/budget";
import type { Market } from "@/context/CartContext";
import { itemsCountLabel, t } from "@/lib/i18n";
import { useCart } from "@/context/CartContext";
import { accentStyle } from "@/lib/marketAccent";

export function MarketCard({
  market,
  itemCount,
  onDelete,
}: {
  market: Market;
  itemCount: number;
  onDelete?: (id: string) => void;
}) {
  const { state } = useCart();
  const status = market.completed ? t(state.locale, "statusCompleted") : t(state.locale, "statusActive");
  const accent = accentStyle(market.accent);

  return (
    <div className="relative">
      <Link
        href={`/market/${market.id}`}
        className="block rounded-[26px] bg-white shadow-card ring-1 ring-black/10 active:scale-[0.99] transition-transform overflow-hidden"
      >
        <div className="absolute inset-0 bg-mesh-light opacity-35" />
        <div className="relative p-4 flex items-center gap-3 pr-14">
          <div
            className={[
              "h-12 w-12 rounded-2xl flex items-center justify-center shadow-soft ring-1",
              accent.tile,
              accent.ring,
            ].join(" ")}
          >
            <Store className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-base font-semibold tracking-tight truncate">{market.name}</p>
            <p className="mt-1 text-sm font-semibold text-black/60">
              {itemsCountLabel(state.locale, itemCount)} ·{" "}
              <span className={market.completed ? "text-black" : "text-brand-primary"}>{status}</span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-[11px] font-semibold text-black/55">{t(state.locale, "spent")}</p>
            <p className="text-sm font-semibold tabular-nums">{formatMoney(market.spent)}</p>
            <ChevronRight className="ml-auto mt-1 h-5 w-5 text-black" />
          </div>
        </div>
      </Link>

      {onDelete && (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (window.confirm(t(state.locale, "deleteMarketConfirm"))) onDelete(market.id);
          }}
          className="absolute right-3 top-1/2 z-20 -translate-y-1/2 p-2 text-brand-primary hover:bg-red-50 rounded-full transition-colors"
          aria-label={t(state.locale, "deleteMarket")}
          title={t(state.locale, "deleteMarket")}
        >
          <Trash2 size={18} />
        </button>
      )}
    </div>
  );
}
