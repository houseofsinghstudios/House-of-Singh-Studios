// /initiatives/<slug>/share-image: the initiative's logo centred on Silver Mist with the studio name
// beneath, 1200 by 630. The page's metadata points here only when a logo is set (see
// src/lib/initiatives/share.ts). Without a logo, or if Sanity or the logo file cannot be read, this
// redirects to the site wide default share image.
import { NextResponse } from "next/server";
import { programmePage } from "@/lib/initiatives/pages";
import { initiativeLogo } from "@/lib/initiatives/types";
import { getInitiativesForPage } from "@/lib/sanity/initiatives";
import { logoShareImage } from "@/lib/og/share-image";
import { DEFAULT_SHARE_IMAGE } from "@/lib/seo";

type Context = { params: Promise<{ slug: string }> };

export async function GET(request: Request, { params }: Context) {
  const { slug } = await params;
  const fallback = () => NextResponse.redirect(new URL(DEFAULT_SHARE_IMAGE.url, request.url));
  try {
    const initiative = programmePage(slug, await getInitiativesForPage());
    const logo = initiative ? initiativeLogo(initiative, "light") : undefined;
    if (!logo) return fallback();
    const file = await fetch(logo.url, { signal: AbortSignal.timeout(8000) });
    if (!file.ok) return fallback();
    const type = logo.svg ? "image/svg+xml" : "image/png";
    const src = `data:${type};base64,${Buffer.from(await file.arrayBuffer()).toString("base64")}`;
    return await logoShareImage({ src, width: logo.width, height: logo.height });
  } catch {
    return fallback();
  }
}
