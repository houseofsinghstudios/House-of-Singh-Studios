import { ViewTransitions } from "next-view-transitions";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "../globals.css";
import "@/styles/scroll-animations.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FooterReveal from "@/components/layout/FooterReveal";
import ClientShell from "@/components/ClientShell";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import MicrosoftClarity from "@/components/MicrosoftClarity";
import ConsentManager from "@/components/consent/ConsentManager";
import { STUDIO_EMAIL } from "@/lib/constants/contact";
import { AREA_SERVED, ORG_ID, PERSON_ID, orgRef, personRef } from "@/lib/schema";
import { FOUNDER_PROFILES, STUDIO_PROFILES, profileUrls } from "@/lib/constants/profiles";
import { jsonLd } from "@/lib/json-ld";

// The website shell: site CSS, header, footer and client behaviour for every site page.
// /studio lives in the (studio) group, so none of this ever loads there.
// Google Analytics and Microsoft Clarity load on the production deployment only: never locally or on
// previews. Clarity also checks the hostname in the browser, so the vercel.app address sends nothing.
const analyticsEnabled = process.env.VERCEL_ENV === "production";

// No telephone: the studio publishes no phone number.
const SITE_GRAPH = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["ProfessionalService", "Organization"],
      "@id": ORG_ID,
      name: "House of Singh Studios",
      url: "https://studios.houseofsingh.com",
      logo: "https://studios.houseofsingh.com/hos-studios-logo.svg",
      image: "https://studios.houseofsingh.com/share-image.png",
      description:
        "Brand identity and design studio in Toronto. We change how businesses are seen, chosen and valued through strategy, identity, digital design and visual media, led by creative direction, with AI built into how the studio works.",
      email: STUDIO_EMAIL,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Toronto",
        addressRegion: "ON",
        addressCountry: "CA",
      },
      areaServed: AREA_SERVED,
      knowsAbout: ["brand identity design", "rebranding", "brand strategy", "website design", "brand photography", "video production", "packaging design"],
      sameAs: profileUrls(STUDIO_PROFILES),
      founder: personRef,
      numberOfEmployees: { "@type": "QuantitativeValue", value: "1-10" },
      foundingDate: "2024",
      priceRange: "$$$$",
    },
    {
      "@type": "Person",
      "@id": PERSON_ID,
      name: "Maninder Singh",
      jobTitle: "Founder and Creative Director",
      honorificSuffix: "RGD",
      url: "https://houseofsingh.com",
      worksFor: orgRef,
      ...(profileUrls(FOUNDER_PROFILES).length > 0 ? { sameAs: profileUrls(FOUNDER_PROFILES) } : {}),
    },
  ],
};

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ViewTransitions>
      {/* First focusable element on every site page. Hidden until focused. /studio never loads this layout. */}
      <a href="#main-content" className="skip-link">Skip to content</a>
      <div className="scroll-progress" />
      <ClientShell />
      <Header />
      <div className="site-content-wrap">
        <main id="main-content" tabIndex={-1}>{children}</main>
        {analyticsEnabled && <ConsentManager />}
        <Footer consentEnabled={analyticsEnabled} />
      </div>
      <FooterReveal />
      <SpeedInsights />
      {analyticsEnabled && <GoogleAnalytics />}
      {analyticsEnabled && <MicrosoftClarity />}
      {/* The studio and its founder, on every site page. Other nodes reference them by @id. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(SITE_GRAPH) }}
      />
    </ViewTransitions>
  );
}
