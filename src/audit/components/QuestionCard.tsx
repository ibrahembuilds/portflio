import { useEffect, useRef } from "react";
import { Check } from "lucide-react";
import { COUNTRY_GROUPS, type Question } from "../../config/assessment";

/**
 * One question, one screen.
 *
 * Controls are real form elements — radios in a radiogroup, checkboxes in a
 * fieldset, a native select where the list is long — so keyboard behaviour and
 * screen-reader semantics come from the platform rather than being re-created.
 */

export type QuestionValue = string | string[];

type Props = {
  question: Question;
  value: QuestionValue;
  error: string | null;
  otherValue: string;
  onChange: (value: QuestionValue) => void;
  onOtherChange: (value: string) => void;
  onAdvance: () => void;
};

const USE_SELECT_ABOVE = 8;

const QuestionCard = ({ question, value, error, otherValue, onChange, onOtherChange, onAdvance }: Props) => {
  const firstControl = useRef<HTMLElement | null>(null);

  // Move focus to the first control whenever the question changes, so a
  // keyboard user is never left with focus on the previous screen's button.
  useEffect(() => {
    const timer = window.setTimeout(() => firstControl.current?.focus({ preventScroll: true }), 40);
    return () => window.clearTimeout(timer);
  }, [question.id]);

  const errorId = error ? `${question.id}-error` : undefined;
  const helpId = question.help ? `${question.id}-help` : undefined;
  const describedBy = [helpId, errorId].filter(Boolean).join(" ") || undefined;

  const selected = Array.isArray(value) ? value : [];

  const toggleMulti = (optionValue: string) => {
    const next = selected.includes(optionValue)
      ? selected.filter((item) => item !== optionValue)
      : [...selected, optionValue];
    onChange(next);
  };

  /** Number keys pick an option, which is how people fill these in quickly. */
  const handleNumberKey = (event: React.KeyboardEvent, options: { value: string }[], multi: boolean) => {
    if (!/^[1-9]$/.test(event.key)) return;
    const option = options[Number(event.key) - 1];
    if (!option) return;
    event.preventDefault();
    if (multi) toggleMulti(option.value);
    else onChange(option.value);
  };

  const renderControl = () => {
    if (question.type === "longtext") {
      return (
        <textarea
          ref={(node) => {
            firstControl.current = node;
          }}
          id={question.id}
          name={question.id}
          value={String(value ?? "")}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={(event) => {
            // Enter makes a new line here; the explicit shortcut moves on.
            if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
              event.preventDefault();
              onAdvance();
            }
          }}
          rows={6}
          maxLength={question.maxLength}
          placeholder={question.placeholder}
          aria-describedby={describedBy}
          aria-invalid={error ? true : undefined}
          className="w-full resize-y rounded-lg border border-[var(--border-strong)] bg-surface px-4 py-3.5 text-[16px] leading-relaxed text-ink outline-none transition-colors placeholder:text-muted/70 focus:border-[var(--primary)]"
        />
      );
    }

    if (question.type === "text" || question.type === "url") {
      return (
        <input
          ref={(node) => {
            firstControl.current = node;
          }}
          id={question.id}
          name={question.id}
          type={question.type === "url" ? "text" : "text"}
          inputMode={question.type === "url" ? "url" : "text"}
          autoComplete={question.id === "company_name" ? "organization" : question.id === "respondent_name" ? "name" : "off"}
          value={String(value ?? "")}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              onAdvance();
            }
          }}
          maxLength={question.maxLength}
          placeholder={question.placeholder}
          aria-describedby={describedBy}
          aria-invalid={error ? true : undefined}
          className="w-full rounded-lg border border-[var(--border-strong)] bg-surface px-4 py-3.5 text-[16px] text-ink outline-none transition-colors placeholder:text-muted/70 focus:border-[var(--primary)]"
        />
      );
    }

    if (question.type === "choice" && (question.options?.length ?? 0) > USE_SELECT_ABOVE) {
      return (
        <select
          ref={(node) => {
            firstControl.current = node;
          }}
          id={question.id}
          name={question.id}
          value={String(value ?? "")}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              onAdvance();
            }
          }}
          aria-describedby={describedBy}
          aria-invalid={error ? true : undefined}
          className="w-full appearance-none rounded-lg border border-[var(--border-strong)] bg-surface bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%228%22 viewBox=%220 0 12 8%22><path d=%22M1 1.5 6 6.5l5-5%22 stroke=%22%23667085%22 stroke-width=%221.5%22 fill=%22none%22/></svg>')] bg-[length:12px_8px] bg-[right_1rem_center] bg-no-repeat px-4 py-3.5 pr-11 text-[16px] text-ink outline-none transition-colors focus:border-[var(--primary)]"
        >
          <option value="">Choose one…</option>
          {COUNTRY_GROUPS.map((group) => (
            <optgroup key={group.label} label={group.label}>
              {group.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      );
    }

    if (question.type === "choice") {
      const options = question.options ?? [];
      return (
        <div
          role="radiogroup"
          aria-labelledby={`${question.id}-label`}
          aria-describedby={describedBy}
          className="grid gap-2"
          onKeyDown={(event) => handleNumberKey(event, options, false)}
        >
          {options.map((option, index) => {
            const checked = value === option.value;
            return (
              <label
                key={option.value}
                className={`flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3.5 transition-colors ${
                  checked
                    ? "border-[var(--primary)] bg-[var(--primary-soft)]"
                    : "border-[var(--border-strong)] bg-surface hover:border-[var(--primary)]"
                }`}
              >
                <input
                  ref={
                    index === 0
                      ? (node) => {
                          firstControl.current = node;
                        }
                      : undefined
                  }
                  type="radio"
                  name={question.id}
                  value={option.value}
                  checked={checked}
                  onChange={() => onChange(option.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      onAdvance();
                    }
                  }}
                  className="h-[18px] w-[18px] shrink-0 accent-[var(--primary)]"
                />
                <span className="flex-1">
                  <span className="block text-[15px] font-medium leading-snug text-ink">{option.label}</span>
                  {option.hint && <span className="mt-0.5 block text-[13px] text-muted">{option.hint}</span>}
                </span>
                <span className="hidden shrink-0 font-mono text-[11px] text-muted sm:block" aria-hidden="true">
                  {index + 1}
                </span>
              </label>
            );
          })}
        </div>
      );
    }

    // multichoice
    const options = question.options ?? [];
    return (
      <fieldset className="border-0 p-0" aria-describedby={describedBy}>
        <legend className="sr-only">{question.prompt}</legend>
        <div className="grid gap-2 sm:grid-cols-2" onKeyDown={(event) => handleNumberKey(event, options, true)}>
          {options.map((option, index) => {
            const checked = selected.includes(option.value);
            return (
              <label
                key={option.value}
                className={`flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 transition-colors ${
                  checked
                    ? "border-[var(--primary)] bg-[var(--primary-soft)]"
                    : "border-[var(--border-strong)] bg-surface hover:border-[var(--primary)]"
                }`}
              >
                <input
                  ref={
                    index === 0
                      ? (node) => {
                          firstControl.current = node;
                        }
                      : undefined
                  }
                  type="checkbox"
                  name={question.id}
                  value={option.value}
                  checked={checked}
                  onChange={() => toggleMulti(option.value)}
                  className="h-[18px] w-[18px] shrink-0 accent-[var(--primary)]"
                />
                <span className="flex-1 text-[15px] leading-snug text-ink">{option.label}</span>
                {checked && <Check size={15} className="shrink-0 text-[var(--primary)]" aria-hidden="true" />}
              </label>
            );
          })}
        </div>

        {question.allowOther && (
          <div className="mt-3">
            <label htmlFor={`${question.id}-other`} className="text-[13px] text-muted">
              Anything else? (optional)
            </label>
            <input
              id={`${question.id}-other`}
              type="text"
              value={otherValue}
              onChange={(event) => onOtherChange(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  onAdvance();
                }
              }}
              maxLength={80}
              placeholder="e.g. our job-management software"
              className="mt-1.5 w-full rounded-lg border border-[var(--border-strong)] bg-surface px-4 py-3 text-[16px] text-ink outline-none transition-colors placeholder:text-muted/70 focus:border-[var(--primary)]"
            />
          </div>
        )}
      </fieldset>
    );
  };

  return (
    <div>
      <h1 id={`${question.id}-label`} className="text-[1.5rem] font-semibold leading-[1.2] tracking-[-0.022em] sm:text-[1.875rem]">
        {question.prompt}
      </h1>
      {question.help && (
        <p id={helpId} className="mt-3 text-[15px] leading-relaxed text-muted">
          {question.help}
        </p>
      )}

      <div className="mt-7">{renderControl()}</div>

      {/* Errors are announced, not just coloured. */}
      <div aria-live="polite" className="min-h-[1.5rem]">
        {error && (
          <p id={errorId} className="mt-3 text-[14px] font-medium text-[var(--primary-strong)]">
            {error}
          </p>
        )}
      </div>
    </div>
  );
};

export default QuestionCard;
