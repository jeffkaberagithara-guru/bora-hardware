"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CreditCard, MessageCircle, Phone, Smartphone } from "lucide-react";
import { buildOrderMessage, useCart } from "@/components/cart/cart-provider";
import { Button } from "@/components/ui/button";
import { getProduct } from "@/data/products";
import { siteConfig, waLink } from "@/config/site";
import { formatKES } from "@/lib/currency";
import { cn } from "@/lib/cn";

/**
 * Checkout.
 *
 * There is no payment processor behind this build, so there is no payment
 * success state — nothing here may ever imply money moved. The honest flow for
 * this business, and the one buyers already use, is: build the order, send it
 * to the counter, confirm stock and delivery, then approve the M-Pesa request
 * on the phone. The form's only job is to make that handoff complete enough
 * that the counter can answer in one reply.
 *
 * Every price is recomputed from catalogue data, never read back from stored
 * cart payloads, so a tampered localStorage cannot move a number.
 */

type Fulfilment = "delivery-nairobi" | "collect" | "upcountry";

const FULFILMENTS: { value: Fulfilment; label: string; note: string }[] = [
  { value: "delivery-nairobi", label: "Delivery inside Nairobi", note: "Quoted by distance and load" },
  { value: "collect", label: "Collect from the counter", note: "Ready the same afternoon where stock allows" },
  { value: "upcountry", label: "Shipping upcountry", note: "Price depends on weight and destination" },
];

const FIELD =
  "w-full rounded-xs border border-border-strong bg-background px-3.5 py-3 text-[length:var(--text-body)] " +
  "text-text placeholder:text-muted transition-colors duration-[var(--motion-fast)] focus:border-primary " +
  "aria-[invalid=true]:border-danger";

const LABEL = "flex flex-col gap-1.5 text-small font-medium text-text";

type Errors = { name?: string; phone?: string };

