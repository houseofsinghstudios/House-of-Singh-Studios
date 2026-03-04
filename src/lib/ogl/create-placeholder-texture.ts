/**
 * Creates a 2x2 pixel texture filled with the given hex color.
 * Used as a placeholder when no real image is available.
 */
export function createPlaceholderData(hexColor: string): Uint8Array {
  const hex = hexColor.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16) || 40;
  const g = parseInt(hex.substring(2, 4), 16) || 40;
  const b = parseInt(hex.substring(4, 6), 16) || 40;

  // 2x2 pixels, RGBA
  return new Uint8Array([
    r, g, b, 255,
    r, g, b, 255,
    r, g, b, 255,
    r, g, b, 255,
  ]);
}

/**
 * Parse a CSS gradient string to extract approximate average color.
 * Falls back to a neutral dark color.
 */
export function gradientToHex(gradient: string): string {
  const match = gradient.match(/#([0-9a-fA-F]{6})/);
  return match ? `#${match[1]}` : "#2C2C2C";
}
