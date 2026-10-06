# BORA HARDWARE — Design System

> Document authority: this file is the source of truth for visual and interaction decisions.
> Tokens here must match `app/globals.css` and `tailwind.config.ts`. Nothing gets a raw hex value inline.

---

## 1. Design Research & Findings

Research was conducted before implementation across: Baymard Institute, Pexels/Pinterest/Refero-style
reference scanning, Kenyan retailer audits (Shabbiri Hardware, BOLD Industrial, MACHE Hardware,
Main Hardware, Ali Glaziers, Rexmall, PowerTools.co.ke), Google Fonts/Typewolf type research, and
industrial type-case studies (Metabo, Liebherr, neue Vektor CNC, DDC Hardware).

### 1.1 What the research actually changed in this design

| Finding | Source | Design consequence |
| --- | --- | --- |
| **Price-per-unit is the dominant comparison tool in hardware.** 86% of ecommerce sites omit it; in hardware it is decisive because goods are sold in incompatible units. | Baymard price-per-unit research | Every product carries a **unit price** (per metre, per bag, per kg, per piece, per litre) rendered in mono beneath the headline price. This is the single most distinctive UI element on the site. |
| **The real trust crisis in Kenyan power tools is counterfeits.** Retail copy across the category is overwhelmingly about avoiding fakes: *"don't fall back on cheap, faulty and copy power tools"*. | Kenyan retailer copy audit | The trust strip and value section are built on **genuine stock / no middlemen**, not on generic "quality products". Trust copy is specific, not decorative. |
| **Prices are quoted with visible currency and thousands separators.** `KSh 8,500` / `KES27,500.00`. | Kenyan retailer audit | One canonical format: **`KSh 14,500`**, en-space-grouped, tabular figures. |
| **Counter-everything messaging is the category convention.** | Kenyan retailer audit | Deliberately rejected. Our credibility claim is operational (genuine stock, direct pricing, real delivery), not promotional. |
| **Over 80% of Kenyan ecommerce traffic is mobile, on mid-range Android.** | Kenyan agency research | Mobile is the primary design target. Fixed mobile add-to-cart bar on product cards' page, 44px+ targets, no hover-dependent information. |
| **M-Pesa STK push is the payment expectation.** | Kenyan agency research | M-Pesa is the primary and default payment method in the order flow. No fake payment success states. |
| **Buyers already order by WhatsApp.** | Category convention | WhatsApp order handoff is a first-class CTA, equal in weight to cart checkout. |
| **Industrial type is defined by signage, not SaaS.** | Metabo / Liebherr / neue Vektor CNC | Headline face is a signage grotesque with a variable width axis. Body face is technical, not neutral-grotesque. Inter rejected. |

### 1.2 Anti-patterns rejected from reference research

- No mega-menu (postponed deliberately; catalogue depth does not justify it at MVP).
- No discount percentage badges, no strikethrough "was" pricing, no countdowns, no fake urgency.
- No testimonial carousels, no customer logo walls, no invented statistics.
- No "Free delivery over KSh 10,000" style claims without verified thresholds — thresholds are
  configuration, not invented.
- No image carousel above the fold.

---

## 2. Design Directions Evaluated

Five directions were developed and scored. Each was assessed on typography, hero composition,
product card design, colour usage, navigation, imagery, motion, mobile behaviour and brand personality.

### Direction A — Modern Industrial Minimal
Strict 12-column grid, hairline rules, flat surfaces, blue/white/orange, no shadows.
- **Strengths:** disciplined, fast, professional, reads as a real business.
- **Weaknesses:** converges toward the generic SaaS-adjacent look the brief prohibits. Nothing
  memorable. A cleaner version of what already exists.
- **Verdict:** Strong foundation, insufficient as a destination.

### Direction B — Editorial Hardware Commerce ✅
Catalogue-as-editorial. The product list is typeset like a printed trade price list: brand in mono
caps, name in the text face, price in tabular figures, unit price as a technical footnote. Asymmetric
grids, deliberate section rhythm, near-square corners, hairline rules instead of shadows.
- **Strengths:** solves the actual job (compare prices fast); typography carries the identity; the
  printed-price-list reference is *native to the category*, not borrowed from a design trend;
  inherently not-template because no ecommerce template renders a catalogue this way.
