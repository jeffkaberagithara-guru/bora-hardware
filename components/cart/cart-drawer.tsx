"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShieldCheck, Smartphone, Trash2, X } from "lucide-react";
import { buildOrderMessage, useCart } from "@/components/cart/cart-provider";
import { ButtonLink, ExternalLink } from "@/components/ui/button";
import { getProduct } from "@/data/products";
import { siteConfig, waLink } from "@/config/site";
import { formatKES, unitPrice } from "@/lib/currency";

/**
 * Cart drawer.
 *
 * Prices are recomputed from catalogue data on every render, never read back
 * from the stored payload, so a tampered localStorage cannot change what the
 * customer is charged. Nothing here claims a payment has been made — the two
 * exits are M-Pesa checkout (a clearly-labelled UI state, see /checkout) and a
 * WhatsApp handoff.
 */
export function CartDrawer() {
  const { lines, isOpen, close, setQty, remove, clear } = useCart();
  const [rendered, setRendered] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  const items = useMemo(
    () =>
      lines
        .map((line) => ({ line, product: getProduct(line.id) }))
        .filter((row): row is { line: (typeof lines)[number]; product: NonNullable<ReturnType<typeof getProduct>> } =>
          Boolean(row.product),
        ),
    [lines],
  );

  const subtotal = items.reduce((sum, row) => sum + row.product.price * row.line.qty, 0);
  const count = items.reduce((n, row) => n + row.line.qty, 0);

  useEffect(() => {
    if (isOpen) {
      setRendered(true);
      return;
    }
    if (!rendered) return;
    const t = setTimeout(() => setRendered(false), 240);
    return () => clearTimeout(t);
  }, [isOpen, rendered]);

  useEffect(() => {
    if (!isOpen) return;
    triggerRef.current = (document.activeElement as HTMLElement) ?? null;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }
      if (event.key !== "Tab") return;
      const panel = panelRef.current;
      if (!panel) return;
      const focusables = panel.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    const t = setTimeout(() => {
      panelRef.current?.querySelector<HTMLElement>("button, a")?.focus();
    }, 240);
    return () => {
      document.removeEventListener("keydown", onKey);
      clearTimeout(t);
      document.body.style.overflow = overflow;
      triggerRef.current?.focus();
    };
  }, [isOpen, close]);

  if (!rendered) return null;

  const empty = items.length === 0;
  const waMessage = buildOrderMessage(
    lines,
    getProduct,
  );

  return (
    <div className="fixed inset-0 z-[68]">
      <button
        type="button"
        aria-label="Close cart"
        onClick={close}
        className={`absolute inset-0 w-full cursor-default bg-text/45 transition-opacity duration-[var(--motion-standard)] ease-[var(--ease-out)] motion-reduce:transition-none ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Your cart"
        className="absolute inset-y-0 right-0 flex w-[min(25rem,100vw)] flex-col border-l border-border bg-background shadow-overlay motion-safe:animate-[panelInRight_var(--motion-emphasis)_var(--ease-out)]"
        style={!isOpen ? { animation: "panelOutRight 240ms var(--ease-inout) forwards" } : undefined}
      >
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-border px-4">
          <h2 className="font-[family-name:var(--font-display)] text-[length:var(--text-h3)] font-[weight:650] tracking-[-0.01em]">
            Your cart
            {!empty && (
              <span className="ml-2 font-[family-name:var(--font-mono)] text-[0.75rem] font-normal text-muted">
                {count} item{count === 1 ? "" : "s"}
              </span>
            )}
          </h2>
          <div className="flex items-center gap-1">
            {!empty && (
              <button
                type="button"
                onClick={clear}
                className="flex min-h-11 items-center rounded-xs px-2.5 text-small text-muted transition-colors duration-[var(--motion-fast)] hover:text-danger"
              >
                Clear
              </button>
            )}
            <button
              type="button"
              onClick={close}
              aria-label="Close cart"
              className="grid size-11 place-items-center rounded-xs text-muted transition-colors duration-[var(--motion-fast)] hover:bg-surface hover:text-text lg:size-9"
            >
              <X className="size-5" strokeWidth={2} aria-hidden />
            </button>
          </div>
        </div>

        {empty ? (
          <EmptyCart onClose={close} />
        ) : (
          <>
            <ul className="flex-1 divide-y divide-[color:var(--color-border)] overflow-y-auto overscroll-contain px-4">
              {items.map(({ line, product }) => {
                const per = unitPrice(product);
                return (
                  <li key={line.id} className="flex gap-3 py-4">
                    <Link
                      href={`/product/${product.id}`}
                      onClick={close}
                      className="relative size-20 shrink-0 overflow-hidden rounded-xs bg-surface"
                    >
                      <Image
                        src={product.image}
                        alt={product.alt}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </Link>

                    <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                      <p className="eyebrow text-muted">{product.brand}</p>
                      <Link
                        href={`/product/${product.id}`}
                        onClick={close}
                        className="line-clamp-2 min-h-11 text-small font-medium leading-snug hover:text-primary"
                      >
                        {product.name}
                      </Link>
                      {per && (
                        <p className="font-[family-name:var(--font-mono)] text-[0.6875rem] text-muted">{per}</p>
                      )}

                      <div className="mt-1 flex items-center justify-between gap-2">
                        <Stepper
                          qty={line.qty}
                          onDecrement={() => setQty(line.id, line.qty - 1)}
                          onIncrement={() => setQty(line.id, line.qty + 1)}
                          label={product.name}
                        />
                        <span className="tnum font-[family-name:var(--font-display)] text-[length:var(--text-price)] font-bold">
                          {formatKES(product.price * line.qty)}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => remove(line.id)}
                      aria-label={`Remove ${product.name} from cart`}
                      className="grid size-11 shrink-0 place-items-center self-start rounded-xs text-muted transition-colors duration-[var(--motion-fast)] hover:bg-surface hover:text-danger lg:size-8"
                    >
                      <Trash2 className="size-4" strokeWidth={1.9} aria-hidden />
                    </button>
                  </li>
                );
              })}
            </ul>

            <div className="shrink-0 border-t border-border bg-surface px-4 py-4">
              <div className="flex items-baseline justify-between">
                <span className="text-small text-text-secondary">Subtotal</span>
                <span className="tnum font-[family-name:var(--font-display)] text-[length:var(--text-price-lg)] font-[weight:750] tracking-[-0.025em]">
                  {formatKES(subtotal)}
                </span>
              </div>
              <p className="mt-1 text-[0.75rem] leading-snug text-muted">
                Delivery is quoted separately once we confirm the site.{" "}
                {siteConfig.delivery.freeThreshold > 0 && (
                  <>Orders over {formatKES(siteConfig.delivery.freeThreshold)} within Nairobi deliver free.</>
                )}
              </p>

              <div className="mt-3 flex flex-col gap-2">
                <ButtonLink href="/checkout" onClick={close} size="lg" fullWidth>
                  Checkout with M-Pesa
                </ButtonLink>
                <ExternalLink href={waLink(waMessage)} external size="md" variant="outline" fullWidth>
                  Send this list on WhatsApp
                </ExternalLink>
              </div>

              <p className="mt-3 flex items-center justify-center gap-3 font-[family-name:var(--font-mono)] text-[0.625rem] uppercase tracking-[0.1em] text-muted">
                <span className="inline-flex items-center gap-1">
                  <Smartphone className="size-3" strokeWidth={2} aria-hidden />
                  M-Pesa
                </span>
                <span aria-hidden className="h-3 w-px shrink-0 bg-border" />
                <span className="inline-flex items-center gap-1">
                  <ShieldCheck className="size-3" strokeWidth={2} aria-hidden />
                  Genuine stock
                </span>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function Stepper({
  qty,
  onIncrement,
  onDecrement,
  label,
}: {
  qty: number;
  onIncrement: () => void;
  onDecrement: () => void;
  label: string;
}) {
  return (
    <div className="inline-flex items-center rounded-xs border border-border">
      <button
        type="button"
        onClick={onDecrement}
        aria-label={qty === 1 ? `Remove ${label} from cart` : `Decrease quantity of ${label}`}
        className="grid size-11 place-items-center text-text-secondary transition-colors duration-[var(--motion-fast)] hover:bg-surface hover:text-text lg:size-8"
      >
        {qty === 1 ? (
          <Trash2 className="size-3.5" strokeWidth={2} aria-hidden />
        ) : (
          <Minus className="size-3.5" strokeWidth={2.25} aria-hidden />
        )}
      </button>
      <span
        aria-live="polite"
        className="tnum w-7 text-center font-[family-name:var(--font-mono)] text-small leading-none"
      >
        {qty}
      </span>
      <button
        type="button"
        onClick={onIncrement}
        aria-label={`Increase quantity of ${label}`}
        className="grid size-11 place-items-center text-text-secondary transition-colors duration-[var(--motion-fast)] hover:bg-surface hover:text-text lg:size-8"
      >
        <Plus className="size-3.5" strokeWidth={2.25} aria-hidden />
      </button>
    </div>
  );
}

function EmptyCart({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 px-8 text-center">
      <div aria-hidden className="grid size-14 place-items-center rounded-card border border-border bg-surface">
        <svg viewBox="0 0 24 24" fill="none" className="size-6 text-muted" aria-hidden>
          <path
            d="M3 5h2.2l1.6 9.4A2 2 0 0 0 8.77 16h8.86a2 2 0 0 0 1.97-1.58L21 8H6"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="10" cy="20" r="1.2" fill="currentColor" />
          <circle cx="17" cy="20" r="1.2" fill="currentColor" />
        </svg>
      </div>
      <h3 className="font-[family-name:var(--font-display)] text-[length:var(--text-h3)] font-[weight:650]">
        Your cart is empty
      </h3>
      <p className="max-w-xs text-small text-muted">
        Nothing in the basket yet. Browse the catalogue, or send us your list on WhatsApp and we will
        price it for you.
      </p>
      <div className="mt-1 flex flex-col gap-2">
        <ButtonLink href="/shop" onClick={onClose} variant="accent" size="md">
          Browse products
        </ButtonLink>
        <ButtonLink href="/contact" onClick={onClose} variant="outline" size="md">
          Order on WhatsApp
        </ButtonLink>
      </div>
    </div>
  );
}