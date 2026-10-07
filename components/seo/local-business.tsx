import { JsonLd } from "@/components/seo/json-ld";
import { siteConfig, usingPlaceholders } from "@/config/site";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://borahardware.co.ke";

/**
 * `HardwareStore` entity for the counter itself.
 *
 * Telephone, email and opening hours are published only when they have been
 * supplied as environment overrides — a placeholder number in structured data
 * would be a placeholder number *claiming to be real*, which is worse than an
 * absent field.
 */
export function LocalBusinessJsonLd() {
  const hours = process.env.NEXT_PUBLIC_HOURS;

  const data = {
    "@context": "https://schema.org",
    "@type": "HardwareStore",
    "@id": `${siteUrl}/#store`,
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteUrl,
    ...(usingPlaceholders
      ? {}
      : {
          telephone: siteConfig.contact.phoneDisplay,
          email: siteConfig.contact.email,
        }),
    ...(hours && hours.trim().length > 0 ? { openingHours: hours.trim() } : {}),
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.location.area,
      addressLocality: "Nairobi",
      addressCountry: "KE",
    },
    currenciesAccepted: siteConfig.currency.code,
    paymentAccepted: siteConfig.payment.methods.join(", "),
    areaServed: "Nairobi and nationwide delivery, Kenya",
  };

  return <JsonLd data={data} />;
}
