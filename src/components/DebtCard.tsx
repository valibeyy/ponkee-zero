import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Pencil, Plus, Trash2 } from "lucide-react";
import type { Debt } from "../lib/types";
import { formatMoney } from "../lib/money";
import { Button } from "./Button";
import { Modal } from "./Modal";
import { DebtForm } from "./DebtForm";
import { PaymentForm } from "./PaymentForm";
import { ProgressBar } from "./ProgressBar";

export function DebtCard({
  debt,
  onEdit,
  onDelete,
  onAddPayment,
}: {
  debt: Debt;
  onEdit: (
    id: string,
    patch: Partial<Pick<Debt, "name" | "totalAmount" | "remainingAmount" | "interestRate" | "minimumPayment">>,
  ) => void;
  onDelete: (id: string) => void;
  onAddPayment: (id: string, p: { date: string; amount: number }) => void;
}) {
  const [editOpen, setEditOpen] = useState(false);
  const [payOpen, setPayOpen] = useState(false);

  const progress = useMemo(() => {
    if (debt.totalAmount <= 0) return 0;
    const paid = Math.max(0, debt.totalAmount - debt.remainingAmount);
    return paid / debt.totalAmount;
  }, [debt.remainingAmount, debt.totalAmount]);

  const lastPayment = debt.payments[0];

  return (
    <motion.div
      layout
      className="group relative overflow-hidden rounded-2xl bg-white p-5 shadow-card ring-1 ring-slate-200/70"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 420, damping: 34 }}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-200/70 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="truncate text-lg font-semibold tracking-tight text-slate-900">{debt.name}</div>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-500">
            <span>{debt.interestRate != null ? `${debt.interestRate}% APR` : "APR —"}</span>
            {debt.minimumPayment != null ? (
              <span className="text-slate-600">Min {formatMoney(debt.minimumPayment)}</span>
            ) : null}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1 sm:justify-end">
          <Button variant="ghost" size="sm" onClick={() => setPayOpen(true)}>
            <Plus className="h-4 w-4" /> Pay
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setEditOpen(true)}>
            <Pencil className="h-4 w-4" /> Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              if (confirm(`Delete “${debt.name}”? This can’t be undone.`)) onDelete(debt.id);
            }}
          >
            <Trash2 className="h-4 w-4" /> Delete
          </Button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-5">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Remaining</div>
          <div className="mt-1 text-2xl font-semibold tracking-tight text-slate-900 tabular-nums">
            {formatMoney(debt.remainingAmount)}
          </div>
        </div>
        <div>
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Paid</div>
          <div className="mt-1 text-2xl font-semibold tracking-tight text-slate-900 tabular-nums">
            {formatMoney(Math.max(0, debt.totalAmount - debt.remainingAmount))}
          </div>
        </div>
      </div>

      <div className="mt-5 space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span className="font-medium text-slate-600">{Math.round(progress * 100)}% toward zero</span>
          <span className="tabular-nums text-slate-600">{formatMoney(debt.totalAmount)} total</span>
        </div>
        <ProgressBar value={progress} />
        {lastPayment ? (
          <div className="pt-1 text-xs text-slate-500">
            Last payment: <span className="font-semibold text-slate-700 tabular-nums">{formatMoney(lastPayment.amount)}</span>{" "}
            on {lastPayment.date}
          </div>
        ) : (
          <div className="pt-1 text-xs text-slate-500">No payments yet — your first one will feel great.</div>
        )}
      </div>

      <Modal open={editOpen} title="Edit debt" onClose={() => setEditOpen(false)}>
        <DebtForm
          submitLabel="Save changes"
          initial={debt}
          onCancel={() => setEditOpen(false)}
          onSubmit={(draft) => {
            onEdit(debt.id, draft);
            setEditOpen(false);
          }}
        />
      </Modal>

      <Modal open={payOpen} title="Add payment" onClose={() => setPayOpen(false)}>
        <PaymentForm
          maxAmount={debt.remainingAmount}
          onCancel={() => setPayOpen(false)}
          onSubmit={(p) => {
            onAddPayment(debt.id, p);
            setPayOpen(false);
          }}
        />
      </Modal>
    </motion.div>
  );
}
