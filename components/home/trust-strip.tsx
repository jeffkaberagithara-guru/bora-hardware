import { Package, ShieldCheck, Smartphone, Truck } from "lucide-react";
import { formatKES } from "@/lib/currency";
import { siteConfig } from "@/config/site";
import { Reveal } from "@/components/ui/reveal";

/**
 * Trust strip.
 *
 * One continuous hairline-bounded band with divider rules between items — not
 * four cards. Each item states something the business actually does, and the
 * claims are drawn from what customers in this market actually worry about:
 * counterfeit tools, delivery cost surprises, and how they will pay.
 *
 * The delivery item is conditional. A free-delivery threshold is a promise about
 * money, so it is only published when NEXT_PUBLIC_FREE_DELIVERY_THRESHOLD is set;
 * the default build states delivery coverage and nothing about cost.
 */
export function TrustStrip() {
  const threshold = siteConfig.delivery.freeThreshold;
  const hasFreeDelivery = threshold > 0;

  const items = [
    {
      icon: ShieldCheck,
      title: "Genuine stock only",
      body: "Branded tools with receipts. No copies, no fakes.",
    },
    {
      icon: Package,
      title: "Direct distributor pricing",
      body: "We buy from the importer. The middlemen's margin stays with you.",
    },
    {
      icon: Smartphone,
      title: "Pay with M-Pesa",
      body: "Lipa na M-Pesa prompt on your phone. No card needed.",
    },
    hasFreeDelivery
      ? {
          icon: Truck,
          title: `Free delivery over ${formatKES(threshold)}`,
          body: `${siteConfig.delivery.nairobi}. We confirm the fee before you pay.`,
        }
      : {
          icon: Truck,
          title: "Delivery inside Nairobi",
          body: "Nationwide delivery and shipping. We confirm the fee before you pay.",
        },
  ];

  return (
    <section aria-label="Why shop with Bora" className="border-b border-border bg-background">
      <div className="shell">
        <ul className="grid grid-cols-1 divide-y divide-[color:var(--color-border)] sm:grid-cols-2 sm:divide-x lg:grid-cols-4 lg:divide-y-0 [&>*]:border-b lg:[&>*]:border-b-0">
          {items.map((item, i) => (
            <Reveal
              as="li"
              key={item.title}
              delay={i * 0.04}
              className="flex gap-3 py-5 sm:px-5 sm:py-6 lg:first:pl-0 lg:last:pr-0"
            >
              <item.icon
                className="mt-0.5 size-[1.125rem] shrink-0 text-primary"
                strokeWidth={1.75}
                aria-hidden
              />
              <div className="min-w-0">
                <p className="text-[0.9375rem] font-semibold leading-tight tracking-[-0.01em]">
                  {item.title}
                </p>
                <p className="mt-1 text-[0.8125rem] leading-snug text-muted">{item.body}</p>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}