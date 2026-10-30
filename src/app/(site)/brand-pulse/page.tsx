import type { Metadata } from "next";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import BrandPulse from "@/components/brand-pulse/BrandPulse";
import PulseResultView from "@/components/brand-pulse/PulseResultView";
import Button from "@/components/ui/Button";
import { decode } from "@/lib/brand-pulse/codec";
import { parsePrefill } from "@/lib/brand-pulse/entry";
import { INTRO, PAGE, SHARED } from "@/lib/brand-pulse/content";
import { assess } from "@/lib/brand-pulse/engine";
import { studioTitle, WEBSITE_OG } from "@/lib/seo";

const URL = "https://studios.houseofsingh.com/brand-pulse";

type Props = { searchParams: Promise<{ r?: string | string[]; q?: string | string[] }> };

// Shared results (?r=) are not indexed and point search engines at the check itself.
export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { r } = await searchParams;
  return {
    title: PAGE.title,
    description: PAGE.description,
    alternates: { canonical: URL },
    openGraph: { ...WEBSITE_OG, title: studioTitle(PAGE.title), description: PAGE.description, url: URL },
    ...(r !== undefined ? { robots: { index: false, follow: true } } : {}),
  };
}

export default async function BrandPulsePage({ searchParams }: Props) {
  const { r, q } = await searchParams;
  const shared = decode(Array.isArray(r) ? r[0] : r);
  // ?q= preselects one answer and starts at question 1; invalid values are ignored.
  const prefill = parsePrefill(q);

  return (
    <>
      <BreadcrumbSchema items={[
        { name: "Home", url: "https://studios.houseofsingh.com" },
        { name: PAGE.title, url: URL },
      ]} />
      <section className="bp-page" style={{ padding: "var(--hero-pt) var(--page-px) clamp(80px, 10vw, 140px)" }}>
        {shared ? (
          // A shared result: the answers come from the link, with no personal data and no reading screen.
          <div className="bp-root">
            <h1 className="sr-only">{SHARED.hiddenHeading}</h1>
            <p className="editorial-label bp-label">{INTRO.label}</p>
            <PulseResultView result={assess(shared)} />
            <div className="bp-shared-actions">
              <Button href="/brand-pulse" variant="primary" data-cursor="link">
                {SHARED.button}
              </Button>
            </div>
          </div>
        ) : (
          <BrandPulse headingLevel="h1" prefill={prefill} />
        )}
      </section>
    </>
  );
}
