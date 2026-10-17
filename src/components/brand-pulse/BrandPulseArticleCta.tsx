// Brand Pulse call to action at the end of every insight article. Server rendered.
import Button from "@/components/ui/Button";
import { ARTICLE_CTA } from "@/lib/brand-pulse/content";
import "./brand-pulse.css";

export default function BrandPulseArticleCta() {
  return (
    <aside className="bp-article-cta" aria-labelledby="bp-article-cta-heading">
      <p className="editorial-label bp-label">{ARTICLE_CTA.label}</p>
      <h2 id="bp-article-cta-heading" className="bp-block-heading">{ARTICLE_CTA.heading}</h2>
      <p className="bp-text">{ARTICLE_CTA.text}</p>
      <div className="bp-btn">
        <Button href="/brand-pulse" variant="primary" data-cursor="link">
          {ARTICLE_CTA.button}
        </Button>
      </div>
    </aside>
  );
}
