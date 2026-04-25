const STORAGE_KEY = "cartpilot:v2";
const LEGACY_STORAGE_KEY = "cartpilot:v1";

export type PersistedState = unknown;

export function loadFromStorage<T>(fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function createDebouncedSaver(delayMs: number) {
  let t: number | null = null;
  const saveNow = (state: PersistedState) => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore quota / serialization issues
    }
  };

  const cancel = () => {
    if (typeof window === "undefined") return;
    if (t) window.clearTimeout(t);
    t = null;
  };

  const schedule = (state: PersistedState) => {
    if (typeof window === "undefined") return;
    if (t) window.clearTimeout(t);
    t = window.setTimeout(() => {
      saveNow(state);
      t = null;
    }, delayMs);
  };

  const clearAll = () => {
    if (typeof window === "undefined") return;
    cancel();
    try {
      window.localStorage.removeItem(STORAGE_KEY);
      window.localStorage.removeItem(LEGACY_STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  return { schedule, saveNow, cancel, clearAll };
}
