// The strong moments on the Initiatives pages: full bleed inverted bands with the same tokens and
// inverse button as the homepage "(04) Two ways to start" band. These bands are the only dark
// sections on these pages.
// NominateBand (id="nominate"): full size, with an optional "What happens next" column beside the
// button. light: Parallel's secondary band, about 60% of the padding and the smaller heading size.
// TakePartBand: two columns, Parallel then Commons, on /initiatives.
import Button from "@/components/ui/Button";
import "@/components/homepage/tool-band.css";
import "./initiatives.css";

export interface NominateItem {
  heading: string;
  text: string;
  button: string;
  href: string;
}

export interface NextSteps {
  label: string;
  items: string[];
}

function Action({ item }: { item: NominateItem }) {
  return (
    <div className="tb-action">
      <Button href={item.href} variant="primary-inverted" className="tb-button" data-cursor="link">
        {item.button} <span className="tb-arrow" aria-hidden="true">&rarr;</span>
      </Button>
    </div>
  );
}

// A program page: label, the heading, one line, the button, and optionally what happens next.
export function NominateBand({ number, item, next, light }: { number: string; item: NominateItem; next?: NextSteps; light?: boolean }) {
  const cls = ["tb", "init-band", next && "init-band--split", light && "init-band--light"].filter(Boolean).join(" ");
  return (
    <section id="nominate" className={cls} aria-labelledby="nominate-heading">
      <div className="init-band-main">
        <p className="editorial-label tb-label">({number})</p>
        <h2 id="nominate-heading" className={light ? "tb-col-heading" : "tb-heading init-band-heading"}>{item.heading}</h2>
        <p className="tb-body">{item.text}</p>
        <Action item={item} />
      </div>
      {next && (
        <div className="init-band-next">
          <p className="editorial-label tb-label">{next.label}</p>
          <ul className="init-next">
            {next.items.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

// /initiatives, (02) Take part: one column per program.
export function TakePartBand({ number, heading, items }: { number: string; heading: string; items: NominateItem[] }) {
  return (
    <section className="tb init-band" aria-labelledby="take-part-heading">
      <p className="editorial-label tb-label">({number})</p>
      <h2 id="take-part-heading" className="tb-heading">{heading}</h2>
      <div className="init-band-cols">
        {items.map((item) => (
          <div key={item.href} className="init-band-col">
            <h3 className="tb-col-heading">{item.heading}</h3>
            <p className="tb-body">{item.text}</p>
            <Action item={item} />
          </div>
        ))}
      </div>
    </section>
  );
}
