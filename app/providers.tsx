"use client";

import { CartProvider } from "@/context/CartContext";
import { AppChrome } from "@/components/AppChrome";
import { QuickAddItemSheet } from "@/components/QuickAddItemSheet";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <AppChrome>{children}</AppChrome>
      <QuickAddItemSheet />
    </CartProvider>
  );
}
