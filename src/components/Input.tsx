import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "../lib/ui";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  hint?: string;
};

export const Input = forwardRef<HTMLInputElement, Props>(function Input(
  { className, label, hint, ...props },
  ref,
) {
  return (
    <label className="block">
      {label ? <div className="mb-1.5 text-sm font-semibold text-slate-800">{label}</div> : null}
      <input
        ref={ref}
        className={cn(
          "h-11 w-full rounded-xl bg-white px-3 text-sm text-slate-900 shadow-soft ring-1 ring-slate-200/80 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-300/70 focus:ring-offset-2 focus:ring-offset-white",
          className,
        )}
        {...props}
      />
      {hint ? <div className="mt-1.5 text-xs leading-relaxed text-slate-500">{hint}</div> : null}
    </label>
  );
});
