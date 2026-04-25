import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { BarChart3, Home } from "lucide-react";
import { useDebts } from "./hooks/useDebts";
import { cn } from "./lib/ui";
import { Dashboard } from "./screens/Dashboard";
import { Weekly } from "./screens/Weekly";
import { LogoWordmark } from "./components/Logo";

type Tab = "home" | "weekly";

export default function App() {
  const store = useDebts();
  const [tab, setTab] = useState<Tab>("home");

  const tabs = useMemo(
    () =>
      [
        { id: "home" as const, label: "Home", icon: Home },
        { id: "weekly" as const, label: "Weekly", icon: BarChart3 },
      ] as const,
    [],
  );

  if (!store.isReady) {
    return (
      <div className="min-h-dvh bg-slate-50">
        <div className="mx-auto flex min-h-dvh max-w-3xl items-center justify-center px-4">
          <div className="rounded-2xl bg-white px-6 py-4 text-sm font-medium text-slate-600 shadow-card ring-1 ring-slate-200/70">
            Loading your local data…
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-slate-50">
      <div className="pointer-events-none fixed inset-0 bg-mesh-light opacity-60" />
      <div className="relative mx-auto max-w-3xl px-4 pb-16 pt-8 sm:pb-12 sm:pt-10">
        <header className="mb-8 flex flex-col gap-5 sm:mb-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <LogoWordmark />
            <nav className="inline-flex w-full overflow-hidden rounded-2xl bg-white/80 p-1 shadow-soft ring-1 ring-slate-200/70 backdrop-blur sm:w-auto">
              {tabs.map((t) => {
                const Icon = t.icon;
                const active = tab === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    className={cn(
                      "relative flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold sm:flex-none",
                      active ? "text-slate-900" : "text-slate-600 hover:text-slate-900",
                    )}
                    onClick={() => setTab(t.id)}
                    aria-pressed={active}
                  >
                    <Icon className={cn("h-4 w-4", active ? "text-sky-600" : "text-slate-400")} />
                    {t.label}
                    {active ? (
                      <motion.div
                        layoutId="tab-pill"
                        className="absolute inset-0 -z-10 rounded-xl bg-slate-900/[0.04] ring-1 ring-slate-200/70"
                        transition={{ type: "spring", stiffness: 520, damping: 38 }}
                      />
                    ) : null}
                  </button>
                );
              })}
            </nav>
          </div>

          <p className="max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
            A calm place to watch debt shrink — with clear totals, gentle motion, and progress you can feel.
          </p>
        </header>

        <main>{tab === "home" ? <Dashboard store={store} /> : <Weekly store={store} />}</main>

        <footer className="mt-12 text-center text-xs leading-relaxed text-slate-500">
          Offline-first • IndexedDB on this device • No login • No backend
        </footer>
      </div>
    </div>
  );
}
