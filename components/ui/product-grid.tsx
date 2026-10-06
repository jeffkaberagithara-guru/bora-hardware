import { cn } from "@/lib/cn";

/**
 * Product grid (DESIGN.md §9).
 *
 * One breakpoint set for the whole site, because a catalogue that changes
 * shape between pages is a catalogue that cannot be scanned:
 * 1-up below 360 (the narrowest phone we support), 2-up from 360 — which is
 * where real mid-range Android widths sit and where prices stay legible in
 * pairs — 3-up at lg, 4-up at xl. Gaps 20px.
 *
 * Exposed as both a class string (so a motion container like `Stagger` can own
 * the grid) and a component.
 */
export const productGridClasses =
  "grid grid-cols-1 gap-4 min-[360px]:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4";

export function ProductGrid({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn(productGridClasses, className)}>{children}</div>;
}
