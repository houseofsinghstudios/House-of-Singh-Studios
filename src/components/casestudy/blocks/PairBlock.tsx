import type { CaseStudyBlock } from "@/data/projectDetails";
import BlockMedia from "./BlockMedia";

type Pair = Extract<CaseStudyBlock, { type: "pair" }>;

// Two images meeting edge to edge on desktop, stacked with a small gap on mobile.
export default function PairBlock({ block }: { block: Pair }) {
  const [first, second] = block.images;
  return (
    <section className="cs-block cs-block-grid cs-pair">
      <BlockMedia image={first} span={6} className="cs-pair-first" />
      <BlockMedia image={second} span={6} className="cs-pair-second" />
    </section>
  );
}
