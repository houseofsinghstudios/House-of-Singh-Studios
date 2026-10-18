// The brief: every section in order. No hooks: the ProjectPlanner flow owns the state and passes callbacks.
import Link from "next/link";
import { ACTIONS, BRIEF, OPTIONAL } from "@/lib/project-planner/content";
import { BAND_IDS, type ActionId, type BandId, type Brief, type Optional } from "@/lib/project-planner/types";
import OptionList from "./OptionList";

export interface CaseStudyLink {
  title: string;
  slug: string;
  workDelivered: string[];
}

interface Props {
  brief: Brief;
  optional: Optional;
  related: CaseStudyLink[];
  bookingHref: string;
  onEditStep: (step: number) => void;
  onOptional: (patch: Optional) => void;
  onAction: (action: ActionId) => void;
  onEdit: () => void;
  onPrint: () => void;
  onStartAgain: () => void;
  announcement: string;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="pp-section">
      <h3 className="pp-label">{title}</h3>
      {children}
    </section>
  );
}

function ActionButton({ action, primary, href, onAction }: { action: ActionId; primary: boolean; href: string; onAction: (a: ActionId) => void }) {
  const cls = `${primary ? "btn-primary" : "btn-secondary"} pp-btn`;
  if (action === "book") {
    return <a href={href} className={cls} target="_blank" rel="noopener noreferrer" onClick={() => onAction("book")}>{ACTIONS.book}</a>;
  }
  return <button type="button" className={cls} onClick={() => onAction(action)}>{ACTIONS[action]}</button>;
}

function OptionalDetails({ optional, onOptional }: Pick<Props, "optional" | "onOptional">) {
  return (
    <details className="pp-optional">
      <summary className="pp-summary">{OPTIONAL.toggle}</summary>
      <fieldset className="pp-fieldset">
        <legend className="pp-legend-small">{OPTIONAL.investmentQuestion} <span className="pp-muted">{OPTIONAL.optional}</span></legend>
        <OptionList name="pp-band" type="radio" options={BAND_IDS.map((id) => ({ id, label: OPTIONAL.bands[id] }))} selected={optional.investment ? [optional.investment] : []} onToggle={(id) => onOptional({ investment: id as BandId })} />
        <p className="pp-small">{OPTIONAL.currency}</p>
      </fieldset>
      <div className="pp-field">
        <label className="contact-label" htmlFor="pp-website">{OPTIONAL.website} <span className="pp-muted">{OPTIONAL.optional}</span></label>
        <input id="pp-website" className="contact-input" autoComplete="url" maxLength={200} value={optional.website ?? ""} onChange={(e) => onOptional({ website: e.target.value })} />
      </div>
      <div className="pp-field">
        <label className="contact-label" htmlFor="pp-date">{OPTIONAL.importantDate} <span className="pp-muted">{OPTIONAL.optional}</span></label>
        <input id="pp-date" className="contact-input" maxLength={60} placeholder={OPTIONAL.importantDatePlaceholder} value={optional.importantDate ?? ""} onChange={(e) => onOptional({ importantDate: e.target.value })} />
      </div>
    </details>
  );
}

export default function PlannerBrief(p: Props) {
  const { brief } = p;
  const related = brief.relatedWork ? p.related.filter((c) => c.workDelivered.includes(brief.relatedWork!.deliveredType)).slice(0, 2) : [];
  return (
    <article className="pp-brief">
      <p className="pp-label">{brief.intro}</p>
      <h2 className="pp-headline" tabIndex={-1}>{brief.headline}</h2>
      <p className="pp-announce" role="status" aria-live="polite">{p.announcement}</p>

      <Section title={BRIEF.toldTitle}>
        <ul className="pp-chips">
          {brief.told.map((t) => (
            <li key={t.question} className="pp-chip">
              <span className="pp-chip-q">{t.question}</span>
              <span className="pp-chip-a">{t.answer}</span>
              <button type="button" className="pp-quiet pp-no-print" onClick={() => p.onEditStep(t.step)} aria-label={`${BRIEF.editAnswer} ${t.question}`}>{BRIEF.editAnswer}</button>
            </li>
          ))}
        </ul>
      </Section>

      <Section title={brief.firstPhase.title}>
        <ul className="pp-list">{brief.firstPhase.items.map((i) => <li key={i}>{i}</li>)}</ul>
      </Section>

      {brief.alsoRequested.length > 0 && (
        <Section title={BRIEF.alsoTitle}>
          <ul className="pp-list">{brief.alsoRequested.map((x) => <li key={x.service}><strong>{x.label}</strong>. {x.note}</li>)}</ul>
          {brief.dependencyNote && <p className="pp-text">{brief.dependencyNote}</p>}
        </Section>
      )}

      <Section title={BRIEF.successTitle}><p className="pp-text">{brief.success}</p></Section>

      <Section title={BRIEF.toConfirmTitle}>
        <ul className="pp-list">{brief.toConfirm.map((i) => <li key={i}>{i}</li>)}</ul>
      </Section>

      <Section title={brief.investment.title}>
        {brief.investment.lines.length > 0 && (
          <dl className="pp-prices">
            {brief.investment.lines.map((l) => (
              <div key={l.service} className="pp-price">
                <dt>{l.label}</dt>
                <dd>{l.text}</dd>
              </div>
            ))}
          </dl>
        )}
        {brief.investment.message && <p className="pp-text">{brief.investment.message}</p>}
        {brief.investment.timelines && (
          <p className="pp-text">
            {brief.investment.timelines.text} <span className="pp-muted">{brief.investment.timelines.label}</span>
          </p>
        )}
        <p className="pp-small">{brief.investment.note}</p>
      </Section>

      {related.length > 0 && (
        <Section title={brief.relatedWork!.title}>
          <ul className="pp-list">{related.map((c) => <li key={c.slug}><Link href={`/work/${c.slug}`} className="pp-link">{c.title}</Link></li>)}</ul>
        </Section>
      )}

      <Section title={brief.nextSteps.title}><p className="pp-text">{brief.nextSteps.text}</p></Section>

      <div className="pp-no-print">
        <OptionalDetails optional={p.optional} onOptional={p.onOptional} />
        {brief.fitNote && <p className="pp-fit" role="status">{brief.fitNote}</p>}
        <div className="pp-actions">
          <ActionButton action={brief.actions.primary} primary href={p.bookingHref} onAction={p.onAction} />
          {brief.actions.secondary && <ActionButton action={brief.actions.secondary} primary={false} href={p.bookingHref} onAction={p.onAction} />}
        </div>
        <nav className="pp-quiet-links" aria-label={BRIEF.nextTitle}>
          <button type="button" className="pp-quiet" onClick={p.onEdit}>{ACTIONS.edit}</button>
          <button type="button" className="pp-quiet" onClick={p.onPrint}>{ACTIONS.print}</button>
          <button type="button" className="pp-quiet" onClick={p.onStartAgain}>{ACTIONS.startAgain}</button>
        </nav>
      </div>
    </article>
  );
}
