"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Menu, MenuItem, OptionGroup } from "@/lib/menu-types";
import { groupFor, lineKey, trayPrice, type CartLine } from "@/lib/pricing";

type Store = {
  menu: Menu;
  item: (id: string) => MenuItem | undefined;
  group: (item: MenuItem) => OptionGroup | undefined;
  /** False until the saved cart has been restored from localStorage. */
  hydrated: boolean;
  lines: CartLine[];
  addLine: (itemId: string, picks: string[], qty: number) => void;
  setQty: (key: string, qty: number) => void;
  clearCart: () => void;
  lineTotal: (line: CartLine) => number;
  qtyOfItem: (itemId: string) => number;
  totalQty: number;
  total: number;
  sheetItemId: string | null;
  openSheet: (id: string | null) => void;
  drawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
  toast: string | null;
  showToast: (msg: string) => void;
};

const Ctx = createContext<Store | null>(null);
const STORAGE_KEY = "toto-cart";

export function StoreProvider({ menu, children }: { menu: Menu; children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [sheetItemId, setSheetItemId] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const byId = useMemo(() => new Map(menu.items.map((i) => [i.id, i])), [menu]);
  const item = useCallback((id: string) => byId.get(id), [byId]);
  const group = useCallback((it: MenuItem) => groupFor(menu, it), [menu]);

  // Restore the cart once on the client, dropping lines whose dish left the menu.
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]") as CartLine[];
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time hydration from localStorage
      setLines(saved.filter((l) => byId.has(l.itemId) && l.qty > 0));
    } catch {
      /* storage unavailable: start empty */
    }
    setHydrated(true);
  }, [byId]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      /* ignore */
    }
  }, [lines, hydrated]);

  const addLine = useCallback((itemId: string, picks: string[], qty: number) => {
    const key = lineKey(itemId, picks);
    setLines((prev) => {
      const existing = prev.find((l) => l.key === key);
      if (existing) return prev.map((l) => (l.key === key ? { ...l, qty: l.qty + qty } : l));
      return [...prev, { key, itemId, picks: [...picks], qty }];
    });
  }, []);

  const setQty = useCallback((key: string, qty: number) => {
    setLines((prev) => (qty <= 0 ? prev.filter((l) => l.key !== key) : prev.map((l) => (l.key === key ? { ...l, qty } : l))));
  }, []);

  const clearCart = useCallback(() => setLines([]), []);

  const lineTotal = useCallback(
    (l: CartLine) => {
      const it = byId.get(l.itemId);
      return it ? trayPrice(it, groupFor(menu, it), l.picks) * l.qty : 0;
    },
    [byId, menu],
  );

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast((t) => (t === msg ? null : t)), 1800);
  }, []);

  const value: Store = {
    menu,
    item,
    group,
    hydrated,
    lines,
    addLine,
    setQty,
    clearCart,
    lineTotal,
    qtyOfItem: (id) => lines.filter((l) => l.itemId === id).reduce((a, l) => a + l.qty, 0),
    totalQty: lines.reduce((a, l) => a + l.qty, 0),
    total: lines.reduce((a, l) => a + lineTotal(l), 0),
    sheetItemId,
    openSheet: setSheetItemId,
    drawerOpen,
    setDrawerOpen,
    searchOpen,
    setSearchOpen,
    toast,
    showToast,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const s = useContext(Ctx);
  if (!s) throw new Error("useStore must be used inside StoreProvider");
  return s;
}

