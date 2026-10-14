import type { CaseStudyBlock } from "@/data/projectDetails";
import BlockMedia from "./BlockMedia";

type Full = Extract<CaseStudyBlock, { type: "full" }>;

// One image across all twelve columns, optional caption underneath.
export default function FullBlock({ block }: { block: Full }) {
  return (
    <section className="cs-block cs-block-grid cs-full">
      <BlockMedia image={block.image} span={12} caption={block.caption} className="cs-full-media" />
    </section>
  );
}
