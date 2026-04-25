"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";
import type { CategoryId } from "@/context/CartContext";
import { t } from "@/lib/i18n";
import { categoryLabel, DEFAULT_CATEGORY_ID, sortCategories } from "@/lib/defaultCategories";

export function AddItemFAB() {
  const pathname = usePathname();
  const { state, actions } = useCart();
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"market" | "item">("market");

  const [marketName, setMarketName] = useState("");

  const [itemMarketId, setItemMarketId] = useState(state.markets[0]?.id ?? "");
  const [itemName, setItemName] = useState("");
  const [itemCategory, setItemCategory] = useState<CategoryId>(DEFAULT_CATEGORY_ID);
  const [itemEst, setItemEst] = useState<string>("");

  const sortedCategories = useMemo(() => sortCategories(state.categories), [state.categories]);

  const canAddItem = useMemo(() => itemMarketId.length > 0 && itemName.trim().length > 0, [itemMarketId, itemName]);

  useEffect(() => {
    if (!state.markets.length) {
      setItemMarketId("");
      return;
    }
    if (!itemMarketId || !state.markets.some((m) => m.id === itemMarketId)) {
      setItemMarketId(state.markets[0]!.id);
    }
  }, [itemMarketId, state.markets]);

  useEffect(() => {
    const allowed = new Set(state.categories.map((c) => c.id));
    if (!allowed.has(itemCategory)) {
      setItemCategory(sortedCategories[0]?.id ?? DEFAULT_CATEGORY_ID);
    }
  }, [itemCategory, sortedCategories, state.categories]);

  function close() {
    setOpen(false);
    setMarketName("");
    setItemName("");
    setItemEst("");
    setItemCategory(sortCategories(state.categories)[0]?.id ?? DEFAULT_CATEGORY_ID);
  }

  if (pathname?.startsWith("/market/") || pathname === "/settings") return null;

  return (
    <>
      {open && <div className="fixed inset-0 bg-black/25 backdrop-blur-[2px] z-40" onClick={close} aria-hidden />}

      <div className="fixed bottom-[calc(84px+env(safe-area-inset-bottom))] right-5 z-50">
        {open && (
          <div className="mb-3 w-[min(92vw,380px)] rounded-[28px] bg-white shadow-card ring-1 ring-black/10 overflow-hidden">
            <div className="p-3">
              <div className="grid grid-cols-2 gap-2 rounded-2xl bg-black p-1">
                <button
                  className={`rounded-xl px-3 py-2 text-sm font-semibold ${
                    mode === "market" ? "bg-white text-black" : "text-white/80"
                  }`}
                  onClick={() => setMode("market")}
                >
                  {t(state.locale, "newMarket")}
                </button>
                <button
                  className={`rounded-xl px-3 py-2 text-sm font-semibold ${
                    mode === "item" ? "bg-white text-black" : "text-white/80"
                  }`}
                  onClick={() => setMode("item")}
                >
                  {t(state.locale, "newItem")}
                </button>
              </div>
            </div>

            {mode === "market" ? (
              <div className="px-3 pb-3">
                <input
                  className="w-full rounded-2xl ring-1 ring-black/10 px-4 py-3 text-base font-semibold outline-none"
                  placeholder={t(state.locale, "marketNamePlaceholder")}
                  value={marketName}
                  onChange={(e) => setMarketName(e.target.value)}
                />
                <button
                  className="mt-2 w-full rounded-2xl bg-brand-primary text-white px-4 py-3 text-base font-semibold disabled:opacity-50"
                  disabled={marketName.trim().length === 0}
                  onClick={() => {
                    actions.addMarket(marketName);
                    close();
                  }}
                >
                  {t(state.locale, "addMarket")}
                </button>
              </div>
            ) : (
              <div className="px-3 pb-3 space-y-2">
                <select
                  className="w-full rounded-2xl ring-1 ring-black/10 px-4 py-3 text-base font-semibold outline-none bg-white"
                  value={itemMarketId}
                  onChange={(e) => setItemMarketId(e.target.value)}
                  disabled={state.markets.length === 0}
                >
                  {state.markets.length === 0 ? (
                    <option value="">{t(state.locale, "newMarket")}</option>
                  ) : (
                    state.markets.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name}
                      </option>
                    ))
                  )}
                </select>

                <input
                  className="w-full rounded-2xl ring-1 ring-black/10 px-4 py-3 text-base font-semibold outline-none"
                  placeholder={t(state.locale, "itemNamePlaceholder")}
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                />

                <div className="flex gap-2">
                  <select
                    className="flex-1 rounded-2xl ring-1 ring-black/10 px-4 py-3 text-base font-semibold outline-none bg-white"
                    value={itemCategory}
                    onChange={(e) => setItemCategory(e.target.value)}
                  >
                    {sortedCategories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {categoryLabel(state.locale, c)}
                      </option>
                    ))}
                  </select>
                  <input
                    inputMode="decimal"
                    className="w-32 rounded-2xl ring-1 ring-black/10 px-4 py-3 text-base font-semibold outline-none"
                    placeholder={t(state.locale, "estimatedShort")}
                    value={itemEst}
                    onChange={(e) => setItemEst(e.target.value)}
                  />
                </div>

                <button
                  className="w-full rounded-2xl bg-brand-primary text-white px-4 py-3 text-base font-semibold disabled:opacity-50"
                  disabled={!canAddItem || state.markets.length === 0}
                  onClick={() => {
                    const est = itemEst.trim().length ? Number(itemEst) : undefined;
                    actions.addItem(itemMarketId, { marketId: itemMarketId, name: itemName, category: itemCategory, estimatedPrice: est });
                    close();
                  }}
                >
                  {t(state.locale, "addItem")}
                </button>
              </div>
            )}
          </div>
        )}

        <button
          className="h-14 w-14 rounded-full bg-brand-primary text-white shadow-glow flex items-center justify-center active:scale-[0.98] transition-transform"
          onClick={() => setOpen((v) => !v)}
          aria-label={t(state.locale, "newItem")}
        >
          <Plus className="h-7 w-7" />
        </button>
      </div>
    </>
  );
}