- **Weaknesses:** risk of feeling dry; requires disciplined photography to avoid flatness.
- **Verdict:** **Selected.** The strongest fit for a price-first hardware buyer and the most
  defensible non-template identity.

### Direction C — Technical Kenyan Commerce
Blueprint/spec-sheet language: visible grid lines, measurement ticks, mono throughout, receipt/ticket
motifs, ticket-number product codes.
- **Strengths:** highly distinctive; the spec-sheet layer is genuinely useful for technical goods.
- **Weaknesses:** mono body copy fails legibility at length; grid-line decoration becomes noise;
  reads cold and enterprise rather than approachable to a first-time DIY buyer.
- **Verdict:** Not selected wholesale. **Adopted as a layer** — mono metadata rows, unit-price
  footnotes and ticket-style reference numbers appear *inside* Direction B.

### Direction D — Bold Toolhouse
High-contrast yellow/black signage cues, huge condensed display type, orange block accents, loud
promotions.
- **Strengths:** high energy, memorable, reads "tool brand".
- **Weaknesses:** drifts into promotional-template territory, undermines the "fair prices, no
  hype" credibility we need, and pushes orange far past its intended role. Also the most common
  visual cliché in the category.
- **Verdict:** Rejected.

### Direction E — Premium Utility
Near-black on warm off-white, hairline type, generous product photography, luxury restraint.
- **Strengths:** elegant, confident, product-forward.
- **Weaknesses:** signals expensive, which contradicts the affordability proposition; loses the
  energy and directness of a working hardware counter.
- **Verdict:** Rejected on brand-proposition mismatch.

### Selection

**Direction B, enriched by Direction C's technical layer and disciplined by Direction A's grid.**

Brand personality: **dependable, plain-spoken, technical, warm.** We sound like a knowledgeable
shopkeeper who tells you the honest price, not a brand that shouts.

---

## 3. Brand

| Property | Value |
| --- | --- |
| Name | **Bora Hardware** |
| Wordmark | `BORA` — Archivo, weight 800, width axis 112, tracking `-0.02em` |
| Descriptor | `HARDWARE · TOOLS · BUILDING MATERIALS` — IBM Plex Mono, 10px, `0.16em` tracking |
| Positioning | Genuine stock at honest, direct prices. |
| Voice | Direct, practical, Kenyan. Short sentences. No superlatives. |

Wordmark rationale: the descriptor line under the mark does the category work, so the mark itself can
be short and confident. The width axis widens the mark to signage proportions — the same axis
narrows for compact UI, giving one family the whole system.

---

## 4. Colour

Semantic tokens only. Raw hex is forbidden in components.

### 4.1 Token table

| Token | Light value | Role |
| --- | --- | --- |
| `--color-primary` | `#0B63CE` | Primary actions, links, focus rings, active nav |
| `--color-primary-hover` | `#0A57B4` | Primary hover/active |
| `--color-primary-strong` | `#084A9E` | Primary text on light backgrounds, footer surface |
| `--color-primary-soft` | `#EEF4FD` | Tinted panels, active nav underline wash |
| `--color-accent` | `#F59A23` | Primary CTA fill, price emphasis rule, category marker |
| `--color-accent-hover` | `#DC8708` | CTA hover |
| `--color-accent-ink` | `#151719` | Text placed **on** `--color-accent` |
| `--color-accent-deep` | `#8A4B04` | Orange used as *text* on light surfaces |
| `--color-accent-soft` | `#FDF4E4` | Soft accent wash |
| `--color-accent-on-dark` | `#FDE8B4` | Orange-family text placed **on** `primary` / `primary-strong` (raw `accent` fails there) |
| `--color-background` | `#FFFFFF` | Page background |
| `--color-surface` | `#F6F7F8` | Section bands, product tile wells |
| `--color-surface-2` | `#ECEEF0` | Hover wells, skeletons |
| `--color-text` | `#151719` | Primary text |
| `--color-text-secondary` | `#454B51` | Body secondary |
| `--color-muted` | `#686F75` | Captions, metadata, helper text |
| `--color-border` | `#E3E6E8` | Default hairline |
| `--color-border-strong` | `#C9CFD4` | Emphasised hairline, input borders |
| `--color-success` | `#16794C` | In-stock |
| `--color-success-soft` | `#EAF5EF` | Success wash |
| `--color-danger` | `#B3261E` | Errors, destructive |
| `--color-danger-soft` | `#FDECEA` | Error wash |
| `--color-focus` | `#0B63CE` | Focus ring |

