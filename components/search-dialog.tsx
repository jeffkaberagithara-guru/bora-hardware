"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, CornerDownLeft, Search, X } from "lucide-react";
import { useCart } from "@/components/cart/cart-provider";
import { formatKES } from "@/lib/currency";
import { searchCatalogue, splitHighlight } from "@/lib/search";
import { cn } from "@/lib/cn";

/**
 * Catalogue search dialog.
 *
 * Opens with the header input, with `/`, or with cmd/ctrl+K. Search matches
 * product name, brand and category because that is how hardware is actually
 * asked for at a counter.
 */
export function SearchDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const labelId = useId();
  const { close: closeCart } = useCart();

  const results = searchCatalogue(query);
  const trimmed = query.trim().length > 0;

  useEffect(() => {
    if (!open) {
      setQuery("");
      return;
    }
    // Whoever opened the dialog gets it back when it closes — otherwise focus
    // falls to <body> and a keyboard user has to Tab in from the top again.
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const focusTimer = setTimeout(() => inputRef.current?.focus(), 60);
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      clearTimeout(focusTimer);
      document.body.style.overflow = overflow;
      opener?.focus();
    };
  }, [open]);

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
    },
    [onClose],
  );

  const go = useCallback(
    (href: string) => {
      onClose();
      closeCart();
      router.push(href);
    },
    [onClose, closeCart, router],
  );

  const submit = () => {
    if (!trimmed) return;
    go(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[70]"
      role="dialog"
      aria-modal="true"
      aria-labelledby={labelId}
      onKeyDown={onKeyDown}
    >
      <button
        type="button"
        aria-label="Close search"
        onClick={onClose}
        className="absolute inset-0 animate-[fadeIn_var(--motion-standard)_ease-out] cursor-default bg-text/40 motion-reduce:animate-none"
      />

      <div
        ref={panelRef}
        className="relative mx-auto mt-16 max-h-[calc(100dvh-7rem)] w-[min(40rem,calc(100vw-2rem))] animate-[dialogIn_var(--motion-emphasis)_var(--ease-out)] overflow-y-auto rounded-panel border border-border bg-background shadow-overlay motion-reduce:animate-none sm:mt-24"
      >
        <h2 id={labelId} className="sr-only">
          Search the catalogue
        </h2>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
          className="flex items-center gap-3 border-b border-border px-4"
        >
          <Search className="size-[1.125rem] shrink-0 text-muted" strokeWidth={2} aria-hidden />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search drills, cable, cement…"
            autoComplete="off"
            className="h-14 min-w-0 flex-1 bg-transparent text-body placeholder:text-muted [&::-webkit-search-cancel-button]:appearance-none"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close search"
            className="-mr-1 grid size-11 shrink-0 place-items-center rounded-xs text-muted transition-colors duration-[var(--motion-fast)] hover:bg-surface hover:text-text lg:size-8"
          >
            <X className="size-4" strokeWidth={2} aria-hidden />
          </button>
        </form>

        <div className="p-2">
          {!trimmed && (
            <div className="p-3">
              <p className="eyebrow mb-2.5 text-muted">Try searching</p>
              <div className="flex flex-wrap gap-1.5">
                {["Cordless drill", "2.5mm cable", "Cement", "Nails", "Angle grinder"].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setQuery(s)}
                    className="min-h-11 rounded-xs border border-border px-2.5 text-small text-text-secondary transition-colors duration-[var(--motion-fast)] hover:border-text hover:text-text"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {trimmed && results.total === 0 && (
            <div className="flex flex-col items-start gap-2 p-6 text-center sm:items-center">
              <p className="font-[family-name:var(--font-display)] text-[length:var(--text-h3)] font-[weight:650]">
                No stock matches “{query.trim()}”
              </p>
              <p className="max-w-sm text-small text-muted">
                We may still be able to source it. Send us the item on WhatsApp and we will come back
                with a price and a delivery date.
              </p>
              <Link
                href="/contact"
                onClick={onClose}
                className="mt-1 inline-flex min-h-11 items-center text-small font-medium hover:text-primary"
              >
                <span className="border-b border-border-strong pb-0.5 transition-colors duration-[var(--motion-fast)] hover:border-text">
                  Ask us to source it
                </span>
              </Link>
            </div>
          )}

          {trimmed && results.total > 0 && (
            <>
              {results.categories.length > 0 && (
                <div className="mb-1">
                  {results.categories.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => go(`/shop/${c.id}`)}
                      className="group/cat flex min-h-11 w-full items-center justify-between gap-3 rounded-xs px-3 text-left transition-colors duration-[var(--motion-fast)] hover:bg-surface"
                    >
                      <span className="text-body font-medium">{c.name}</span>
                      <span className="flex items-center gap-2 text-small text-muted">
                        {c.count} items
                        <ArrowRight
                          className="size-4 transition-transform duration-[var(--motion-fast)] group-hover/cat:translate-x-0.5"
                          strokeWidth={2}
                          aria-hidden
                        />
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {results.products.length > 0 && (
                <ul className="border-t border-border pt-1">
                  {results.products.map((product) => {
                    const parts = splitHighlight(product.name, query);
                    return (
                      <li key={product.id}>
                        <Link
                          href={`/product/${product.id}`}
                          onClick={onClose}
                          className="flex items-center gap-3 rounded-xs px-3 py-2.5 transition-colors duration-[var(--motion-fast)] hover:bg-surface"
                        >
                          <span className="relative size-11 shrink-0 overflow-hidden rounded-xs bg-surface">
                            <Image src={product.image} alt="" fill sizes="44px" className="object-cover" />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="eyebrow block text-muted">{product.brand}</span>
                            <span className="block truncate text-small font-medium">
                              {parts ? (
                                <>
                                  {parts[0]}
                                  <mark className="bg-accent-soft text-text">{parts[1]}</mark>
                                  {parts[2]}
                                </>
                              ) : (
                                product.name
                              )}
                            </span>
                          </span>
                          <span className="tnum shrink-0 font-[family-name:var(--font-display)] text-small font-bold">
                            {formatKES(product.price)}
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}

              <div className="border-t border-border p-2">
                <button
                  type="button"
                  onClick={submit}
                  className="flex min-h-11 w-full items-center justify-between gap-3 rounded-xs px-3 text-left text-small text-text-secondary transition-colors duration-[var(--motion-fast)] hover:bg-surface hover:text-text"
                >
                  <span>
                    {results.total} result{results.total === 1 ? "" : "s"} — see all
                  </span>
                  <CornerDownLeft className="size-3.5 shrink-0 text-muted" strokeWidth={2} aria-hidden />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/** Opens search from anywhere via `/` or cmd/ctrl+K. */
export function useSearchHotkey(open: () => void, close: () => void) {
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const typing =
        !!target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable);

      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        open();
        return;
      }
      if (event.key === "/" && !typing && !event.metaKey && !event.ctrlKey && !event.altKey) {
        event.preventDefault();
        open();
        return;
      }
      if (event.key === "Escape") close();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, close]);
}

export const searchButtonClass = (extra?: string) =>
  cn(
    "inline-flex h-9 items-center gap-2 rounded-xs border border-border bg-surface px-3 text-[length:var(--text-nav)] text-muted",
    "transition-colors duration-[var(--motion-fast)] hover:border-border-strong hover:text-text",
    extra,
  );