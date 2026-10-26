// The contact form's extra fields for "Introducing a client" and "Becoming a partner". Rendered
// inside ContactClient's form, which reads them by name from FormData. The permission tick is
// checked there on submit, so its message shows inline instead of as a browser bubble.
import { FORM_COPY, PARTNER_TYPES, REFERRAL_LIMITS } from "@/lib/partners/forms";

function TextField({ id, name, label, limit, required, autoComplete = "off", inputMode }: {
  id: string;
  name: string;
  label: string;
  limit: number;
  required?: boolean;
  autoComplete?: string;
  inputMode?: "url";
}) {
  return (
    <div>
      <label htmlFor={id} className="contact-label">
        {label}{!required && <> {FORM_COPY.optional}</>}
      </label>
      <input id={id} type="text" name={name} required={required} maxLength={limit} autoComplete={autoComplete} inputMode={inputMode} className="contact-input" />
      <span className="focus-line" />
    </div>
  );
}

export function IntroductionFields({ permissionError, onPermission }: { permissionError: boolean; onPermission: () => void }) {
  return (
    <>
      <TextField id="contact-who" name="who" label={FORM_COPY.who} limit={REFERRAL_LIMITS.who} required />
      <TextField id="contact-reach" name="contact" label={FORM_COPY.reach} limit={REFERRAL_LIMITS.contact} required />
      <div>
        <label className="pp-tick contact-tick">
          <input
            id="contact-permission"
            type="checkbox"
            name="permission"
            aria-required="true"
            aria-invalid={permissionError || undefined}
            aria-describedby="contact-permission-error"
            onChange={onPermission}
          />
          <span>{FORM_COPY.permission}</span>
        </label>
        <p id="contact-permission-error" className="contact-error" role="alert">
          {permissionError ? FORM_COPY.permissionError : ""}
        </p>
      </div>
    </>
  );
}

export function PartnershipFields() {
  return (
    <>
      <TextField id="contact-business" name="businessName" label={FORM_COPY.businessName} limit={REFERRAL_LIMITS.businessName} required autoComplete="organization" />
      <div>
        <label htmlFor="contact-partner-type" className="contact-label">{FORM_COPY.partnerType}</label>
        <select id="contact-partner-type" name="partnerType" required className="contact-input" defaultValue="">
          <option value="" disabled>{FORM_COPY.partnerTypePlaceholder}</option>
          {PARTNER_TYPES.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
        <span className="focus-line" />
      </div>
      <TextField id="contact-website" name="website" label={FORM_COPY.website} limit={REFERRAL_LIMITS.website} autoComplete="url" inputMode="url" />
    </>
  );
}
