// The studio's and the founder's public profiles, for structured data (sameAs). Empty entries are
// left out of the page. The footer keeps its own social links.
export const STUDIO_PROFILES = {
  instagram: "https://instagram.com/houseofsinghstudios",
  linkedin: "https://linkedin.com/company/houseofsinghstudios",
  x: "https://x.com/hosdesignstudio",
  // TODO: the studio's Clutch profile URL, once confirmed.
  clutch: "",
  // TODO: the studio's DesignRush profile URL, once confirmed.
  designRush: "",
};

export const FOUNDER_PROFILES = {
  // TODO: Maninder Singh's RGD member profile URL, once confirmed.
  rgd: "",
  // TODO: Maninder Singh's personal LinkedIn URL, once confirmed.
  linkedin: "",
};

export const profileUrls = (profiles: Record<string, string>): string[] => Object.values(profiles).filter(Boolean);
