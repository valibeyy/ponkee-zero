import { useEffect, useMemo, useState } from "react";
import { ArrowDownWideNarrow, Flame, Plus, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "../components/Button";
import { DebtCard } from "../components/DebtCard";
import { Modal } from "../components/Modal";
import { DebtForm } from "../components/DebtForm";
import { ProgressBar } from "../components/ProgressBar";
import { Toast } from "../components/Toast";
import { AnimatedMoney } from "../components/AnimatedMoney";
import { formatMoney } from "../lib/money";
import type { SortMode } from "../lib/types";
import { useStreak } from "../hooks/useStreak";
import type { ReturnTypeDebts } from "./types";

const sortLabels: Record<SortMode, string> = {
  snowball: "Snowball",
  avalanche: "Avalanche",
};

export function Dashboard({ store }: { store: ReturnTypeDebts }) {
  const { streakDays } = useStreak(store.actionTick);
  const [addOpen, setAddOpen] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);

  useEffect(() => {
    if (!store.lastDelta) return;
    if (Date.now() - store.lastDelta.at > 2500) return;
    setToastOpen(true);
    const t = window.setTimeout(() => setToastOpen(false), 2800);
    return () => window.clearTimeout(t);
  }, [store.lastDelta]);

  const deltaText = useMemo(() => {
    if (!store.lastDelta) return "";
    return `${formatMoney(store.lastDelta.before)} → ${formatMoney(store.lastDelta.after)}`;
  }, [store.lastDelta]);

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-3xl bg-white p-6 shadow-card ring-1 ring-slate-200/70 sm:p-8">
        <div className="pointer-events-none absolute inset-0 bg-mesh-light" />
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-sky-200/25 blur-3xl" />
        <div className="pointer-events-none absolute -left-28 -bottom-28 h-72 w-72 rounded-full bg-teal-200/20 blur-3xl" />

        <div className="relative">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-xs font-semibold text-slate-700 shadow-soft ring-1 ring-slate-200/70 backdrop-blur">
                <Sparkles className="h-3.5 w-3.5 text-sky-600" />
                Zero progress, visible relief
              </div>

              <div className="mt-4 text-sm font-semibold text-slate-500">Total remaining</div>
              <motion.div
                key={store.totals.remaining}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 text-4xl font-semibold tracking-tight text-slate-900 sm:text-6xl"
              >
                <span className="tabular-nums">
                  <AnimatedMoney value={store.totals.remaining} />
                </span>
              </motion.div>

              <div className="mt-3 text-sm leading-relaxed text-slate-600">
                Total paid so far:{" "}
                <span className="font-semibold text-slate-900 tabular-nums">{formatMoney(store.totals.paid)}</span>
              </div>
            </div>

            <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center lg:flex-col lg:items-end">
              <div className="inline-flex items-center gap-2 rounded-2xl bg-white/75 px-4 py-3 shadow-soft ring-1 ring-slate-200/70 backdrop-blur">
                <Flame className="h-4 w-4 text-orange-500" />
                <div className="text-sm text-slate-700">
                  <span className="font-semibold text-slate-900">{streakDays}</span> day streak
                </div>
              </div>
              <Button onClick={() => setAddOpen(true)} className="w-full sm:w-auto">
                <Plus className="h-4 w-4" /> Add debt
              </Button>
            </div>
          </div>

          <div className="relative mt-8 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-semibold text-slate-600">{Math.round(store.totals.progress * 100)}% toward ZERO</span>
              <span className="tabular-nums font-medium text-slate-600">{formatMoney(store.totals.total)}</span>
            </div>
            <ProgressBar value={store.totals.progress} />
            {deltaText ? (
              <div className="pt-1 text-xs text-slate-500">
                Latest move: <span className="font-semibold text-slate-700 tabular-nums">{deltaText}</span>
              </div>
            ) : null}
          </div>

          <div className="relative mt-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm font-semibold text-slate-900">Your debts</div>
            <div className="flex items-center gap-2">
              <ArrowDownWideNarrow className="h-4 w-4 text-slate-400" />
              <div className="inline-flex overflow-hidden rounded-2xl bg-white/70 p-1 shadow-soft ring-1 ring-slate-200/70 backdrop-blur">
                {(["snowball", "avalanche"] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    className={[
                      "rounded-xl px-3 py-2 text-sm font-semibold transition-colors",
                      store.sortMode === m
                        ? "bg-slate-900 text-white shadow-soft"
                        : "text-slate-700 hover:bg-slate-50",
                    ].join(" ")}
                    onClick={() => store.setSort(m)}
                    aria-pressed={store.sortMode === m}
                  >
                    {sortLabels[m]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {store.debts.length === 0 ? (
        <div className="relative overflow-hidden rounded-3xl bg-white p-10 text-center shadow-card ring-1 ring-slate-200/70 sm:p-12">
          <div className="pointer-events-none absolute inset-0 bg-mesh-light opacity-70" />
          <div className="relative mx-auto max-w-md">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-soft">
              <Sparkles className="h-5 w-5 text-sky-300" />
            </div>
            <div className="text-2xl font-semibold tracking-tight text-slate-900">Start your journey to zero debt.</div>
            <div className="mt-3 text-sm leading-relaxed text-slate-600">
              Add your first debt, log payments, and watch the number move in the right direction — privately, on this device.
            </div>
            <div className="mt-8 flex justify-center">
              <Button onClick={() => setAddOpen(true)}>
                <Plus className="h-4 w-4" /> Add your first debt
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {store.debts.map((d) => (
            <DebtCard
              key={d.id}
              debt={d}
              onEdit={store.editDebt}
              onDelete={store.deleteDebt}
              onAddPayment={(id, p) => store.addPayment(id, { date: p.date, amount: p.amount })}
            />
          ))}
        </div>
      )}

      <Modal open={addOpen} title="Add a debt" onClose={() => setAddOpen(false)}>
        <DebtForm
          submitLabel="Add debt"
          onCancel={() => setAddOpen(false)}
          onSubmit={(draft) => {
            store.addDebt(draft);
            setAddOpen(false);
          }}
        />
      </Modal>

      <Toast
        open={toastOpen}
        message={
          deltaText ? `Nice. You just reduced your debt. ${deltaText}` : "Nice. You just reduced your debt."
        }
      />
    </div>
  );
}
