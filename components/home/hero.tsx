import Image from "next/image";
import { ArrowRight, MessageCircle, Truck } from "lucide-react";
import { ButtonLink, ExternalLink } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { siteConfig, waLink } from "@/config/site";

/**
 * Hero.
 *
 * Composition is an asymmetric 5/7 split with the photograph bleeding off the
 * right viewport edge and its top corner lifted above the text block's baseline —
 * not the default centred hero, and not a plain text-left/image-right tile.
 * The headline sits in the optical centre of the left column while the image
 * carries the full height of the section, so the photograph does the work of
 * proving the claim ("real gear, real job") rather than decorating it.
 *
 * The photograph is a craftsperson drilling at work: labour, not advertising.
 * No suited presenter, no smiling stock-photo team.
 */
export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border bg-background">
      <div className="shell">
        <div className="grid items-center gap-10 py-12 md:py-16 lg:grid-cols-12 lg:gap-8 lg:py-20">
          {/* ---------------------------------------------------------- text */}
          <div className="lg:col-span-5 lg:pr-6 xl:pr-10">
            <Reveal>
              <p className="eyebrow inline-flex items-center gap-2 border border-border bg-surface px-2.5 py-1.5 text-muted">
                <span aria-hidden className="size-1.5 rounded-pill bg-accent-deep" />
                Nairobi · hardware &amp; building supplies
              </p>
            </Reveal>

            <Reveal delay={0.05}>
              <h1
                className="mt-5 font-[family-name:var(--font-display)] text-[length:var(--text-display)] font-[weight:800] leading-[0.94] tracking-[-0.03em]"
                style={{ fontVariationSettings: "'wdth' 100" }}
              >
                Genuine gear.
                <br />
                <span className="text-primary">Honest prices.</span>
              </h1>
            </Reveal>

            <Reveal delay={0.1}>
              <p className="mt-5 max-w-[34rem] text-[length:var(--text-body-lg)] leading-[1.65] text-text-secondary">
                Power tools, hand tools, electrical, plumbing and building materials — stocked
                deep, priced straight from the distributor, and delivered anywhere in Kenya. Pay
                with M-Pesa.
              </p>
            </Reveal>

            <Reveal delay={0.15}>
              <div className="mt-7 flex flex-col gap-2.5 sm:flex-row sm:items-center">
                <ButtonLink href="/shop" size="lg" className="group/hero">
                  Shop the catalogue
                  <ArrowRight
                    className="size-4 transition-transform duration-[var(--motion-fast)] ease-[var(--ease-out)] group-hover/hero:translate-x-0.5"
                    strokeWidth={2.25}
                    aria-hidden
                  />
                </ButtonLink>
                <ExternalLink
                  href={waLink("Hello Bora Hardware, I need a quote for a job.")}
                  external
                  size="lg"
                  variant="outline"
                >
                  <MessageCircle className="size-4" strokeWidth={2} aria-hidden />
                  Send us a list
                </ExternalLink>
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <p className="mt-6 flex flex-wrap items-center gap-x-2 gap-y-1 border-t border-border pt-5 font-[family-name:var(--font-mono)] text-[0.6875rem] uppercase tracking-[0.1em] text-muted">
                <Truck className="size-3.5 shrink-0 text-primary" strokeWidth={2} aria-hidden />
                {siteConfig.delivery.nairobi} · {siteConfig.delivery.upcountry}
              </p>
            </Reveal>
          </div>

          {/* ------------------------------------------------------- photograph */}
          <div className="relative lg:col-span-7">
            <Reveal delay={0.08} className="relative">
              {/* Accent rule sits behind the image's top-left corner — the one
                  place orange appears above the fold, and it reads as a printed
                  registration mark rather than decoration. */}
              <span
                aria-hidden
                className="absolute -left-px -top-3 hidden h-16 w-16 border-l-2 border-t-2 border-accent lg:block"
              />
              <div className="relative aspect-[4/3] overflow-hidden rounded-card border border-border bg-surface sm:aspect-[16/10] lg:aspect-[4/5] lg:rounded-none lg:border-y-0 lg:border-r-0">
                <Image
                  src="/img/hero-fundi.jpg"
                  alt="A craftsperson using a power drill on a timber frame at a workbench"
                  fill
                  priority
                  fetchPriority="high"
                  sizes="(min-width: 1024px) 58vw, 100vw"
                  className="object-cover object-[55%_center] lg:object-[52%_38%]"
                />
              </div>

              {/* Stock strip pinned to the image's foot — a factual note in the
                  catalogue's own typographic voice, not a floating stat card. */}
              <div className="absolute bottom-0 left-0 flex items-center gap-2 bg-background px-3 py-2 lg:left-0">
                <span aria-hidden className="size-1.5 rounded-pill bg-success" />
                <span className="font-[family-name:var(--font-mono)] text-[0.6875rem] uppercase tracking-[0.12em] text-text-secondary">
                  Seven departments · one counter
                </span>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}