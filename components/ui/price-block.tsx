import { cn } from "@/lib/cn";
import { formatKES, secondaryRate, stockLabel, unitPrice } from "@/lib/currency";
import type { Product } from "@/data/products";

/**
 * The price block.
 *
 * Price visibility is the highest-priority UX concern for hardware: Baymard's
 * research shows users abandon when price is not immediately legible, and
 * recommends price rendered close to headline size with tabular figures.
 * So: price is set in the display face at card-title scale, never in the accent
 * colour, always tabular so a column of them aligns.
 *
 * The unit price underneath is what makes the catalogue usable — cement, cable
 * and nails cannot be compared without it.
 */
export function PriceBlock({
  product,
  size = "md",
  showStock = true,
  className,
}: {
  product: Product;
  size?: "sm" | "md" | "lg";
  showStock?: boolean;
  className?: string;
}) {
  const per = unitPrice(product);
  const alt = secondaryRate(product);
  const out = product.stock <= 0;
  const low = product.stock > 0 && product.stock <= 5;

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
        <span
          className={cn(
            "tnum font-[family-name:var(--font-display)] font-[length:var(--text-price)] leading-[1.1] tracking-[-0.015em]",
            size === "lg" &&
              "font-[length:var(--text-price-lg)] font-[weight:750] tracking-[-0.025em]",
            out && "text-muted line-through decoration-1",
          )}
        >
          {formatKES(product.price)}
        </span>
        {per && (
          <span className="font-[family-name:var(--font-mono)] text-[length:var(--text-unit-price)] text-muted">
            {per}
          </span>
        )}
      </div>

      {alt && (
        <span className="font-[family-name:var(--font-mono)] text-[0.6875rem] text-muted">{alt}</span>
      )}

      {showStock && (
        <span
          className={cn(
            "inline-flex items-center gap-1.5 text-[0.75rem] leading-none",
            out ? "text-muted" : low ? "text-accent-deep" : "text-success",
          )}
        >
          <span
            aria-hidden
            className={cn(
              "size-1.5 shrink-0 rounded-pill",
              out ? "bg-border-strong" : low ? "bg-accent" : "bg-success",
            )}
          />
          {stockLabel(product.stock)}
        </span>
      )}
    </div>
  );
}