"use client";

import { useMemo, useState } from "react";
import { Wallet } from "lucide-react";
import { clamp, formatMoney } from "@/lib/budget";
import { useCart } from "@/context/CartContext";
import { BudgetEditModal } from "@/components/BudgetEditModal";
import { t } from "@/lib/i18n";

export function BudgetCard() {
  const { state, derived } = useCart();
  const [editingBudget, setEditingBudget] = useState(false);

  const pct = useMemo(() => {
    if (state.budget <= 0) return 0;
    return clamp((derived.totalSpent / state.budget) * 100, 0, 140);
  }, [derived.totalSpent, state.budget]);

  const exceeded = derived.remaining < 0;

  return (
    <section className="relative overflow-hidden rounded-[28px] bg-white shadow-card ring-1 ring-black/10">
      <div className="absolute inset-0 bg-mesh-light opacity-90" />
      <div className="relative p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-sm font-semibold tracking-tight text-black/70">{t(state.locale, "thisMonthsBudget")}</p>
            <div className="mt-3 flex items-center gap-3">
              <span className="inline-flex items-center justify-center rounded-2xl bg-black text-white p-3 shadow-soft">
                <Wallet className="h-5 w-5" />
              </span>
              <button
                className="text-left"
                onClick={() => setEditingBudget(true)}
                aria-label={t(state.locale, "budgetEditTitle")}
              >
                <div className="text-4xl font-semibold tracking-tight tabular-nums">{formatMoney(state.budget)}</div>
                <div className="mt-1 text-xs font-semibold text-black/55">{t(state.locale, "tapToBuyHint")}</div>
              </button>
            </div>
          </div>

          <div className="text-right">
            <p className="text-xs font-semibold text-black/60">{t(state.locale, "spent")}</p>
            <p className="text-xl font-semibold tabular-nums">{formatMoney(derived.totalSpent)}</p>
            <p className="mt-2 text-xs font-semibold">
              {exceeded ? (
                <span className="text-brand-primary">
                  {t(state.locale, "overBy")} {formatMoney(derived.exceededBy)}
                </span>
              ) : (
                <span className="text-black/75">
                  {t(state.locale, "remaining")}: <span className="text-black tabular-nums">{formatMoney(derived.remaining)}</span>
                </span>
              )}
            </p>
          </div>
        </div>

        <div className="mt-5">
          <div className="h-4 w-full rounded-full bg-black overflow-hidden ring-1 ring-black/10">
            <div
              className={[
                "h-full rounded-full transition-[width] duration-300 bg-brand-primary",
                exceeded ? "cp-pulse" : "",
              ].join(" ")}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      </div>

      {exceeded && (
        <div className="relative px-5 py-3 bg-brand-primary text-white text-sm font-semibold">
          {t(state.locale, "budgetExceededBy")} {formatMoney(derived.exceededBy)}
        </div>
      )}

      <BudgetEditModal open={editingBudget} onClose={() => setEditingBudget(false)} />
    </section>
  );
}
