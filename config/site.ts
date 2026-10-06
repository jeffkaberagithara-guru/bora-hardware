/**
 * Business configuration.
 *
 * Contact details are environment-overridable so that no real phone number is
 * ever committed to source. Defaults are clearly-marked placeholders and must be
 * replaced before launch — see README.md.
 */

const env = (key: string, fallback: string) => {
  const value = process.env[key];
  return value && value.trim().length > 0 ? value.trim() : fallback;
};

export const siteConfig = {
  name: "Bora Hardware",
  wordmark: "BORA",
  descriptor: "Hardware · Tools · Building Supplies",
  legalName: env("NEXT_PUBLIC_LEGAL_NAME", "Bora Hardware"),

  tagline: "Genuine gear. Honest prices.",

  description:
    "Power tools, hand tools, electrical, plumbing and building materials in Nairobi. Genuine branded stock at direct prices, paid with M-Pesa and delivered across Kenya.",

  /** Short announcement for the top bar (mobile shows `short`). */
  announcement: {
    main: "Genuine stock. Direct prices. Delivery inside Nairobi and nationwide.",
    short: "Genuine stock. Direct prices.",
    action: "How we deliver",
    href: "/contact#delivery",
  },

  currency: {
    code: "KES",
    /** Kenyan convention: KSh + comma-grouped integer. */
    prefix: "KSh ",
  },

  contact: {
    phoneDisplay: env("NEXT_PUBLIC_PHONE_DISPLAY", "+254 700 000 000"),
    phoneHref: env("NEXT_PUBLIC_PHONE_HREF", "+254700000000"),
    whatsapp: env("NEXT_PUBLIC_WHATSAPP", "254700000000"),
    email: env("NEXT_PUBLIC_EMAIL", "orders@example.co.ke"),
  },

  location: {
    line1: env("NEXT_PUBLIC_ADDRESS_1", "Warehouse & Counter"),
    line2: env("NEXT_PUBLIC_ADDRESS_2", "Nairobi, Kenya"),
    area: env("NEXT_PUBLIC_AREA", "Industrial Area, Nairobi"),
  },

  hours: env("NEXT_PUBLIC_HOURS", "Call the counter to confirm today's hours"),

  payment: {
    primary: "M-Pesa",
    methods: ["M-Pesa (Lipa na M-Pesa STK)", "Bank transfer", "Cash on delivery in Nairobi"],
  },

  delivery: {
    nairobi: "Delivery inside Nairobi",
    upcountry: "Nationwide delivery and shipping",
    /* 0 = feature off. Set NEXT_PUBLIC_FREE_DELIVERY_THRESHOLD to publish a
       free-delivery promise; until then the site must not claim one. */
    freeThreshold: Number(env("NEXT_PUBLIC_FREE_DELIVERY_THRESHOLD", "0")),
  },

  social: [] as { label: string; href: string }[],
} as const;

export type SiteConfig = typeof siteConfig;

/** Placeholder guard so a demo build can never be mistaken for a live shop. */
export const usingPlaceholders = Boolean(
  process.env.NEXT_PUBLIC_PHONE_DISPLAY === undefined && process.env.NEXT_PUBLIC_EMAIL === undefined,
);

export const waLink = (message: string) =>
  `https://wa.me/${siteConfig.contact.whatsapp}?text=${encodeURIComponent(message)}`;