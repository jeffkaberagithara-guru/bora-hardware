import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ContactCta } from "@/components/home/contact-cta";
import { PageHeader } from "@/components/ui/page-header";
import { Reveal } from "@/components/ui/reveal";
import { categories } from "@/data/categories";
import { countByCategory, inStockCount, products } from "@/data/products";

export const metadata: Metadata = {
  title: "About",
  description:
    "Bora Hardware is a Nairobi counter for power tools, electrical, plumbing and building materials — genuine branded stock, unit prices on the page, delivery quoted before you pay.",
  alternates: { canonical: "/about" },
};

const steps = [
  {
    n: "01",
    title: "You send the list",
    body: "A WhatsApp message, a photograph of a cut-off list, or a call. Measurements and brand preferences help, but a description of the job is enough.",
  },
  {
    n: "02",
    title: "We check the shelf and the price",
    body: "Stock is confirmed against what is physically in the shop, not what a website says. If something is out, you are told straight, with an alternative.",
  },
  {
    n: "03",
    title: "Delivery is quoted first",
    body: "Distance and load decide the figure. You see the total — goods and delivery together — before any payment is requested.",
  },
  {
    n: "04",
    title: "You approve the M-Pesa prompt",
    body: "The request goes to the number you gave us and you enter your own PIN. Bank transfer and cash inside Nairobi are also available.",
  },
  {
    n: "05",
    title: "It leaves the counter",
    body: "Collect the same afternoon where stock allows, or take delivery in Nairobi. Upcountry orders are packed and shipped once the balance clears.",
  },
];

