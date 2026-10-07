/**
 * Structured data.
 *
 * JSON-LD is data, not markup: the payload is serialised inside a script
 * element, so `<` is escaped to `\u003c` to keep a `</script>` sequence in any
 * string from ending the element early. Nothing here invents ratings, reviews
 * or stock the catalogue does not carry — schema.org markup is only as good as
 * the data behind it, and a hardware counter with no review feed must not
 * publish one.
 */

type Json = string | number | boolean | null | Json[] | { [key: string]: Json };

export function JsonLd({ data }: { data: Json }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

/**
 * `BreadcrumbList` for the crumbs a page actually renders — the last entry is
 * the page itself, which carries no `item` URL because it is where the reader
 * already is.
 */
export function breadcrumbList(crumbs: { name: string; url?: string }[]): Json {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      ...(crumb.url ? { item: crumb.url } : {}),
    })),
  };
}