### 4.2 Usage rules

1. **Orange is a fill, not a text colour.** `accent` fills buttons and rules; text on it is
   `accent-ink` (near-black). Orange as *text* on white uses `accent-deep` only. This solves the
   contrast failure of `#F59A23` + white text (2.06:1) by design rather than by accident, and it is
   also the yellow-on-black language of the tool trade.
2. **Blue carries trust and is the default interactive colour.** Orange is reserved for the single
   highest-value action on any screen: the buy CTA. Never two orange buttons competing.
3. **Orange is capped at ~5% of any viewport.** If orange starts to dominate, something is wrong.
4. **Price is `text`, not `accent`.** Colour-coding prices orange would devalue them; price is
   emphasised with weight, size and tabular figures instead.
5. **Hairlines over shadows.** Surfaces are separated by `--color-border`, not by elevation.
6. **Verified contrast** (computed by `scripts/audit-contrast.mjs`, not by eye — see §12):
   body ≥ 7:1 (17.97 on background, 16.76 on surface), muted ≥ 4.6:1 (5.10 / 4.75),
   white on primary 5.69:1, `accent-ink` on `accent` 8.16:1.

---

## 5. Typography

Three roles, two vendors. **Inter is explicitly excluded.**

| Role | Family | Setting |
| --- | --- | --- |
| Display / headline | **Archivo** (variable `wght` 100–900, `wdth` 62–125) | signage grotesque; variable width is the identity mechanism |
| Body / UI | **IBM Plex Sans** | technical humanist sans; engineered rather than neutral; paired with Archivo so headings and text never share a skeleton |
| Mono / data | **IBM Plex Mono** | prices, unit prices, SKUs, spec rows, labels, reference numbers |

Rationale: Archivo supplies signage character and one family covers wordmark (widened),
headlines (normal) and UI numerics (tabular). IBM Plex Sans keeps long-form and form text warm
yet technical. IBM Plex Mono is used because **prices and specifications must align in columns** —
tabular figures are a functional requirement of a trade price list, not decoration.

### 5.1 Scale

| Token | Font | Size / line | Weight | Tracking | Notes |
| --- | --- | --- | --- | --- | --- |
| `--text-display` | Archivo | `clamp(2.75rem, 6.4vw, 5.25rem)` / `0.94` | 800 | `-0.03em` | Hero headline only. `font-variation-settings: 'wdth' 100` |
| `--text-h1` | Archivo | `clamp(2rem, 3.6vw, 2.875rem)` / `1.06` | 750 | `-0.025em` | Page titles |
| `--text-h2` | Archivo | `clamp(1.5rem, 2.4vw, 2rem)` / `1.14` | 700 | `-0.02em` | Section headings |
| `--text-h3` | Archivo | `1.1875rem` / `1.3` | 650 | `-0.01em` | Card titles |
| `--text-body` | IBM Plex Sans | `1rem` / `1.6` | 400 | `0` | Default |
| `--text-body-lg` | IBM Plex Sans | `1.0625rem` / `1.65` | 400 | `0` | Lead paragraphs |
| `--text-small` | IBM Plex Sans | `0.875rem` / `1.5` | 400 | `0` | Secondary text |
| `--text-caption` | IBM Plex Mono | `0.6875rem` / `1.4` | 500 | `0.14em` | Uppercase eyebrow / label |
| `--text-price` | Archivo | `1.1875rem` / `1.1` | 700 | `-0.015em` | Card price, `font-variant-numeric: tabular-nums` |
| `--text-price-lg` | Archivo | `1.75rem` / `1.05` | 750 | `-0.025em` | Cart / product page price |
| `--text-unit-price` | IBM Plex Mono | `0.75rem` / `1.4` | 400 | `0` | "KSh 165 / metre" |
| `--text-nav` | IBM Plex Sans | `0.9375rem` / `1` | 500 | `-0.005em` | Navigation |
| `--text-button` | IBM Plex Sans | `0.9375rem` / `1` | 600 | `0` | Buttons |

