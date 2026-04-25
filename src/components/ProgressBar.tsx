import { motion } from "framer-motion";

export function ProgressBar({ value }: { value: number }) {
  const pct = Math.max(0, Math.min(1, value));
  return (
    <div className="relative h-3 w-full overflow-hidden rounded-full bg-slate-100 ring-1 ring-slate-200/70">
      <motion.div
        className="h-3 rounded-full bg-gradient-to-r from-sky-500 via-blue-600 to-teal-500"
        initial={false}
        animate={{ width: `${pct * 100}%` }}
        transition={{ type: "spring", stiffness: 220, damping: 30 }}
      />
    </div>
  );
}
