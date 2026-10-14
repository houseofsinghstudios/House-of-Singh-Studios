import type { CaseStudyBlock } from "@/data/projectDetails";
import SplitBlock from "./SplitBlock";
import OffsetBlock from "./OffsetBlock";
import FullBlock from "./FullBlock";
import PairBlock from "./PairBlock";
import StatementBlock from "./StatementBlock";
import FeatureBlock from "./FeatureBlock";

function renderBlock(block: CaseStudyBlock) {
  switch (block.type) {
    case "split":
      return <SplitBlock key={block.key} block={block} />;
    case "offset":
      return <OffsetBlock key={block.key} block={block} />;
    case "full":
      return <FullBlock key={block.key} block={block} />;
    case "pair":
      return <PairBlock key={block.key} block={block} />;
    case "statement":
      return <StatementBlock key={block.key} block={block} />;
    case "feature":
      return <FeatureBlock key={block.key} block={block} />;
    default: {
      // Fails to compile if a new block type is added without a component.
      const unhandled: never = block;
      return unhandled;
    }
  }
}

// The composed middle of the project page, in the order stored in Sanity.
export default function BlockRenderer({ blocks }: { blocks: CaseStudyBlock[] }) {
  return <div className="cs-blocks">{blocks.map(renderBlock)}</div>;
}
