export const siteConfig = {
  name: "House of Singh Studios",
  description:
    "AI powered design studio delivering brand identity, visual media, digital design, and creative strategy across North America.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://studios.houseofsingh.com",
  email: "studio@houseofsingh.com",
  location: "Toronto, Canada",
  stats: {
    projects: "110+",
    years: "12+",
    fewerRevisions: "40%",
  },
  social: {
    instagram: "https://instagram.com/houseofsingh",
    linkedin: "https://linkedin.com/company/houseofsingh",
  },
  nav: [
    { label: "Services", href: "/services" },
    { label: "Work", href: "/work" },
    { label: "AI", href: "/ai" },
    { label: "Journal", href: "/insights" },
    { label: "About", href: "/about" },
    { label: "Packages", href: "/packages" },
    { label: "Contact", href: "/contact" },
  ],
};
