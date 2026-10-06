import Link from "next/link";
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { categories } from "@/data/categories";
import { siteConfig, waLink } from "@/config/site";

/**
 * Footer.
 *
 * Deep blue, four columns, and the real contact details in full — a hardware
 * buyer scanning the bottom of the page is looking for a phone number and a
 * location, so both are given in plain text rather than hidden behind a form.
 */
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-[color:var(--color-primary-strong)] text-white">
      <div className="shell py-12 md:py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          {/* ------------------------------------------------------- identity */}
          <div className="lg:col-span-4">
            <div className="flex flex-col leading-none">
              <span
                className="font-[family-name:var(--font-display)] text-2xl font-[weight:800] tracking-[-0.02em] text-white"
                style={{ fontVariationSettings: "'wdth' 112" }}
              >
                <span className="text-white">BO</span>
                <span className="text-accent-on-dark">RA</span>
              </span>
              <span className="mt-2 font-[family-name:var(--font-mono)] text-[0.6875rem] uppercase tracking-[0.16em] text-white/70">
                {siteConfig.descriptor}
              </span>
            </div>
            <p className="mt-5 max-w-xs text-small leading-relaxed text-white/70">
              Power tools, hand tools, electrical, plumbing and building materials in Nairobi.
              Genuine branded stock, priced direct, delivered nationwide.
            </p>
            <p className="mt-5 font-[family-name:var(--font-mono)] text-[0.6875rem] uppercase tracking-[0.12em] text-accent-on-dark">
              {siteConfig.tagline}
            </p>
          </div>

          {/* ------------------------------------------------------ catalogue */}
          <nav aria-label="Shop" className="lg:col-span-3">
            <p className="eyebrow text-white/70">Shop</p>
            <ul className="mt-4 flex flex-col">
              {categories.map((category) => (
                <li key={category.id}>
                  <Link
                    href={`/shop/${category.id}`}
                    className="inline-flex min-h-11 items-center text-small text-white/80 transition-colors duration-[var(--motion-fast)] hover:text-accent-on-dark"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* --------------------------------------------------------- browse */}
          <nav aria-label="More" className="lg:col-span-2">
            <p className="eyebrow text-white/70">More</p>
            <ul className="mt-4 flex flex-col">
              {[
                { label: "All products", href: "/shop" },
                { label: "About Bora", href: "/about" },
                { label: "Contact", href: "/contact" },
                { label: "Delivery & payment", href: "/contact#delivery" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-flex min-h-11 items-center text-small text-white/80 transition-colors duration-[var(--motion-fast)] hover:text-accent-on-dark"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* -------------------------------------------------------- contact */}
          <div className="lg:col-span-3">
            <p className="eyebrow text-white/70">Reach us</p>
            <ul className="mt-4 flex flex-col gap-3">
              <li>
                <a
                  href={`tel:${siteConfig.contact.phoneHref}`}
                  className="flex min-h-11 items-center gap-2.5 text-small text-white/80 transition-colors duration-[var(--motion-fast)] hover:text-accent-on-dark"
                >
                  <Phone className="size-4 shrink-0 text-white/70" strokeWidth={1.75} aria-hidden />
                  {siteConfig.contact.phoneDisplay}
                </a>
              </li>
              <li>
                <a
                  href={`https://wa.me/${siteConfig.contact.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex min-h-11 items-center gap-2.5 text-small text-white/80 transition-colors duration-[var(--motion-fast)] hover:text-accent-on-dark"
                >
                  <MessageCircle className="size-4 shrink-0 text-white/70" strokeWidth={1.75} aria-hidden />
                  WhatsApp orders
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="flex min-h-11 items-center gap-2.5 text-small text-white/80 transition-colors duration-[var(--motion-fast)] hover:text-accent-on-dark"
                >
                  <Mail className="size-4 shrink-0 text-white/70" strokeWidth={1.75} aria-hidden />
                  {siteConfig.contact.email}
                </a>
              </li>
              <li className="flex min-h-11 items-center gap-2.5 text-small text-white/80">
                <MapPin className="size-4 shrink-0 text-white/70" strokeWidth={1.75} aria-hidden />
                <span>
                  {siteConfig.location.line1}
                  <br />
                  {siteConfig.location.line2}
                </span>
              </li>
              <li className="flex items-start gap-2.5 text-small text-white/80">
                <Clock className="size-4 shrink-0 text-white/70" strokeWidth={1.75} aria-hidden />
                <span>{siteConfig.hours}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* ------------------------------------------------------- legal rail */}
        <div className="mt-12 flex flex-col gap-4 border-t border-white/12 pt-6 md:flex-row md:items-center md:justify-between">
          <p className="font-[family-name:var(--font-mono)] text-[0.6875rem] leading-relaxed text-white/70">
            © {year} {siteConfig.legalName}. Nairobi, Kenya.
          </p>
          <p className="flex flex-wrap items-center gap-x-3 gap-y-1 font-[family-name:var(--font-mono)] text-[0.6875rem] uppercase tracking-[0.1em] text-white/70">
            <span className="text-white/70">We accept</span>
            <span>M-Pesa</span>
            <span aria-hidden className="text-white/20">
              ·
            </span>
            <span>Bank transfer</span>
            <span aria-hidden className="text-white/20">
              ·
            </span>
            <span>Cash on delivery</span>
          </p>
        </div>

        <p className="mt-4 text-[0.6875rem] leading-relaxed text-white/70">
          Product names and brands shown are illustrative. Bora Hardware is not affiliated with or
          endorsed by the manufacturers listed. Prices are sample data and should be replaced with
          live inventory before launch.
        </p>
      </div>
    </footer>
  );
}