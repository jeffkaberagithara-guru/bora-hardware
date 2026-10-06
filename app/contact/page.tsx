import type { Metadata } from "next";
import { Clock, Mail, MapPin, MessageCircle, Phone, Truck, Wallet } from "lucide-react";
import { ExternalLink } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { Reveal } from "@/components/ui/reveal";
import { siteConfig, waLink } from "@/config/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Call, WhatsApp or email the Bora Hardware counter in Nairobi. Delivery inside Nairobi and nationwide, paid by M-Pesa, bank transfer or cash on delivery.",
  alternates: { canonical: "/contact" },
};

const channels = [
  {
    icon: Phone,
    label: "Call the counter",
    value: siteConfig.contact.phoneDisplay,
    href: `tel:${siteConfig.contact.phoneHref}`,
    action: "Call now",
    external: false,
    note: "Fastest for stock checks and delivery quotes.",
  },
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: siteConfig.contact.phoneDisplay,
    href: waLink("Hello Bora Hardware, I have an order question:"),
    action: "Open WhatsApp",
    external: true,
    note: "Send a photo of your list — we price it and reply.",
  },
  {
    icon: Mail,
    label: "Email",
    value: siteConfig.contact.email,
    href: `mailto:${siteConfig.contact.email}`,
    action: "Write to us",
    external: false,
    note: "For quotations, invoices and supplier enquiries.",
  },
];

