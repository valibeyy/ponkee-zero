import { useId } from "react";
import { cn } from "../lib/ui";

export function LogoMark({ className, size = 36 }: { className?: string; size?: number }) {
  const gid = useId().replace(/:/g, "");

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0", className)}
      aria-hidden
    >
      <rect width="40" height="40" rx="12" className="fill-slate-900" />
      <circle cx="20" cy="20" r="11" stroke={`url(#pzGrad-${gid})`} strokeWidth="2.25" opacity={0.95} />
      <path
        d="M15 26V14h5.2c2.4 0 3.9 1.3 3.9 3.3 0 2-1.5 3.3-3.9 3.3H17.4V26H15zm2.4-7.8v2.4h2.6c1.1 0 1.8-.6 1.8-1.6 0-1-.7-1.6-1.8-1.6h-2.6z"
        className="fill-white"
      />
      <defs>
        <linearGradient id={`pzGrad-${gid}`} x1="8" y1="8" x2="34" y2="34" gradientUnits="userSpaceOnUse">
          <stop stopColor="#38bdf8" />
          <stop offset="1" stopColor="#2dd4bf" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function LogoWordmark({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-3", className)} aria-label="Ponkee Zero">
      <LogoMark size={40} />
      <div className="leading-tight">
        <div className="text-base font-semibold tracking-tight text-slate-900">Ponkee Zero</div>
        <div className="text-xs font-medium text-slate-500">Debt → zero, calmly.</div>
      </div>
    </div>
  );
}
