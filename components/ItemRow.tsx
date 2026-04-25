"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CheckCircle2, Circle, Trash2 } from "lucide-react";
import type { Item } from "@/context/CartContext";
import { formatMoney } from "@/lib/budget";
import { useCart } from "@/context/CartContext";
import { t } from "@/lib/i18n";
import { CategoryBadge } from "@/components/CategoryIcon";

export function ItemRow({ item }: { item: Item }) {
  const { state, actions } = useCart();
  const [editing, setEditing] = useState(false);
  const [price, setPrice] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  const meta = useMemo(() => {
    const est = typeof item.estimatedPrice === "number" ? item.estimatedPrice : undefined;
    const actual = typeof item.actualPrice === "number" ? item.actualPrice : undefined;
    return { est, actual };
  }, [item.actualPrice, item.estimatedPrice]);

  const categoryDef = useMemo(() => {
    return state.categories.find((c) => c.id === item.category) ?? state.categories[0];
  }, [item.category, state.categories]);

  useEffect(() => {
    if (editing) queueMicrotask(() => inputRef.current?.focus());
  }, [editing]);

  function startPurchaseFlow() {
    if (item.purchased) return;
    setEditing(true);
    setPrice("");
  }

  function commitPurchase() {
    const trimmed = price.trim();
    if (trimmed.length > 0) {
      const n = Number(trimmed);
      if (Number.isFinite(n)) {
        actions.purchaseItem(item.marketId, item.id, n);
        setEditing(false);
        return;
      }
    }
    actions.quickBuyItem(item.marketId, item.id);
    setEditing(false);
  }

  return (
    <div
      className={[
        "relative overflow-hidden rounded-[26px] bg-white ring-1 ring-black/10 shadow-soft",
        item.purchased ? "opacity-70" : "opacity-100",
      ].join(" ")}
    >
      <div className="absolute inset-0 bg-mesh-light opacity-25" />
      <div className="relative flex items-center gap-3 px-3 py-3">
        <button
          className={[
            "h-11 w-11 rounded-2xl text-white flex items-center justify-center active:scale-[0.98] transition-transform",
            item.purchased ? "bg-brand-primary" : "bg-black",
          ].join(" ")}
          onClick={() => {
            if (item.purchased) actions.unpurchaseItem(item.marketId, item.id);
            else startPurchaseFlow();
          }}
          aria-label={item.purchased ? t(state.locale, "uncheckItem") : t(state.locale, "checkItem")}
        >
          {item.purchased ? <CheckCircle2 className="h-7 w-7 text-white" /> : <Circle className="h-7 w-7 text-white" />}
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 min-w-0">
            <CategoryBadge glyph={categoryDef?.glyph ?? "custom"} size="sm" />
            <p className={["min-w-0 text-base font-semibold tracking-tight truncate", item.purchased ? "line-through" : ""].join(" ")}>
              {item.name}
            </p>
          </div>
          <p className="mt-1 pl-11 text-sm font-semibold text-black/65">
            {item.purchased ? (
              <span>
                {t(state.locale, "paid")} {formatMoney(meta.actual ?? 0)}
                {item.quickBought ? <span className="ml-2 text-brand-primary">{t(state.locale, "quickBuy")}</span> : null}
              </span>
            ) : meta.est != null ? (
              <span>
                {t(state.locale, "estimatedLabel")} {formatMoney(meta.est)}
              </span>
            ) : (
              <span>{t(state.locale, "tapToBuy")}</span>
            )}
          </p>
        </div>

        {!item.purchased && editing && (
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              inputMode="decimal"
              className="w-28 rounded-2xl ring-1 ring-black/10 px-3 py-2 text-base font-semibold outline-none bg-white"
              placeholder={meta.est != null ? String(meta.est) : "0"}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              onBlur={commitPurchase}
              onKeyDown={(e) => {
                if (e.key === "Enter") commitPurchase();
                if (e.key === "Escape") setEditing(false);
              }}
              aria-label={t(state.locale, "estimatedShort")}
            />
            <button className="rounded-2xl bg-black text-white px-3 py-2 text-sm font-semibold" onClick={commitPurchase}>
              {t(state.locale, "done")}
            </button>
          </div>
        )}

        {!editing && (
          <button
            onClick={() => actions.deleteItem(item.marketId, item.id)}
            className="text-brand-primary hover:bg-red-50 p-2 rounded-full transition-colors"
            aria-label={t(state.locale, "deleteItem")}
          >
            <Trash2 size={18} />
          </button>
        )}
      </div>
    </div>
  );
}
