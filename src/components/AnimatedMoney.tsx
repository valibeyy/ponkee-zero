import { useEffect, useState } from "react";
import { animate, useMotionValue, useMotionValueEvent } from "framer-motion";
import { formatMoney } from "../lib/money";

export function AnimatedMoney({ value }: { value: number }) {
  const mv = useMotionValue(value);
  const [display, setDisplay] = useState(() => Math.round(value));

  useMotionValueEvent(mv, "change", (latest) => {
    setDisplay(Math.round(latest));
  });

  useEffect(() => {
    const controls = animate(mv, value, { type: "spring", stiffness: 200, damping: 28 });
    return () => controls.stop();
  }, [mv, value]);

  return <span className="tabular-nums">{formatMoney(display)}</span>;
}
