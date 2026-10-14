import type { CaseStudyBlock } from "@/data/projectDetails";
import BlockBody from "./BlockBody";

type Statement = Extract<CaseStudyBlock, { type: "statement" }>;

// A large statement, with optional supporting text beside it. No quotation marks are added.
export default function StatementBlock({ block }: { block: Statement }) {
  const hasBody = Boolean(block.body && block.body.length > 0);
  return (
    <section className={`cs-block cs-block--rule cs-block-grid cs-statement${hasBody ? " cs-statement--with-body" : ""}`}>
      <p className="cs-statement-quote css-reveal">{block.quote}</p>
      {hasBody && <BlockBody value={block.body} className="cs-statement-body" />}
    </section>
  );
}
