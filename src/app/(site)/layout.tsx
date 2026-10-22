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

// The website shell: site CSS, header, footer and client behaviour for every site page.
// /studio lives in the (studio) group, so none of this ever loads there.
// Google Analytics and Microsoft Clarity load on the production deployment only: never locally or on
// previews. Clarity also checks the hostname in the browser, so the vercel.app address sends nothing.
const analyticsEnabled = process.env.VERCEL_ENV === "production";

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": ["LocalBusiness", "Organization"],
            "name": "House of Singh Studios",
            "url": "https://studios.houseofsingh.com",
            "logo": "https://studios.houseofsingh.com/hos-studios-logo.svg",
            "description": "A design studio powered by AI systems and led by creative direction. Brand identity, visual media, digital design, and creative strategy for established businesses.",
            "email": STUDIO_EMAIL,
            "founder": {
              "@type": "Person",
              "name": "Maninder Singh",
              "jobTitle": "Founder and Creative Director",
              "url": "https://houseofsingh.com"
            },
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Toronto",
              "addressRegion": "ON",
              "addressCountry": "CA"
            },
            "areaServed": [
              { "@type": "City", "name": "Toronto" },
              { "@type": "Country", "name": "Canada" },
              { "@type": "Country", "name": "United States" }
            ],
            "sameAs": [
              "https://instagram.com/houseofsinghstudios",
              "https://linkedin.com/company/houseofsinghstudios",
              "https://x.com/hosdesignstudio"
            ],
            "numberOfEmployees": {
              "@type": "QuantitativeValue",
              "value": "1-10"
            },
            "foundingDate": "2024",
            "priceRange": "$$$$"
          })
        }}
      />
    </ViewTransitions>
  );
}
