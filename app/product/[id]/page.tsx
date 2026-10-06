import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Truck } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { PriceBlock } from "@/components/ui/price-block";
import { ProductCard } from "@/components/ui/product-card";
import { ProductGrid } from "@/components/ui/product-grid";
import { PurchaseBar, PurchasePanel, SpecList } from "@/components/product/purchase";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { getCategory } from "@/data/categories";
import { getProduct, products, type Product } from "@/data/products";
import { soldPer } from "@/lib/currency";

type Params = { id: string };

export function generateStaticParams(): Params[] {
  return products.map((product) => ({ id: product.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = getProduct(id);
  if (!product) return { title: "Product" };

  return {
    title: `${product.name}, ${product.brand}`,
    description: product.description,
    alternates: { canonical: `/product/${product.id}` },
    openGraph: {
      type: "website",
      title: `${product.name}, ${product.brand}`,
      description: product.description,
      images: [{ url: product.image, alt: product.alt }],
    },
  };
}

/** Related lines: same department, this product removed, stocked first. */
function related(product: Product): Product[] {
  return products
    .filter((p) => p.categoryId === product.categoryId && p.id !== product.id)
    .sort((a, b) => Number(b.stock > 0) - Number(a.stock > 0))
    .slice(0, 4);
}

export default async function ProductPage({ params }: { params: Promise<Params> }) {
  const { id } = await params;
  const product = getProduct(id);
  if (!product) notFound();

  const category = getCategory(product.categoryId);
  const alsoInStock = related(product);

  return (
    <>
      {/* Clearance for the fixed buy bar on mobile when there is no related
          section underneath to absorb it. */}
      <div className={`shell pt-7 md:pt-9 ${alsoInStock.length > 0 ? "pb-10" : "pb-28 lg:pb-10"}`}>
        <Breadcrumbs
          items={[
            { label: "Shop", href: "/shop" },
            ...(category ? [{ label: category.name, href: `/shop/${category.id}` }] : []),
            { label: product.name },
          ]}
        />

        <div className="mt-6 grid gap-8 lg:grid-cols-12 lg:gap-10">
          {/* ------------------------------------------------------ photograph */}
          <div className="lg:col-span-7">
            <div className="relative aspect-[4/3] overflow-hidden rounded-card border border-border bg-surface">
              <Image
                src={product.image}
                alt={product.alt}
                fill
                priority
                sizes="(min-width: 1024px) 56vw, 100vw"
                className="object-cover"
              />
            </div>
            <p className="mt-3 font-[family-name:var(--font-mono)] text-[0.6875rem] uppercase tracking-[0.1em] text-muted">
              {soldPer(product)} · Ref {product.sku}
            </p>
          </div>

          {/* ---------------------------------------------------------- detail */}
          <div className="lg:col-span-5">
            <div className="flex flex-col gap-5 lg:sticky lg:top-24">
              <p className="eyebrow flex flex-wrap items-center gap-2 text-muted">
                <span className="text-text-secondary">{product.brand}</span>
                {category && (
                  <>
                    <span aria-hidden className="h-3 w-px shrink-0 bg-border" />
                    <Link
                      href={`/shop/${category.id}`}
                      className="-my-2 inline-flex min-h-11 items-center px-0.5 hover:text-primary"
                    >
                      {category.name}
                    </Link>
                  </>
                )}
              </p>

              <h1 className="font-[family-name:var(--font-display)] text-[length:var(--text-h1)] font-[weight:750] leading-[1.06] tracking-[-0.025em]">
                {product.name}
              </h1>

              <PriceBlock product={product} size="lg" />

              <p className="text-[length:var(--text-body)] leading-[1.6] text-text-secondary">
                {product.description}
              </p>

              <SpecList specs={product.specs} />

              {product.warranty && (
                <p className="font-[family-name:var(--font-mono)] text-[0.75rem] leading-relaxed text-muted">
                  Warranty: {product.warranty}
                </p>
              )}

              <PurchasePanel product={product} />

              <p className="flex items-start gap-2.5 border-t border-border pt-4 text-small text-muted">
                <Truck className="mt-0.5 size-4 shrink-0 text-primary" strokeWidth={1.75} aria-hidden />
                Delivery is quoted before payment. Stock is confirmed at the counter before any
                M-Pesa request is sent.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- related */}
      {alsoInStock.length > 0 && (
        <section aria-labelledby="related-heading" className="border-t border-border bg-surface">
          <div className="shell pb-28 pt-[length:var(--spacing-section-sm)] lg:pb-[length:var(--spacing-section)]">
            <Reveal>
              <SectionHeading
                id="related-heading"
                headingLevel="h2"
                eyebrow="Also on this shelf"
                title={category ? `More from ${category.name}` : "Related lines"}
                action={category ? { label: `See all ${category.name}`, href: `/shop/${category.id}` } : undefined}
              />
            </Reveal>

            <Reveal delay={0.05} className="mt-8">
              <ProductGrid>
                {alsoInStock.map((item) => (
                  <ProductCard key={item.id} product={item} className="w-full" />
                ))}
              </ProductGrid>
            </Reveal>
          </div>
        </section>
      )}

      <PurchaseBar product={product} />
    </>
  );
}
