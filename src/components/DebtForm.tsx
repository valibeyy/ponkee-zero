import { useMemo, useState } from "react";
import { Input } from "./Input";
import { Button } from "./Button";
import type { Debt } from "../lib/types";
import { clampToMoney } from "../lib/money";

type DebtDraft = Pick<Debt, "name" | "totalAmount" | "remainingAmount" | "interestRate" | "minimumPayment">;

function toNum(v: string) {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

export function DebtForm({
  initial,
  submitLabel,
  onSubmit,
  onCancel,
}: {
  initial?: Partial<DebtDraft>;
  submitLabel: string;
  onSubmit: (draft: DebtDraft) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [totalAmount, setTotalAmount] = useState(String(initial?.totalAmount ?? ""));
  const [remainingAmount, setRemainingAmount] = useState(String(initial?.remainingAmount ?? ""));
  const [interestRate, setInterestRate] = useState(String(initial?.interestRate ?? ""));
  const [minimumPayment, setMinimumPayment] = useState(String(initial?.minimumPayment ?? ""));

  const preview = useMemo(() => {
    const total = clampToMoney(Math.max(0, toNum(totalAmount)));
    const remaining = clampToMoney(Math.min(total, Math.max(0, toNum(remainingAmount || totalAmount))));
    return { total, remaining };
  }, [totalAmount, remainingAmount]);

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        const total = clampToMoney(Math.max(0, toNum(totalAmount)));
        const remaining = clampToMoney(Math.min(total, Math.max(0, toNum(remainingAmount || totalAmount))));
        onSubmit({
          name: name.trim() || "Debt",
          totalAmount: total,
          remainingAmount: remaining,
          interestRate: interestRate.trim() === "" ? undefined : toNum(interestRate),
          minimumPayment: minimumPayment.trim() === "" ? undefined : toNum(minimumPayment),
        });
      }}
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Input label="Debt name" placeholder="Credit card, car loan…" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <Input
          label="Total amount"
          inputMode="decimal"
          placeholder="12450"
          value={totalAmount}
          onChange={(e) => setTotalAmount(e.target.value)}
          hint={`Preview total: ${preview.total.toLocaleString()}`}
        />
        <Input
          label="Remaining"
          inputMode="decimal"
          placeholder="11980"
          value={remainingAmount}
          onChange={(e) => setRemainingAmount(e.target.value)}
          hint={`Clamped to 0–${preview.total.toLocaleString()}`}
        />
        <Input
          label="APR % (optional)"
          inputMode="decimal"
          placeholder="19.9"
          value={interestRate}
          onChange={(e) => setInterestRate(e.target.value)}
          hint="Used for Avalanche ordering"
        />
        <Input
          label="Minimum payment (optional)"
          inputMode="decimal"
          placeholder="80"
          value={minimumPayment}
          onChange={(e) => setMinimumPayment(e.target.value)}
        />
      </div>

      <div className="flex items-center justify-end gap-2 pt-1">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">{submitLabel}</Button>
      </div>
    </form>
  );
}
