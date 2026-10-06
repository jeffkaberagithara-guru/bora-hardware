"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { ProductCard } from "@/components/ui/product-card";
import { productGridClasses } from "@/components/ui/product-grid";
import { Stagger, StaggerItem } from "@/components/ui/reveal";
import { categories } from "@/data/categories";
import type { Product } from "@/data/products";
import { cn } from "@/lib/cn";

/**
 * Catalogue.
 *
 * The toolbar is deliberately small: a department rail, a sort control and a
 * count. Faceted filtering would be theatre at this catalogue depth — seven
 * departments, a few dozen lines — and every extra control is a control a
 * buyer on a mid-range Android has to parse before seeing a price.
 *
 * Department chips are real links (`/shop/:id`) so a filtered view is
 * shareable and indexable; only the sort order is local state, because it
 * re-orders what is already on the page rather than selecting a different set.
 */
type SortKey = "featured" | "price-asc" | "price-desc" | "name";

const SORTS: { value: SortKey; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price, low to high" },
  { value: "price-desc", label: "Price, high to low" },
  { value: "name", label: "Name, A–Z" },
];

function sortProducts(products: Product[], sort: SortKey): Product[] {
  const list = [...products];
  switch (sort) {
    case "price-asc":
      return list.sort((a, b) => a.price - b.price);
    case "price-desc":
      return list.sort((a, b) => b.price - a.price);
    case "name":
      return list.sort((a, b) => a.name.localeCompare(b.name));
    case "featured":
      return list.sort((a, b) => Number(b.featured) - Number(a.featured));
  }
}

export function Catalogue({
  products,
  activeCategory,
}: {
  products: Product[];
  activeCategory: string | null;
}) {
  const [sort, setSort] = useState<SortKey>("featured");
  const sorted = useMemo(() => sortProducts(products, sort), [products, sort]);

  return (
    <div className="flex flex-col gap-6">
      {/* ------------------------------------------------------------ toolbar */}
      <div className="flex flex-col gap-3 border-b border-border pb-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* This is the heading for the grid below it — the product cards are
              h3, so it has to be an h2 for the document outline to hold. It is
              the count, which is also the most useful thing to label the grid
              with: how many lines you are looking at. */}
          <h2 className="eyebrow text-muted" aria-live="polite">
            {products.length} {products.length === 1 ? "line" : "lines"}
            {activeCategory && " in this department"}
          </h2>

          <div className="flex items-center gap-2">
            <label htmlFor="catalogue-sort" className="eyebrow text-muted">
              Sort
            </label>
            <div className="relative">
              <select
                id="catalogue-sort"
                value={sort}
                onChange={(event) => setSort(event.target.value as SortKey)}
                className="h-11 appearance-none rounded-xs border border-border-strong bg-background py-0 pl-3 pr-9 text-[length:var(--text-nav)] text-text transition-colors duration-[var(--motion-fast)] hover:border-text"
              >
                {SORTS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="pointer-events-none absolute right-2.5 top-1/2 size-4 -translate-y-1/2 text-muted"
                strokeWidth={2}
                aria-hidden
              />
            </div>
          </div>
        </div>

        {/* Department rail. A horizontal scroller below md — seven chips do not
            fit a 360px viewport, and hiding them would hide the catalogue's
            structure. */}
        <ul className="no-bar -mx-1 flex items-center gap-1.5 overflow-x-auto px-1">
          <li>
            <Chip href="/shop" active={activeCategory === null}>
              All products
            </Chip>
          </li>
          {categories.map((category) => (
            <li key={category.id}>
              <Chip href={`/shop/${category.id}`} active={activeCategory === category.id}>
                {category.name}
              </Chip>
            </li>
          ))}
        </ul>
      </div>

      {/* --------------------------------------------------------------- grid */}
      {sorted.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-card border border-border bg-surface px-6 py-14 text-center">
          <h2 className="font-[family-name:var(--font-display)] text-[length:var(--text-h3)] font-[weight:650]">
            Nothing on this shelf yet
          </h2>
          <p className="max-w-sm text-small text-muted">
            This department is being stocked. Send us the item on WhatsApp and we will quote it
            from the counter.
          </p>
          <Link
            href="/contact"
            className="mt-1 min-h-11 border-b border-border-strong text-[length:var(--text-nav)] font-medium transition-colors duration-[var(--motion-fast)] hover:border-text hover:text-primary"
          >
            Ask the counter
          </Link>
        </div>
      ) : (
        <Stagger className={productGridClasses}>
          {sorted.map((product, i) => (
            <StaggerItem key={product.id} className="flex">
              <ProductCard product={product} priority={i < 4} className="w-full" />
            </StaggerItem>
          ))}
        </Stagger>
      )}
    </div>
  );
}

function Chip({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "inline-flex h-11 shrink-0 items-center rounded-xs border px-3.5 text-[length:var(--text-nav)] font-medium",
        "transition-[background-color,color,border-color] duration-[var(--motion-fast)] ease-[var(--ease-out)]",
        active
          ? "border-primary bg-primary-soft text-primary"
          : "border-border bg-background text-text-secondary hover:border-border-strong hover:text-text",
      )}
    >
      {children}
    </Link>
  );
}
