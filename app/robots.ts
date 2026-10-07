import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://borahardware.co.ke";

/**
 * Crawl policy.
 *
 * `/checkout` and `/search` also emit `noindex` in their page metadata — the
 * two mechanisms are complementary rather than contradictory: disallow keeps a
 * crawler out of an unbounded query-string space (`/search?q=…`), and the meta
 * tag covers the case where the URL is reached anyway. Neither is in the
 * sitemap.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/checkout", "/search", "/api/"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
