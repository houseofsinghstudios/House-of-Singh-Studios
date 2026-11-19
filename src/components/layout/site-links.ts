// The main pages, in the order the header shows them: the desktop links (Header.tsx) and the drawer
// (MenuDrawer.tsx), which adds Contact after them. One list, so the two never drift apart.
export const SITE_LINKS = [
  { label: "Services", href: "/services" },
  { label: "Work", href: "/work" },
  { label: "AI Lab", href: "/ai" },
  { label: "About", href: "/about" },
  { label: "Insights", href: "/insights" },
] as const;