---

## 6. Spacing, Grid & Breakpoints

4px base scale: `--space-1: 4px` … `--space-24: 96px`. Section rhythm uses
`--space-16` (mobile) → `--space-24` (desktop) vertical padding, deliberately alternating with
`--space-12` between tightly-related blocks to avoid uniform, machine-like section spacing.

- Container: `--container: 1320px`, gutter `clamp(16px, 4vw, 40px)`.
- Desktop grid: 12 columns, 20px gutter. Content grids deliberately use **asymmetric spans**
  (`7/5`, `8/4`, `4/8`) rather than uniform thirds.
- Breakpoints: `sm 640`, `md 768`, `lg 1024`, `xl 1280`, `2xl 1440`.
- Verified widths: 320, 360, 390, 430, 540, 768, 1024, 1280, 1440, 1680, 1920.

---

## 7. Radius, Border, Shadow

Near-square geometry is the signature. Hardware is machined, not inflated.

| Token | Value | Use |
| --- | --- | --- |
| `--radius-xs` | `2px` | Buttons, inputs, badges |
| `--radius-sm` | `3px` | Cards, product tiles, image frames |
| `--radius-md` | `4px` | Popovers, drawers, larger panels |
| `--radius-full` | `999px` | Availability dot only |

Shadows are almost absent:

| Token | Value | Use |
| --- | --- | --- |
| `--shadow-none` | `none` | Default for all surfaces |
| `--shadow-lift` | `0 1px 2px rgb(21 23 25 / 0.05), 0 8px 20px -12px rgb(21 23 25 / 0.18)` | Product card hover lift (2–4px) |
| `--shadow-overlay` | `0 12px 40px -12px rgb(21 23 25 / 0.28)` | Mobile menu, cart drawer, dialogs |

Never a coloured or blue glow. Never a large-radius soft shadow.

---

## 8. Iconography

Lucide, and **only where it carries meaning**. Default `18px` / `1.75` stroke, `20px` in nav,
`16px` inline with text. Icons are never decorative and never sit beside every sentence.

Permitted set for this site: `Search`, `ShoppingBag`, `Menu`, `X`, `ChevronRight`, `ArrowRight`,
`ArrowUpRight`, `Truck`, `ShieldCheck`, `BadgeCheck`, `Smartphone`, `Package`, `Wrench`,
`Hammer`, `Zap`, `Droplets`, `HardHat`, `Ruler`, `Phone`, `MessageCircle`, `MapPin`, `Clock`,
`Minus`, `Plus`, `Trash2`, `Check`, `ChevronDown`.

Category marks use icons **only** where the category has no photograph; photography is preferred.

---

## 9. Components

