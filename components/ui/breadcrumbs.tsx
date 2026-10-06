import Link from "next/link";
import { ChevronRight } from "lucide-react";

export type Crumb = { label: string; href?: string };

/**
 * Breadcrumb.
 *
 * Mono, uppercase and tracked, so it reads as catalogue furniture rather than
 * as another line of navigation competing with the header. The current page is
 * never a link and carries `aria-current`.
 *
 * The links carry a 44px hit area (DESIGN.md §11) even though the type is
 * 11px — on a phone this row sits right under the thumb path, and a 15px target
 * is a mis-tap.
 */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="eyebrow text-muted">
      <ol className="-ml-1.5 flex flex-wrap items-center gap-x-1">
        <li className="flex items-center">
          <Link
            href="/"
            className="inline-flex min-h-11 items-center px-1.5 transition-colors duration-[var(--motion-fast)] hover:text-primary"
          >
            Home
          </Link>
          <ChevronRight className="size-3 shrink-0 text-border-strong" strokeWidth={2.5} aria-hidden />
        </li>
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={item.label} className="flex items-center">
              {item.href && !last ? (
                <>
                  <Link
                    href={item.href}
                    className="inline-flex min-h-11 items-center px-1.5 transition-colors duration-[var(--motion-fast)] hover:text-primary"
                  >
                    {item.label}
                  </Link>
                  <ChevronRight className="size-3 shrink-0 text-border-strong" strokeWidth={2.5} aria-hidden />
                </>
              ) : (
                <span aria-current={last ? "page" : undefined} className="px-1.5 text-text-secondary">
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
