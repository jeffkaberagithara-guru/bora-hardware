import type { Metadata } from "next";
import Link from "next/link";
import { CornerDownLeft, Search } from "lucide-react";
import { Catalogue, SEARCH_SORTS } from "@/components/shop/catalogue";
import { ButtonLink, ExternalLink } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { searchCatalogue } from "@/lib/search";
import { categories } from "@/data/categories";
import { waLink } from "@/config/site";

type SearchParams = { q?: string | string[] };

/** Longest query we will echo back — long enough for a part number, short
    enough that a crafted URL cannot become a wall of text on the page. */
const MAX_QUERY = 80;

const readQuery = (params: SearchParams) => {
  const raw = Array.isArray(params.q) ? params.q[0] : params.q;
  return (raw ?? "").trim().slice(0, MAX_QUERY);
};

const SUGGESTIONS = ["Cordless drill", "2.5mm cable", "Cement", "Nails", "Angle grinder"];

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}): Promise<Metadata> {
  const q = readQuery(await searchParams);

  return {
    title: q ? `Search: ${q}` : "Search",
    description:
      "Search the Bora Hardware catalogue by product, brand or department — every line shown with its price and unit price.",
    // Query-string results are an unbounded set of pages with no index value;
    // robots.txt disallows /search as well, so a crawler does not spend budget
    // here either.
    robots: { index: false, follow: false },
  };
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const q = readQuery(await searchParams);
  const trimmed = q.length > 0;
  const results = searchCatalogue(q, Infinity);

  return (
    <>
      <PageHeader
        crumbs={[{ label: "Search" }]}
        eyebrow={
          trimmed
            ? `${results.total} ${results.total === 1 ? "result" : "results"} for “${q}”`
            : "Catalogue search"
        }
        title={trimmed ? <>Results for “{q}”</> : "Search the catalogue"}
        intro={
          trimmed
            ? "Matched against product names, brands and departments — the three ways an item gets asked for at the counter."
            : "Search the way you would say it out loud: the product, the brand, or the department."
        }
      />

      <div className="shell py-8 md:py-10">
        {/* A plain GET form: it works with JavaScript off, and the browser's
            own history still lands on each query. */}
        <form action="/search" method="get" className="flex flex-col gap-2 sm:flex-row sm:items-end">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="search-query" className="eyebrow text-muted">
              What are you looking for?
            </label>
            <div className="flex h-12 items-center gap-2.5 rounded-xs border border-border-strong bg-background px-3 focus-within:border-text">
              <Search className="size-4 shrink-0 text-muted" strokeWidth={2} aria-hidden />
              <input
                id="search-query"
                type="search"
                name="q"
                defaultValue={q}
                placeholder="Drills, cable, cement…"
                autoComplete="off"
                maxLength={MAX_QUERY}
                className="h-full min-w-0 flex-1 bg-transparent text-body placeholder:text-muted [&::-webkit-search-cancel-button]:appearance-none"
              />
            </div>
          </div>
          <button
            type="submit"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xs border border-primary bg-primary px-5 text-[length:var(--text-button)] text-white transition-colors duration-[var(--motion-fast)] hover:border-primary-hover hover:bg-primary-hover"
          >
            Search
            <CornerDownLeft className="size-4" strokeWidth={2} aria-hidden />
          </button>
        </form>

        {!trimmed && (
          <section aria-labelledby="suggestions-heading" className="mt-10">
            <h2 id="suggestions-heading" className="eyebrow text-muted">
              Try searching
            </h2>
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {SUGGESTIONS.map((suggestion) => (
                <li key={suggestion}>
                  <Link
                    href={`/search?q=${encodeURIComponent(suggestion)}`}
                    className="inline-flex min-h-11 items-center rounded-xs border border-border px-3.5 text-[length:var(--text-nav)] text-text-secondary transition-colors duration-[var(--motion-fast)] hover:border-text hover:text-text"
                  >
                    {suggestion}
                  </Link>
                </li>
              ))}
            </ul>

            <h2 className="eyebrow mt-9 text-muted">Or browse a department</h2>
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {categories.map((category) => (
                <li key={category.id}>
                  <Link
                    href={`/shop/${category.id}`}
                    className="inline-flex min-h-11 items-center rounded-xs border border-border bg-surface px-3.5 text-[length:var(--text-nav)] text-text-secondary transition-colors duration-[var(--motion-fast)] hover:border-text hover:text-text"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {trimmed && results.total > 0 && (
          <div className="mt-10">
            {results.categories.length > 0 && (
              <section aria-labelledby="matching-departments" className="mb-7 border-b border-border pb-5">
                <h2 id="matching-departments" className="eyebrow text-muted">
                  Matching departments
                </h2>
                <ul className="mt-3 flex flex-wrap gap-1.5">
                  {results.categories.map((category) => (
                    <li key={category.id}>
                      <Link
                        href={`/shop/${category.id}`}
                        className="inline-flex min-h-11 items-center rounded-xs border border-border bg-surface px-3.5 text-[length:var(--text-nav)] text-text-secondary transition-colors duration-[var(--motion-fast)] hover:border-text hover:text-text"
                      >
                        {category.name}
                        <span className="ml-2 font-[family-name:var(--font-mono)] text-[0.6875rem] text-muted">
                          {category.count}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <Catalogue
              products={results.products}
              activeCategory={null}
              showDepartments={false}
              sorts={SEARCH_SORTS}
              defaultSort="relevance"
              countLabel={`${results.total} ${results.total === 1 ? "match" : "matches"} for “${q}”`}
            />
          </div>
        )}

        {trimmed && results.total === 0 && (
          <section aria-labelledby="no-results-heading" className="mt-10">
            <div className="flex max-w-2xl flex-col items-start gap-3 rounded-card border border-border bg-surface px-6 py-12">
              <h2
                id="no-results-heading"
                className="font-[family-name:var(--font-display)] text-[length:var(--text-h3)] font-[weight:650]"
              >
                No stock matches “{q}”
              </h2>
              <p className="text-[length:var(--text-body)] leading-[1.6] text-text-secondary">
                We may still be able to source it. Send the item to the counter on WhatsApp and we
                will come back with a price and a delivery date — or try the brand name, which is
                how most lines are filed here.
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                <ExternalLink
                  href={waLink(`Hello Bora Hardware, I could not find "${q}" on the site. Can you price it?`)}
                  external
                  variant="outline"
                  size="md"
                >
                  Ask the counter on WhatsApp
                </ExternalLink>
                <ButtonLink href="/shop" variant="ghost" size="md">
                  Browse the full catalogue
                </ButtonLink>
              </div>
            </div>
          </section>
        )}
      </div>
    </>
  );
}
