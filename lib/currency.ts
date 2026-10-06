import { siteConfig } from "@/config/site";
import type { Product, Unit } from "@/data/products";

/**
 * Kenyan currency formatting.
 *
 * Intl returns "Ksh" for en-KE and "KES" elsewhere; Kenyan trade writing
 * standardises on "KSh". We format manually so the string is identical on the
 * server and the client and cannot drift between builds.
 */
const groupDigits = (value: number) =>
  Math.round(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

export const formatKES = (amount: number): string => `${siteConfig.currency.prefix}${groupDigits(amount)}`;

/** Human phrase for each selling unit. */
const UNIT_PHRASE: Record<Unit, string> = {
  metre: "metre",
  piece: "piece",
  bag: "50kg bag",
  kg: "kg",
  tin: "5L tin",
  set: "set",
  kit: "kit",
};

export const unitPhrase = (product: Pick<Product, "unit">): string => UNIT_PHRASE[product.unit];

/**
 * Price-per-unit.
 *
 * This is the load-bearing idea in the catalogue UI. Hardware is sold in
 * incompatible units — a bag of cement, a metre of cable, a kilogram of nails
 * — so the ticket price alone can't be compared. Baymard's research puts this
 * at the top of the buyer's decision hierarchy, and it is the single element
 * that makes this catalogue look like a trade price list rather than a
 * template storefront.
 *
 * `unitAlt` carries an explicitly precomputed secondary rate (price per kg,
 * price per litre) so no division happens at render time and no float ever
 * reaches the page.
 */
export function unitPrice(product: Product): string | null {
  if (product.unitAlt) return `${formatKES(product.unitAlt.price)} / ${product.unitAlt.unit}`;
  if (product.unit === "piece") return null;
  return `${formatKES(product.price)} / ${unitPhrase(product)}`;
}

/** "Sold per metre" — the stock hint under the price block. */
export const soldPer = (product: Pick<Product, "unit">): string => `Sold per ${unitPhrase(product)}`;

/** Secondary rate for the price block, e.g. "KSh 19 / kg" beside "KSh 950 / 50kg bag". */
export function secondaryRate(product: Product): string | null {
  if (!product.unitAlt) return null;
  return `${formatKES(product.unitAlt.price)} / ${product.unitAlt.unit}`;
}

export const stockLabel = (stock: number): string => {
  if (stock <= 0) return "Out of stock";
  if (stock <= 5) return `Only ${stock} left`;
  return "In stock";
};