import { useEffect, useMemo, useState } from "react";
import { addDaysISO, todayISO } from "../lib/date";
import { dbGetActionsInRange } from "../lib/db";
import type { ISODate } from "../lib/types";

export function useStreak(refreshKey?: number) {
  const [daysWithActions, setDaysWithActions] = useState<Set<ISODate>>(new Set());

  useEffect(() => {
    let alive = true;
    (async () => {
      const end = todayISO();
      const start = addDaysISO(end, -90);
      const actions = await dbGetActionsInRange(start, end);
      if (!alive) return;
      setDaysWithActions(new Set(actions.filter((a) => a.count > 0).map((a) => a.date)));
    })();
    return () => {
      alive = false;
    };
  }, [refreshKey]);

  const streakDays = useMemo(() => {
    const end = todayISO();
    let s = 0;
    let cursor = end;
    while (daysWithActions.has(cursor)) {
      s++;
      cursor = addDaysISO(cursor, -1);
      if (s > 365) break;
    }
    return s;
  }, [daysWithActions]);

  return { streakDays };
}
