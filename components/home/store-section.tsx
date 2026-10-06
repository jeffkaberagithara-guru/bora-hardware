import Image from "next/image";
import Link from "next/link";
import { Clock, MapPin, MessageCircle, Phone } from "lucide-react";
import { ButtonLink, ExternalLink } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { siteConfig, waLink } from "@/config/site";

/**
 * Store / about block.
 *
 * A short, factual piece about the shop — location, hours, what the counter is
 * like — paired with one photograph. Deliberately small: the brief asks for a
 * small trust section, not a corporate "our story". The facts a customer
 * actually needs before visiting or ordering are the ones included.
 */
export function StoreSection() {
  return (
    <section aria-labelledby="store-heading" className="bg-surface">
      <div className="shell py-[length:var(--spacing-section)]">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-8">
          <Reveal className="lg:col-span-7">
            <div className="relative aspect-[16/10] overflow-hidden rounded-card border border-border bg-background">
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

          <div className="lg:col-span-5 lg:pl-6">
            <Reveal>
              <p className="eyebrow text-muted">The shop</p>
              <h2
                id="store-heading"
                className="mt-3 font-[family-name:var(--font-display)] text-[length:var(--text-h2)] font-[weight:700] leading-[1.14] tracking-[-0.02em]"
              >
                A counter you can bring a list to.
              </h2>
              <p className="mt-4 text-[length:var(--text-body-lg)] leading-[1.65] text-text-secondary">
                Bring a photo of a cut-off list or a scribbled measurement. We will price it, check
                the stock and tell you honestly if something is the wrong tool for the job. Most
                orders leave the same afternoon.
              </p>
            </Reveal>

            <Reveal delay={0.05}>
              <dl className="mt-6 flex flex-col divide-y divide-[color:var(--color-border)] border-y border-border">
                <div className="flex items-start gap-3 py-3.5">
                  <MapPin className="mt-0.5 size-[1.125rem] shrink-0 text-primary" strokeWidth={1.75} aria-hidden />
                  <div>
                    <dt className="text-[0.8125rem] font-semibold">Where we are</dt>
                    <dd className="text-small text-muted">
                      {siteConfig.location.line1}, {siteConfig.location.line2}
                    </dd>
                  </div>
                </div>
                <div className="flex items-start gap-3 py-3.5">
                  <Clock className="mt-0.5 size-[1.125rem] shrink-0 text-primary" strokeWidth={1.75} aria-hidden />
                  <div>
                    <dt className="text-[0.8125rem] font-semibold">Opening hours</dt>
                    <dd className="text-small text-muted">
                      {siteConfig.hours}
                    </dd>
                  </div>
                </div>
                <div className="flex items-start gap-3 py-3.5">
                  <Phone className="mt-0.5 size-[1.125rem] shrink-0 text-primary" strokeWidth={1.75} aria-hidden />
                  <div>
                    <dt className="text-[0.8125rem] font-semibold">Call the counter</dt>
                    <dd className="text-small">
                      <a
                        href={`tel:${siteConfig.contact.phoneHref}`}
                        className="inline-flex min-h-11 items-center hover:text-primary"
                      >
                        {siteConfig.contact.phoneDisplay}
                      </a>
                    </dd>
                  </div>
                </div>
              </dl>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
                <ButtonLink href="/about" variant="outline" size="md">
                  More about Bora
                </ButtonLink>
                <ExternalLink
                  href={waLink("Hello Bora Hardware, I have a question about a product.")}
                  external
                  variant="ghost"
                  size="md"
                >
                  <MessageCircle className="size-4" strokeWidth={2} aria-hidden />
                  Ask us anything
                </ExternalLink>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}