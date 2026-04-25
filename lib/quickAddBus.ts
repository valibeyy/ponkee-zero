import type { CategoryId } from "@/context/CartContext";

export type QuickAddPayload = {
  marketId: string;
  category: CategoryId;
};

type Listener = (p: QuickAddPayload) => void;

const listeners = new Set<Listener>();

export function subscribeQuickAdd(listener: Listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function publishQuickAdd(payload: QuickAddPayload) {
  for (const l of listeners) l(payload);
}
