/**
 * Categories.
 *
 * Only categories the business actually trades in. `blurb` is written for the
 * buyer, not for search engines.
 */

export type Category = {
  id: string;
  name: string;
  /** Short, plain, Kenyan-friendly. Shown under the category name. */
  blurb: string;
  image: string;
  /** Grid emphasis: lead tiles are visually larger on desktop. */
  scale: "lead" | "tall" | "wide";
};

export const categories: Category[] = [
  {
    id: "power-tools",
    name: "Power Tools",
    blurb: "Drills, grinders, saws, chargers and batteries.",
    image: "/img/cat-power-tools.jpg",
    scale: "lead",
  },
  {
    id: "hand-tools",
    name: "Hand Tools",
    blurb: "Hammers, spanners, saws, chisels and tool boxes.",
    image: "/img/cat-hand-tools.jpg",
    scale: "tall",
  },
  {
    id: "electrical",
    name: "Electrical",
    blurb: "Copper cable, switches, fittings and boards.",
    image: "/img/cat-electrical.jpg",
    scale: "tall",
  },
  {
    id: "plumbing",
    name: "Plumbing",
    blurb: "PVC and galvanised pipe, fittings, valves, taps.",
    image: "/img/cat-plumbing.jpg",
    scale: "wide",
  },
  {
    id: "building-materials",
    name: "Building Materials",
    blurb: "Cement, blocks, nails, timber, reinforcement and paint.",
    image: "/img/cat-building-materials.jpg",
    scale: "wide",
  },
  {
    id: "safety-workwear",
    name: "Safety & Workwear",
    blurb: "Helmets, gloves, goggles, extinguishers and signage.",
    image: "/img/cat-safety-workwear.jpg",
    scale: "wide",
  },
  {
    id: "hardware-accessories",
    name: "Hardware & Accessories",
    blurb: "Screws, anchors, brackets, abrasives and consumables.",
    image: "/img/cat-hardware-accessories.jpg",
    scale: "wide",
  },
];

export const getCategory = (id: string) => categories.find((c) => c.id === id);