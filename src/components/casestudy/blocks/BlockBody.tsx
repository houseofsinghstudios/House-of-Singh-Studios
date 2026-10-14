import { PortableText, type PortableTextComponents, type PortableTextBlock } from "@portabletext/react";

// Block bodies allow paragraphs, bold and links only. Any other style renders as a plain paragraph,
// and any other mark (italic included) renders as plain text.
const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p>{children}</p>,
  },
  marks: {
    strong: ({ children }) => <strong>{children}</strong>,
    link: ({ value, children }) => {
      const href: string = value?.href || "";
      const external = /^https?:\/\//.test(href);
      return (
        <a href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
          {children}
        </a>
      );
    },
  },
  unknownBlockStyle: ({ children }) => <p>{children}</p>,
  unknownMark: ({ children }) => <>{children}</>,
  unknownType: () => null,
};

export default function BlockBody({
  value,
  className = "",
}: {
  value?: PortableTextBlock[];
  className?: string;
}) {
  if (!value || value.length === 0) return null;
  return (
    <div className={`cs-block-body css-reveal ${className}`}>
      <PortableText value={value} components={components} />
    </div>
  );
}
