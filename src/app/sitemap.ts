import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://studios.houseofsingh.com";

  const staticPages = [
    "",
    "/services",
    "/services/brand-identity",
    "/services/visual-media",
    "/services/digital-design",
    "/services/creative-strategy",
    "/work",
    "/work/tedxtoronto",
    "/work/meridian",
    "/work/soulbound",
    "/work/nomad-kitchen",
    "/about",
    "/contact",
    "/ai",
    "/packages",
    "/insights",
    "/careers",
    "/privacy",
  ];

  return staticPages.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "weekly" : path === "/privacy" ? "yearly" : "monthly",
    priority: path === "" ? 1.0 : path === "/services" || path === "/work" || path === "/contact" ? 0.9 : path === "/privacy" ? 0.3 : 0.7,
  }));
}
