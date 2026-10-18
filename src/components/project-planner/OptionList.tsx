// A list of full width answer rows with real radio buttons or checkboxes inside.
// No hooks, so it works inside the client flow without being a client boundary itself.

export interface Option {
  id: string;
  label: string;
  hint?: string;
}

interface Props {
  name: string;
  type: "radio" | "checkbox";
  options: Option[];
  selected: string[];
  onToggle: (id: string) => void;
  describedBy?: string;
}

export default function OptionList({ name, type, options, selected, onToggle, describedBy }: Props) {
  return (
    <div className="pp-options">
      {options.map((o) => {
        const checked = selected.includes(o.id);
        return (
          <label key={o.id} className={`pp-option${checked ? " is-selected" : ""}`}>
            <input
              type={type}
              name={name}
              value={o.id}
              checked={checked}
              onChange={() => onToggle(o.id)}
              aria-describedby={describedBy}
              className="pp-input"
            />
            <span className="pp-option-text">
              <span>{o.label}</span>
              {o.hint && <span className="pp-option-hint">{o.hint}</span>}
            </span>
            <span className="pp-check" aria-hidden="true">{checked ? "✓" : ""}</span>
          </label>
        );
      })}
    </div>
  );
}
