// "(0N) Questions" on a service page, after Related work, in the editorial split of "Across the GTA":
// label, heading and a note offering a discovery call on the left, the accordion on the right (the
// same accordion as the Initiatives and Partners questions: all closed, each question an h3). The
// answers are in the server HTML while closed. Links written in an answer render as links; the
// FAQPage structured data carries the same words as plain text. Renders nothing without questions.
import ServiceDetailAccordion from "./ServiceDetailAccordion";
import EditorialLabel from "@/components/ui/EditorialLabel";
import FaqSchema from "@/components/FaqSchema";
import InlineLinks from "@/components/InlineLinks";
import { plainText } from "@/lib/inline-links";
import { DISCOVERY_CALL_URL } from "@/lib/constants/booking";
import type { ServiceFaq } from "@/data/services";
import "@/components/initiatives/initiatives.css";

const NOTE = `Have a question that is not here? [Book a 30 minute discovery call](${DISCOVERY_CALL_URL}).`;

export default function ServiceQuestions({ faqs, number }: { faqs?: ServiceFaq[]; number: string }) {
  if (!faqs || faqs.length === 0) return null;
  const steps = faqs.map((f, i) => ({ step: String(i + 1).padStart(2, "0"), name: f.question, description: <InlineLinks text={f.answer} /> }));
  return (
    <section
      className="init-section init-split init-split--note"
      aria-labelledby="questions-heading"
      style={{ padding: "clamp(48px, 8vw, 96px) var(--page-px)" }}
    >
      <FaqSchema questions={faqs.map((f) => ({ q: f.question, a: plainText(f.answer) }))} />
      <div className="init-split-head">
        <div className="css-reveal">
          <EditorialLabel number={number} text="Questions" className="mb-6" />
        </div>
        <h2 id="questions-heading" className="svcd-process-heading css-reveal" style={{ transitionDelay: "80ms" }}>
          Questions, answered
        </h2>
      </div>
      <div className="init-split-body css-reveal" style={{ transitionDelay: "160ms" }}>
        <ServiceDetailAccordion steps={steps} initialOpen={-1} headingLevel="h3" variant="questions" />
      </div>
      <p className="init-split-intro init-split-note css-reveal" style={{ transitionDelay: "160ms" }}>
        <InlineLinks text={NOTE} />
      </p>
    </section>
  );
}
