// /llms.txt, built when the site builds and refreshed hourly like the sitemap, so new articles appear
// without a deploy. Plain text; not listed in the sitemap.
import { buildLlmsTxt } from "@/lib/llms";
import { getLlmsArticles } from "@/lib/sanity/articles";

export const revalidate = 3600;

export async function GET() {
  return new Response(buildLlmsTxt(await getLlmsArticles()), {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
