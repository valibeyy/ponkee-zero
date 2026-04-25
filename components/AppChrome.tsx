"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LayoutGrid, Settings } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { t } from "@/lib/i18n";

function NavItem({
  href,
  label,
  icon: Icon,
  active,
}: {
  href: string;
  label: string;
  icon: typeof Home;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={[
        "flex flex-1 flex-col items-center justify-center gap-1 py-2 text-xs font-semibold",
        active ? "text-white" : "text-white/70",
      ].join(" ")}
    >
      <Icon className={["h-5 w-5", active ? "opacity-100" : "opacity-80"].join(" ")} />
      <span>{label}</span>
    </Link>
  );
}

export function AppChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { state } = useCart();

  const hideChrome = pathname?.startsWith("/market/");
  const active = (p: string) => pathname === p;

  return (
    <div className="min-h-[100dvh] bg-white text-brand-ink">
      <div className={hideChrome ? "" : "pb-[calc(72px+env(safe-area-inset-bottom))]"}>{children}</div>

      {!hideChrome && (
        <nav className="fixed bottom-0 inset-x-0 z-40">
          <div className="mx-auto w-full max-w-[440px] px-3 pb-[max(10px,env(safe-area-inset-bottom))]">
            <div className="rounded-3xl bg-black text-white shadow-card ring-1 ring-black/10 overflow-hidden">
              <div className="grid grid-cols-3">
                <NavItem href="/" label={t(state.locale, "navHome")} icon={Home} active={active("/")} />
                <NavItem href="/lists" label={t(state.locale, "navLists")} icon={LayoutGrid} active={active("/lists")} />
                <NavItem href="/settings" label={t(state.locale, "navSettings")} icon={Settings} active={active("/settings")} />
              </div>
            </div>
          </div>
        </nav>
      )}
    </div>
  );
}
