"use client";

import { CartLogo } from "@/components/CartLogo";
import { LanguageToggle } from "@/components/LanguageToggle";
import { useCart } from "@/context/CartContext";
import { t } from "@/lib/i18n";

export function ScreenHeader({ subtitle }: { subtitle?: string }) {
  const { state } = useCart();
  return (
    <header className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-3 min-w-0">
        <CartLogo />
        <div className="min-w-0">
          <p className="text-sm font-semibold tracking-tight truncate">{t(state.locale, "appName")}</p>
          {subtitle ? <p className="text-xs font-semibold text-black/55 truncate">{subtitle}</p> : null}
        </div>
      </div>
      <LanguageToggle />
    </header>
  );
}
