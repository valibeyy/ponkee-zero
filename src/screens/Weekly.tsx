import { useMemo } from "react";
import { Calendar, TrendingDown } from "lucide-react";
import { startOfWeekISO, todayISO } from "../lib/date";
import { formatMoney } from "../lib/money";
import { useStreak } from "../hooks/useStreak";
import type { ReturnTypeDebts } from "./types";

export function Weekly({ store }: { store: ReturnTypeDebts }) {
  const { streakDays } = useStreak(store.actionTick);
  const weekStart = startOfWeekISO(todayISO());
  const today = todayISO();

  const summary = useMemo(() => {
    const payments = store.rawDebts.flatMap((d) => d.payments.map((p) => ({ ...p, debtName: d.name })));
    const thisWeek = payments.filter((p) => p.date >= weekStart && p.date <= today);
    const totalPaid = thisWeek.reduce((s, p) => s + p.amount, 0);
    const count = thisWeek.length;
    const top = [...thisWeek].sort((a, b) => b.amount - a.amount)[0];
    return { totalPaid, count, top };
  }, [store.rawDebts, today, weekStart]);

  const progressText = useMemo(() => {
    if (store.totals.total <= 0) return "Add a debt to start tracking progress.";
    const pct = Math.round(store.totals.progress * 100);
    return `${pct}% toward ZERO overall.`;
  }, [store.totals.progress, store.totals.total]);

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-3xl bg-white p-6 shadow-card ring-1 ring-slate-200/70 sm:p-8">
        <div className="pointer-events-none absolute inset-0 bg-mesh-light" />
        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600">
              <Calendar className="h-4 w-4 text-sky-600" /> This week
            </div>
            <div className="mt-3 text-4xl font-semibold tracking-tight text-slate-900 tabular-nums sm:text-5xl">
              {formatMoney(summary.totalPaid)}
            </div>
            <div className="mt-3 text-sm leading-relaxed text-slate-600">
              {summary.count} payment{summary.count === 1 ? "" : "s"} logged • {progressText}
            </div>
          </div>

          <div className="self-start rounded-2xl bg-white/75 px-4 py-3 text-sm text-slate-700 shadow-soft ring-1 ring-slate-200/70 backdrop-blur">
            <span className="font-semibold text-slate-900">{streakDays}</span> day streak
          </div>
        </div>
      </div>

      <div className="rounded-3xl bg-white p-6 shadow-card ring-1 ring-slate-200/70 sm:p-8">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
          <TrendingDown className="h-4 w-4 text-emerald-600" /> Highlights
        </div>
        <div className="mt-4 text-sm leading-relaxed text-slate-600">
          {summary.totalPaid > 0 ? (
            <>
              You paid <span className="font-semibold text-slate-900 tabular-nums">{formatMoney(summary.totalPaid)}</span>{" "}
              this week.
              {summary.top ? (
                <span className="mt-2 block sm:mt-0 sm:inline sm:ml-2">
                  Biggest step:{" "}
                  <span className="font-semibold text-slate-900 tabular-nums">{formatMoney(summary.top.amount)}</span>{" "}
                  toward <span className="font-semibold text-slate-900">{summary.top.debtName}</span>.
                </span>
              ) : null}
            </>
          ) : (
            <>No payments logged yet this week. A small step still counts.</>
          )}
        </div>
      </div>
    </div>
  );
}
