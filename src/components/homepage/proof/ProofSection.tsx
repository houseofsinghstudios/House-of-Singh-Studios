// The homepage (03) Proof: "What every client can count on." Four promises, each with one client
// quote. A server component: every word is in the server HTML, with chapter 01 lit and the others at
// rest, the same as the island's first state, so nothing flashes and all of it reads without
// JavaScript. ProofLight (the client island) moves the light with the scroll.

import EditorialLabel from "@/components/ui/EditorialLabel";
import { PROOF_SECTION, captionText, splitOnKeyPhrase, type ProofChapter } from "@/lib/proof";
import ProofLight from "./ProofLight";
import "./proof.css";

const HEADING_ID = "proof-heading";

function Chapter({ chapter, index }: { chapter: ProofChapter; index: number }) {
  const { before, phrase, after } = splitOnKeyPhrase(chapter.quote.excerpt, chapter.quote.keyPhrase);
  return (
    <li className="proof-ch" data-chapter={index}>
      {/* Phones only: the index carries the names on desktop. */}
      <p className="proof-ch-label">
        <span>{chapter.number}</span>
        <span>{chapter.name}</span>
      </p>
      <h3 className="proof-promise">{chapter.promise}</h3>
      <figure className="proof-figure">
        <blockquote className="proof-quote">
          <p>
            {before}
            {phrase && <span className="proof-band">{phrase}</span>}
            {after}
          </p>
        </blockquote>
        <figcaption className="proof-caption">{captionText(chapter.quote)}</figcaption>
      </figure>
    </li>
  );
}

export default function ProofSection({ chapters }: { chapters: ProofChapter[] }) {
  const head = (
    <>
      <EditorialLabel number={PROOF_SECTION.number} text={PROOF_SECTION.label} className="proof-label" />
      <h2 id={HEADING_ID} className="proof-h2">
        {PROOF_SECTION.heading}
      </h2>
    </>
  );
  const list = (
    <ol className="proof-list">
      {chapters.map((c, i) => (
        <Chapter key={c.id} chapter={c} index={i} />
      ))}
    </ol>
  );
  return (
    <section className="proof" aria-labelledby={HEADING_ID}>
      <ProofLight head={head} list={list} headingId={HEADING_ID} promises={chapters.map(({ id, number, name }) => ({ id, number, name }))} />
    </section>
  );
}
