"use client";

import React, { createContext, useContext, useEffect, useMemo, useReducer } from "react";
import { createDebouncedSaver, loadFromStorage } from "@/lib/storage";
import type { MarketAccent } from "@/lib/marketAccent";
import { nextAccent } from "@/lib/marketAccent";
import { DEFAULT_CATEGORIES, DEFAULT_CATEGORY_ID, sortCategories } from "@/lib/defaultCategories";

export type CategoryGlyph =
  | "produce"
  | "dairy"
  | "meat_poultry"
  | "snacks"
  | "frozen"
  | "beverages"
  | "bakery"
  | "household"
  | "personal_care"
  | "pets"
  | "custom";

export type CategoryId = string;

export type CategoryDef = {
  id: CategoryId;
  glyph: CategoryGlyph;
  nameEn: string;
  nameTr: string;
  sort: number;
};

export type Locale = "en" | "tr";

export type Market = {
  id: string;
  name: string;
  createdAt: number;
  spent: number;
  completed: boolean;
  accent: MarketAccent;
};

export type Item = {
  id: string;
  marketId: string;
  name: string;
  category: CategoryId;
  estimatedPrice?: number;
  purchased: boolean;
  actualPrice?: number;
  quickBought?: boolean;
};

type State = {
  budget: number;
  locale: Locale;
  categories: CategoryDef[];
  markets: Market[];
  itemsByMarket: Record<string, Item[]>;
};

type Action =
  | { type: "SET_BUDGET"; budget: number }
  | { type: "SET_LOCALE"; locale: Locale }
  | { type: "ADD_MARKET"; name: string }
  | { type: "DELETE_MARKET"; id: string }
  | { type: "ADD_ITEM"; marketId: string; item: Omit<Item, "id" | "purchased" | "actualPrice" | "quickBought"> }
  | { type: "DELETE_ITEM"; marketId: string; itemId: string }
  | { type: "TOGGLE_ITEM_PURCHASED"; marketId: string; itemId: string; actualPrice?: number; useEstimatedIfMissing?: boolean }
  | { type: "UNPURCHASE_ITEM"; marketId: string; itemId: string }
  | { type: "ADD_CATEGORY"; nameEn: string; nameTr: string; glyph?: CategoryGlyph }
  | { type: "UPDATE_CATEGORY"; id: CategoryId; nameEn: string; nameTr: string; glyph: CategoryGlyph }
  | { type: "DELETE_CATEGORY"; id: CategoryId; moveItems: boolean }
  | { type: "MOVE_CATEGORY"; id: CategoryId; dir: -1 | 1 }
  | { type: "RESET_CATEGORIES" }
  | { type: "RESET" };

const DEFAULT_STATE: State = {
  budget: 500,
  locale: "en",
  categories: sortCategories(DEFAULT_CATEGORIES),
  markets: [],
  itemsByMarket: {},
};

