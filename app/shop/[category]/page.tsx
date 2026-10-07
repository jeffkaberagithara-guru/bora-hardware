import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Catalogue } from "@/components/shop/catalogue";
import { PageHeader } from "@/components/ui/page-header";
import { JsonLd, breadcrumbList } from "@/components/seo/json-ld";
import { siteConfig } from "@/config/site";
import { categories, getCategory } from "@/data/categories";
import { countByCategory, productsByCategory } from "@/data/products";

type Params = { category: string };

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://borahardware.co.ke";

export function generateStaticParams(): Params[] {
  return categories.map((category) => ({ category: category.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { category: id } = await params;
  const category = getCategory(id);
  if (!category) return { title: "Department" };

  const title = `${category.name} — prices and unit rates`;
  const description = `${category.blurb} Prices and unit rates for every line in ${category.name} at ${siteConfig.name}, Nairobi.`;
  const url = `${siteUrl}/shop/${category.id}`;

  return {
    title: category.name,
    description,
    alternates: { canonical: `/shop/${category.id}` },
    openGraph: {
      type: "website",
      siteName: siteConfig.name,
      title: `${title} | ${siteConfig.name}`,
      description,
      url,
      locale: "en_KE",
      images: [{ url: category.image, alt: `${category.name} — ${siteConfig.name}` }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${siteConfig.name}`,
      description,
      images: [category.image],
    },
  };
}

export default async function CategoryPage({ params }: { params: Promise<Params> }) {
  const { category: id } = await params;
  const category = getCategory(id);
  if (!category) notFound();

  const items = productsByCategory(category.id);
  const total = countByCategory()[category.id] ?? items.length;

  return (
    <>
      <JsonLd
        data={breadcrumbList([
          { name: "Home", url: `${siteUrl}/` },
          { name: "Shop", url: `${siteUrl}/shop` },
          { name: category.name },
        ])}
      />

      <PageHeader
        crumbs={[{ label: "Shop", href: "/shop" }, { label: category.name }]}
        eyebrow={`${total} ${total === 1 ? "line" : "lines"} in stock`}
        title={category.name}
        intro={category.blurb}
      />

      <div className="shell py-8 md:py-10">
        <Catalogue products={items} activeCategory={category.id} />
      </div>
    </>
  );
}
