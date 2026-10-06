"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, MessageCircle, Phone, X } from "lucide-react";
import { categories } from "@/data/categories";
import { countByCategory } from "@/data/products";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/cn";

const counts = countByCategory();

/**
 * Mobile menu.
 *
 * A panel that slides from the right, not a generic bottom drawer. Categories
 * are hairline-separated rows with counts so the mobile buyer gets the same
 * product-discovery structure as desktop. Focus is trapped, Escape closes,
 * body scroll locks, and focus returns to the trigger on close.
 */
export function MobileMenu({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const [rendered, setRendered] = useState(open);
  const [closing, setClosing] = useState(false);

  // Keep the panel mounted through its exit transition.
  useEffect(() => {
    if (open) {
      setRendered(true);
      setClosing(false);
      return;
    }
    if (!rendered) return;
    setClosing(true);
    const t = setTimeout(() => {
      setRendered(false);
      setClosing(false);
    }, 240);
    return () => clearTimeout(t);
  }, [open, rendered]);

  // Close on route change.
  useEffect(() => {
    if (open) onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    triggerRef.current = document.querySelector<HTMLButtonElement>("[data-menu-trigger]");
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
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
    const focusTimer = setTimeout(() => {
      panelRef.current?.querySelector<HTMLElement>("a, button")?.focus();
    }, 240);

    return () => {
      document.removeEventListener("keydown", onKey);
      clearTimeout(focusTimer);
      document.body.style.overflow = overflow;
      triggerRef.current?.focus();
    };
  }, [open, onClose]);

  const onBackdrop = useCallback(() => onClose(), [onClose]);

  if (!rendered) return null;

  return (
    <div className="fixed inset-0 z-[65] lg:hidden">
      <button
        type="button"
        tabIndex={closing ? -1 : 0}
        aria-label="Close menu"
        onClick={onBackdrop}
        className={cn(
          "absolute inset-0 w-full cursor-default bg-text/45 transition-opacity duration-[var(--motion-standard)] ease-[var(--ease-out)] motion-reduce:transition-none",
          closing ? "opacity-0" : "opacity-100",
        )}
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        className={cn(
          "absolute inset-y-0 right-0 flex w-[min(21rem,88vw)] flex-col border-l border-border bg-background shadow-overlay",
          "motion-safe:animate-[panelInRight_var(--motion-emphasis)_var(--ease-out)]",
        )}
        style={
          closing
            ? { animation: "panelOutRight 240ms var(--ease-inout) forwards" }
            : undefined
        }
      >
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-border px-4">
          <span className="eyebrow text-muted">Menu</span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="-mr-1 grid size-11 place-items-center rounded-xs text-muted transition-colors duration-[var(--motion-fast)] hover:bg-surface hover:text-text"
          >
            <X className="size-5" strokeWidth={2} aria-hidden />
          </button>
        </div>

        <nav aria-label="Mobile" className="flex-1 overflow-y-auto overscroll-contain">
          <ul className="divide-y divide-[color:var(--color-border)]">
            {categories.map((category) => (
              <li key={category.id}>
                <Link
                  href={`/shop/${category.id}`}
                  onClick={onClose}
                  className="flex items-center justify-between gap-3 px-4 py-3.5 transition-colors duration-[var(--motion-fast)] active:bg-surface"
                >
                  <span className="min-w-0">
                    <span className="block font-[family-name:var(--font-display)] text-[1.0625rem] font-[weight:650] tracking-[-0.01em]">
                      {category.name}
                    </span>
                    <span className="mt-0.5 block truncate text-[0.8125rem] text-muted">
                      {category.blurb}
                    </span>
                  </span>
                  <span className="flex shrink-0 items-center gap-2 text-small text-muted">
                    {counts[category.id] ?? 0}
                    <ArrowRight className="size-4" strokeWidth={2} aria-hidden />
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          <ul className="divide-y divide-[color:var(--color-border)] border-t border-border">
            {[
              { label: "All products", href: "/shop" },
              { label: "About Bora", href: "/about" },
              { label: "Contact & delivery", href: "/contact" },
            ].map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onClose}
                  className="block px-4 py-3.5 font-[family-name:var(--font-display)] text-[1.0625rem] font-[weight:650] tracking-[-0.01em] transition-colors duration-[var(--motion-fast)] active:bg-surface"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex flex-col gap-2 border-t border-border p-4">
            <a
              href={`tel:${siteConfig.contact.phoneHref}`}
              className="flex min-h-11 items-center gap-2.5 rounded-xs border border-border px-3 text-small font-medium transition-colors duration-[var(--motion-fast)] active:bg-surface"
            >
              <Phone className="size-4 text-muted" strokeWidth={2} aria-hidden />
              {siteConfig.contact.phoneDisplay}
            </a>
            <a
              href={`https://wa.me/${siteConfig.contact.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-11 items-center justify-center gap-2 rounded-xs border border-accent bg-accent px-3 text-small font-semibold text-accent-ink transition-colors duration-[var(--motion-fast)] active:bg-accent-hover"
            >
              <MessageCircle className="size-4" strokeWidth={2.25} aria-hidden />
              Order on WhatsApp
            </a>
          </div>
        </nav>
      </div>
    </div>
  );
}