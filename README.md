# Bora Hardware

A catalogue-first storefront for a Nairobi hardware counter: power tools, hand tools, electrical,
plumbing and building materials — priced with the **unit price on every line** (per metre, per bag,
per kg), because hardware cannot be compared on ticket price alone.

Visual and interaction decisions live in **[DESIGN.md](./DESIGN.md)**. That file is the source of
truth; components follow it rather than the other way round.

## Running it

```bash
npm install
npm run dev    # http://localhost:3000
npm run build  # production build + type check
npm run start
npx tsc --noEmit   # type check only
```

## Routes

| Route | What it is |
| --- | --- |
| `/` | Home: hero, trust strip, featured lines, departments, value argument, store, order CTA |
| `/shop` | Full catalogue with department rail and sort |
| `/shop/[category]` | One department |
| `/search` | Results page: GET form, relevance sort, empty state |
| `/product/[id]` | Product detail with spec table and a sticky mobile buy bar |
| `/checkout` | Order summary → WhatsApp handoff to the counter |
| `/contact` | Call / WhatsApp / email, plus `#delivery` (delivery & payment) |
| `/about` | How the business works, department index |

Every route except `/search` is statically generated (`generateStaticParams` from the catalogue).
`/search` reads `searchParams`, so it is rendered per request and excluded from `robots.txt`.

### Search engines and sharing

`app/robots.ts` and `app/sitemap.ts` are generated from the catalogue; product and category pages
carry JSON-LD (`HardwareStore`, `Product` with a unit-price `UnitPriceSpecification`, and
breadcrumb lists) from `components/seo/`. Share cards use the branded 1200×630 `public/img/og-cover.jpg`
— regenerate it after changing design tokens with `npm run og`.

## ⚠️ Sample data

**Everything in `data/` is sample content pending real inventory.** Prices are representative
Kenyan retail prices, product names and specifications are illustrative, and images are stock
photography in `public/img/` (most product photos are derived frames of those shots, scripted by
`npm run derive-images`). The footer says so on every page. Replace `data/products.ts`,
`data/categories.ts` and the images before taking real orders.

Business contact details in `config/site.ts` are **placeholders** and are environment-overridable
so no real phone number is ever committed to source.

### Environment variables

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical origin for metadata (default `https://borahardware.co.ke`) |
| `NEXT_PUBLIC_PHONE_DISPLAY` / `NEXT_PUBLIC_PHONE_HREF` | Counter number, display and `tel:` forms |
| `NEXT_PUBLIC_WHATSAPP` | WhatsApp number in international format, digits only |
| `NEXT_PUBLIC_EMAIL` | Enquiry inbox |
| `NEXT_PUBLIC_ADDRESS_1` / `_2` / `NEXT_PUBLIC_AREA` | Location lines |
| `NEXT_PUBLIC_HOURS` | Opening hours line |
| `NEXT_PUBLIC_LEGAL_NAME` | Entity name in the footer |
| `NEXT_PUBLIC_FREE_DELIVERY_THRESHOLD` | **0 (default) = no free-delivery claim anywhere.** Set a verified figure in KSh to publish one. |

No `.env*` file is committed.

## How ordering works (and what it deliberately does not do)

There is **no payment processor** in this build, and no page claims a payment succeeded.

1. The customer builds a cart (client-side, `localStorage`).
2. `/checkout` recomputes every price from catalogue data — never from stored payloads — and hands
   the order to the counter on WhatsApp.
3. The counter confirms stock and delivery cost, then sends an M-Pesa STK prompt to the customer's
   phone, which they approve with their own PIN.

Adding real checkout later means replacing step 2 with a server route that verifies stock and
creates the STK push; the UI already matches that flow.

## Verification

```bash
npm run audit            # build + structure + contrast + layout + focus
npm run audit:structure  # headings, landmarks, alt text, accessible names, no raw hex
npm run audit:contrast   # WCAG ratios + DESIGN §4.1 ↔ globals.css token parity
npm run audit:layout     # headless Chrome: overflow 320–1920, touch targets, reduced motion
npm run audit:focus      # headless Chrome: focus rings, dialog focus restore, link integrity
npm run typecheck
npm run og               # regenerate public/img/og-cover.jpg from the current tokens
npm run derive-images    # regenerate derived product photos from their source frames
```

`audit:structure` reads the prerendered HTML in `.next/server/app` and additionally live-fetches
`/search` (it is never prerendered). `audit:layout` (port 3113) and `audit:focus` (port 3114)
start their own `next start` and close it afterwards — set `AUDIT_BASE_URL` to reuse a server,
`BROWSER_PATH` to pick the browser.

## Layout

```
app/            routes (RSC) + globals.css + not-found + robots/sitemap
components/     ui/, home/, cart/, shop/, product/, checkout/, seo/
config/site.ts  business details, environment-overridable
data/           products.ts, categories.ts  ← SAMPLE DATA
scripts/        audit: structure, contrast, layout, focus + og/derive-image tools
lib/            currency, search, cn
DESIGN.md       design system: tokens, components, motion, a11y rules
```

Rules that are easy to break and therefore written down: no raw hex in components (use the tokens
in `app/globals.css`), orange is reserved for the single highest-value action per screen, radius
stays ≤ 4px, motion never exceeds 620ms and nothing loops, and **Inter is not used**.