export function Checkout() {
  const { lines, clear } = useCart();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [fulfilment, setFulfilment] = useState<Fulfilment>("delivery-nairobi");
  const [area, setArea] = useState("");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<Errors>({});

  const items = useMemo(
    () =>
      lines
        .map((line) => ({ line, product: getProduct(line.id) }))
        .filter((row): row is { line: (typeof lines)[number]; product: NonNullable<ReturnType<typeof getProduct>> } =>
          Boolean(row.product),
        ),
    [lines],
  );

  const subtotal = items.reduce((sum, row) => sum + row.product.price * row.line.qty, 0);
  const count = items.reduce((n, row) => n + row.line.qty, 0);

  if (items.length === 0) return <EmptyCheckout />;

  const chosen = FULFILMENTS.find((option) => option.value === fulfilment)!;

  function validate(): Errors {
    const next: Errors = {};
    if (name.trim().length < 2) next.name = "Tell us who the order is for.";
    if (phone.replace(/\D/g, "").length < 9) next.phone = "A reachable number, e.g. 0712 345 678.";
    return next;
  }

  function buildMessage(): string {
    const rows = items.map(({ line, product }, i) =>
      [
        `${i + 1}. ${product.name} (${product.brand})`,
        `   ${line.qty} × ${formatKES(product.price)} = ${formatKES(product.price * line.qty)}`,
        `   Ref: ${product.sku}`,
      ].join("\n"),
    );

    return [
      "Hello Bora Hardware, I would like to place this order:",
      "",
      ...rows,
      "",
      `Subtotal: ${formatKES(subtotal)}`,
      "",
      `Name: ${name.trim()}`,
      `Phone: ${phone.trim()}`,
      `Fulfilment: ${chosen.label}`,
      area.trim() && `Area: ${area.trim()}`,
      notes.trim() && `Notes: ${notes.trim()}`,
    ]
      .filter((row) => row !== "")
      .join("\n")
      .concat("", "Please confirm availability, delivery cost and the M-Pesa request.");
  }

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) return;
    window.open(waLink(buildMessage()), "_blank", "noopener,noreferrer");
  }

  return (
    <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
      {/* ------------------------------------------------------- order summary */}
      <aside className="lg:order-2 lg:col-span-5">
        <div className="flex flex-col gap-5 lg:sticky lg:top-24">
          <section
            aria-labelledby="summary-heading"
            className="rounded-card border border-border bg-background"
          >
            <div className="flex items-baseline justify-between border-b border-border px-4 py-3.5">
              <h2
                id="summary-heading"
                className="font-[family-name:var(--font-display)] text-[length:var(--text-h3)] font-[weight:650] tracking-[-0.01em]"
              >
                Your order
              </h2>
              <span className="eyebrow text-muted">
                {count} {count === 1 ? "item" : "items"}
              </span>
            </div>

            <ul className="divide-y divide-[color:var(--color-border)] px-4">
              {items.map(({ line, product }) => (
                <li key={line.id} className="flex gap-3 py-3.5">
                  <Link
                    href={`/product/${product.id}`}
                    className="relative size-14 shrink-0 overflow-hidden rounded-xs bg-surface"
                  >
                    <Image src={product.image} alt="" fill sizes="56px" className="object-cover" />
                  </Link>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-small font-medium">{product.name}</p>
                    <p className="mt-0.5 font-[family-name:var(--font-mono)] text-[0.6875rem] text-muted">
                      {line.qty} × {formatKES(product.price)} · {product.sku}
                    </p>
                  </div>
                  <span className="tnum shrink-0 font-[family-name:var(--font-display)] text-[length:var(--text-price)] font-bold">
                    {formatKES(product.price * line.qty)}
                  </span>
                </li>
              ))}
            </ul>

            <div className="border-t border-border bg-surface px-4 py-4">
              <div className="flex items-baseline justify-between">
                <span className="text-small text-text-secondary">Subtotal</span>
                <span className="tnum font-[family-name:var(--font-display)] text-[length:var(--text-price-lg)] font-[weight:750] tracking-[-0.025em]">
                  {formatKES(subtotal)}
                </span>
              </div>
              <p className="mt-1.5 text-[0.75rem] leading-snug text-muted">
                Delivery or shipping is added once we know the address and the load.{" "}
                {siteConfig.delivery.freeThreshold > 0 &&
                  `Orders over ${formatKES(siteConfig.delivery.freeThreshold)} inside Nairobi deliver free.`}
              </p>
            </div>
          </section>

          <section aria-labelledby="pay-heading" className="rounded-card border border-border bg-surface p-4">
            <h2
              id="pay-heading"
              className="eyebrow flex items-center gap-2 text-muted"
            >
              <CreditCard className="size-3.5" strokeWidth={2} aria-hidden />
              How you pay
            </h2>
            <ol className="mt-3 flex flex-col gap-2.5">
              {[
                "We confirm the stock and the delivery cost.",
                "You get an M-Pesa prompt on the number you gave above.",
                "You approve it with your PIN. Nothing is charged before that.",
              ].map((step, i) => (
                <li key={step} className="flex gap-3">
                  <span className="tnum font-[family-name:var(--font-mono)] text-[0.6875rem] leading-5 text-accent-deep">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-small leading-relaxed text-text-secondary">{step}</span>
                </li>
              ))}
            </ol>
            <p className="mt-3 border-t border-border pt-3 font-[family-name:var(--font-mono)] text-[0.6875rem] uppercase tracking-[0.1em] text-muted">
              {siteConfig.payment.methods.join(" · ")}
            </p>
          </section>

          <div className="flex flex-col gap-2">
            <Link
              href="/shop"
              className="min-h-11 self-start border-b border-border-strong text-[length:var(--text-nav)] font-medium transition-colors duration-[var(--motion-fast)] hover:border-text hover:text-primary"
            >
              Keep shopping
            </Link>
            <button
              type="button"
              onClick={clear}
              className="min-h-11 self-start text-small text-muted transition-colors duration-[var(--motion-fast)] hover:text-danger"
            >
              Empty the cart
            </button>
          </div>
        </div>
      </aside>

      {/* ---------------------------------------------------------------- form */}
      <div className="lg:order-1 lg:col-span-7">
        <form onSubmit={onSubmit} noValidate className="flex flex-col gap-6">
          <section aria-labelledby="details-heading" className="flex flex-col gap-4">
            <h2
              id="details-heading"
              className="font-[family-name:var(--font-display)] text-[length:var(--text-h2)] font-[weight:700] leading-[1.14] tracking-[-0.02em]"
            >
              Who is the order for?
            </h2>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className={LABEL}>
                Name
                <input
                  type="text"
                  name="name"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jane Wanjiku"
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? "name-error" : undefined}
                  className={FIELD}
                />
                {errors.name && (
                  <span id="name-error" role="alert" className="text-[0.75rem] font-normal text-danger">
                    {errors.name}
                  </span>
                )}
              </label>

              <label className={LABEL}>
                Phone (M-Pesa number)
                <input
                  type="tel"
                  name="phone"
                  inputMode="tel"
                  autoComplete="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0712 345 678"
                  aria-invalid={Boolean(errors.phone)}
                  aria-describedby={errors.phone ? "phone-error" : undefined}
                  className={FIELD}
                />
                {errors.phone && (
                  <span id="phone-error" role="alert" className="text-[0.75rem] font-normal text-danger">
                    {errors.phone}
                  </span>
                )}
              </label>
            </div>

            <fieldset className="flex flex-col gap-2.5">
              <legend className="mb-1 text-small font-medium text-text">How do you want it?</legend>
              {FULFILMENTS.map((option) => (
                <label
                  key={option.value}
                  className={cn(
                    "flex cursor-pointer items-start gap-3 rounded-xs border px-3.5 py-3 transition-colors duration-[var(--motion-fast)]",
                    fulfilment === option.value
                      ? "border-primary bg-primary-soft"
                      : "border-border hover:border-border-strong",
                  )}
                >
                  <input
                    type="radio"
                    name="fulfilment"
                    value={option.value}
                    checked={fulfilment === option.value}
                    onChange={() => setFulfilment(option.value)}
                    className="mt-1 size-4 shrink-0 accent-primary"
                  />
                  <span className="flex flex-col">
                    <span className="text-small font-medium text-text">{option.label}</span>
                    <span className="text-[0.75rem] text-muted">{option.note}</span>
                  </span>
                </label>
              ))}
            </fieldset>

            <label className={LABEL}>
              {fulfilment === "collect" ? "When are you coming?" : "Estate, road or landmark"}
              <input
                type="text"
                name="area"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                placeholder={fulfilment === "collect" ? "This afternoon, say" : "Kaloleni, off Jogoo Road"}
                className={FIELD}
              />
            </label>

            <label className={LABEL}>
              Anything the counter should know?
              <textarea
                name="notes"
                rows={4}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Measurements, brand preference, gate size for delivery…"
                className={cn(FIELD, "resize-y")}
              />
            </label>
          </section>

          <div className="flex flex-col gap-2.5 border-t border-border pt-5">
            <Button type="submit" size="lg" fullWidth>
              <MessageCircle className="size-[1.125rem]" strokeWidth={2} aria-hidden />
              Send this order on WhatsApp
            </Button>
            <Button
              type="button"
              variant="outline"
              size="md"
              fullWidth
              onClick={() => {
                window.location.href = `tel:${siteConfig.contact.phoneHref}`;
              }}
            >
              <Phone className="size-4" strokeWidth={2} aria-hidden />
              Call the counter instead — {siteConfig.contact.phoneDisplay}
            </Button>
            <p className="mt-1 flex items-center justify-center gap-2 text-center font-[family-name:var(--font-mono)] text-[0.6875rem] uppercase tracking-[0.1em] text-muted">
              <Smartphone className="size-3.5" strokeWidth={2} aria-hidden />
              No payment is taken on this page
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

function EmptyCheckout() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-3 rounded-card border border-border bg-surface px-6 py-14 text-center">
      <h2 className="font-[family-name:var(--font-display)] text-[length:var(--text-h2)] font-[weight:700] tracking-[-0.02em]">
        Nothing to check out
      </h2>
      <p className="text-small text-muted">
        Your cart is empty. Add the lines you need from the catalogue, or send the whole list to
        the counter on WhatsApp and we will price it for you.
      </p>
      <div className="mt-2 flex flex-col gap-2">
        <Link
          href="/shop"
          className="inline-flex min-h-11 items-center justify-center rounded-xs border border-accent bg-accent px-5 text-[length:var(--text-button)] font-semibold text-accent-ink transition-colors duration-[var(--motion-fast)] hover:border-accent-hover hover:bg-accent-hover"
        >
          Browse the catalogue
        </Link>
        <Link
          href="/contact"
          className="inline-flex min-h-11 items-center justify-center rounded-xs border border-border-strong px-5 text-[length:var(--text-button)] font-semibold transition-colors duration-[var(--motion-fast)] hover:border-text hover:bg-surface"
        >
          Order on WhatsApp
        </Link>
      </div>
    </div>
  );
}
