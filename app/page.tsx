import { Hero } from "@/components/home/hero";
import { TrustStrip } from "@/components/home/trust-strip";
import { FeaturedProducts } from "@/components/home/featured-products";
import { CategoryGrid } from "@/components/home/category-grid";
import { ValueSection } from "@/components/home/value-section";
import { StoreSection } from "@/components/home/store-section";
import { ContactCta } from "@/components/home/contact-cta";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustStrip />
      <FeaturedProducts />

      <section aria-labelledby="categories-heading" className="border-t border-border bg-surface">
        <div className="shell py-[length:var(--spacing-section)]">
          <Reveal>
            <SectionHeading
              id="categories-heading"
              eyebrow="Shop by department"
              title="Seven departments, one counter"
              intro="Everything a job in Nairobi actually needs, under headings a fundi would use."
              action={{ label: "See the full catalogue", href: "/shop" }}
            />
          </Reveal>
          <Reveal delay={0.06} className="mt-8">
            <CategoryGrid />
          </Reveal>
        </div>
      </section>

      <ValueSection />
      <StoreSection />
      <ContactCta />
    </>
  );
}