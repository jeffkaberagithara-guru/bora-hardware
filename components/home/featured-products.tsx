import { SectionHeading } from "@/components/ui/section-heading";
import { ProductCard } from "@/components/ui/product-card";
import { productGridClasses } from "@/components/ui/product-grid";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/reveal";
import { featuredProducts } from "@/data/products";
import { cn } from "@/lib/cn";

/**
 * Featured products.
 *
 * Eight lines, four across on desktop. Deliberately not twelve: a longer grid
 * would push the categories and the value argument below the fold, and the
 * priority order is product clarity before everything else. Eight is enough to
 * show the range of units on offer without becoming a paginated table.
 */
export function FeaturedProducts() {
  const featured = featuredProducts();

  return (
    <section aria-labelledby="featured-heading" className="bg-background">
      <div className="shell py-[length:var(--spacing-section)]">
        <Reveal>
          <SectionHeading
            id="featured-heading"
            eyebrow="In stock now"
            title="Ready to go today"
            intro="Every line shows the price and the unit it is sold in, so you can compare it against anything else."
            action={{ label: "Browse all products", href: "/shop" }}
          />
        </Reveal>

        <Stagger className={cn("mt-8", productGridClasses)}>
          {featured.map((product, i) => (
            <StaggerItem key={product.id} className="flex">
              <ProductCard product={product} priority={i < 4} className="w-full" />
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}