import { MessageCircle, Phone } from "lucide-react";
import { ButtonLink, ExternalLink } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { siteConfig, waLink } from "@/config/site";

/**
 * Order CTA.
 *
 * The closing action for a Kenyan hardware business is not "subscribe" or
 * "get a quote" — it is WhatsApp or a phone call to the counter. Both are given
 * first-class weight here, and the copy says what happens after you send a list,
 * because that uncertainty is what stops people messaging a shop.
 */
export function ContactCta() {
  return (
    <section aria-labelledby="order-heading" className="border-t border-border bg-primary-strong">
      <div className="shell py-[length:var(--spacing-section)]">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-8">
          <div className="lg:col-span-7">
            <Reveal>
              <p className="eyebrow text-white/70">Ordering</p>
              <h2
                id="order-heading"
                className="mt-3 font-[family-name:var(--font-display)] text-[length:var(--text-h1)] font-[weight:750] leading-[1.06] tracking-[-0.025em] text-white"
              >
                Send us your list.
                <br />
                <span className="text-accent-on-dark">We will price it.</span>
              </h2>
              <p className="mt-4 max-w-xl text-[length:var(--text-body-lg)] leading-[1.65] text-white/75">
                Photograph a list, type the measurements, or just tell us the job. You will get a
                price, a delivery date and a payment prompt on M-Pesa — usually within the hour.
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.06} className="lg:col-span-5">
            <div className="flex flex-col gap-2.5">
              <ExternalLink
                href={waLink("Hello Bora Hardware, here is my list for a quote:")}
                external
                size="lg"
                variant="accent"
                fullWidth
                className="group/wa"
              >
                <MessageCircle className="size-[1.125rem]" strokeWidth={2} aria-hidden />
                Message us on WhatsApp
              </ExternalLink>

              <ButtonLink
                href={`tel:${siteConfig.contact.phoneHref}`}
                variant="onDark"
                size="md"
                fullWidth
              >
                <Phone className="size-4" strokeWidth={2} aria-hidden />
                Call {siteConfig.contact.phoneDisplay}
              </ButtonLink>

              <p className="mt-1 text-center font-[family-name:var(--font-mono)] text-[0.6875rem] uppercase tracking-[0.1em] text-white/70">
                M-Pesa · Bank transfer · Cash on delivery in Nairobi
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}