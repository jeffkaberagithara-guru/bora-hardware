import { Search } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";

/**
 * 404.
 *
 * Same designed empty state the cart and search use — a plain statement of
 * what happened, the two ways forward, and no decorative illustration. It
 * catches unknown product and department ids too, since both call notFound().
 */
export default function NotFound() {
  return (
    <div className="shell flex flex-col items-start gap-4 py-16 md:py-24">
      <Breadcrumbs items={[{ label: "Page not found" }]} />

      <p className="eyebrow text-muted">Error 404</p>

      <h1 className="max-w-xl font-[family-name:var(--font-display)] text-[length:var(--text-h1)] font-[weight:750] leading-[1.06] tracking-[-0.025em]">
        That shelf is empty
      </h1>

      <p className="max-w-lg text-[length:var(--text-body-lg)] leading-[1.65] text-text-secondary">
        The page you asked for is not here — the product may have been renamed, or the link is
        broken. The catalogue is still where you left it.
      </p>

      <div className="mt-2 flex flex-col gap-2.5 sm:flex-row">
        <ButtonLink href="/shop" size="lg">
          Browse the catalogue
        </ButtonLink>
        <ButtonLink href="/contact" size="lg" variant="outline">
          Ask the counter
        </ButtonLink>
      </div>

      <p className="mt-4 flex items-center gap-2 border-t border-border pt-5 font-[family-name:var(--font-mono)] text-[0.6875rem] uppercase tracking-[0.1em] text-muted">
        <Search className="size-3.5" strokeWidth={2} aria-hidden />
        Or press Ctrl / ⌘ K to search the whole catalogue
      </p>
    </div>
  );
}
