import { Breadcrumbs, type Crumb } from "./breadcrumbs";

/**
 * Page header band.
 *
 * One shape for every inner route: breadcrumb, mono eyebrow, h1, one honest
 * sentence of intro. It sits on `--color-surface` behind a hairline so a
 * catalogue or info page announces itself without inventing a hero.
 */
export function PageHeader({
  crumbs,
  eyebrow,
  title,
  intro,
}: {
  crumbs: Crumb[];
  eyebrow: string;
  title: React.ReactNode;
  intro?: React.ReactNode;
}) {
  return (
    <header className="border-b border-border bg-surface">
      <div className="shell pb-9 pt-7 md:pb-11 md:pt-9">
        <Breadcrumbs items={crumbs} />
        <p className="eyebrow mt-4 text-muted">{eyebrow}</p>
        <h1 className="mt-3 font-[family-name:var(--font-display)] text-[length:var(--text-h1)] font-[weight:750] leading-[1.06] tracking-[-0.025em]">
          {title}
        </h1>
        {intro && (
          <p className="mt-4 max-w-2xl text-[length:var(--text-body-lg)] leading-[1.65] text-text-secondary">
            {intro}
          </p>
        )}
      </div>
    </header>
  );
}
