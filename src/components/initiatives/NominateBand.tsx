// The one strong moment on each Initiatives page: a full bleed inverted band with the same tokens,
// padding and inverse button as the homepage "(04) Two ways to start" band. One column on a programme
// page (id="nominate"), two columns, Parallel then Commons, on /initiatives. These bands are the only
// dark sections on these pages.
import Button from "@/components/ui/Button";
import "@/components/homepage/tool-band.css";
import "./initiatives.css";

export interface NominateItem {
  heading: string;
  text: string;
  button: string;
  href: string;
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

// A programme page: label, the heading, one line, the button.
export function NominateBand({ number, item }: { number: string; item: NominateItem }) {
  return (
    <section id="nominate" className="tb init-band" aria-labelledby="nominate-heading">
      <p className="editorial-label tb-label">({number})</p>
      <h2 id="nominate-heading" className="tb-heading init-band-heading">{item.heading}</h2>
      <p className="tb-body">{item.text}</p>
      <Action item={item} />
    </section>
  );
}

// /initiatives, (02) Take part: one column per programme.
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
