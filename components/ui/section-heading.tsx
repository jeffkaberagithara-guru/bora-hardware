import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * Section heading.
 *
 * A mono eyebrow plus a heading plus an optional right-hand link. The `rule`
 * variant draws a full-bleed hairline above the heading, which is how a printed
 * catalogue separates sections — and it lets the page breathe without reaching
 * for another floating card.
 */
export function SectionHeading({
  eyebrow,
  title,
  intro,
  action,
  rule = true,
  className,
  headingLevel = "h2",
  id,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  intro?: React.ReactNode;
  action?: { label: string; href: string };
  rule?: boolean;
  className?: string;
  headingLevel?: "h1" | "h2" | "h3";
  id?: string;
}) {
  const Tag = headingLevel;

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {rule && <hr className="border-0 border-t border-border" />}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between md:gap-8">
        <div className="flex max-w-2xl flex-col gap-2.5">
          {eyebrow && <p className="eyebrow text-muted">{eyebrow}</p>}
          <Tag
            id={id}
            className="font-[family-name:var(--font-display)] text-[length:var(--text-h2)] font-[weight:700] leading-[1.14] tracking-[-0.02em]"
          >
            {title}
          </Tag>
          {intro && (
            <p className="text-[length:var(--text-body-lg)] leading-[1.65] text-text-secondary">{intro}</p>
          )}
        </div>

        {action && (
          <Link
            href={action.href}
            className="group/link inline-flex min-h-11 shrink-0 items-center gap-1.5 self-start border-b border-border-strong text-[length:var(--text-nav)] font-medium transition-colors duration-[var(--motion-fast)] hover:border-text hover:text-primary md:self-end"
          >
            {action.label}
            <ArrowRight
              className="size-4 transition-transform duration-[var(--motion-fast)] ease-[var(--ease-out)] group-hover/link:translate-x-0.5"
              strokeWidth={2}
              aria-hidden
            />
          </Link>
        )}
      </div>
    </div>
  );
}