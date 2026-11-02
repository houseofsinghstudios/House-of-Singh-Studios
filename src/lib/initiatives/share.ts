// The share image for an initiative's page. With a logo set in Sanity: the logo image drawn by
// /initiatives/<slug>/share-image, versioned by the logo file so a new logo is a new URL. Without
// one: the site wide default, exactly as before logos existed.
import { DEFAULT_SHARE_IMAGE, STUDIO_NAME } from "@/lib/seo";
import { initiativeLogo, type Initiative } from "./types";

export function initiativeShareImage(initiative: Pick<Initiative, "name" | "slug" | "logo" | "logoOnDark">) {
  const logo = initiativeLogo(initiative, "light");
  if (!logo) return DEFAULT_SHARE_IMAGE;
  const version = (logo.url.split("/").pop() || "").split(/[-.?]/)[0].slice(0, 12);
  return {
    url: `/initiatives/${initiative.slug}/share-image${version ? `?v=${version}` : ""}`,
    width: 1200,
    height: 630,
    type: "image/png",
    alt: `${initiative.name}, an initiative by ${STUDIO_NAME}.`,
  };
}
