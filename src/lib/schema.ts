// Structured data shared across the site: the stable ids of the studio and its founder, which other
// nodes reference instead of repeating them, and the area the studio serves. The full studio and
// founder nodes are on every site page (src/app/(site)/layout.tsx), so every reference resolves.

export const SITE_URL = "https://studios.houseofsingh.com";
export const ORG_ID = `${SITE_URL}/#organization`;
export const PERSON_ID = `${SITE_URL}/#maninder-singh`;

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
