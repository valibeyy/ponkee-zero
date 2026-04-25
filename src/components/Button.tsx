import { type ButtonHTMLAttributes } from "react";
import { motion } from "framer-motion";
import { cn } from "../lib/ui";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md";
};

export function Button({ className, variant = "primary", size = "md", ...props }: Props) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-[transform,box-shadow,background-color,color] disabled:pointer-events-none disabled:opacity-45";
  const sizes = size === "sm" ? "h-9 px-3 text-sm" : "h-11 px-4 text-sm";
  const variants: Record<NonNullable<Props["variant"]>, string> = {
    primary:
      "bg-gradient-to-b from-sky-500 to-blue-600 text-white shadow-soft hover:brightness-[1.03] active:brightness-[0.98]",
    secondary:
      "bg-white text-slate-900 shadow-soft ring-1 ring-slate-200/80 hover:bg-slate-50",
    danger: "bg-slate-900 text-white hover:bg-slate-800",
    ghost: "bg-transparent text-slate-700 hover:bg-slate-100/80",
  };

  return (
    <motion.div whileTap={{ scale: 0.985 }} className="inline-flex">
      <button className={cn(base, sizes, variants[variant], className)} {...props} />
    </motion.div>
  );
}
