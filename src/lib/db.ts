import { openDB, type DBSchema } from "idb";
import type { Debt, ISODate } from "./types";

type MetaKey = "sortMode" | "lastDelta";

interface PonkeeDb extends DBSchema {
  debts: { key: string; value: Debt };
  actions: { key: ISODate; value: { date: ISODate; count: number } };
  meta: { key: MetaKey; value: { key: MetaKey; value: unknown } };
}

const DB_NAME = "ponkee-zero";
const DB_VERSION = 1;

const dbPromise = openDB<PonkeeDb>(DB_NAME, DB_VERSION, {
  upgrade(db) {
    db.createObjectStore("debts", { keyPath: "id" });
    db.createObjectStore("actions", { keyPath: "date" });
    db.createObjectStore("meta", { keyPath: "key" });
  },
});

export async function dbGetDebts() {
  return (await dbPromise).getAll("debts");
}

export async function dbPutDebt(debt: Debt) {
  await (await dbPromise).put("debts", debt);
}

export async function dbDeleteDebt(id: string) {
  await (await dbPromise).delete("debts", id);
}

export async function dbBumpAction(date: ISODate) {
  const db = await dbPromise;
  const existing = await db.get("actions", date);
  await db.put("actions", { date, count: (existing?.count ?? 0) + 1 });
}

export async function dbGetActionsInRange(start: ISODate, end: ISODate) {
  const all = await (await dbPromise).getAll("actions");
  return all.filter((a) => a.date >= start && a.date <= end);
}

export async function dbGetMeta<T>(key: MetaKey) {
  const item = await (await dbPromise).get("meta", key);
  return (item?.value as T | undefined) ?? undefined;
}

export async function dbSetMeta<T>(key: MetaKey, value: T) {
  await (await dbPromise).put("meta", { key, value });
}
