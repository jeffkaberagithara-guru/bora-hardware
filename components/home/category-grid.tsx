import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { categories, type Category } from "@/data/categories";
import { countByCategory } from "@/data/products";

const counts = countByCategory();

/**
 * Category grid.
 *
 * Deliberately not seven identical cards. The grid resolves into three bands with
 * descending visual weight: one large lead tile (Power Tools — where most
 * customers arrive), two medium tiles beside it, then two larger and two compact
 * tiles. The asymmetry gives the section a deliberate rhythm instead of a
 * templated grid, and it keeps the lead category genuinely dominant.
 *
 * Labels sit in a solid block beneath each photograph, never over it. Text laid
 * on an unpredictable source photo cannot be contrast-guaranteed, and contrast is
 * a floor here, not a preference.
 */
export function CategoryGrid() {
  const [lead, a, b, c, d, e, f] = categories;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-12">
      <Tile category={lead} variant="lead" className="sm:col-span-2 lg:col-span-6 lg:row-span-2" />
      <Tile category={a} variant="tall" className="lg:col-span-3 lg:row-span-2" />
      <Tile category={b} variant="tall" className="lg:col-span-3 lg:row-span-2" />
      <Tile category={c} variant="mid" className="lg:col-span-4" />
      <Tile category={d} variant="mid" className="lg:col-span-4" />
      <Tile category={e} variant="compact" className="lg:col-span-2" />
      <Tile category={f} variant="compact" className="lg:col-span-2" />
    </div>
  );
}

type TileVariant = "lead" | "tall" | "mid" | "compact";

const ASPECT: Record<TileVariant, string> = {
  lead: "aspect-[16/10] lg:aspect-auto lg:flex-1",
  tall: "aspect-[4/3]",
  mid: "aspect-[16/9]",
  compact: "aspect-[16/10]",
};

const TITLE: Record<TileVariant, string> = {
  lead: "text-[length:var(--text-h2)]",
  tall: "text-[1.3125rem]",
  mid: "text-[length:var(--text-h3)]",
  compact: "text-[1.0625rem]",
};

function Tile({
  category,
  variant,
  className = "",
}: {
  category: Category;
  variant: TileVariant;
  className?: string;
}) {
  const count = counts[category.id] ?? 0;

  return (
    <Link
      href={`/shop/${category.id}`}
      className={`group/cat relative flex flex-col overflow-hidden rounded-card border border-border bg-background transition-[border-color,transform] duration-[var(--motion-standard)] ease-[var(--ease-out)] motion-safe:hover:-translate-y-[3px] hover:border-border-strong ${className}`}
    >
      <div className={`relative w-full overflow-hidden bg-surface ${ASPECT[variant]}`}>
        <Image
          src={category.image}
          alt=""
          fill
          loading="lazy"
          decoding="async"
          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 46vw, 92vw"
          className="object-cover transition-transform duration-[var(--motion-standard)] ease-[var(--ease-out)] motion-safe:group-hover/cat:scale-[1.025]"
        />
      </div>

      <div className={`flex flex-1 flex-col gap-1 border-t border-border ${variant === "compact" ? "p-4" : "p-5"}`}>
        <div className="flex items-baseline justify-between gap-3">
          <h3
            className={`font-[family-name:var(--font-display)] font-[weight:650] leading-tight tracking-[-0.01em] ${TITLE[variant]}`}
          >
            {category.name}
          </h3>
          <span className="tnum shrink-0 font-[family-name:var(--font-mono)] text-[0.6875rem] text-muted">
            {String(count).padStart(2, "0")}
          </span>
        </div>
        <p className="text-small leading-snug text-muted">{category.blurb}</p>
        <span className="mt-auto inline-flex items-center gap-1 pt-3 font-[family-name:var(--font-mono)] text-[0.6875rem] uppercase tracking-[0.1em] text-text-secondary transition-colors duration-[var(--motion-fast)] group-hover/cat:text-accent-deep">
          Browse
          <ArrowUpRight
            className="size-3.5 transition-transform duration-[var(--motion-fast)] ease-[var(--ease-out)] group-hover/cat:translate-x-0.5 group-hover/cat:-translate-y-0.5"
            strokeWidth={2}
            aria-hidden
          />
        </span>
      </div>
    </Link>
  );
}