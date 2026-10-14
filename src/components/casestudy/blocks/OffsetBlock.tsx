import type { CaseStudyBlock } from "@/data/projectDetails";
import BlockBody from "./BlockBody";
import BlockMedia from "./BlockMedia";

type Offset = Extract<CaseStudyBlock, { type: "offset" }>;

// Three part asymmetric band: heading, body, image, all on a shared bottom line.
export default function OffsetBlock({ block }: { block: Offset }) {
  return (
    <section className="cs-block cs-block--rule cs-block-grid cs-offset">
      <BlockMedia image={block.image} span={4} className="cs-offset-media" />
      {block.heading && <h2 className="cs-block-heading cs-offset-heading css-reveal">{block.heading}</h2>}
      <BlockBody value={block.body} className="cs-offset-body" />
    </section>
  );
}
