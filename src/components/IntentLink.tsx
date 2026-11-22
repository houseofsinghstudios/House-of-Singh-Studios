"use client";
// A client component: it prefetches on intent. A link to a page of the site that is fetched ahead only
// once the visitor shows intent (a pointer over it, keyboard focus or a finger on it), not as soon as it
// scrolls into view. Prefetching on sight fetched every linked page's data and stylesheets before any
// interaction, and Chrome warns about each preloaded stylesheet a page does not use (homepage audit
// H-07, 22 Nov 2026). Same props as next-view-transitions' Link, which it wraps, so page transitions
// are unchanged. Links that should prefetch on sight keep that Link directly (the /work links).
import { Link } from "next-view-transitions";
import { useRouter } from "next/navigation";
import type { ComponentProps } from "react";

type Props = ComponentProps<typeof Link>;

export default function IntentLink({ href, onMouseEnter, onFocus, onTouchStart, ...rest }: Props) {
  const router = useRouter();
  // Only paths on this site; the router ignores a repeat for a route it already has.
  const warm = () => {
    if (typeof href === "string" && href.startsWith("/")) router.prefetch(href);
  };
  return (
    <Link
      href={href}
      prefetch={false}
      onMouseEnter={(e) => {
        warm();
        onMouseEnter?.(e);
      }}
      onFocus={(e) => {
        warm();
        onFocus?.(e);
      }}
      onTouchStart={(e) => {
        warm();
        onTouchStart?.(e);
      }}
      {...rest}
    />
  );
}
