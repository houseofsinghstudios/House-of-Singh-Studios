import type { Metadata } from "next";
import AILabClient from "@/components/ai/AILabClient";

export const metadata: Metadata = {
  title: "AI Lab — House of Singh Studios",
  description:
    "See how AI powers our design process. Try our Brand Pulse Check for a free 30-second brand assessment powered by AI.",
  openGraph: {
    title: "AI Lab — House of Singh Studios",
    description:
      "See how AI powers our design process. Try our Brand Pulse Check for a free 30-second brand assessment powered by AI.",
  },
};

export default function AILabPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "AI Lab",
            description:
              "See how AI powers the design process at House of Singh Studios. Interactive brand assessment tool and AI capabilities overview.",
            url: "https://studios.houseofsingh.com/ai",
            isPartOf: {
              "@type": "WebSite",
              name: "House of Singh Studios",
              url: "https://studios.houseofsingh.com",
            },
          }),
        }}
      />
      <AILabClient />
    </>
  );
}
