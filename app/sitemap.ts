import type { MetadataRoute } from "next";
import { categories } from "@/data/categories";
import { products } from "@/data/products";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://borahardware.co.ke";

/**
 * Every indexable route, generated from the catalogue so a new product cannot
 * be forgotten. `/checkout` and `/search` are deliberately absent — neither is
 * a landing page, and both carry `noindex`.
 *
 * No `lastModified` is claimed: the dates would be a guess, and a guessed
 * freshness signal is worse than none.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/`, priority: 1 },
    { url: `${siteUrl}/shop`, priority: 0.9 },
    { url: `${siteUrl}/about`, priority: 0.4 },
    { url: `${siteUrl}/contact`, priority: 0.5 },
  ];

  const departmentRoutes: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${siteUrl}/shop/${category.id}`,
    priority: 0.7,
  }));

  const productRoutes: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${siteUrl}/product/${product.id}`,
    priority: 0.6,
  }));

  return [...staticRoutes, ...departmentRoutes, ...productRoutes];
}
