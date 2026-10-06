"use client";

import { ShoppingBag } from "lucide-react";
import { useCart } from "@/components/cart/cart-provider";
import { cn } from "@/lib/cn";

/**
 * Header cart control.
 *
 * Baymard guidance is to visually emphasise the cart link in the sitewide
 * header. We do it with a persistent square outline and a count, not with a
 * coloured badge floating on an icon. The count is a real live region so a
 * screen reader hears the basket change.
 */
export function CartButton({ className }: { className?: string }) {
  const { count, open, justAdded, isHydrated } = useCart();
  const bumped = Boolean(justAdded);

  return (
    <button
      type="button"
      onClick={open}
      aria-label={count > 0 ? `Cart, ${count} item${count === 1 ? "" : "s"}` : "Cart, empty"}
      className={cn(
        "relative inline-flex h-11 items-center gap-1.5 rounded-xs border border-border bg-background px-3",
        "transition-colors duration-[var(--motion-fast)] hover:border-text lg:h-9 lg:px-2.5 xl:px-3",
        bumped ? "border-accent bg-accent-soft" : "",
        className,
      )}
    >
      <ShoppingBag
        className={cn(
          "size-[1.125rem] shrink-0 transition-transform duration-[var(--motion-standard)] ease-[var(--ease-spring)] motion-reduce:transition-none",
          bumped && "-translate-y-0.5",
        )}
        strokeWidth={1.9}
        aria-hidden
      />
      <span
        aria-live="polite"
        className={cn(
          "tnum font-[family-name:var(--font-mono)] text-[0.75rem] leading-none transition-opacity duration-[var(--motion-fast)]",
          count > 0 ? "opacity-100" : "opacity-55",
        )}
      >
        {isHydrated ? count : 0}
      </span>
    </button>
  );
}