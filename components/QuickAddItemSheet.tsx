"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import type { CategoryId } from "@/context/CartContext";
import { t } from "@/lib/i18n";
import { subscribeQuickAdd } from "@/lib/quickAddBus";
import { CategoryBadge } from "@/components/CategoryIcon";
import { categoryLabel, DEFAULT_CATEGORY_ID, sortCategories } from "@/lib/defaultCategories";

export function QuickAddItemSheet() {
  const { state, actions } = useCart();
  const [open, setOpen] = useState(false);
  const [marketId, setMarketId] = useState<string>("");
  const [category, setCategory] = useState<CategoryId>(DEFAULT_CATEGORY_ID);
  const [name, setName] = useState("");
  const [est, setEst] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    return subscribeQuickAdd((p) => {
      setMarketId(p.marketId);
      setCategory(p.category);
      setName("");
      setEst("");
      setOpen(true);
    });
  }, []);

  useEffect(() => {
    if (!open) return;
    queueMicrotask(() => inputRef.current?.focus());
  }, [open, marketId, category]);

  const sorted = useMemo(() => sortCategories(state.categories), [state.categories]);

  const catDef = useMemo(() => {
    return sorted.find((c) => c.id === category) ?? sorted[0];
  }, [sorted, category]);

  const title = useMemo(() => {
    if (!catDef) return "";
    return categoryLabel(state.locale, catDef);
  }, [catDef, state.locale]);

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-[60]" onClick={() => setOpen(false)} aria-hidden />
      <div className="fixed inset-x-0 bottom-0 z-[70]">
        <div className="mx-auto w-full max-w-[440px] px-4 pb-[max(14px,env(safe-area-inset-bottom))]">
          <div className="rounded-[28px] bg-white shadow-card ring-1 ring-black/10 overflow-hidden">
            <div className="p-4 flex items-start justify-between gap-3">
              <div className="min-w-0 flex items-start gap-3">
                <CategoryBadge glyph={catDef?.glyph ?? "custom"} size="lg" />
                <div className="min-w-0">
                  <p className="text-base font-semibold tracking-tight">{t(state.locale, "newItem")}</p>
                  <p className="mt-1 text-sm font-semibold text-black/65 truncate">{title}</p>
                </div>
              </div>
              <button className="p-2 rounded-full hover:bg-black/5" onClick={() => setOpen(false)} aria-label="Close">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="px-4 pb-4 space-y-2">
              <input
                ref={inputRef}
                className="w-full rounded-2xl ring-1 ring-black/10 px-4 py-3 text-base font-semibold outline-none"
                placeholder={t(state.locale, "itemNamePlaceholder")}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <input
                inputMode="decimal"
                className="w-full rounded-2xl ring-1 ring-black/10 px-4 py-3 text-base font-semibold outline-none"
                placeholder={t(state.locale, "estimatedShort")}
                value={est}
                onChange={(e) => setEst(e.target.value)}
              />

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button className="rounded-2xl bg-white ring-1 ring-black/10 px-4 py-3 text-base font-semibold" onClick={() => setOpen(false)}>
                  {t(state.locale, "cancel")}
                </button>
                <button
                  className="rounded-2xl bg-brand-primary text-white px-4 py-3 text-base font-semibold disabled:opacity-50"
                  disabled={name.trim().length === 0 || !catDef}
                  onClick={() => {
                    const estN = est.trim().length ? Number(est) : undefined;
                    actions.addItem(marketId, {
                      marketId,
                      name,
                      category: catDef!.id,
                      estimatedPrice: estN,
                    });
                    setOpen(false);
                  }}
                >
                  {t(state.locale, "addItem")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
