// FAQPage structured data. Pass the same questions the page shows, so the markup matches the
// visible text exactly. No ratings, results or other claims.
import { jsonLd } from "@/lib/json-ld";

export default function FaqSchema({ questions }: { questions: { q: string; a: string }[] }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: questions.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(data) }} />;
}
