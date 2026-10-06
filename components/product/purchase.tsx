"use client";

import { useState } from "react";
import { MessageCircle, Minus, Plus } from "lucide-react";
import { AddToCartButton } from "@/components/ui/add-to-cart-button";
import { ExternalLink } from "@/components/ui/button";
import { formatKES } from "@/lib/currency";
import { waLink } from "@/config/site";
import type { Product } from "@/data/products";
import { cn } from "@/lib/cn";

/**
 * Purchase controls.
 *
 * Two components, one decision: the orange action is always add-to-cart,
 * because that is the highest-value action on the page. WhatsApp is the equal
 * way to order for this audience but it is a link, not a competing orange
 * button — two orange buttons on one screen would break the accent rule and
 * make the buyer choose a channel instead of a product.
 *
 * The message sent to the counter is built from catalogue prices at the moment
 * of sending, so the number in the chat is the number on the page.
 */

function orderMessage(product: Product, qty: number): string {
  const total = product.price * qty;
  return [
    "Hello Bora Hardware, I would like to order:",
    "",
    `• ${product.name} (${product.brand})`,
    `  ${qty} × ${formatKES(product.price)} = ${formatKES(total)}`,
    `  Ref: ${product.sku}`,
    "",
    "Please confirm availability and total, including delivery.",
  ].join("\n");
}

const MAX_QTY = 99;

export function PurchasePanel({ product }: { product: Product }) {
  const [qty, setQty] = useState(1);
  const out = product.stock <= 0;
  const ceiling = product.stock > 0 ? Math.min(MAX_QTY, product.stock) : MAX_QTY;

  return (
    <div className="flex flex-col gap-3">
      {!out && (
        <div className="flex items-center gap-3">
          <span id="qty-label" className="eyebrow text-muted">
            Quantity
          </span>
          <div className="inline-flex items-center rounded-xs border border-border-strong">
            <button
              type="button"
              onClick={() => setQty((n) => Math.max(1, n - 1))}
              disabled={qty <= 1}
              aria-label={`Decrease quantity of ${product.name}`}
              className="grid size-11 place-items-center text-text-secondary transition-colors duration-[var(--motion-fast)] hover:bg-surface hover:text-text disabled:pointer-events-none disabled:opacity-40"
            >
              <Minus className="size-4" strokeWidth={2.25} aria-hidden />
            </button>
            <span
              aria-live="polite"
              className="tnum w-10 text-center font-[family-name:var(--font-mono)] text-[length:var(--text-nav)] leading-none"
            >
              {qty}
            </span>
            <button
              type="button"
              onClick={() => setQty((n) => Math.min(ceiling, n + 1))}
              disabled={qty >= ceiling}
              aria-label={`Increase quantity of ${product.name}`}
              className="grid size-11 place-items-center text-text-secondary transition-colors duration-[var(--motion-fast)] hover:bg-surface hover:text-text disabled:pointer-events-none disabled:opacity-40"
            >
              <Plus className="size-4" strokeWidth={2.25} aria-hidden />
            </button>
          </div>
          {product.stock > 0 && product.stock <= 5 && (
            <span className="text-[0.75rem] text-accent-deep">
              Only {product.stock} on the shelf
            </span>
          )}
        </div>
      )}

      <div className="flex flex-col gap-2.5">
        <AddToCartButton product={product} qty={qty} size="lg" full />
        <ExternalLink
          href={waLink(orderMessage(product, qty))}
          external
          size="lg"
          variant="outline"
          fullWidth
        >
          <MessageCircle className="size-[1.125rem]" strokeWidth={2} aria-hidden />
          Order this on WhatsApp
        </ExternalLink>
      </div>

      <p className="flex flex-wrap items-center gap-x-3 gap-y-1 font-[family-name:var(--font-mono)] text-[0.6875rem] uppercase tracking-[0.1em] text-muted">
        <span>Pay: M-Pesa · Bank · Cash in Nairobi</span>
        <span aria-hidden className="hidden h-3 w-px shrink-0 bg-border sm:block" />
        <span>Delivery quoted before you pay</span>
      </p>
    </div>
  );
}

/**
 * Sticky buy bar — product detail route only (DESIGN.md §11).
 *
 * Over 80% of traffic here is a phone held one-handed, and a long spec table
 * pushes the add-to-cart button off-screen. The bar keeps price and action in
 * thumb reach without covering the specification, and it is hidden entirely on
 * desktop where the panel is already visible.
 */
export function PurchaseBar({ product }: { product: Product }) {
  if (product.stock <= 0) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background lg:hidden">
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="min-w-0 flex-1">
          <p className="tnum truncate font-[family-name:var(--font-display)] text-[length:var(--text-price)] font-bold leading-none">
            {formatKES(product.price)}
          </p>
          <p className="mt-1 truncate font-[family-name:var(--font-mono)] text-[0.6875rem] text-muted">
            {product.brand} · {product.sku}
          </p>
        </div>
        <AddToCartButton product={product} size="md" full={false} className="shrink-0 px-6" />
      </div>
    </div>
  );
}

/** Spec table — label left, value right, hairline between rows. */
export function SpecList({ specs, className }: { specs: Product["specs"]; className?: string }) {
  return (
    <dl className={cn("divide-y divide-[color:var(--color-border)] border-y border-border", className)}>
      {specs.map((spec) => (
        <div key={spec.label} className="flex items-baseline justify-between gap-6 py-3">
          <dt className="text-small text-muted">{spec.label}</dt>
          <dd className="tnum text-right text-small font-medium text-text">{spec.value}</dd>
        </div>
      ))}
    </dl>
  );
}
