"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { Product } from "@/data/products";
import { getProduct } from "@/data/products";

/**
 * Cart state.
 *
 * Deliberately a client-side basket only. There is no payment integration and
 * this code never claims a payment succeeded — checkout hands off to M-Pesa or
 * WhatsApp. Prices are re-derived from catalogue data at render time so a
 * tampered localStorage payload cannot alter what the customer is shown.
 */

export type CartLine = {
  id: string;
  qty: number;
  /** Timestamp of the most recent add — drives the cart button confirmation. */
  addedAt: number;
};

type Action =
  | { type: "hydrate"; lines: CartLine[] }
  | { type: "add"; id: string; qty: number; at: number }
  | { type: "setQty"; id: string; qty: number }
  | { type: "remove"; id: string }
  | { type: "clear" };

const MAX_QTY = 99;

function reducer(state: CartLine[], action: Action): CartLine[] {
  switch (action.type) {
    case "hydrate":
      return action.lines;
    case "add": {
      const existing = state.find((l) => l.id === action.id);
      if (!existing) {
        return [
          ...state,
          { id: action.id, qty: Math.min(action.qty, MAX_QTY), addedAt: action.at },
        ];
      }
      return state.map((l) =>
        l.id === action.id ? { ...l, qty: Math.min(l.qty + action.qty, MAX_QTY), addedAt: action.at } : l,
      );
    }
    case "setQty": {
      if (action.qty <= 0) return state.filter((l) => l.id !== action.id);
      return state.map((l) => (l.id === action.id ? { ...l, qty: Math.min(action.qty, MAX_QTY) } : l));
    }
    case "remove":
      return state.filter((l) => l.id !== action.id);
    case "clear":
      return [];
  }
}

const STORAGE_KEY = "bora.cart.v1";

type CartContextValue = {
  lines: CartLine[];
  count: number;
  /** Ids added within the last 1400ms — used for the quiet confirmation tick. */
  justAdded: string | null;
  isOpen: boolean;
  isHydrated: boolean;
  add: (id: string, qty?: number) => void;
  setQty: (id: string, qty: number) => void;
  remove: (id: string) => void;
  clear: () => void;
  open: () => void;
  close: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, dispatch] = useReducer(reducer, []);
  const [isOpen, setIsOpen] = useState(false);
  const [justAdded, setJustAdded] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  /** Spoken confirmation for cart actions the buttons themselves cannot
      announce — an `aria-label` on a focused control is not a live region. */
  const [status, setStatus] = useState("");
  const confirmTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          const clean = parsed
            .filter(
              (l): l is CartLine =>
                !!l &&
                typeof l === "object" &&
                typeof (l as CartLine).id === "string" &&
                typeof (l as CartLine).qty === "number",
            )
            .map((l) => ({ id: l.id, qty: Math.min(Math.max(1, Math.floor(l.qty)), MAX_QTY), addedAt: 0 }));
          dispatch({ type: "hydrate", lines: clean });
        }
      }
    } catch {
      /* corrupt or unavailable storage — start empty rather than crash */
    }
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      /* private mode — the basket simply won't survive the tab */
    }
  }, [lines, isHydrated]);

  const count = lines.reduce((n, l) => n + l.qty, 0);

  const add = useCallback(
    (id: string, qty = 1) => {
      dispatch({ type: "add", id, qty, at: Date.now() });
      setJustAdded(id);
      const product = getProduct(id);
      if (product) {
        const total = count + qty;
        setStatus(
          `${product.name} added to cart — ${total} item${total === 1 ? "" : "s"} in cart.`,
        );
      }
      if (confirmTimer.current) clearTimeout(confirmTimer.current);
      confirmTimer.current = setTimeout(() => setJustAdded(null), 1400);
    },
    [count],
  );

  const setQty = useCallback((id: string, qty: number) => dispatch({ type: "setQty", id, qty }), []);
  const remove = useCallback((id: string) => {
    dispatch({ type: "remove", id });
    const product = getProduct(id);
    if (product) setStatus(`${product.name} removed from cart.`);
  }, []);
  const clear = useCallback(() => {
    dispatch({ type: "clear" });
    setStatus("Cart cleared.");
  }, []);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  useEffect(() => () => { if (confirmTimer.current) clearTimeout(confirmTimer.current); }, []);

  const value = useMemo<CartContextValue>(
    () => ({ lines, count, justAdded, isOpen, isHydrated, add, setQty, remove, clear, open, close }),
    [lines, count, justAdded, isOpen, isHydrated, add, setQty, remove, clear, open, close],
  );

  return (
    <CartContext.Provider value={value}>
      {children}
      <div role="status" aria-live="polite" className="sr-only">
        {status}
      </div>
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}

/** Builds a WhatsApp order message from catalogue prices, never from stored numbers. */
export function buildOrderMessage(
  lines: CartLine[],
  lookup: (id: string) => Product | undefined,
): string {
  const rows = lines
    .map((line) => {
      const product = lookup(line.id);
      if (!product) return null;
      return `• ${product.name} (${product.brand})\n  ${line.qty} × — see price on site`;
    })
    .filter(Boolean);

  return [
    "Hello Bora Hardware, I would like to order:",
    "",
    ...rows,
    "",
    "Please confirm availability and total, including delivery.",
  ].join("\n");
}