| Component | Behaviour |
| --- | --- |
| `AnnouncementBar` | 32px tall, `primary-strong` surface, white text. One line, no dismiss button (nothing to dismiss for one message). Mobile shortens the message; "Learn more" hidden < 640px. |
| `Navbar` | Sticky, 64px, white, hairline bottom border on scroll only. Two-row on `lg+`: category rail beneath the primary row. Search is a real input on desktop (≥1024px) and an icon button below it. |
| `MobileMenu` | Full-height panel sliding from the **right** at 320ms, backdrop fades at 200ms, categories listed as hairline-separated rows with counts. Focus trapped; `Esc` closes; body scroll locked. |
| `Hero` | Asymmetric: 5/7 text, 7/7 image, offset baseline, image bleeds to the right viewport edge. Not a centred hero. |
| `TrustStrip` | One continuous hairline-bounded band, 4 items, 16px icons, hairline dividers. Not four cards. |
| `SectionHeading` | Eyebrow (mono caps) + heading + optional right-aligned link. Optional `rule` variant draws a full-bleed hairline above. |
| `ProductCard` | 1px border, `--radius-sm`, image well in `--color-surface`, brand eyebrow, name, price + unit price, compact add-to-cart button revealed on hover and always visible on touch. |
| `ProductGrid` | 4-up `xl`, 3-up `lg`, 2-up `md`, 2-up `sm`, 1-up `<360`. Gaps 20px. |
| `CategoryGrid` | 12-col asymmetric: one 6×2 lead tile + two 3×2 tiles + two 3×1 tiles. |
| `ValueSection` | Split: 5 cols editorial copy, 7 cols numbered proof list on `--color-surface`. |
| `CartDrawer` | Right panel, 400px (`min(400px, 100vw)`), line items with stepper, subtotal, M-Pesa note, checkout + WhatsApp actions. |
| `SearchDialog` | `cmd/ctrl+K`, name/brand/category matching, results grouped, empty state designed. |
| `Footer` | `primary-strong` surface, 4 columns, real contact details, payment rails row. |

### 9.1 Product card rules

1. Price is the second-most-prominent element on the card after the product name; never below the
   fold of the card.
2. **Unit price is mandatory** on every product. `KSh 165 / metre`. Rendered in mono, muted.
3. Availability uses a 6px `--color-success` dot + text. Never a coloured pill.
4. Hover: image `scale(1.025)` over 220ms, border → `--border-strong`, lift 3px, CTA fills accent.
5. Touch devices get no hover dependency; CTA is always rendered and legible.
6. Whole card is not a link — the name is the link. This prevents nested-interactive failure.

---

## 10. Motion

| Token | Value | Use |
| --- | --- | --- |
| `--motion-fast` | `140ms` | Button feedback, icon nudge, chip toggles |
| `--motion-standard` | `220ms` | Hover states, opacity fades, image scale |
| `--motion-emphasis` | `420ms` | Mobile menu, cart drawer, dialogs |
| `--motion-entrance` | `620ms` | Hero headline/CTA reveal |
| `--ease-out` | `cubic-bezier(0.22, 0.61, 0.36, 1)` | Default |
| `--ease-inout` | `cubic-bezier(0.65, 0, 0.35, 1)` | Drawers, two-state |
| `--ease-spring` | `cubic-bezier(0.34, 1.3, 0.64, 1)` | Cart confirmation only, low amplitude |

- Page transitions: 160ms opacity on route change. No slide, no layout animation.
- Section reveals: `whileInView` opacity + 12px translate, once, `-margin: 0px 0px -12% 0px`,
  500ms, 40ms stagger. Disabled for reduced motion.
- Product stagger: 45ms, capped at 8 items.
- **No parallax. No scroll-jacking. No looping ambient animation. Nothing over 620ms.**
- Animations must never delay an interaction; the cart opens on click, not on animation end.

### 10.1 `prefers-reduced-motion: reduce`

All transforms, transitions and entrance animations collapse to `opacity` only, or to instant state
change. The mobile menu appears without translation. The drawer fades. Image hover scale is removed.
Functionality is identical.

---

## 11. Responsive Rules

- **Mobile is the primary target**, not a fallback. Header collapses to logo / search / cart / menu.
- Mobile hero is image-led: text block, then full-bleed image with a controlled crop
  (`object-position` tuned per breakpoint), because the photograph is the proof.
- Product grid goes 1-up only below 360px; 2-up from 360px, which matches real mid-range Android
  widths and keeps prices scannable in pairs.
- No horizontal scroll at any width ≥ 320px. Enforced by audit.
- Touch targets ≥ 44×44px on all interactive elements under 768px. Enforced by audit.
- Base body text never drops below 16px on mobile.
- Sticky mobile add-to-cart bar on the product detail route only.

---

## 12. Accessibility Rules

