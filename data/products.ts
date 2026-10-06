/**
 * Product catalogue — SAMPLE DATA.
 *
 * Prices are representative Kenyan retail prices in whole KSh, not a live feed.
 * `sku` values are Bora's own internal references (not manufacturer part numbers).
 * Everything here is shaped so a real inventory source can replace it without
 * touching a single UI component. See README.md before going live.
 */

export type Unit = "metre" | "piece" | "bag" | "kg" | "tin" | "set" | "kit";

export type Spec = { label: string; value: string };

export type Product = {
  id: string;
  name: string;
  brand: string;
  categoryId: string;
  /** Whole shillings. Never send floats. */
  price: number;
  /** The selling unit — drives the unit-price line everywhere. */
  unit: Unit;
  /** Alternative units for the price-per-unit breakdown, if sold in multiples. */
  /** Precomputed secondary rate, e.g. per kg or per litre. Never divide at render time. */
  unitAlt?: { price: number; unit: string };
  image: string;
  alt: string;
  description: string;
  specs: Spec[];
  /** Units on hand. 0 renders the out-of-stock state. */
  stock: number;
  featured: boolean;
  sku: string;
  warranty?: string;
};

export const products: Product[] = [
  /* ---------------------------------------------------------------- power */
  {
    id: "cordless-drill-18v",
    name: "Cordless Drill Driver, 18V, 2 Batteries + Charger",
    brand: "Makita",
    categoryId: "power-tools",
    price: 24500,
    unit: "kit",
    image: "/img/p-cordless-drill.jpg",
    alt: "A hand holding a cordless drill against a workbench in a workshop",
    description:
      "The everyday site drill. Two 18V batteries mean you finish a day's fixing without waiting on a charger. Brushless motor, 13mm keyless chuck, two-speed.",
    specs: [
      { label: "Voltage", value: "18V" },
      { label: "Chuck", value: "13mm keyless" },
      { label: "Max torque", value: "50 Nm" },
      { label: "In the box", value: "2 batteries, charger, belt clip" },
    ],
    stock: 12,
    featured: true,
    sku: "BH-PT-001",
    warranty: "12 months on the tool, 12 months on batteries",
  },
  {
    id: "rotary-hammer-sds",
    name: "Rotary Hammer Drill, SDS+, 800W",
    brand: "Bosch",
    categoryId: "power-tools",
    price: 15900,
    unit: "piece",
    image: "/img/p-rotary-hammer.jpg",
    alt: "A rotary hammer drill boring into a timber beam",
    description:
      "For chasing channels into masonry and drilling 8–20mm holes in concrete. SDS-plus fitting means the bit twists in and locks — no chuck to lose on site.",
    specs: [
      { label: "Power", value: "800W" },
      { label: "Chuck", value: "SDS-plus" },
      { label: "Max hole", value: "20mm in masonry" },
      { label: "Impact rate", value: "0–4,300 bpm" },
    ],
    stock: 7,
    featured: true,
    sku: "BH-PT-002",
    warranty: "12 months",
  },
  {
    id: "angle-grinder-115",
    name: "Angle Grinder, 115mm Disc, 750W",
    brand: "DeWalt",
    categoryId: "power-tools",
    price: 8500,
    unit: "piece",
    image: "/img/p-angle-grinder.jpg",
    alt: "A worker cutting steel with an angle grinder, sparks flying",
    description:
      "Cuts, grinds and cuts off rebar and plate. Sold as the bare tool — discs and guard are chosen per job, so buy them from the Accessories shelf.",
    specs: [
      { label: "Power", value: "750W" },
      { label: "Disc", value: "115mm" },
      { label: "No-load speed", value: "11,000 rpm" },
      { label: "Sold as", value: "Bare tool" },
    ],
    stock: 18,
    featured: true,
    sku: "BH-PT-003",
    warranty: "12 months",
  },
  {
    id: "arc-welder-200a",
    name: "Arc Welding Machine, 200A Inverter",
    brand: "Ingco",
    categoryId: "power-tools",
    price: 21500,
    unit: "piece",
    image: "/img/p-welder.jpg",
    alt: "A welder working on a steel assembly inside a workshop",
    description:
      "Lightweight inverter set for site fabrication and repair. Runs standard 2.5mm and 3.2mm electrodes off a 13A socket.",
    specs: [
      { label: "Output", value: "200A" },
      { label: "Input", value: "220V / 13A" },
      { label: "Electrode", value: "1.6–3.2mm" },
      { label: "Duty cycle", value: "60% at 200A" },
    ],
    stock: 5,
    featured: false,
    sku: "BH-PT-004",
    warranty: "12 months",
  },

  /* ----------------------------------------------------------------- hand */
  {
    id: "claw-hammer-16oz",
    name: "Claw Hammer, 16oz, Fibreglass Handle",
    brand: "Stanley",
    categoryId: "hand-tools",
    price: 1250,
    unit: "piece",
    image: "/img/p-claw-hammer.jpg",
    alt: "A claw hammer mid-swing over a concrete surface",
    description:
      "The hammer you actually reach for. Forged head, rubber-gripped fibreglass shaft, and a claw that pulls nails without shearing the head.",
    specs: [
      { label: "Head", value: "16oz forged steel" },
      { label: "Handle", value: "Fibreglass, rubber grip" },
      { label: "Length", value: "330mm" },
    ],
    stock: 40,
    featured: true,
    sku: "BH-HT-001",
  },
  {
    id: "hand-saw-20in",
    name: "Hand Saw, 20in Crosscut",
    brand: "Stanley",
    categoryId: "hand-tools",
    price: 1850,
    unit: "piece",
    image: "/img/p-hand-saw.jpg",
    alt: "A crosscut hand saw cutting into a log",
    description:
      "Crosscut teeth for clean cuts across timber. Tapered body so the tip doesn't bind as you close the cut.",
    specs: [
      { label: "Length", value: "500mm / 20in" },
      { label: "Teeth", value: "11 TPI crosscut" },
      { label: "Back", value: "Tri-fold" },
    ],
    stock: 22,
    featured: false,
    sku: "BH-HT-002",
  },
  {
    id: "tool-box-20in",
    name: "20in Plastic Tool Box, 5 Compartments",
    brand: "Total",
    categoryId: "hand-tools",
    price: 4200,
    unit: "piece",
    image: "/img/p-toolbox-set.jpg",
    alt: "Hand tools arranged in a grey plastic toolbox",
    description:
      "Site box with a steel carry handle and five compartments. Stacks with others, which matters when one person owns three.",
    specs: [
      { label: "Capacity", value: "20in / 50cm" },
      { label: "Compartments", value: "5" },
      { label: "Latches", value: "Steel, lockable" },
    ],
    stock: 9,
    featured: true,
    sku: "BH-HT-003",
  },

  /* ------------------------------------------------------------ electrical */
  {
    id: "cable-25-single-core",
    name: "Single Core Copper Cable, 2.5mm²",
    brand: "Nexans",
    categoryId: "electrical",
    price: 165,
    unit: "metre",
    image: "/img/p-cable-25.jpg",
    alt: "A bundle of copper electrical wires",
    description:
      "Copper, not copper-clad. Cut to the metre you need from the reel — tell us the total length when you order and we cut it.",
    specs: [
      { label: "Conductor", value: "Copper, class 2" },
      { label: "Core", value: "1 core" },
      { label: "Insulation", value: "PVC, 450/750V" },
      { label: "Colour", value: "Red / black / brown" },
    ],
    stock: 2400,
    featured: true,
    sku: "BH-EL-001",
  },
  {
    id: "cable-4-single-core",
    name: "Single Core Copper Cable, 4mm²",
    brand: "Nexans",
    categoryId: "electrical",
    price: 265,
    unit: "metre",
    image: "/img/p-cable-4.jpg",
    alt: "Copper cable bundled and coiled at an electrical installation",
    description:
      "The size most sub-boards land on. Same copper, same reel-cutting service as the 2.5mm².",
    specs: [
      { label: "Conductor", value: "Copper, class 2" },
      { label: "Core", value: "1 core" },
      { label: "Insulation", value: "PVC, 450/750V" },
      { label: "Colour", value: "Red / black / brown" },
    ],
    stock: 1800,
    featured: false,
    sku: "BH-EL-002",
  },
  {
    id: "energy-meter-100a",
    name: "Single Phase Energy Meter, 100A",
    brand: "Landis+Gyr",
    categoryId: "electrical",
    price: 3400,
    unit: "piece",
    image: "/img/p-energy-meter.jpg",
    alt: "A row of single-phase electricity meters on a wall",
    description:
      "Class 1 accuracy single-phase meter for a 100A incomer. Bring your old meter number and connection details when you collect.",
    specs: [
      { label: "Rating", value: "100A single phase" },
      { label: "Accuracy", value: "Class 1" },
      { label: "Enclosure", value: "IP54" },
    ],
    stock: 6,
    featured: false,
    sku: "BH-EL-003",
  },
  {
    id: "switch-16a",
    name: "Surface Switch, 16A, 2 Gang",
    brand: "Hager",
    categoryId: "electrical",
    price: 320,
    unit: "piece",
    image: "/img/p-switch-16a.jpg",
    alt: "Close-up of wall-mounted light switches",
    description:
      "Two-gang surface switch on a 1-module plate. Screws and terminals included.",
    specs: [
      { label: "Rating", value: "16AX" },
      { label: "Gangs", value: "2" },
      { label: "Plate", value: "Surface, 1 module" },
    ],
    stock: 85,
    featured: false,
    sku: "BH-EL-004",
  },

  /* ------------------------------------------------------------- plumbing */
  {
    id: "pvc-pipe-4in",
    name: "PVC Pressure Pipe, 4in, 6m Length",
    brand: "Kenia Plasson",
    categoryId: "plumbing",
    price: 2150,
    unit: "piece",
    image: "/img/p-pvc-pipe.jpg",
    alt: "Plastic plumbing pipes stacked against a wall",
    description:
      "Sold as a full 6 metre length — we don't cut pipe to length because a cut pressure pipe is a warranty problem. Fittings sold separately.",
    specs: [
      { label: "Diameter", value: "4in / 110mm" },
      { label: "Length", value: "6m" },
      { label: "Pressure", value: "PN16" },
      { label: "Standard", value: "KS" },
    ],
    stock: 54,
    featured: true,
    sku: "BH-PL-001",
  },
  {
    id: "galv-pipe-1in",
    name: "Galvanised Pipe, 1in, 6m Length",
    brand: "Simba",
    categoryId: "plumbing",
    price: 3600,
    unit: "piece",
    image: "/img/p-galv-pipe.jpg",
    alt: "Galvanised metal pipes fixed to an interior wall",
    description:
      "Threaded both ends for water supply and general service. Ask us to cut and re-thread to your measurement.",
    specs: [
      { label: "Diameter", value: "1in BSP" },
      { label: "Length", value: "6m" },
      { label: "Standard", value: "IS 1239" },
      { label: "Finish", value: "Galvanised, threaded" },
    ],
    stock: 31,
    featured: false,
    sku: "BH-PL-002",
  },

  /* ------------------------------------------------------ building materials */
  {
    id: "cement-50kg",
    name: "Portland Cement, 50kg Bag",
    brand: "EAPC",
    categoryId: "building-materials",
    price: 950,
    unit: "bag",
    unitAlt: { price: 19, unit: "kg" },
    image: "/img/p-cement.jpg",
    alt: "Stacked bags of cement in a hardware store",
    description:
      "Nakuru-made Portland cement for general work — blocks, screed, mortar. Pallets available for site orders.",
    specs: [
      { label: "Net weight", value: "50kg" },
      { label: "Type", value: "Portland, CEM I" },
      { label: "Bags", value: "25 or 40 per pallet" },
    ],
    stock: 420,
    featured: true,
    sku: "BH-BM-001",
  },
  {
    id: "concrete-block-7in",
    name: "Solid Concrete Block, 7in",
    brand: "Corobrik",
    categoryId: "building-materials",
    price: 130,
    unit: "piece",
    image: "/img/p-blocks.jpg",
    alt: "Stacked concrete building blocks at a block yard",
    description:
      "Load-bearing solid block for wall construction. Loose price shown — a full pallet drops the unit price.",
    specs: [
      { label: "Size", value: "7in (225mm) hollow-free solid" },
      { label: "Strength", value: "7N/mm²" },
      { label: "Per pallet", value: "720 blocks" },
    ],
    stock: 5400,
    featured: false,
    sku: "BH-BM-002",
  },
  {
    id: "nails-common-35",
    name: "Common Nails 3.5in, 1kg",
    brand: "Simba",
    categoryId: "building-materials",
    price: 240,
    unit: "kg",
    image: "/img/p-nails.jpg",
    alt: "Loose common nails and construction fixings",
    description:
      "Sold by weight because that's how you buy them. Roughly 1,100 nails to the kilogram.",
    specs: [
      { label: "Length", value: "3.5in / 90mm" },
      { label: "Head", value: "Flat, checkered" },
      { label: "Material", value: "Mild steel" },
    ],
    stock: 310,
    featured: false,
    sku: "BH-BM-003",
  },
  {
    id: "timber-hardwood",
    name: "Hardwood Timber, 2x4 x 8ft",
    brand: "Kilifi Timber",
    categoryId: "building-materials",
    price: 1950,
    unit: "piece",
    image: "/img/p-timber.jpg",
    alt: "Seasoned timber in a carpentry workshop",
    description:
      "Planed hardwood for formwork and framing. Longer lengths and treated timber quoted separately.",
    specs: [
      { label: "Section", value: "2x4in nominal" },
      { label: "Length", value: "8ft / 2.4m" },
      { label: "Finish", value: "Planed, untreated" },
    ],
    stock: 96,
    featured: false,
    sku: "BH-BM-004",
  },

  /* ----------------------------------------------------------------- paint */
  {
    id: "paint-emulsion-5l",
    name: "Interior Emulsion Paint, 5L",
    brand: "Dulux",
    categoryId: "building-materials",
    price: 4200,
    unit: "tin",
    unitAlt: { price: 840, unit: "litre" },
    image: "/img/p-paint.jpg",
    alt: "A paint bucket with emulsion being mixed",
    description:
      "Washable matt emulsion for interior walls. 5 litres covers roughly 50m² in two coats — check your wall area before you buy.",
    specs: [
      { label: "Volume", value: "5L" },
      { label: "Finish", value: "Matt, washable" },
      { label: "Coverage", value: "~50m² in 2 coats" },
      { label: "Base", value: "Water" },
    ],
    stock: 64,
    featured: true,
    sku: "BH-BM-005",
  },

  /* ---------------------------------------------------------------- safety */
  {
    id: "safety-helmet-vented",
    name: "Safety Helmet, Vented ABS",
    brand: "3M",
    categoryId: "safety-workwear",
    price: 2400,
    unit: "piece",
    image: "/img/p-helmet.jpg",
    alt: "A worker on site wearing a hard hat",
    description:
      "Vented shell with a ratchet harness and chin strap. Fits over most safety glasses.",
    specs: [
      { label: "Shell", value: "ABS, vented" },
      { label: "Harness", value: "6-point ratchet" },
      { label: "Sizing", value: "53–64cm" },
    ],
    stock: 48,
    featured: false,
    sku: "BH-SF-001",
  },
  {
    id: "fire-extinguisher-6kg",
    name: "Fire Extinguisher, 6kg CO₂",
    brand: "Chubb",
    categoryId: "safety-workwear",
    price: 5900,
    unit: "piece",
    image: "/img/p-extinguisher.jpg",
    alt: "A fire extinguisher mounted on a wall",
    description:
      "CO₂ extinguisher for electrical and flammable-liquid fires. Comes with a wall bracket.",
    specs: [
      { label: "Agent", value: "CO₂" },
      { label: "Capacity", value: "6kg" },
      { label: "Mount", value: "Wall bracket included" },
      { label: "Certification", value: "Inspected and tagged" },
    ],
    stock: 17,
    featured: false,
    sku: "BH-SF-002",
  },
];

/* ------------------------------------------------------------------ queries */

export const getProduct = (id: string) => products.find((p) => p.id === id);

export const featuredProducts = () => products.filter((p) => p.featured);

export const productsByCategory = (categoryId: string) =>
  products.filter((p) => p.categoryId === categoryId);

export const countByCategory = () => {
  const map: Record<string, number> = {};
  for (const p of products) map[p.categoryId] = (map[p.categoryId] ?? 0) + 1;
  return map;
};

export const inStockCount = () => products.filter((p) => p.stock > 0).length;