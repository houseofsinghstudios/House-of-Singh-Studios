// Initiative logo heights (px) by breakpoint: below 768px, from 768px, from 1024px. The width
// follows the logo's own proportions. The CSS in src/components/initiatives/initiatives.css sets
// the same heights (a test keeps the two in step).
export const LOGO_HEIGHTS = {
  hero: { base: 40, md: 52, lg: 64 },
  row: { base: 32, md: 38, lg: 44 },
} as const;

export type LogoPlace = keyof typeof LOGO_HEIGHTS;

// The sizes attribute for a logo: its drawn width at each breakpoint, from its height and
// proportions. The browser multiplies by the screen's pixel ratio and picks the next larger
// candidate, so a PNG is requested at least twice as wide as drawn on a 2x screen.
export function logoSizes(logo: { width: number; height: number }, place: LogoPlace): string {
  const h = LOGO_HEIGHTS[place];
  const w = (height: number) => Math.ceil((height * logo.width) / logo.height);
  return `(min-width: 1024px) ${w(h.lg)}px, (min-width: 768px) ${w(h.md)}px, ${w(h.base)}px`;
}
