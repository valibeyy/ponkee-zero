import { AnimatePresence, motion } from "framer-motion";

export function Toast({ open, message }: { open: boolean; message: string }) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed bottom-5 left-1/2 z-50 w-[min(92vw,520px)] -translate-x-1/2"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 14 }}
          transition={{ type: "spring", stiffness: 520, damping: 36 }}
        >
          <div className="flex items-start gap-3 rounded-2xl bg-slate-900 px-4 py-3 text-sm text-white shadow-card">
            <motion.span
              className="mt-0.5 inline-block h-2.5 w-2.5 shrink-0 rounded-full bg-emerald-400"
              initial={{ scale: 0.9, opacity: 0.75 }}
              animate={{ scale: [0.9, 1.12, 1], opacity: [0.75, 1, 0.92] }}
              transition={{ duration: 0.55, times: [0, 0.55, 1] }}
            />
            <div className="min-w-0 flex-1 leading-relaxed">{message}</div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
