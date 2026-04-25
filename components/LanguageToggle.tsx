"use client";

import { Languages } from "lucide-react";
import { useCart } from "@/context/CartContext";

export function LanguageToggle() {
  const { state, actions } = useCart();

  return (
    <button
      onClick={() => actions.setLocale(state.locale === "en" ? "tr" : "en")}
      className="inline-flex items-center gap-2 rounded-2xl bg-white/80 backdrop-blur ring-1 ring-black/10 px-3 py-2 text-sm font-semibold active:scale-[0.99] transition-transform"
      aria-label="Toggle language"
      title={state.locale === "en" ? "Türkçe" : "English"}
    >
      <Languages className="h-4 w-4" />
      <span className="tabular-nums">{state.locale.toUpperCase()}</span>
    </button>
  );
}
