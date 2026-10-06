"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search } from "lucide-react";
import { Logo } from "@/components/logo";
import { MobileMenu } from "@/components/mobile-menu";
import { SearchDialog, useSearchHotkey } from "@/components/search-dialog";
import { CartButton } from "@/components/ui/cart-button";
import { categories } from "@/data/categories";
import { cn } from "@/lib/cn";

const SECONDARY_LINKS = [
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  const openSearch = useCallback(() => setSearchOpen(true), []);
  const closeSearch = useCallback(() => setSearchOpen(false), []);
  useSearchHotkey(openSearch, closeSearch);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[90] focus:rounded-xs focus:bg-accent focus:px-4 focus:py-2.5 focus:text-small focus:font-semibold focus:text-accent-ink"
      >
        Skip to content
      </a>

      <header className="sticky top-0 z-50 bg-background">
        <div
          className={cn(
            "border-b bg-background transition-colors duration-[var(--motion-standard)]",
            scrolled ? "border-border" : "border-transparent",
          )}
        >
          <div className="shell flex h-16 items-center gap-3 lg:gap-4">
            <Logo className="shrink-0" />

            {/* Row 1 carries only the routes a returning buyer uses most. The
                seven departments live in row 2 — trying to fit both on one line
                pushed the header to 1452px at 1024 and broke the page. */}
            <nav aria-label="Primary" className="ml-2 hidden items-center gap-1 lg:flex">
              <NavLink href="/shop" active={isActive("/shop")}>
                All products
              </NavLink>
            </nav>

            <div className="ml-auto flex items-center gap-2">
              {/* Real input on wide screens — the catalogue is searchable and
                  pretending otherwise would hide the primary discovery path. */}
              <button
                type="button"
                onClick={openSearch}
                className="hidden h-9 w-52 items-center gap-2 rounded-xs border border-border bg-surface px-3 text-left text-[length:var(--text-nav)] text-muted transition-colors duration-[var(--motion-fast)] hover:border-border-strong hover:text-text lg:flex xl:w-64"
              >
                <Search className="size-4 shrink-0" strokeWidth={2} aria-hidden />
                <span className="flex-1 truncate">Search tools, cable, cement…</span>
                <kbd className="hidden rounded-xs border border-border bg-background px-1.5 py-0.5 font-[family-name:var(--font-mono)] text-[0.6875rem] leading-none text-muted xl:block">
                  ⌘K
                </kbd>
              </button>

              <button
                type="button"
                onClick={openSearch}
                aria-label="Search products"
                className="grid size-11 place-items-center rounded-xs border border-border text-text transition-colors duration-[var(--motion-fast)] hover:border-text lg:hidden"
              >
                <Search className="size-[1.125rem]" strokeWidth={2} aria-hidden />
              </button>

              <CartButton />

              <button
                type="button"
                data-menu-trigger
                onClick={() => setMenuOpen(true)}
                aria-label="Open menu"
                aria-expanded={menuOpen}
                className="grid size-11 place-items-center rounded-xs border border-border text-text transition-colors duration-[var(--motion-fast)] hover:border-text lg:hidden"
              >
                <Menu className="size-5" strokeWidth={2} aria-hidden />
              </button>
            </div>
          </div>
        </div>

        {/* Row 2 — the department rail. Hidden below lg where the menu button
            carries it instead; a horizontally scrolling rail would hide
            departments and 7 categories genuinely do not fit in 944px. */}
        <div className="hidden border-b border-border bg-background lg:block">
          <nav aria-label="Departments" className="shell">
            <ul className="-mb-px flex items-center gap-0.5 overflow-x-auto">
              <CategoryRail pathname={pathname} />
              <li aria-hidden className="mx-2.5 h-4 w-px shrink-0 bg-border" />
              {SECONDARY_LINKS.map((link) => (
                <li key={link.href}>
                  <NavLink href={link.href} active={isActive(link.href)}>
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <SearchDialog open={searchOpen} onClose={closeSearch} />
        <MobileMenu open={menuOpen} onClose={closeMenu} />
      </header>
    </>
  );
}

/**
 * Horizontal category rail.
 *
 * A second row inside the header rather than a mega-menu: seven categories fit
 * on one line, a mega-menu would hide them, and an MVP catalogue does not have
 * the depth to justify one.
 */
function CategoryRail({ pathname }: { pathname: string }) {
  return (
    <>
      {categories.map((category) => {
        const active = pathname.startsWith(`/shop/${category.id}`) || pathname === `/shop/${category.id}`;
        return (
          <li key={category.id}>
            <Link
              href={`/shop/${category.id}`}
              aria-current={active ? "page" : undefined}
              className={cn(
                "relative inline-flex h-11 shrink-0 items-center rounded-xs px-2.5 text-[length:var(--text-nav)] transition-colors duration-[var(--motion-fast)]",
                active ? "text-primary" : "text-text-secondary hover:text-text",
              )}
            >
              {category.name}
              <span
                aria-hidden
                className={cn(
                  "absolute inset-x-2.5 bottom-0 h-0.5 origin-left bg-accent transition-transform duration-[var(--motion-fast)] ease-[var(--ease-out)]",
                  active ? "scale-x-100" : "scale-x-0",
                )}
              />
            </Link>
          </li>
        );
      })}
    </>
  );
}

function NavLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "relative inline-flex h-11 shrink-0 items-center rounded-xs px-2.5 text-[length:var(--text-nav)] transition-colors duration-[var(--motion-fast)]",
        active ? "text-primary" : "text-text-secondary hover:text-text",
      )}
    >
      {children}
    </Link>
  );
}