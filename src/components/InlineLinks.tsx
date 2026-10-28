// Renders text with links written as [visible text](href). Site paths use the site's Link (next/link
// with the page transition); web addresses open in a new tab and say so. In the body link style.
// Segments are siblings, so a link never wraps another link.
import { Fragment } from "react";
import { Link } from "next-view-transitions";
import { isExternal, parseInlineLinks } from "@/lib/inline-links";

export default function InlineLinks({ text }: { text: string }) {
  return (
    <>
      {parseInlineLinks(text).map((part, i) => {
        if (!part.href) return <Fragment key={i}>{part.text}</Fragment>;
        if (isExternal(part.href)) {
          return (
            <a key={i} href={part.href} target="_blank" rel="noopener noreferrer" className="art-link" aria-label={`${part.text} (opens in a new tab)`}>
              {part.text}
            </a>
          );
        }
        return (
          <Link key={i} href={part.href} className="art-link">
            {part.text}
          </Link>
        );
      })}
    </>
  );
}
