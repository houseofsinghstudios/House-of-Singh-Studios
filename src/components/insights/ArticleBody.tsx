// An article's text, rendered on the server from its Portable Text. Each standalone "RGD" is linked
// (linkRgdInBlocks); images arrive with their URL already built (src, from the article page).
import Image from "next/image";
import { PortableText, type PortableTextComponents, type PortableTextMarkComponentProps, type PortableTextTypeComponentProps } from "@portabletext/react";
import RgdLink from "@/components/RgdLink";
import { linkRgdInBlocks } from "@/lib/rgd";

export type ArticleBlock = { _type: string; children?: Array<{ text?: string }> };

// A link mark and an inline image as the article page passes them (the image URL already built).
type LinkMark = { _type: "link"; href?: string };
type InlineImage = { _type: "image"; asset?: unknown; src?: string; alt?: string };

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="art-p">{children}</p>
    ),
    h2: ({ children }) => (
      <h2 className="art-h2">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="art-h3">{children}</h3>
    ),
    h4: ({ children }) => (
      <h4 className="art-h4">{children}</h4>
    ),
    blockquote: ({ children }) => (
      <blockquote className="art-bq">{children}</blockquote>
    ),
  },
  marks: {
    strong: ({ children }) => (
      <strong style={{ fontWeight: 500 }}>{children}</strong>
    ),
    em: ({ children }) => (
      <em style={{ fontStyle: "italic" }}>{children}</em>
    ),
    code: ({ children }) => <code className="art-code">{children}</code>,
    // A standalone "RGD" in the text, never one already inside a link (see linkRgdInBlocks).
    rgdLink: () => <RgdLink />,
    link: ({ children, value }: PortableTextMarkComponentProps<LinkMark>) => {
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
    bullet: ({ children }) => <ul className="art-ul">{children}</ul>,
    number: ({ children }) => <ol className="art-ol">{children}</ol>,
  },
  listItem: {
    bullet: ({ children }) => <li className="art-li">{children}</li>,
    number: ({ children }) => <li className="art-li">{children}</li>,
  },
  types: {
    image: ({ value }: PortableTextTypeComponentProps<InlineImage>) => {
      if (!value?.asset || !value.src) return null;
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

export default function ArticleBody({ body }: { body: ArticleBlock[] }) {
  return <PortableText value={linkRgdInBlocks(body)} components={components} />;
}
