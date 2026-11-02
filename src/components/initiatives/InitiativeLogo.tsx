// An initiative's wordmark, drawn at the height its container's CSS sets (width follows).
// SVG files are served as uploaded (unoptimized, so next/image renders a plain img with the file's
// own URL); PNG files go through the image optimizer.
import Image from "next/image";
import type { InitiativeLogo as Logo } from "@/lib/initiatives/types";

interface Props {
  logo: Logo;
  // Empty where the logo is decorative and the name is given as text beside it.
  alt: string;
  sizes: string;
  priority?: boolean;
}

export default function InitiativeLogo({ logo, alt, sizes, priority }: Props) {
  return (
    <Image
      src={logo.url}
      alt={alt}
      width={logo.width}
      height={logo.height}
      sizes={sizes}
      unoptimized={logo.svg}
      priority={priority}
      className="init-logo-img"
    />
  );
}
