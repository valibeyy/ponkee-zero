"use client";

import { BudgetCard } from "@/components/BudgetCard";
import { MarketCard } from "@/components/MarketCard";
import { AddItemFAB } from "@/components/AddItemFAB";
import { ScreenHeader } from "@/components/ScreenHeader";
import { useCart } from "@/context/CartContext";
import { t } from "@/lib/i18n";

export default function DashboardPage() {
  const { state } = useCart();

  return (
    <main className="min-h-[100dvh] bg-white">
      <div className="relative">
        <div className="absolute inset-0 bg-mesh-light" />
        <div className="relative mx-auto w-full max-w-[440px] px-4 pt-[max(14px,env(safe-area-inset-top))] pb-28">
          <ScreenHeader subtitle="390×844 • PWA" />

          <div className="mt-6">
            <p className="text-4xl font-semibold tracking-tight">{t(state.locale, "welcomeTitle")}</p>
            <p className="mt-2 text-sm font-semibold text-black/65 max-w-[34ch]">{t(state.locale, "welcomeSubtitle")}</p>
          </div>

          <div className="mt-6">
            <BudgetCard />
          </div>

          <section className="mt-7">
            <SectionTitle />
            <MarketList />
          </section>
        </div>
      </div>

      <AddItemFAB />
    </main>
  );
}

function SectionTitle() {
  const { state } = useCart();
  return <h2 className="text-xs font-semibold tracking-wide text-black/55 uppercase">{t(state.locale, "myShoppingRoutes")}</h2>;
}

function MarketList() {
  const { state, actions } = useCart();

  return (
    <div className="mt-3 space-y-3">
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
  );
}
