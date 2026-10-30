// An article's text, rendered on the server from its Portable Text. Each standalone "RGD" is linked
// (linkRgdInBlocks); images arrive with their URL already built (src, from the article page).
import Image from "next/image";
import { PortableText, type PortableTextReactComponents } from "@portabletext/react";
import RgdLink from "@/components/RgdLink";
import { linkRgdInBlocks } from "@/lib/rgd";

export type ArticleBlock = { _type: string; children?: Array<{ text?: string }> };

/* eslint-disable @typescript-eslint/no-explicit-any */
const components: Partial<PortableTextReactComponents> = {
  block: {
    normal: ({ children }: any) => (
      <p className="art-p">{children}</p>
    ),
    h2: ({ children }: any) => (
      <h2 className="art-h2">{children}</h2>
    ),
    h3: ({ children }: any) => (
      <h3 className="art-h3">{children}</h3>
    ),
    h4: ({ children }: any) => (
      <h4 className="art-h4">{children}</h4>
    ),
    blockquote: ({ children }: any) => (
      <blockquote className="art-bq">{children}</blockquote>
    ),
  },
  marks: {
    strong: ({ children }: any) => (
      <strong style={{ fontWeight: 500 }}>{children}</strong>
    ),
    em: ({ children }: any) => (
      <em style={{ fontStyle: "italic" }}>{children}</em>
    ),
    code: ({ children }: any) => <code className="art-code">{children}</code>,
    // A standalone "RGD" in the text, never one already inside a link (see linkRgdInBlocks).
    rgdLink: () => <RgdLink />,
    link: ({ children, value }: any) => {
      const href = value?.href || "";
      const isExternal = href.startsWith("http");
      return (
        <a
          href={href}
          className="art-link"
          {...(isExternal
            ? { target: "_blank", rel: "noopener noreferrer" }
            : {})}
        >
          {children}
        </a>
      );
    },
  },
  list: {
    bullet: ({ children }: any) => <ul className="art-ul">{children}</ul>,
    number: ({ children }: any) => <ol className="art-ol">{children}</ol>,
  },
  listItem: {
    bullet: ({ children }: any) => <li className="art-li">{children}</li>,
    number: ({ children }: any) => <li className="art-li">{children}</li>,
  },
  types: {
    image: ({ value }: any) => {
      if (!value?.asset) return null;
      return (
        <figure className="art-figure reveal-clip">
          <div className="art-figure-inner">
            <Image
              src={value.src}
              alt={value.alt || "Article image"}
              fill
              style={{ objectFit: "cover" }}
            />
          </div>
          {value.alt && (
            <figcaption className="art-caption">{value.alt}</figcaption>
          )}
        </figure>
      );
    },
  },
};
/* eslint-enable @typescript-eslint/no-explicit-any */

export default function ArticleBody({ body }: { body: ArticleBlock[] }) {
  return <PortableText value={linkRgdInBlocks(body)} components={components} />;
}
