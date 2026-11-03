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
import { jsonLd } from "@/lib/json-ld";
import { siteGraph } from "@/lib/site-graph";
import { getFounderImageUrl } from "@/lib/sanity/queries";

// The website shell: site CSS, header, footer and client behaviour for every site page.
// /studio lives in the (studio) group, so none of this ever loads there.
// Google Analytics and Microsoft Clarity load on the production deployment only: never locally or on
// previews. Clarity also checks the hostname in the browser, so the vercel.app address sends nothing.
const analyticsEnabled = process.env.VERCEL_ENV === "production";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const founderImage = await getFounderImageUrl();
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
        dangerouslySetInnerHTML={{ __html: jsonLd(siteGraph({ founderImage })) }}
      />
    </ViewTransitions>
  );
}
