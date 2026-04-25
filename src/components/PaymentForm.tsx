import { useState } from "react";
import { Input } from "./Input";
import { Button } from "./Button";
import { todayISO } from "../lib/date";

function toNum(v: string) {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

export function PaymentForm({
  onSubmit,
  onCancel,
  maxAmount,
}: {
  onSubmit: (p: { date: string; amount: number }) => void;
  onCancel: () => void;
  maxAmount: number;
}) {
  const [date, setDate] = useState(todayISO());
  const [amount, setAmount] = useState("");

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({ date, amount: Math.min(maxAmount, Math.max(0, toNum(amount))) });
      }}
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input label="Date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <Input
          label="Amount"
          inputMode="decimal"
          placeholder="250"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          hint={maxAmount > 0 ? `Up to ${Math.round(maxAmount).toLocaleString()}` : "Already at zero"}
        />
      </div>
      <div className="flex items-center justify-end gap-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={maxAmount <= 0}>
          Add payment
        </Button>
      </div>
    </form>
  );
}
