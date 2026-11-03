// Structured data shared across the site: the stable ids of the studio and its founder, which other
// nodes reference instead of repeating them, and the area the studio serves. The full studio and
// founder nodes are on every site page (src/lib/site-graph.ts), so every reference resolves.

export const SITE_URL = "https://studios.houseofsingh.com";
export const ORG_ID = `${SITE_URL}/#organization`;
// The founder's id belongs to houseofsingh.com, his own site, and is shared with it, so search
// engines and AI assistants see one person on both sites.
export const PERSON_ID = "https://houseofsingh.com/#maninder-singh";

// House of Singh, the founder's creative practice and the studio's parent brand. Like the founder,
// it belongs to houseofsingh.com; the studio is a venture of it.
export const PARENT_ORG_ID = "https://houseofsingh.com/#organization";

export const orgRef = { "@id": ORG_ID };
export const personRef = { "@id": PERSON_ID };

// The Greater Toronto Area, then Ontario and Canada.
export const AREA_SERVED = [
  ...["Toronto", "Mississauga", "Brampton", "Oakville", "Vaughan", "Markham"].map((name) => ({ "@type": "City", name })),
  { "@type": "State", name: "Ontario" },
  { "@type": "Country", name: "Canada" },
];

// The short, descriptive name of each service: the Service schema's serviceType and the visible
// text of "Services delivered" links on case studies.
export const SERVICE_TERMS: Record<string, string> = {
  "brand-identity": "Brand identity design",
  "visual-media": "Brand photography and video",
  "digital-design": "Website design",
  "creative-strategy": "Brand strategy",
};
