import Image from "next/image";
import type { BlockImage } from "@/data/projectDetails";

// `sizes` for an image spanning `span` of the 12 columns. Mirrors --page-px:
// 8vw each side from 900px (content is 84vw), 24px each side below.
export function columnSizes(span: number) {
  const wide = Math.round((84 * span) / 12);
  return `(min-width: 900px) ${wide}vw, (min-width: 768px) calc((100vw - 48px) * ${span} / 12), calc(100vw - 48px)`;
}

// One block image at its natural aspect ratio. Never cropped, never stretched past its pixel width.
export default function BlockMedia({
  image,
  span,
  caption,
  className = "",
}: {
  image: BlockImage;
  span: number;
  caption?: string;
  className?: string;
}) {
  return (
    <figure className={`cs-block-media ${className}`}>
      <div className="reveal-clip">
        <Image
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          sizes={columnSizes(span)}
          className="cs-block-img"
          style={{ maxWidth: `${image.width}px` }}
        />
      </div>
      {caption && <figcaption className="cs-block-caption">{caption}</figcaption>}
    </figure>
  );
}
