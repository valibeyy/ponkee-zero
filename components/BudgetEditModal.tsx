"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { t } from "@/lib/i18n";

export function BudgetEditModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { state, actions } = useCart();
  const [value, setValue] = useState(() => String(state.budget));
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!open) return;
    setValue(String(state.budget));
    queueMicrotask(() => inputRef.current?.focus());
  }, [open, state.budget]);

  const parsed = useMemo(() => {
    const n = Number(value);
    return Number.isFinite(n) ? Math.max(0, n) : null;
  }, [value]);

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-50" onClick={onClose} aria-hidden />
      <div className="fixed inset-x-0 bottom-0 z-50">
        <div className="mx-auto w-full max-w-[440px] px-4 pb-[max(14px,env(safe-area-inset-bottom))]">
          <div className="rounded-[28px] bg-white shadow-card ring-1 ring-black/10 overflow-hidden">
            <div className="p-4 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-base font-semibold tracking-tight">{t(state.locale, "budgetEditTitle")}</p>
                <p className="mt-1 text-sm font-semibold text-black/65">{t(state.locale, "budgetEditSubtitle")}</p>
              </div>
              <button className="p-2 rounded-full hover:bg-black/5" onClick={onClose} aria-label="Close">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="px-4 pb-4">
              <input
                ref={inputRef}
                inputMode="numeric"
                className="w-full rounded-2xl ring-1 ring-black/10 px-4 py-4 text-3xl font-semibold tracking-tight outline-none"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                aria-label="Budget"
              />

              <div className="mt-3 flex gap-2">
                <button
                  className="flex-1 rounded-2xl bg-white ring-1 ring-black/10 px-4 py-3 text-base font-semibold"
                  onClick={onClose}
                >
                  {t(state.locale, "cancel")}
                </button>
                <button
                  className="flex-1 rounded-2xl bg-brand-primary text-white px-4 py-3 text-base font-semibold disabled:opacity-50"
                  disabled={parsed == null}
                  onClick={() => {
                    if (parsed == null) return;
                    actions.setBudget(parsed);
                    onClose();
                  }}
                >
                  {t(state.locale, "save")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
