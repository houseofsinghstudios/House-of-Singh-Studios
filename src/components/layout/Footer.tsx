import Link from "next/link";
import { siteConfig } from "@/lib/config";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-neutral-100 bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-10 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="text-lg font-semibold tracking-tight text-black">
              {siteConfig.name}
            </Link>
            <p className="mt-3 text-sm text-neutral-500 leading-relaxed max-w-xs">
              AI powered design studio delivering brand identity, visual media,
              digital design, and creative strategy.
            </p>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-4">
              Services
            </h4>
            <div className="flex flex-col gap-2.5">
              <Link href="/services/brand-identity" className="text-sm text-neutral-600 hover:text-black transition-colors">
                Brand Identity
              </Link>
              <Link href="/services/visual-media" className="text-sm text-neutral-600 hover:text-black transition-colors">
                Visual Media
              </Link>
              <Link href="/services/digital-design" className="text-sm text-neutral-600 hover:text-black transition-colors">
                Digital Design
              </Link>
              <Link href="/services/creative-strategy" className="text-sm text-neutral-600 hover:text-black transition-colors">
                Creative Strategy
              </Link>
            </div>
          </div>

          {/* Studio */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-4">
              Studio
            </h4>
            <div className="flex flex-col gap-2.5">
              <Link href="/work" className="text-sm text-neutral-600 hover:text-black transition-colors">
                Work
              </Link>
              <Link href="/ai" className="text-sm text-neutral-600 hover:text-black transition-colors">
                AI Capabilities
              </Link>
              <Link href="/journal" className="text-sm text-neutral-600 hover:text-black transition-colors">
                Journal
              </Link>
              <Link href="/about" className="text-sm text-neutral-600 hover:text-black transition-colors">
                About
              </Link>
              <Link href="/packages" className="text-sm text-neutral-600 hover:text-black transition-colors">
                Packages
              </Link>
            </div>
          </div>

          {/* Connect */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-4">
              Connect
            </h4>
            <div className="flex flex-col gap-2.5">
              <Link href="/contact" className="text-sm text-neutral-600 hover:text-black transition-colors">
                Get in Touch
              </Link>
              <a
                href={siteConfig.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-neutral-600 hover:text-black transition-colors"
              >
                Instagram
              </a>
              <a
                href={siteConfig.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-neutral-600 hover:text-black transition-colors"
              >
                LinkedIn
              </a>
              <p className="text-sm text-neutral-500 mt-2">{siteConfig.location}</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-14 pt-6 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-neutral-400">
            &copy; {currentYear} House of Singh Studios Inc. All rights reserved.
          </p>
          <p className="text-xs text-neutral-400">
            AI Powered Creative Studio
          </p>
        </div>
      </div>
    </footer>
  );
}
