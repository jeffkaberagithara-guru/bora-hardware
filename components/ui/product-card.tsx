import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { formatKES, soldPer } from "@/lib/currency";
import { getCategory } from "@/data/categories";
import type { Product } from "@/data/products";
import { PriceBlock } from "./price-block";
import { AddToCartButton } from "./add-to-cart-button";

/**
 * Product card.
 *
 * Built from the printed trade price list rather than from a generic storefront
 * card: brand as a mono eyebrow, name in the text face, ticket price large and
 * tabular, unit rate as the technical footnote. Radius is 3px and separation is
 * a hairline, not a shadow — machined, not inflated.
 *
 * The title link's ::after stretches it over the whole card so the entire tile is
 * clickable from a single link, while the add-to-cart button stays a separate,
 * independently focusable control. No nested interactive elements.
 */
export function ProductCard({
  product,
  className,
  priority = false,
  sizes = "(min-width: 1280px) 22vw, (min-width: 1024px) 30vw, (min-width: 640px) 44vw, 92vw",
}: {
  product: Product;
  className?: string;
  priority?: boolean;
  sizes?: string;
}) {
  const category = getCategory(product.categoryId);

  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-card border border-border bg-background",
        "transition-[border-color,box-shadow,transform] duration-[var(--motion-standard)] ease-[var(--ease-out)]",
        "hover:-translate-y-[3px] hover:border-border-strong hover:shadow-lift",
        className,
      )}
    >
      {/* Uniform crop on a neutral well, so a mixed catalogue still reads as one
          system rather than a scrapbook of mismatched source photography. */}
      <div className="relative aspect-[4/3] overflow-hidden bg-surface">
        <Image
          src={product.image}
          alt={product.alt}
          fill
          priority={priority}
          sizes={sizes}
          className="object-cover transition-transform duration-[var(--motion-standard)] ease-[var(--ease-out)] motion-safe:group-hover:scale-[1.025]"
        />
      </div>

      <div className="flex flex-1 flex-col gap-3 border-t border-border p-4">
        <div className="flex flex-col gap-1.5">
          <p className="eyebrow flex items-center gap-2 text-muted">
            <span className="truncate text-text-secondary">{product.brand}</span>
            {category && (
              <>
                <span aria-hidden className="h-3 w-px shrink-0 bg-border" />
                <span className="truncate">{category.name}</span>
              </>
            )}
          </p>

          <h3 className="font-[family-name:var(--font-display)] text-[length:var(--text-h3)] font-[weight:650] leading-[1.3] tracking-[-0.01em]">
            <Link
              href={`/product/${product.id}`}
              className="after:absolute after:inset-0 after:content-[''] hover:text-primary"
            >
              {product.name}
            </Link>
          </h3>
        </div>

        <div className="mt-auto flex flex-col gap-3">
          <PriceBlock product={product} />
          <p className="font-[family-name:var(--font-mono)] text-[0.6875rem] leading-none text-muted">
            {soldPer(product)} · {product.sku}
          </p>
          <AddToCartButton product={product} className="relative z-10" />
        </div>
      </div>
    </article>
  );
}

/** Compact row variant for the cart drawer and search results. */
export function ProductRow({ product, className }: { product: Product; className?: string }) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="relative size-16 shrink-0 overflow-hidden rounded-xs bg-surface">
        <Image src={product.image} alt="" fill sizes="64px" className="object-cover" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="eyebrow text-muted">{product.brand}</p>
        <Link
          href={`/product/${product.id}`}
          className="mt-0.5 block truncate text-small font-medium hover:text-primary"
        >
          {product.name}
        </Link>
      </div>
      <span className="tnum shrink-0 font-[family-name:var(--font-display)] text-[length:var(--text-price)] font-bold">
        {formatKES(product.price)}
      </span>
    </div>
  );
}

/** Skeleton matching ProductCard's geometry, for the loading state. */
export function ProductCardSkeleton() {
  return (
    <div
      aria-hidden
      className="flex flex-col overflow-hidden rounded-card border border-border bg-background"
    >
      <div className="aspect-[4/3] animate-pulse bg-surface-2" />
      <div className="flex flex-col gap-3 border-t border-border p-4">
        <div className="h-2.5 w-20 animate-pulse rounded-xs bg-surface-2" />
        <div className="h-4 w-full animate-pulse rounded-xs bg-surface-2" />
        <div className="h-4 w-3/4 animate-pulse rounded-xs bg-surface-2" />
        <div className="mt-2 h-5 w-24 animate-pulse rounded-xs bg-surface-2" />
        <div className="h-9 w-full animate-pulse rounded-xs bg-surface-2" />
      </div>
    </div>
  );
}