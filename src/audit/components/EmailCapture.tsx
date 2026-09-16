import { useEffect, useRef, useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { PRIVACY_POLICY_VERSION, SITE_URL } from "../../config/site";

/**
 * Email capture, shown only after the questions are done and the preview has
 * been seen.
 *
 * Marketing consent is a separate, unticked checkbox. Asking for the report is
 * never treated as agreement to be marketed to — the two are stored as
 * different fields for exactly that reason.
 */

type Props = {
  defaultFirstName: string;
  submitting: boolean;
  error: string | null;
  fieldErrors: Record<string, string>;
  onSubmit: (values: { firstName: string; email: string; marketingConsent: boolean }) => void;
  onBack: () => void;
};

const EmailCapture = ({ defaultFirstName, submitting, error, fieldErrors, onSubmit, onBack }: Props) => {
  const [firstName, setFirstName] = useState(defaultFirstName);
  const [email, setEmail] = useState("");
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [touched, setTouched] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => nameRef.current?.focus({ preventScroll: true }), 40);
    return () => window.clearTimeout(timer);
  }, []);

  const emailLooksValid = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/.test(email.trim());
  const nameValid = firstName.trim().length >= 1;
  const localError = touched && !nameValid ? "Please add your first name." : touched && !emailLooksValid ? "Please check that email address." : null;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setTouched(true);
    if (!nameValid || !emailLooksValid) return;
    onSubmit({ firstName: firstName.trim(), email: email.trim(), marketingConsent });
  };

  const message = error ?? localError ?? fieldErrors.email ?? fieldErrors.first_name ?? null;

  return (
    <form onSubmit={handleSubmit} noValidate>
      <h1 className="text-[1.5rem] font-semibold leading-[1.2] tracking-[-0.022em] sm:text-[1.875rem]">
        Where should I send the full report?
      </h1>
      <p className="mt-3 max-w-prose text-[15px] leading-relaxed text-muted">
        You'll see the whole thing on screen straight away — the email is so you have a copy to keep or forward
        internally.
      </p>

      <div className="mt-7 grid gap-4">
        <div>
          <label htmlFor="first_name" className="text-[14px] font-medium text-ink">
            First name
          </label>
          <input
            ref={nameRef}
            id="first_name"
            name="first_name"
            type="text"
            autoComplete="given-name"
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
            maxLength={80}
            aria-invalid={touched && !nameValid ? true : undefined}
            className="mt-1.5 w-full rounded-lg border border-[var(--border-strong)] bg-surface px-4 py-3.5 text-[16px] text-ink outline-none transition-colors focus:border-[var(--primary)]"
          />
        </div>

        <div>
          <label htmlFor="email" className="text-[14px] font-medium text-ink">
            Work email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            maxLength={254}
            aria-invalid={touched && !emailLooksValid ? true : undefined}
            aria-describedby="email-help"
            className="mt-1.5 w-full rounded-lg border border-[var(--border-strong)] bg-surface px-4 py-3.5 text-[16px] text-ink outline-none transition-colors focus:border-[var(--primary)]"
          />
          <p id="email-help" className="mt-2 text-[13px] text-muted">
            One email with your report. I don't sell or share it.
          </p>
        </div>
      </div>

      {/* Separate, optional, and unticked. */}
      <label className="mt-6 flex cursor-pointer items-start gap-3 rounded-lg border border-border bg-surface p-4">
        <input
          type="checkbox"
          name="marketing_consent"
          checked={marketingConsent}
          onChange={(event) => setMarketingConsent(event.target.checked)}
          className="mt-0.5 h-[18px] w-[18px] shrink-0 accent-[var(--primary)]"
        />
        <span className="text-[14px] leading-snug text-muted">
          Send me occasional practical ideas about improving business systems.
          <span className="mt-1 block text-[13px]">Optional. Unsubscribe any time.</span>
        </span>
      </label>

      <div aria-live="polite" className="min-h-[1.5rem]">
        {message && <p className="mt-3 text-[14px] font-medium text-[var(--primary-strong)]">{message}</p>}
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row-reverse sm:justify-start">
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? (
            <>
              <Loader2 size={16} className="animate-spin" aria-hidden="true" />
              Building your report…
            </>
          ) : (
            <>
              Send my full report
              <ArrowRight size={16} aria-hidden="true" />
            </>
          )}
        </button>
        <button type="button" onClick={onBack} className="btn btn-ghost" disabled={submitting}>
          Back
        </button>
      </div>

      <p className="mt-6 max-w-prose text-[13px] leading-relaxed text-muted">
        By sending this you agree to the{" "}
        <a href={`${SITE_URL}/terms`} className="text-[var(--primary)] underline-offset-4 hover:underline">
          terms
        </a>{" "}
        and the{" "}
        <a href={`${SITE_URL}/privacy`} className="text-[var(--primary)] underline-offset-4 hover:underline">
          privacy policy
        </a>{" "}
        (version {PRIVACY_POLICY_VERSION}).
      </p>
    </form>
  );
};

export default EmailCapture;