- Semantic landmarks: `header`, `nav`, `main`, `footer`; one `h1` per page.
- Heading order is never skipped.
- All interactive elements are real `<button>` / `<a>`; no `div onclick`.
- Visible focus: `outline: 2px solid --color-focus; outline-offset: 2px` — never removed.
- Body text ≥ 7:1, muted ≥ 4.6:1, non-text UI ≥ 3:1. Verified in `scripts/audit-contrast.mjs`.
- Icon-only controls always carry `aria-label`.
- `aria-live="polite"` region announces cart changes.
- Mobile menu and cart drawer: `role="dialog"`, `aria-modal`, focus trap, focus restore, `Esc`.
- Images: descriptive `alt`; decorative images use empty `alt=""`.
- `prefers-reduced-motion` honoured globally.
- Colour is never the sole carrier of state (availability has text, not just a dot).

---

## 13. Imagery Rules

- Real photography of real work: hands, tools, materials, sites. Never a suited presenter.
- Hero must read as *labour*, not *advertising*. Chosen frame: a craftsperson drilling at work.
- Product photography is consistent: single subject, uniform 4:3 crop, `--color-surface` well.
- Category photography: real material/tool detail, cropped 3:2, label in an adjacent solid block
  (never text laid over an unpredictable photograph — contrast cannot be guaranteed).
- Photography is never graded with heavy filters, duotone, or colour casts toward the brand blue.
- All hero/category imagery ships AVIF/WebP via `next/image` with explicit dimensions to prevent CLS.
- Every image has real alt text written from its actual content.

---

## 14. Anti-AI Design Rules (enforced)

1. No gradient text. No purple/blue "AI" gradient anywhere.
2. No decorative blobs, orbs, floating shapes, or background grid patterns.
3. No glassmorphism. No `backdrop-blur` panels over photography.
4. No arbitrary bento grids; asymmetry must have a content reason.
5. Radius stays ≤ 4px except the availability dot.
6. No badge stacking. At most one status element per product card.
7. Icons only where they carry meaning.
8. No centred hero with a gradient headline.
9. No fake statistics, testimonials, customer logos, or guarantees.
10. No unmeasured claims ("50% cheaper"). Value claims are operational and verifiable.
11. Motion never exceeds 620ms; nothing loops.
12. Orange never exceeds ~5% of the viewport.
13. No component is shipped with untouched library defaults.
14. No `Lorem ipsum`, no "Product Name", no "Company Name".

---

## 15. Data Architecture

Products, categories and business details live in `data/`. UI components never hardcode product
content. Business contact details come from `config/site.ts` (environment-overridable) so no
phone number is fabricated in source.

```
Product   { id, name, brand, categoryId, price, unit, unitAlt?, image, alt,
            description, specs[], stock, featured, sku, warranty? }
Category  { id, name, blurb, image, scale }
```

`price` is an integer in **KES minor-sequence-free whole shillings**. `unit` is the selling unit
(`metre`, `bag`, `kg`, `piece`, `litre`, `set`, `tin`) and drives the unit-price line everywhere.

All catalogue content is clearly sample data pending real inventory, documented in `README.md`.

---

## 16. Verification Checklist

Script-checked — run `npm run audit` (build + three scripts):

- [x] Contrast computed and asserted by script, not by eye — `scripts/audit-contrast.mjs`
- [x] Token parity between §4.1 and `app/globals.css` — same script
- [x] Heading order, landmarks, `img` alt, accessible names, no raw hex in components —
      `scripts/audit-structure.mjs`, run against the prerendered HTML in `.next/server/app`
- [x] No horizontal overflow, 320 → 1920px — `scripts/audit-layout.mjs`, headless Chrome
      (11 widths × 9 routes)
- [x] Touch targets ≥ 44×44px below 768px — same script, including the three client-only
      overlays (mobile menu, search, cart) opened at 390px
- [x] `prefers-reduced-motion` leaves nothing hidden and nothing animating > 50ms — same
      script, emulated media
- [x] Empty cart, empty search, empty catalogue, empty checkout and 404 states designed

Not scriptable — browser only, and **to be re-run for every new route**:

- [ ] Focus-visible on every interactive element, verified by keyboard traversal
- [ ] Screen-reader semantics reviewed (announcements, dialog focus restore)