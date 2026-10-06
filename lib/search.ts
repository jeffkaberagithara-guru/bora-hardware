import { categories, getCategory } from "@/data/categories";
import { products, type Product } from "@/data/products";

/**
 * Catalogue search.
 *
 * Intentionally a plain scored substring match across name, brand and category.
 * Hardware buyers search the way they talk — "dewalt drill", "2.5 cable",
 * "cement" — so matching across all three fields with name weighted highest
 * behaves correctly without a search service. Replace with a real index when
 * the catalogue outgrows a few hundred SKUs.
 */

const normalise = (value: string) => value.toLowerCase().trim();

function score(product: Product, query: string): number {
  const name = normalise(product.name);
  const brand = normalise(product.brand);
  const category = normalise(getCategory(product.categoryId)?.name ?? "");
  const sku = normalise(product.sku);

  if (name === query) return 100;
  if (name.startsWith(query)) return 80;
  if (brand === query) return 70;
  if (brand.startsWith(query)) return 60;
  if (name.includes(query)) return 50;
  if (category.includes(query)) return 40;
  if (sku.includes(query)) return 35;
  // Every word must appear somewhere, so "cordless drill" doesn't match a drill.
  const words = query.split(/\s+/).filter(Boolean);
  if (words.length > 1) {
    const haystack = `${name} ${brand} ${category}`;
    if (words.every((w) => haystack.includes(w))) return 30;
  }
  return 0;
}

export type SearchResults = {
  products: Product[];
  categories: { id: string; name: string; count: number }[];
  total: number;
};

export function searchCatalogue(query: string, limit = 8): SearchResults {
  const q = normalise(query);
  if (q.length === 0) return { products: [], categories: [], total: 0 };

  const matched = products
    .map((product) => ({ product, s: score(product, q) }))
    .filter((r) => r.s > 0)
    .sort((a, b) => b.s - a.s || a.product.price - b.product.price)
    .map((r) => r.product);

  const matchedCats = categories
    .map((c) => ({ c, s: normalise(c.name).includes(q) ? 1 : 0 }))
    .filter((r) => r.s > 0)
    .map(({ c }) => ({ id: c.id, name: c.name, count: products.filter((p) => p.categoryId === c.id).length }));

  return {
    products: matched.slice(0, limit),
    categories: matchedCats.slice(0, 4),
    total: matched.length,
  };
}

/** Highlights the matched span without dangerouslySetInnerHTML. */
export function splitHighlight(text: string, query: string): [string, string, string] | null {
  const q = normalise(query);
  if (!q) return null;
  const index = normalise(text).indexOf(q);
  if (index === -1) return null;
  return [text.slice(0, index), text.slice(index, index + q.length), text.slice(index + q.length)];
}