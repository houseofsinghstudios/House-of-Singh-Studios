import type { CaseStudyBlock } from "@/data/projectDetails";
import BlockBody from "./BlockBody";
import BlockMedia from "./BlockMedia";

type Split = Extract<CaseStudyBlock, { type: "split" }>;

// Image on one half, heading and body on the other, text sitting on the image's baseline.
export default function SplitBlock({ block }: { block: Split }) {
  return (
    <section className={`cs-block cs-block--rule cs-block-grid cs-split cs-split--${block.side}`}>
      <BlockMedia image={block.image} span={6} className="cs-split-media" />
      <div className="cs-split-text">
        {block.heading && <h2 className="cs-block-heading css-reveal">{block.heading}</h2>}
        <BlockBody value={block.body} />
      </div>
    </section>
  );
}
