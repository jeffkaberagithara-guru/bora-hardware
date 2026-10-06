import Image from "next/image";
import { Reveal } from "@/components/ui/reveal";

/**
 * Value section — "Fair prices, without the fakes."
 *
 * The affordability claim cannot be an unsupported number, and the brief is
 * explicit about not inventing statistics. So this section argues value
 * operationally: what we do that a discount cannot fake. Each point is a
 * verifiable commitment about how we source and sell, which is a stronger
 * argument than a percentage.
 *
 * Layout is a 5/7 split: editorial copy on the left, a numbered commitment list
 * on a surface panel on the right, photograph bleeding under it. Asymmetric on
 * purpose — a centred two-column would read as a template.
 */
const commitments = [
  {
    n: "01",
    title: "We buy from the importer, not the middleman",
    body: "One step between the factory and your site. That is where the difference between a fair price and a marked-up one actually comes from.",
  },
  {
    n: "02",
    title: "Brands, with receipts",
    body: "Every power tool we sell is the genuine article, and we can show you the invoice. Copies cost less because they skip warranty, spares and safety.",
  },
  {
    n: "03",
    title: "We quote the unit, not just the ticket",
    body: "A bag of cement, a metre of cable, a kilogram of nails. You can compare our price with anyone else's because the maths is on the page.",
  },
  {
    n: "04",
    title: "Delivery cost before you pay",
    body: "We tell you what delivery will cost before payment. No arrival-day surprises.",
  },
];

export function ValueSection() {
  return (
    <section aria-labelledby="value-heading" className="border-y border-border bg-background">
      <div className="shell py-[length:var(--spacing-section)]">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
          {/* ------------------------------------------------------ editorial */}
          <div className="lg:col-span-5">
            <Reveal>
              <p className="eyebrow text-muted">Why the price is fair</p>
              <h2
                id="value-heading"
                className="mt-3 font-[family-name:var(--font-display)] text-[length:var(--text-h1)] font-[weight:750] leading-[1.06] tracking-[-0.025em]"
              >
                Fair prices.
                <br />
                Quality products.
                <br />
                <span className="text-primary">Less hassle.</span>
              </h2>
              <p className="mt-5 max-w-md text-[length:var(--text-body-lg)] leading-[1.65] text-text-secondary">
                Cheap tools cost more when they fail on a Thursday afternoon. What you actually want
                is gear that works, at a price you did not have to argue for. That is the whole
                proposition.
              </p>
            </Reveal>

            <Reveal delay={0.06} className="mt-8">
              <div className="relative aspect-[3/2] overflow-hidden rounded-card border border-border bg-surface">
                <Image
                  src="/img/about-materials.jpg"
                  alt="Stacked building materials on a construction site"
                  fill
                  loading="lazy"
                  sizes="(min-width: 1024px) 38vw, 92vw"
                  className="object-cover"
                />
              </div>
            </Reveal>
          </div>

          {/* --------------------------------------------------- commitments */}
          <div className="lg:col-span-7">
            <ol className="divide-y divide-[color:var(--color-border)] border-y border-border">
              {commitments.map((item, i) => (
                <Reveal as="li" key={item.n} delay={i * 0.04}>
                  <div className="grid grid-cols-[auto_1fr] gap-4 py-6 sm:gap-6 sm:py-7">
                    <span className="tnum font-[family-name:var(--font-mono)] text-[0.75rem] leading-6 text-accent-deep">
                      {item.n}
                    </span>
                    <div className="flex flex-col gap-1.5">
                      <h3 className="font-[family-name:var(--font-display)] text-[1.0625rem] font-[weight:650] leading-snug tracking-[-0.01em] sm:text-[1.1875rem]">
                        {item.title}
                      </h3>
                      <p className="max-w-prose text-small leading-relaxed text-text-secondary">
                        {item.body}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}