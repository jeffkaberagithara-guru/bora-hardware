import Link from "next/link";
import { cn } from "@/lib/cn";
import { siteConfig } from "@/config/site";

/**
 * Wordmark.
 *
 * `BORA` is set in Archivo at weight 800 with the variable width axis pushed to
 * 112 — signage proportions. The descriptor under it does the category work, so
 * the mark itself stays short and confident. On mobile the descriptor is dropped
 * rather than shrunk, which keeps the header height fixed at 64px.
 */
export function Logo({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <Link
      href="/"
      aria-label={`${siteConfig.name} home`}
      className={cn(
        "group/logo inline-flex min-h-11 items-center py-1.5 leading-none",
        className,
      )}
    >
      <span
        className="font-[family-name:var(--font-display)] text-[1.375rem] font-[weight:800] leading-none tracking-[-0.02em] text-text transition-colors duration-[var(--motion-fast)]"
        style={{ fontVariationSettings: "'wdth' 112" }}
      >
        <span className="text-primary">BO</span>
        <span className="text-accent-deep">RA</span>
      </span>
      {!compact && (
        <span className="mt-1 hidden font-[family-name:var(--font-mono)] text-[0.6875rem] uppercase leading-none tracking-[0.16em] text-muted lg:block">
          {siteConfig.descriptor}
        </span>
      )}
    </Link>
  );
}