export default function ContactPage() {
  return (
    <>
      <PageHeader
        crumbs={[{ label: "Contact" }]}
        eyebrow="Reach us"
        title="Talk to the counter"
        intro="No tickets, no chatbot. A person at the counter answers, checks the shelf and tells you what it costs — including delivery."
      />

      {/* ------------------------------------------------------------ channels */}
      <section aria-labelledby="channels-heading" className="border-b border-border bg-background">
        <div className="shell py-[length:var(--spacing-section-sm)] md:py-[length:var(--spacing-section)]">
          <h2 id="channels-heading" className="sr-only">
            Ways to reach us
          </h2>
          <ul className="grid gap-4 md:grid-cols-3 md:gap-5">
            {channels.map((channel) => {
              const Icon = channel.icon;
              return (
                <li key={channel.label}>
                  <div className="flex h-full flex-col gap-3 rounded-card border border-border bg-background p-5 transition-colors duration-[var(--motion-standard)] hover:border-border-strong">
                    <div className="flex items-center gap-2.5">
                      <span className="grid size-9 place-items-center rounded-xs border border-border bg-surface text-primary">
                        <Icon className="size-[1.0625rem]" strokeWidth={1.85} aria-hidden />
                      </span>
                      <span className="eyebrow text-muted">{channel.label}</span>
                    </div>
                    <p className="font-[family-name:var(--font-display)] text-[length:var(--text-h3)] font-[weight:650] leading-snug tracking-[-0.01em] break-words">
                      {channel.value}
                    </p>
                    <p className="text-small text-muted">{channel.note}</p>
                    <a
                      href={channel.href}
                      {...(channel.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className="mt-auto inline-flex min-h-11 items-center gap-1.5 border-b border-border-strong self-start text-[length:var(--text-nav)] font-medium transition-colors duration-[var(--motion-fast)] hover:border-text hover:text-primary"
                    >
                      {channel.action}
                    </a>
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="mt-8 grid gap-6 border-t border-border pt-8 md:grid-cols-2 md:gap-10">
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 size-[1.125rem] shrink-0 text-primary" strokeWidth={1.75} aria-hidden />
              <div>
                <h3 className="text-small font-semibold">Where we are</h3>
                <p className="mt-1 text-small text-muted">
                  {siteConfig.location.line1}
                  <br />
                  {siteConfig.location.line2}
                  <br />
                  {siteConfig.location.area}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock className="mt-0.5 size-[1.125rem] shrink-0 text-primary" strokeWidth={1.75} aria-hidden />
              <div>
                <h3 className="text-small font-semibold">Opening hours</h3>
                <p className="mt-1 text-small text-muted">{siteConfig.hours}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------- delivery & payment */}
      <section id="delivery" aria-labelledby="delivery-heading" className="bg-surface scroll-mt-24">
        <div className="shell py-[length:var(--spacing-section-sm)] md:py-[length:var(--spacing-section)]">
          <Reveal>
            <p className="eyebrow text-muted">Delivery &amp; payment</p>
            <h2
              id="delivery-heading"
              className="mt-3 font-[family-name:var(--font-display)] text-[length:var(--text-h2)] font-[weight:700] leading-[1.14] tracking-[-0.02em]"
            >
              You know the cost before you pay
            </h2>
            <p className="mt-4 max-w-2xl text-[length:var(--text-body-lg)] leading-[1.65] text-text-secondary">
              Delivery is quoted against the address and the load, then added to your order. Nothing
              is charged until you have seen the total and approved the M-Pesa prompt yourself.
            </p>
          </Reveal>

          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:gap-6">
            <Reveal className="h-full">
              <div className="flex h-full flex-col gap-4 rounded-card border border-border bg-background p-5 md:p-6">
                <div className="flex items-center gap-2.5">
                  <Truck className="size-[1.125rem] text-primary" strokeWidth={1.75} aria-hidden />
                  <h3 className="font-[family-name:var(--font-display)] text-[length:var(--text-h3)] font-[weight:650] tracking-[-0.01em]">
                    Delivery
                  </h3>
                </div>
                <dl className="flex flex-col divide-y divide-[color:var(--color-border)] border-y border-border">
                  <div className="flex items-baseline justify-between gap-4 py-3">
                    <dt className="text-small text-muted">Inside Nairobi</dt>
                    <dd className="text-right text-small font-medium">{siteConfig.delivery.nairobi}</dd>
                  </div>
                  <div className="flex items-baseline justify-between gap-4 py-3">
                    <dt className="text-small text-muted">Upcountry</dt>
                    <dd className="text-right text-small font-medium">{siteConfig.delivery.upcountry}</dd>
                  </div>
                  <div className="flex items-baseline justify-between gap-4 py-3">
                    <dt className="text-small text-muted">Cost</dt>
                    <dd className="text-right text-small font-medium">
                      {siteConfig.delivery.freeThreshold > 0
                        ? `Free over ${siteConfig.currency.prefix}${siteConfig.delivery.freeThreshold.toLocaleString("en-KE")} in Nairobi`
                        : "Quoted before payment"}
                    </dd>
                  </div>
                </dl>
                <p className="text-small leading-relaxed text-muted">
                  Heavy goods — cement, blocks, pipe — are priced by load and distance. We tell you
                  the figure before you send money, every time.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.05} className="h-full">
              <div className="flex h-full flex-col gap-4 rounded-card border border-border bg-background p-5 md:p-6">
                <div className="flex items-center gap-2.5">
                  <Wallet className="size-[1.125rem] text-primary" strokeWidth={1.75} aria-hidden />
                  <h3 className="font-[family-name:var(--font-display)] text-[length:var(--text-h3)] font-[weight:650] tracking-[-0.01em]">
                    Payment
                  </h3>
                </div>
                <ol className="flex flex-col gap-3">
                  {[
                    "We confirm the stock and send you the total, delivery included.",
                    "An M-Pesa prompt reaches the number you gave us.",
                    "You approve it with your PIN. That is the payment.",
                  ].map((step, i) => (
                    <li key={step} className="flex gap-3">
                      <span className="tnum font-[family-name:var(--font-mono)] text-[0.6875rem] leading-5 text-accent-deep">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="text-small leading-relaxed text-text-secondary">{step}</span>
                    </li>
                  ))}
                </ol>
                <p className="mt-auto border-t border-border pt-4 font-[family-name:var(--font-mono)] text-[0.6875rem] uppercase leading-relaxed tracking-[0.1em] text-muted">
                  {siteConfig.payment.methods.join(" · ")}
                </p>
              </div>
            </Reveal>
          </div>

          <div className="mt-8 flex flex-col gap-2.5 sm:flex-row">
            <ExternalLink
              href={waLink("Hello Bora Hardware, I need a delivery quote:")}
              external
              size="lg"
              variant="accent"
            >
              <MessageCircle className="size-[1.125rem]" strokeWidth={2} aria-hidden />
              Get a delivery quote
            </ExternalLink>
            <a
              href={`tel:${siteConfig.contact.phoneHref}`}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xs border border-border-strong bg-background px-6 text-[length:var(--text-button)] font-semibold transition-colors duration-[var(--motion-fast)] hover:border-text hover:bg-surface"
            >
              <Phone className="size-4" strokeWidth={2} aria-hidden />
              Call {siteConfig.contact.phoneDisplay}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
