import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Catalogue } from "@/components/shop/catalogue";
import { PageHeader } from "@/components/ui/page-header";
import { categories, getCategory } from "@/data/categories";
import { countByCategory, productsByCategory } from "@/data/products";

type Params = { category: string };

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

  return {
    title: category.name,
    description: `${category.blurb} Prices and unit rates for every line in ${category.name} at Bora Hardware, Nairobi.`,
    alternates: { canonical: `/shop/${category.id}` },
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
