import type { CaseStudyBlock } from "@/data/projectDetails";
import BlockMedia from "./BlockMedia";

type Feature = Extract<CaseStudyBlock, { type: "feature" }>;

// A large main image with a small detail image set on its bottom line.
export default function FeatureBlock({ block }: { block: Feature }) {
  return (
    <section className="cs-block cs-block-grid cs-feature">
      <BlockMedia image={block.image} span={8} className="cs-feature-main" />
      <BlockMedia image={block.detail} span={3} caption={block.caption} className="cs-feature-detail" />
    </section>
  );
}
