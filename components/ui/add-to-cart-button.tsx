"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Plus } from "lucide-react";
import { cn } from "@/lib/cn";
import { useCart } from "@/components/cart/cart-provider";
import type { Product } from "@/data/products";

/**
 * Add to cart.
 *
 * Deliberately not a modal and not a toast — a toast would interrupt the scan
 * of a product grid. The confirmation is a 1400ms in-place label swap plus a
 * dot on the header cart, so the customer never loses their place in the list.
 */
export function AddToCartButton({
  product,
  qty = 1,
  size = "sm",
  full = true,
  className,
  showLabel = true,
}: {
  product: Product;
  qty?: number;
  size?: "sm" | "md" | "lg";
  full?: boolean;
  className?: string;
  showLabel?: boolean;
}) {
  const { add, justAdded } = useCart();
  const [flash, setFlash] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isNew = justAdded === product.id;
  const out = product.stock <= 0;

  useEffect(() => {
    if (!isNew) return;
    setFlash(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setFlash(false), 1400);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [isNew]);

  /* `sm` is the product-grid default, so it must clear 44px on touch widths.
     `lg:h-9` keeps the dense two-column grid from looking like a form. */
  const heights = {
    sm: "h-11 px-3.5 text-[0.8125rem] lg:h-9",
    md: "h-11 px-5",
    lg: "h-12 px-6",
  };

  return (
    <button
      type="button"
      disabled={out}
      onClick={() => add(product.id, qty)}
      /* The label carries the state rather than an inner `sr-only` span:
         `aria-label` overrides the subtree, so text inside the button would
         never be read back. The confirmation itself is spoken by the cart's
         live region (see cart-provider), which is the only reliable place for
         an announcement. */
      aria-label={
        out
          ? `${product.name} is out of stock`
          : flash
            ? `${product.name} added to cart`
            : `Add ${qty > 1 ? `${qty} × ` : ""}${product.name} to cart`
      }
      className={cn(
        "group/add inline-flex items-center justify-center gap-1.5 rounded-xs border font-[length:var(--text-button)]",
        "transition-[background-color,color,border-color] duration-[var(--motion-fast)] ease-[var(--ease-out)]",
        "active:translate-y-px disabled:pointer-events-none",
        heights[size],
        full && "w-full",
        out
          ? "cursor-not-allowed border-border bg-surface text-muted"
          : flash
            ? "border-success bg-success text-white"
            : "border-border-strong bg-background text-text hover:border-accent hover:bg-accent hover:text-accent-ink",
        className,
      )}
    >
      {flash ? (
        <>
          <Check className="size-4 shrink-0" strokeWidth={2.5} aria-hidden />
          {showLabel && <span>Added</span>}
        </>
      ) : out ? (
        <>
          <span className="size-1.5 rounded-pill bg-border-strong" aria-hidden />
          {showLabel && <span>Out of stock</span>}
        </>
      ) : (
        <>
          <Plus
            className="size-4 shrink-0 transition-transform duration-[var(--motion-fast)] group-hover/add:rotate-90"
            strokeWidth={2.25}
            aria-hidden
          />
          {showLabel && <span>Add</span>}
        </>
      )}
    </button>
  );
}