function uid(prefix = "id") {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`;
}

function legacyCategoryToDefaultId(cat: string): CategoryId {
  const v = cat.trim();
  switch (v) {
    case "produce":
    case "Produce":
      return "cat_produce";
    case "dairy":
    case "Dairy":
      return "cat_dairy";
    case "meat_poultry":
      return "cat_meat";
    case "snacks":
    case "Snacks":
      return "cat_snacks";
    case "frozen":
      return "cat_frozen";
    case "beverages":
      return "cat_beverages";
    case "bakery":
      return "cat_bakery";
    case "household":
    case "Household":
      return "cat_household";
    case "personal_care":
      return "cat_personal";
    case "pets":
      return "cat_pets";
    default:
      return DEFAULT_CATEGORY_ID;
  }
}

function normalizeItemCategory(cat: unknown, allowed: Set<CategoryId>): CategoryId {
  if (typeof cat !== "string") return DEFAULT_CATEGORY_ID;
  const v = cat.trim();
  if (allowed.has(v)) return v;
  const mapped = legacyCategoryToDefaultId(v);
  return allowed.has(mapped) ? mapped : DEFAULT_CATEGORY_ID;
}

function normalizeState(input: State): State {
  const locale: Locale = input.locale === "tr" ? "tr" : "en";

  let categories = Array.isArray((input as any).categories) ? ((input as any).categories as CategoryDef[]) : [];
  if (!categories.length) {
    categories = DEFAULT_CATEGORIES;
  }
  // sanitize + sort
  categories = sortCategories(
    categories
      .filter((c) => c && typeof c.id === "string")
      .map((c, idx) => ({
        id: c.id,
        glyph: (c.glyph ?? "custom") as CategoryGlyph,
        nameEn: (c.nameEn ?? "").trim() || "Category",
        nameTr: (c.nameTr ?? "").trim() || "Kategori",
        sort: Number.isFinite(c.sort) ? c.sort : idx,
      })),
  );

  const allowed = new Set(categories.map((c) => c.id));

  const itemsByMarket: Record<string, Item[]> = {};
  for (const [marketId, items] of Object.entries(input.itemsByMarket ?? {})) {
    itemsByMarket[marketId] = (items ?? []).map((it) => ({
      ...it,
      category: normalizeItemCategory((it as any).category, allowed),
    }));
  }

  const markets = (input.markets ?? []).map((m, idx) => {
    const accent = typeof (m as any).accent === "number" ? ((m as any).accent as MarketAccent) : ((idx % 8) as MarketAccent);
    return { ...m, accent };
  });

  return {
    ...input,
    locale,
    budget: Number.isFinite(input.budget) ? Math.max(0, input.budget) : DEFAULT_STATE.budget,
    categories,
    markets,
    itemsByMarket,
  };
}

function loadMergedState(): State {
  const v2 = loadFromStorage<State | null>(null as any);
  if (v2 && typeof v2 === "object" && Array.isArray((v2 as any).markets)) {
    return normalizeState(v2 as State);
  }

  // legacy key (older builds)
  if (typeof window !== "undefined") {
    try {
      const raw = window.localStorage.getItem("cartpilot:v1");
      if (raw) {
        const parsed = JSON.parse(raw) as State;
        return normalizeState(parsed);
      }
    } catch {
      // ignore
    }
  }

  return DEFAULT_STATE;
}

function computeMarketSpent(items: Item[]) {
  let s = 0;
  for (const it of items) {
    if (!it.purchased) continue;
    const price = typeof it.actualPrice === "number" ? it.actualPrice : 0;
    s += price;
  }
  return s;
}

function remapItemsCategory(
  itemsByMarket: Record<string, Item[]>,
  fromId: CategoryId,
  toId: CategoryId,
): Record<string, Item[]> {
  const next: Record<string, Item[]> = {};
  for (const [mid, items] of Object.entries(itemsByMarket)) {
    next[mid] = (items ?? []).map((it) => (it.category === fromId ? { ...it, category: toId } : it));
  }
  return next;
}

function deleteItemsInCategory(itemsByMarket: Record<string, Item[]>, categoryId: CategoryId): Record<string, Item[]> {
  const next: Record<string, Item[]> = {};
  for (const [mid, items] of Object.entries(itemsByMarket)) {
    next[mid] = (items ?? []).filter((it) => it.category !== categoryId);
  }
  return next;
}

function recalcAllMarkets(markets: Market[], itemsByMarket: Record<string, Item[]>): Market[] {
  return markets.map((m) => {
    const items = itemsByMarket[m.id] ?? [];
    const spent = computeMarketSpent(items);
    const completed = items.length > 0 && items.every((x) => x.purchased);
    return { ...m, spent, completed };
  });
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_BUDGET": {
      const budget = Number.isFinite(action.budget) ? Math.max(0, action.budget) : state.budget;
      return { ...state, budget };
    }
    case "SET_LOCALE": {
      return { ...state, locale: action.locale };
    }
    case "ADD_MARKET": {
      const name = action.name.trim() || "New Market";
      const id = uid("m");
      const accent = nextAccent(state.markets.map((m) => m.accent));
      return {
        ...state,
        markets: [{ id, name, createdAt: Date.now(), spent: 0, completed: false, accent }, ...state.markets],
        itemsByMarket: { ...state.itemsByMarket, [id]: [] },
      };
    }
    case "DELETE_MARKET": {
      const nextMarkets = state.markets.filter((m) => m.id !== action.id);
      const { [action.id]: _removed, ...rest } = state.itemsByMarket;
      return {
        ...state,
        markets: nextMarkets,
        itemsByMarket: rest,
      };
    }
    case "ADD_ITEM": {
      const itemId = uid("i");
      const base = action.item;
      const allowed = new Set(state.categories.map((c) => c.id));
      const categoryId = typeof base.category === "string" && allowed.has(base.category) ? base.category : sortCategories(state.categories)[0]?.id ?? DEFAULT_CATEGORY_ID;
      const item: Item = {
        id: itemId,
        marketId: action.marketId,
        name: base.name.trim() || "New item",
        category: categoryId,
        estimatedPrice: typeof base.estimatedPrice === "number" ? Math.max(0, base.estimatedPrice) : undefined,
        purchased: false,
      };
      const prev = state.itemsByMarket[action.marketId] ?? [];
      return {
        ...state,
        itemsByMarket: { ...state.itemsByMarket, [action.marketId]: [item, ...prev] },
      };
    }
    case "DELETE_ITEM": {
      const prev = state.itemsByMarket[action.marketId] ?? [];
      const nextItems = prev.filter((it) => it.id !== action.itemId);
      const spent = computeMarketSpent(nextItems);
      const completed = nextItems.length > 0 && nextItems.every((x) => x.purchased);
      return {
        ...state,
        itemsByMarket: { ...state.itemsByMarket, [action.marketId]: nextItems },
        markets: state.markets.map((m) => (m.id === action.marketId ? { ...m, spent, completed } : m)),
      };
    }
    case "UNPURCHASE_ITEM": {
      const prev = state.itemsByMarket[action.marketId] ?? [];
      const nextItems = prev.map((it) =>
        it.id === action.itemId ? { ...it, purchased: false, actualPrice: undefined, quickBought: undefined } : it,
      );
      const spent = computeMarketSpent(nextItems);
      const completed = nextItems.length > 0 && nextItems.every((x) => x.purchased);
      return {
        ...state,
        itemsByMarket: { ...state.itemsByMarket, [action.marketId]: nextItems },
        markets: state.markets.map((m) => (m.id === action.marketId ? { ...m, spent, completed } : m)),
      };
    }
    case "TOGGLE_ITEM_PURCHASED": {
      const prev = state.itemsByMarket[action.marketId] ?? [];
      const nextItems = prev.map((it) => {
        if (it.id !== action.itemId) return it;
        if (it.purchased) return it;

        const hasActual = typeof action.actualPrice === "number" && Number.isFinite(action.actualPrice);
        const actualPrice = hasActual
          ? Math.max(0, action.actualPrice!)
          : action.useEstimatedIfMissing
            ? typeof it.estimatedPrice === "number"
              ? it.estimatedPrice
              : 0
            : undefined;

        const quickBought = !hasActual && Boolean(action.useEstimatedIfMissing);

        return {
          ...it,
          purchased: true,
          actualPrice,
          quickBought: quickBought || undefined,
        };
      });

      const spent = computeMarketSpent(nextItems);
      const completed = nextItems.length > 0 && nextItems.every((x) => x.purchased);
      return {
        ...state,
        itemsByMarket: { ...state.itemsByMarket, [action.marketId]: nextItems },
        markets: state.markets.map((m) => (m.id === action.marketId ? { ...m, spent, completed } : m)),
      };
    }
    case "ADD_CATEGORY": {
      const nameEn = action.nameEn.trim() || "New category";
      const nameTr = action.nameTr.trim() || "Yeni kategori";
      const glyph = action.glyph ?? "custom";
      const id = uid("cat");
      const maxSort = state.categories.reduce((m, c) => Math.max(m, c.sort), -1);
      const nextCats = sortCategories([...state.categories, { id, glyph, nameEn, nameTr, sort: maxSort + 1 }]);
      return { ...state, categories: nextCats };
    }
    case "UPDATE_CATEGORY": {
      const prev = state.categories.find((c) => c.id === action.id);
      if (!prev) return state;
      const nameEn = action.nameEn.trim() || prev.nameEn;
      const nameTr = action.nameTr.trim() || prev.nameTr;
      const glyph = action.glyph;
      const nextCats = sortCategories(state.categories.map((c) => (c.id === action.id ? { ...c, nameEn, nameTr, glyph } : c)));
      return { ...state, categories: nextCats };
    }
    case "DELETE_CATEGORY": {
      const cats = state.categories.filter((c) => c.id !== action.id);
      if (!cats.length) return state; // never delete last category

      const fallback = sortCategories(cats)[0]!.id;
      const nextItems = action.moveItems
        ? remapItemsCategory(state.itemsByMarket, action.id, fallback)
        : deleteItemsInCategory(state.itemsByMarket, action.id);

      const nextCats = sortCategories(cats.map((c, idx) => ({ ...c, sort: idx })));
      const nextMarkets = recalcAllMarkets(state.markets, nextItems);
      return { ...state, categories: nextCats, itemsByMarket: nextItems, markets: nextMarkets };
    }
    case "MOVE_CATEGORY": {
      const sorted = sortCategories(state.categories);
      const idx = sorted.findIndex((c) => c.id === action.id);
      if (idx < 0) return state;
      const j = idx + action.dir;
      if (j < 0 || j >= sorted.length) return state;
      const a = sorted[idx]!;
      const b = sorted[j]!;
      const next = sorted.map((c) => {
        if (c.id === a.id) return { ...c, sort: b.sort };
        if (c.id === b.id) return { ...c, sort: a.sort };
        return c;
      });
      return { ...state, categories: sortCategories(next) };
    }
    case "RESET_CATEGORIES": {
      const nextCats = sortCategories(DEFAULT_CATEGORIES);
      const allowed = new Set(nextCats.map((c) => c.id));
      const nextItems: Record<string, Item[]> = {};
      for (const [mid, items] of Object.entries(state.itemsByMarket)) {
        nextItems[mid] = (items ?? []).map((it) => ({
          ...it,
          category: normalizeItemCategory(it.category, allowed),
        }));
      }
      const nextMarkets = recalcAllMarkets(state.markets, nextItems);
      return { ...state, categories: nextCats, itemsByMarket: nextItems, markets: nextMarkets };
    }
    case "RESET":
      return DEFAULT_STATE;
    default:
      return state;
  }
}

type CartContextValue = {
  state: State;
  derived: {
    totalSpent: number;
    remaining: number;
    exceededBy: number;
  };
  actions: {
    setBudget: (budget: number) => void;
    setLocale: (locale: Locale) => void;
    addMarket: (name: string) => void;
    deleteMarket: (id: string) => void;
    addItem: (marketId: string, item: Omit<Item, "id" | "purchased" | "actualPrice" | "quickBought">) => void;
    purchaseItem: (marketId: string, itemId: string, actualPrice?: number) => void;
    quickBuyItem: (marketId: string, itemId: string) => void;
    unpurchaseItem: (marketId: string, itemId: string) => void;
    deleteItem: (marketId: string, itemId: string) => void;
    addCategory: (nameEn: string, nameTr: string, glyph?: CategoryGlyph) => void;
    updateCategory: (id: CategoryId, patch: { nameEn: string; nameTr: string; glyph: CategoryGlyph }) => void;
    deleteCategory: (id: CategoryId, moveItems: boolean) => void;
    moveCategory: (id: CategoryId, dir: -1 | 1) => void;
    resetCategories: () => void;
    reset: () => void;
  };
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, DEFAULT_STATE, () => normalizeState(loadMergedState()));

  const saver = useMemo(() => createDebouncedSaver(250), []);
  useEffect(() => {
    saver.schedule(state);
  }, [state, saver]);

  const derived = useMemo(() => {
    const totalSpent = state.markets.reduce((acc, m) => acc + (Number.isFinite(m.spent) ? m.spent : 0), 0);
    const remaining = state.budget - totalSpent;
    const exceededBy = remaining < 0 ? Math.abs(remaining) : 0;
    return { totalSpent, remaining, exceededBy };
  }, [state.budget, state.markets]);

  const value = useMemo<CartContextValue>(() => {
    return {
      state,
      derived,
      actions: {
        setBudget: (budget) => dispatch({ type: "SET_BUDGET", budget }),
        setLocale: (locale) => dispatch({ type: "SET_LOCALE", locale }),
        addMarket: (name) => dispatch({ type: "ADD_MARKET", name }),
        deleteMarket: (id) => dispatch({ type: "DELETE_MARKET", id }),
        addItem: (marketId, item) => dispatch({ type: "ADD_ITEM", marketId, item }),
        purchaseItem: (marketId, itemId, actualPrice) =>
          dispatch({ type: "TOGGLE_ITEM_PURCHASED", marketId, itemId, actualPrice, useEstimatedIfMissing: false }),
        quickBuyItem: (marketId, itemId) =>
          dispatch({ type: "TOGGLE_ITEM_PURCHASED", marketId, itemId, useEstimatedIfMissing: true }),
        unpurchaseItem: (marketId, itemId) => dispatch({ type: "UNPURCHASE_ITEM", marketId, itemId }),
        deleteItem: (marketId, itemId) => dispatch({ type: "DELETE_ITEM", marketId, itemId }),
        addCategory: (nameEn, nameTr, glyph) => dispatch({ type: "ADD_CATEGORY", nameEn, nameTr, glyph }),
        updateCategory: (id, patch) => dispatch({ type: "UPDATE_CATEGORY", id, ...patch }),
        deleteCategory: (id, moveItems) => dispatch({ type: "DELETE_CATEGORY", id, moveItems }),
        moveCategory: (id, dir) => dispatch({ type: "MOVE_CATEGORY", id, dir }),
        resetCategories: () => dispatch({ type: "RESET_CATEGORIES" }),
        reset: () => {
          saver.cancel();
          saver.clearAll();
          dispatch({ type: "RESET" });
          saver.saveNow(DEFAULT_STATE);
        },
      },
    };
  }, [state, derived, saver]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
