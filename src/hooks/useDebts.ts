import { useEffect, useMemo, useState } from "react";
import { dbBumpAction, dbDeleteDebt, dbGetDebts, dbGetMeta, dbPutDebt, dbSetMeta } from "../lib/db";
import { clampToMoney } from "../lib/money";
import { todayISO } from "../lib/date";
import type { Debt, Payment, SortMode } from "../lib/types";

type LastDelta = { before: number; after: number; at: number; debtId?: string };

function sortDebts(debts: Debt[], sortMode: SortMode) {
  const copy = [...debts];
  if (sortMode === "snowball") {
    copy.sort((a, b) => a.remainingAmount - b.remainingAmount || a.createdAt - b.createdAt);
    return copy;
  }
  copy.sort((a, b) => {
    const ir = (b.interestRate ?? 0) - (a.interestRate ?? 0);
    if (ir !== 0) return ir;
    const rem = a.remainingAmount - b.remainingAmount;
    if (rem !== 0) return rem;
    return a.createdAt - b.createdAt;
  });
  return copy;
}

export function useDebts() {
  const [debts, setDebts] = useState<Debt[]>([]);
  const [isReady, setIsReady] = useState(false);
  const [sortMode, setSortMode] = useState<SortMode>("snowball");
  const [lastDelta, setLastDelta] = useState<LastDelta | null>(null);
  const [actionTick, setActionTick] = useState(0);

  useEffect(() => {
    let alive = true;
    (async () => {
      const [d, savedSort, savedDelta] = await Promise.all([
        dbGetDebts(),
        dbGetMeta<SortMode>("sortMode"),
        dbGetMeta<LastDelta>("lastDelta"),
      ]);
      if (!alive) return;
      setDebts(d);
      if (savedSort) setSortMode(savedSort);
      if (savedDelta) setLastDelta(savedDelta);
      setIsReady(true);
    })();
    return () => {
      alive = false;
    };
  }, []);

  const sortedDebts = useMemo(() => sortDebts(debts, sortMode), [debts, sortMode]);

  const totals = useMemo(() => {
    const total = debts.reduce((s, d) => s + d.totalAmount, 0);
    const remaining = debts.reduce((s, d) => s + d.remainingAmount, 0);
    const paid = Math.max(0, total - remaining);
    const progress = total <= 0 ? 0 : paid / total;
    return {
      total: clampToMoney(total),
      remaining: clampToMoney(remaining),
      paid: clampToMoney(paid),
      progress,
    };
  }, [debts]);

  async function setSort(next: SortMode) {
    setSortMode(next);
    await dbSetMeta("sortMode", next);
  }

  async function addDebt(input: Omit<Debt, "id" | "createdAt" | "payments">) {
    const now = Date.now();
    const id = crypto.randomUUID();
    const totalAmount = clampToMoney(Math.max(0, input.totalAmount));
    const remainingAmount = clampToMoney(Math.min(totalAmount, Math.max(0, input.remainingAmount)));
    const debt: Debt = {
      id,
      name: input.name.trim() || "Debt",
      totalAmount,
      remainingAmount,
      interestRate: input.interestRate,
      minimumPayment: input.minimumPayment,
      createdAt: now,
      payments: [],
    };
    setDebts((prev) => [...prev, debt]);
    await Promise.all([dbPutDebt(debt), dbBumpAction(todayISO())]);
    setActionTick((x) => x + 1);
  }

  async function editDebt(id: string, patch: Partial<Omit<Debt, "id" | "createdAt" | "payments">>) {
    setDebts((prev) =>
      prev.map((d) => {
        if (d.id !== id) return d;
        const nextTotal = clampToMoney(Math.max(0, patch.totalAmount ?? d.totalAmount));
        const nextRemainingRaw = patch.remainingAmount ?? d.remainingAmount;
        const nextRemaining = clampToMoney(Math.min(nextTotal, Math.max(0, nextRemainingRaw)));
        const next: Debt = {
          ...d,
          name: (patch.name ?? d.name).trim() || d.name,
          totalAmount: nextTotal,
          remainingAmount: nextRemaining,
          interestRate: patch.interestRate ?? d.interestRate,
          minimumPayment: patch.minimumPayment ?? d.minimumPayment,
        };
        void dbPutDebt(next);
        return next;
      }),
    );
    await dbBumpAction(todayISO());
    setActionTick((x) => x + 1);
  }

  async function deleteDebt(id: string) {
    setDebts((prev) => prev.filter((d) => d.id !== id));
    await Promise.all([dbDeleteDebt(id), dbBumpAction(todayISO())]);
    setActionTick((x) => x + 1);
  }

  async function addPayment(debtId: string, payment: Payment) {
    const iso = payment.date;
    const amount = clampToMoney(Math.max(0, payment.amount));
    if (amount <= 0) return;

    let delta: LastDelta | null = null;
    setDebts((prev) =>
      prev.map((d) => {
        if (d.id !== debtId) return d;
        const before = clampToMoney(d.remainingAmount);
        const after = clampToMoney(Math.max(0, before - amount));
        delta = { before, after, at: Date.now(), debtId };
        const next: Debt = {
          ...d,
          remainingAmount: after,
          payments: [{ date: iso, amount }, ...d.payments],
        };
        void dbPutDebt(next);
        return next;
      }),
    );
    if (delta) {
      setLastDelta(delta);
      await dbSetMeta("lastDelta", delta);
    }
    await dbBumpAction(todayISO());
    setActionTick((x) => x + 1);
  }

  return {
    isReady,
    debts: sortedDebts,
    rawDebts: debts,
    totals,
    sortMode,
    setSort,
    lastDelta,
    actionTick,
    addDebt,
    editDebt,
    deleteDebt,
    addPayment,
  };
}
