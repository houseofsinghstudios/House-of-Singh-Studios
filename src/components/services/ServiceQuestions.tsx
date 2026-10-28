// "(0N) Questions" on a service page, after Related work: the same accordion as the Initiatives and
// Partners questions (ServiceDetailAccordion, all closed, each question an h3), with the answers in
// the server HTML while closed. Links written in an answer render as links; the FAQPage structured
// data carries the same words as plain text. Renders nothing when a service has no questions.
import ServiceDetailAccordion from "./ServiceDetailAccordion";
import FaqSchema from "@/components/FaqSchema";
import InlineLinks from "@/components/InlineLinks";
import { plainText } from "@/lib/inline-links";
import type { ServiceFaq } from "@/data/services";

export default function ServiceQuestions({ faqs, number }: { faqs?: ServiceFaq[]; number: string }) {
  if (!faqs || faqs.length === 0) return null;
  const steps = faqs.map((f, i) => ({ step: String(i + 1).padStart(2, "0"), name: f.question, description: <InlineLinks text={f.answer} /> }));
  return (
    <section aria-labelledby="questions-heading" style={{ padding: "clamp(48px, 8vw, 96px) var(--page-px)" }}>
      <FaqSchema questions={faqs.map((f) => ({ q: f.question, a: plainText(f.answer) }))} />
      <p className="editorial-label css-reveal" style={{ margin: "0 0 16px" }}>
        ({number}) Questions
      </p>
      <h2 id="questions-heading" className="svcd-process-heading css-reveal" style={{ transitionDelay: "80ms" }}>
        Questions, answered
      </h2>
      <div className="css-reveal" style={{ transitionDelay: "160ms" }}>
        <ServiceDetailAccordion steps={steps} initialOpen={-1} headingLevel="h3" variant="questions" />
      </div>
    </section>
  );
}
