"use client";

import { ScreenHeader } from "@/components/ScreenHeader";
import { MarketCard } from "@/components/MarketCard";
import { AddItemFAB } from "@/components/AddItemFAB";
import { useCart } from "@/context/CartContext";
import { t } from "@/lib/i18n";

export default function ListsPage() {
  const { state, actions } = useCart();

  return (
    <main className="min-h-[100dvh] bg-white">
      <div className="relative">
        <div className="absolute inset-0 bg-mesh-light" />
        <div className="relative mx-auto w-full max-w-[440px] px-4 pt-[max(14px,env(safe-area-inset-top))] pb-28">
          <ScreenHeader />

          <div className="mt-6">
            <p className="text-3xl font-semibold tracking-tight">{t(state.locale, "listsTitle")}</p>
            <p className="mt-2 text-sm font-semibold text-black/65 max-w-[38ch]">{t(state.locale, "listsSubtitle")}</p>
          </div>

          <div className="mt-7 space-y-3">
            {state.markets.length === 0 ? (
              <div className="rounded-[26px] bg-white shadow-card ring-1 ring-black/10 p-5">
                <p className="text-base font-semibold tracking-tight">{t(state.locale, "emptyMarketsTitle")}</p>
                <p className="mt-2 text-sm font-semibold text-black/65">{t(state.locale, "emptyMarketsSubtitle")}</p>
              </div>
            ) : (
              state.markets.map((m) => (
                <MarketCard
                  key={m.id}
                  market={m}
                  itemCount={(state.itemsByMarket[m.id] ?? []).length}
                  onDelete={(id) => actions.deleteMarket(id)}
                />
              ))
            )}
          </div>
        </div>
      </div>

      <AddItemFAB />
    </main>
  );
}
