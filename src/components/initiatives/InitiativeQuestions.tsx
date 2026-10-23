// Questions on an Initiatives page: the service page accordion, all closed at first, each question an
// h3. The answers are in the server HTML even while closed, and the FAQPage structured data is built
// from the same list, so search engines, answer engines and visitors read the same words.
import ServiceDetailAccordion from "@/components/services/ServiceDetailAccordion";
import FaqSchema from "@/components/FaqSchema";
import type { Question } from "@/lib/initiatives/content";

export default function InitiativeQuestions({ questions }: { questions: Question[] }) {
  const steps = questions.map((q, i) => ({ step: String(i + 1).padStart(2, "0"), name: q.q, description: q.a }));
  return (
    <>
      <FaqSchema questions={questions} />
      <div className="css-reveal" style={{ transitionDelay: "160ms" }}>
        <ServiceDetailAccordion steps={steps} initialOpen={-1} headingLevel="h3" />
      </div>
    </>
  );
}
