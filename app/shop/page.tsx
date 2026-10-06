import type { Metadata } from "next";
import { Catalogue } from "@/components/shop/catalogue";
import { PageHeader } from "@/components/ui/page-header";
import { products } from "@/data/products";

export const metadata: Metadata = {
  title: "All products",
  description:
    "The full Bora Hardware catalogue: power tools, hand tools, electrical, plumbing and building materials, each shown with its price and unit price.",
  alternates: { canonical: "/shop" },
};

export default function ShopPage() {
  return (
    <>
      <PageHeader
        crumbs={[{ label: "Shop" }]}
        eyebrow="Catalogue"
        title="The full price list"
        intro="Every line shows the ticket price and the unit it is sold in, so two things you can only compare properly — a bag and a metre — sit on the same footing."
      />

      <div className="shell py-8 md:py-10">
        <Catalogue products={products} activeCategory={null} />
      </div>
    </>
  );
}
