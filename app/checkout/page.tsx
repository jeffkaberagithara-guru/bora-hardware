import type { Metadata } from "next";
import { Checkout } from "@/components/checkout/checkout";
import { PageHeader } from "@/components/ui/page-header";

export const metadata: Metadata = {
  title: "Checkout",
  description:
    "Send your Bora Hardware order to the counter on WhatsApp, confirm stock and delivery, then approve the M-Pesa prompt on your phone.",
  alternates: { canonical: "/checkout" },
  robots: { index: false },
};

export default function CheckoutPage() {
  return (
    <>
      <PageHeader
        crumbs={[{ label: "Shop", href: "/shop" }, { label: "Checkout" }]}
        eyebrow="Order"
        title="Send it to the counter"
        intro="Check the lines, add your number and how you want it. The order goes to us on WhatsApp; we confirm stock and delivery, then send the M-Pesa prompt to your phone."
      />

      <div className="shell py-8 md:py-10">
        <Checkout />
      </div>
    </>
  );
}