export default function AboutPage() {
  const counts = countByCategory();
  const productCount = products.length;

  return (
    <>
      <PageHeader
        crumbs={[{ label: "About" }]}
        eyebrow="About Bora"
        title="A counter you can bring a list to"
        intro="Bora Hardware sells genuine branded tools and building materials in Nairobi, at prices you can compare line by line. No invented discounts, no middlemen, no surprises on the delivery note."
      />

      {/* -------------------------------------------------------------- story */}
      <section aria-labelledby="story-heading" className="border-b border-border bg-background">
        <div className="shell py-[length:var(--spacing-section-sm)] md:py-[length:var(--spacing-section)]">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-8">
            <Reveal className="lg:col-span-7">
              <div className="relative aspect-[16/10] overflow-hidden rounded-card border border-border bg-surface">
                <Image
                  src="/img/about-counter.jpg"
                  alt="A hardware shop counter with goods and a shopkeeper"
                  fill
                  loading="lazy"
                  sizes="(min-width: 1024px) 56vw, 92vw"
                  className="object-cover"
                />
              </div>
            </Reveal>

            <div className="lg:col-span-5 lg:pl-4">
              <Reveal>
                <p className="eyebrow text-muted">Why we are here</p>
                <h2
                  id="story-heading"
                  className="mt-3 font-[family-name:var(--font-display)] text-[length:var(--text-h2)] font-[weight:700] leading-[1.14] tracking-[-0.02em]"
                >
                  The hard part is knowing it is genuine
                </h2>
                <div className="mt-4 flex flex-col gap-4 text-[length:var(--text-body)] leading-[1.6] text-text-secondary">
                  <p>
                    Anyone can sell a drill. The question a buyer in Nairobi is really asking is
                    whether the drill is the real one, whether the price is the price, and whether
                    the money goes somewhere honest. Those three questions are the whole business.
                  </p>
                  <p>
                    So we buy close to the importer, keep the middlemen out, and put the unit on
                    every line — per metre, per bag, per kilogram — because a ticket price alone
                    cannot be compared against anything else. If we do not have it, we say so.
                  </p>
                </div>
              </Reveal>

              <Reveal delay={0.06}>
                <dl className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-card border border-border bg-border">
                  <div className="bg-background p-4">
                    <dt className="eyebrow text-muted">Departments</dt>
                    <dd className="tnum mt-2 font-[family-name:var(--font-display)] text-[length:var(--text-price-lg)] font-[weight:750] tracking-[-0.025em]">
                      {categories.length}
                    </dd>
                  </div>
                  <div className="bg-background p-4">
                    <dt className="eyebrow text-muted">Lines listed</dt>
                    <dd className="tnum mt-2 font-[family-name:var(--font-display)] text-[length:var(--text-price-lg)] font-[weight:750] tracking-[-0.025em]">
                      {productCount}
                    </dd>
                  </div>
                </dl>
                <p className="mt-2 font-[family-name:var(--font-mono)] text-[0.6875rem] leading-relaxed text-muted">
                  {inStockCount()} of {productCount} lines currently in stock.
                </p>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------- how it runs */}
      <section aria-labelledby="steps-heading" className="bg-surface">
        <div className="shell py-[length:var(--spacing-section-sm)] md:py-[length:var(--spacing-section)]">
          <Reveal>
            <p className="eyebrow text-muted">From list to site</p>
            <h2
              id="steps-heading"
              className="mt-3 font-[family-name:var(--font-display)] text-[length:var(--text-h2)] font-[weight:700] leading-[1.14] tracking-[-0.02em]"
            >
              How an order actually runs
            </h2>
          </Reveal>

          <ol className="mt-8 divide-y divide-[color:var(--color-border)] border-y border-border">
            {steps.map((step, i) => (
              <Reveal as="li" key={step.n} delay={i * 0.04}>
                <div className="grid grid-cols-[auto_1fr] gap-4 py-5 sm:gap-6 sm:py-6">
                  <span className="tnum font-[family-name:var(--font-mono)] text-[0.75rem] leading-6 text-accent-deep">
                    {step.n}
                  </span>
                  <div className="flex flex-col gap-1.5">
                    <h3 className="font-[family-name:var(--font-display)] text-[1.0625rem] font-[weight:650] leading-snug tracking-[-0.01em] sm:text-[1.1875rem]">
                      {step.title}
                    </h3>
                    <p className="max-w-prose text-small leading-relaxed text-text-secondary">
                      {step.body}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* --------------------------------------------------------- departments */}
      <section aria-labelledby="departments-heading" className="border-t border-border bg-background">
        <div className="shell py-[length:var(--spacing-section-sm)] md:py-[length:var(--spacing-section)]">
          <Reveal>
            <p className="eyebrow text-muted">What we stock</p>
            <h2
              id="departments-heading"
              className="mt-3 font-[family-name:var(--font-display)] text-[length:var(--text-h2)] font-[weight:700] leading-[1.14] tracking-[-0.02em]"
            >
              Seven departments
            </h2>
          </Reveal>

          <ul className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category, i) => (
              <Reveal as="li" key={category.id} delay={i * 0.03}>
                <Link
                  href={`/shop/${category.id}`}
                  className="group flex items-start justify-between gap-4 rounded-card border border-border bg-background p-4 transition-[border-color,box-shadow] duration-[var(--motion-standard)] hover:-translate-y-[2px] hover:border-border-strong hover:shadow-lift"
                >
                  <span className="flex flex-col gap-1.5">
                    <span className="font-[family-name:var(--font-display)] text-[1.0625rem] font-[weight:650] tracking-[-0.01em] group-hover:text-primary">
                      {category.name}
                    </span>
                    <span className="text-small leading-snug text-muted">{category.blurb}</span>
                  </span>
                  <span className="flex shrink-0 flex-col items-end gap-2">
                    <span className="tnum font-[family-name:var(--font-mono)] text-[0.6875rem] text-muted">
                      {counts[category.id] ?? 0} lines
                    </span>
                    <ArrowUpRight
                      className="size-4 text-border-strong transition-[color,transform] duration-[var(--motion-fast)] group-hover:translate-x-0.5 group-hover:text-primary"
                      strokeWidth={2}
                      aria-hidden
                    />
                  </span>
                </Link>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <ContactCta />
    </>
  );
}
