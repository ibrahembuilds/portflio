import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { BUSINESS_SECTION_END, PROCESS_SECTION_END, QUESTIONS } from "../config/assessment";
import { CONTACT_EMAIL, PRIVACY_POLICY_VERSION, SITE_URL } from "../config/site";
import type { SystemsReport } from "../server/report/schema";
import {
  fetchPreview,
  fetchStoredReport,
  lookupWebsite,
  pdfUrl,
  submitLead,
  track,
  type NextAction,
  type PreviewFinding,
  type WebsiteContext,
} from "./api";
import EmailCapture from "./components/EmailCapture";
import QuestionCard, { type QuestionValue } from "./components/QuestionCard";
import Report from "./components/Report";
import {
  clearState,
  createInitialState,
  isComplete,
  loadState,
  saveState,
  toSubmissionAnswers,
  type SavedState,
  type Stage,
} from "./state";

/* -------------------------------------------------------------------------- */
/* Chrome                                                                     */
/* -------------------------------------------------------------------------- */

const Header = ({ children }: { children?: React.ReactNode }) => (
  <header className="border-b border-border">
    <div className="shell flex h-[60px] items-center justify-between gap-4">
      <a href={SITE_URL} className="text-[14px] font-semibold tracking-tight">
        Ibrahem Ahmed
      </a>
      {children}
    </div>
  </header>
);

const Progress = ({ current, total }: { current: number; total: number }) => {
  const percent = Math.round((current / total) * 100);
  return (
    <div className="flex items-center gap-3">
      <div
        className="h-1 w-24 overflow-hidden rounded-full bg-[var(--border)] sm:w-40"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={current}
        aria-label={`Question ${current} of ${total}`}
      >
        <div
          className="h-full rounded-full bg-[var(--primary)] transition-[width] duration-300 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
      <span className="font-mono text-[12px] text-muted">
        {current}/{total}
      </span>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* Landing                                                                    */
/* -------------------------------------------------------------------------- */

const Landing = ({ onStart, resumable }: { onStart: (resume: boolean) => void; resumable: boolean }) => (
  <div className="shell-narrow py-14 md:py-20">
    <p className="text-[12px] font-medium uppercase tracking-[0.1em] text-muted">Systems Teardown</p>
    <h1 className="mt-4 text-[2rem] font-semibold leading-[1.06] tracking-[-0.03em] sm:text-[2.75rem]">
      Find where your business is losing time, dropping work or depending too heavily on manual processes.
    </h1>
    <p className="mt-6 max-w-prose text-[1.0625rem] leading-relaxed text-muted sm:text-[1.1875rem]">
      Answer a few questions about how your team works. I'll turn the answers into a preliminary Systems Report showing
      what looks worth fixing first.
    </p>

    <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
      <button type="button" onClick={() => onStart(false)} className="btn btn-primary">
        Start the Teardown
        <ArrowRight size={17} aria-hidden="true" />
      </button>
      {resumable && (
        <button type="button" onClick={() => onStart(true)} className="btn btn-secondary">
          Pick up where I left off
        </button>
      )}
    </div>

    <p className="mt-5 text-[14px] text-muted">Takes a few minutes. No technical knowledge required.</p>

    <ol className="mt-12 grid gap-px overflow-hidden rounded-xl border border-border bg-[var(--border)]">
      {[
        ["Answer a few questions", "About one process that's costing you time. Nothing technical."],
        ["Get a preliminary Systems Report", "On screen straight away, and emailed so you can forward it."],
        ["Book the 20-minute call, if it fits", "That conversation is the actual Systems Teardown."],
      ].map(([title, body], index) => (
        <li key={title} className="flex gap-4 bg-surface p-5">
          <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[var(--primary-soft)] font-mono text-[11px] font-medium text-[var(--primary-strong)]">
            {index + 1}
          </span>
          <div>
            <h2 className="text-[15px] font-semibold leading-snug">{title}</h2>
            <p className="mt-1 text-[14px] leading-relaxed text-muted">{body}</p>
          </div>
        </li>
      ))}
    </ol>

    <p className="mt-10 text-[13px] leading-relaxed text-muted">
      Your answers stay in your browser until you ask for the report. See the{" "}
      <a href={`${SITE_URL}/privacy`} className="text-[var(--primary)] underline-offset-4 hover:underline">
        privacy policy
      </a>
      .
    </p>
  </div>
);

/* -------------------------------------------------------------------------- */
/* Preview                                                                    */
/* -------------------------------------------------------------------------- */

const Preview = ({
  findings,
  loading,
  onContinue,
  onBack,
}: {
  findings: PreviewFinding[];
  loading: boolean;
  onContinue: () => void;
  onBack: () => void;
}) => (
  <div>
    <p className="text-[12px] font-medium uppercase tracking-[0.1em] text-muted">Preliminary analysis</p>
    <h1 className="mt-3 text-[1.5rem] font-semibold leading-[1.2] tracking-[-0.022em] sm:text-[1.875rem]">
      {loading
        ? "Reading your answers…"
        : findings.length === 0
          ? "Your answers are in."
          : `Your preliminary analysis found ${findings.length} area${findings.length === 1 ? "" : "s"} worth reviewing.`}
    </h1>

    {loading ? (
      <p className="mt-6 flex items-center gap-2 text-[15px] text-muted">
        <Loader2 size={16} className="animate-spin" aria-hidden="true" />
        One moment.
      </p>
    ) : (
      <>
        <ul className="mt-7 grid gap-3">
          {findings.map((finding) => (
            <li key={finding.title} className="card p-5">
              <h2 className="text-[15px] font-semibold leading-snug">{finding.title}</h2>
              <p className="mt-2 text-[14px] leading-relaxed text-muted">{finding.body}</p>
            </li>
          ))}
        </ul>

        <p className="mt-7 max-w-prose text-[15px] leading-relaxed text-muted">
          {findings.length === 0
            ? "Nothing jumped out from the quick pass, which usually means the detail is in how the work actually runs rather than in the shape of it. The full report sets out what I would want to look at on a call."
            : "The full report explains what each of these is costing you operationally, which one to fix first, and what a better version of the process would look like."}
        </p>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row-reverse sm:justify-start">
          <button type="button" onClick={onContinue} className="btn btn-primary">
            Get the full report
            <ArrowRight size={16} aria-hidden="true" />
          </button>
          <button type="button" onClick={onBack} className="btn btn-ghost">
            <ArrowLeft size={16} aria-hidden="true" />
            Change an answer
          </button>
        </div>
      </>
    )}
  </div>
);

/* -------------------------------------------------------------------------- */
/* App                                                                        */
/* -------------------------------------------------------------------------- */

type ReportState = {
  report: SystemsReport;
  companyName: string;
  firstName: string;
  generatedAt: string;
  nextAction: NextAction;
  leadId: string;
  accessToken: string;
  notice: string | null;
};

const OTHER_TOOL_KEY = "current_tools_other";

const App = () => {
  const [state, setState] = useState<SavedState>(() => createInitialState());
  const [hydrated, setHydrated] = useState(false);
  const [resumable, setResumable] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [preview, setPreview] = useState<PreviewFinding[]>([]);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [reportState, setReportState] = useState<ReportState | null>(null);
  const [loadingReport, setLoadingReport] = useState(false);

  const websiteContext = useRef<WebsiteContext | null>(null);
  /** The preview is fetched once per visit to the preview screen. */
  const previewRequested = useRef(false);
  const mainRef = useRef<HTMLElement>(null);

  const question = QUESTIONS[state.index];
  const answers = state.answers;

  /* Restore ------------------------------------------------------------- */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const reportId = params.get("report");
    const reportToken = params.get("t");

    if (reportId && reportToken) {
      setLoadingReport(true);
      void fetchStoredReport(reportId, reportToken).then((result) => {
        setLoadingReport(false);
        if (!result.ok) {
          setError("That report link is no longer valid. You're welcome to run the assessment again.");
          setHydrated(true);
          return;
        }
        setReportState({
          report: result.data.report,
          companyName: result.data.company_name,
          firstName: result.data.first_name,
          generatedAt: result.data.created_at,
          nextAction: result.data.next_action,
          leadId: result.data.lead_id,
          accessToken: reportToken,
          notice: null,
        });
        setState((current) => ({ ...current, stage: "report" }));
        setHydrated(true);
      });
      return;
    }

    const saved = loadState();
    if (saved) {
      if (saved.report) {
        setLoadingReport(true);
        void fetchStoredReport(saved.report.leadId, saved.report.accessToken).then((result) => {
          setLoadingReport(false);
          if (result.ok) {
            setReportState({
              report: result.data.report,
              companyName: result.data.company_name,
              firstName: result.data.first_name,
              generatedAt: result.data.created_at,
              nextAction: result.data.next_action,
              leadId: result.data.lead_id,
              accessToken: saved.report?.accessToken ?? "",
              notice: null,
            });
            setState({ ...saved, stage: "report" });
          } else {
            setState({ ...saved, stage: "landing", report: undefined });
            setResumable(true);
          }
          setHydrated(true);
        });
        return;
      }

      // Always land on the landing page after a refresh and offer to resume,
      // rather than dropping someone back into a half-answered question with
      // no explanation.
      setState({ ...saved, stage: "landing" });
      setResumable(Object.keys(saved.answers).length > 0);
    }
    setHydrated(true);
  }, []);

  /* Autosave ------------------------------------------------------------ */
  useEffect(() => {
    if (!hydrated) return;
    saveState(state);
  }, [state, hydrated]);

  /* Move focus to the new screen so a keyboard user follows the flow. ---- */
  useEffect(() => {
    if (!hydrated) return;
    mainRef.current?.scrollTo?.({ top: 0 });
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [state.stage, state.index, hydrated]);

  const setStage = useCallback((stage: Stage) => setState((current) => ({ ...current, stage })), []);

  const setAnswer = useCallback((id: string, value: QuestionValue) => {
    setState((current) => ({ ...current, answers: { ...current.answers, [id]: value } }));
    setError(null);
  }, []);

  /* Validation ---------------------------------------------------------- */
  const validate = useCallback((): string | null => {
    const value = answers[question.id];

    if (question.type === "multichoice") {
      const selected = Array.isArray(value) ? value : [];
      const other = String(answers[OTHER_TOOL_KEY] ?? "").trim();
      if (question.required && selected.length === 0 && !other) return "Please pick at least one.";
      return null;
    }

    const text = String(value ?? "").trim();
    if (!question.required) return null;
    if (!text) return question.type === "choice" ? "Please choose one to continue." : "This one's needed to continue.";
    if (question.minLength && text.length < question.minLength) {
      return question.type === "longtext"
        ? `A little more detail would help — ${question.minLength - text.length} more character${question.minLength - text.length === 1 ? "" : "s"} or so.`
        : "That looks a bit short.";
    }
    return null;
  }, [answers, question]);

  /* Navigation ---------------------------------------------------------- */
  const goNext = useCallback(() => {
    const problem = validate();
    if (problem) {
      setError(problem);
      return;
    }
    setError(null);

    // Website lookup happens in the background and never blocks the flow.
    if (question.id === "company_website") {
      const url = String(answers.company_website ?? "").trim();
      if (url) {
        void lookupWebsite(state.sessionId, url).then((result) => {
          if (result.ok && result.data.ok && result.data.context) websiteContext.current = result.data.context;
        });
      }
    }

    if (state.index === BUSINESS_SECTION_END) {
      track("audit_business_completed", state.sessionId, state.attribution, {
        employee_range: String(answers.employee_range ?? ""),
        country: String(answers.country ?? ""),
        role: String(answers.respondent_role ?? ""),
      });
    }

    if (state.index === PROCESS_SECTION_END) {
      track("audit_process_completed", state.sessionId, state.attribution, {
        weekly_frequency: String(answers.weekly_frequency ?? ""),
      });
    }

    if (state.index >= QUESTIONS.length - 1) {
      track("audit_completed", state.sessionId, state.attribution, {
        step_count: QUESTIONS.length,
        decision_timing: String(answers.decision_timing ?? ""),
        budget_state: String(answers.budget_state ?? ""),
      });
      setStage("preview");
      return;
    }

    setState((current) => ({ ...current, index: current.index + 1 }));
  }, [answers, question.id, state.attribution, state.index, state.sessionId, setStage, validate]);

  const goBack = useCallback(() => {
    setError(null);
    setState((current) => ({ ...current, index: Math.max(0, current.index - 1) }));
  }, []);

  /* Alt+Arrow moves between questions without touching the mouse. -------- */
  useEffect(() => {
    if (state.stage !== "questions") return;
    const onKey = (event: KeyboardEvent) => {
      if (!event.altKey) return;
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goBack();
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        goNext();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [state.stage, goBack, goNext]);

  /* Preview ------------------------------------------------------------- */
  const submissionAnswers = useMemo(() => {
    const base = toSubmissionAnswers(answers);
    const other = String(answers[OTHER_TOOL_KEY] ?? "").trim();
    return other ? { ...base, current_tools: [...base.current_tools, other].slice(0, 12) } : base;
  }, [answers]);

  useEffect(() => {
    if (state.stage !== "preview" || previewRequested.current) return;
    previewRequested.current = true;
    setPreviewLoading(true);

    void fetchPreview(submissionAnswers).then((result) => {
      setPreviewLoading(false);
      if (result.ok) {
        setPreview(result.data.findings);
      } else {
        // If the preview cannot be built, do not block the funnel — move
        // straight to the email step rather than showing a dead end.
        setStage("email");
      }
    });
  }, [state.stage, submissionAnswers, setStage]);

  /* Submit -------------------------------------------------------------- */
  const handleSubmit = useCallback(
    async ({ firstName, email, marketingConsent }: { firstName: string; email: string; marketingConsent: boolean }) => {
      setSubmitting(true);
      setError(null);
      setFieldErrors({});

      track("email_submitted", state.sessionId, state.attribution, {
        has_website: Boolean(String(answers.company_website ?? "").trim()),
      });

      const result = await submitLead({
        session_id: state.sessionId,
        first_name: firstName,
        email,
        answers: submissionAnswers,
        consent: { marketing_consent: marketingConsent, privacy_policy_version: PRIVACY_POLICY_VERSION },
        attribution: state.attribution,
        website_context: websiteContext.current,
      });

      setSubmitting(false);

      if (!result.ok) {
        setError(result.message);
        setFieldErrors(result.details ?? {});
        return;
      }

      const { data } = result;

      track("report_generated", state.sessionId, state.attribution, { report_status: data.report_status });

      setReportState({
        report: data.report,
        companyName: String(answers.company_name ?? ""),
        firstName,
        generatedAt: new Date().toISOString(),
        nextAction: data.next_action,
        leadId: data.lead_id,
        accessToken: data.access_token,
        notice: data.delivery.emailed
          ? null
          : "I couldn't get the email out just now — the report is right here, and you can download the PDF. I'll follow up by hand.",
      });

      setState((current) => ({
        ...current,
        stage: "report",
        report: data.lead_id ? { leadId: data.lead_id, accessToken: data.access_token } : undefined,
      }));
    },
    [answers, state.attribution, state.sessionId, submissionAnswers],
  );

  useEffect(() => {
    if (state.stage === "report" && reportState) {
      track("report_viewed", state.sessionId, state.attribution, {});
    }
  }, [state.stage, reportState, state.sessionId, state.attribution]);

  /* Render -------------------------------------------------------------- */
  if (!hydrated || loadingReport) {
    return (
      <>
        <Header />
        <main className="shell-narrow py-20">
          <p className="flex items-center gap-2 text-[15px] text-muted">
            <Loader2 size={16} className="animate-spin" aria-hidden="true" />
            Loading…
          </p>
        </main>
      </>
    );
  }

  if (state.stage === "landing") {
    return (
      <>
        <Header />
        <main id="main" ref={mainRef}>
          {error && (
            <div className="shell-narrow pt-6">
              <p className="rounded-lg border border-border bg-surface px-4 py-3 text-[14px] text-muted">{error}</p>
            </div>
          )}
          <Landing
            resumable={resumable}
            onStart={(resume) => {
              if (!resume) {
                clearState();
                const fresh = createInitialState();
                setState({ ...fresh, stage: "questions" });
                setPreview([]);
              } else {
                setStage("questions");
              }
              setError(null);
              track("audit_started", state.sessionId, state.attribution, {});
            }}
          />
        </main>
      </>
    );
  }

  if (state.stage === "report" && reportState) {
    return (
      <>
        <Header>
          <a href={`${SITE_URL}/services`} className="text-[13px] text-muted hover:text-ink">
            What I build
          </a>
        </Header>
        <main id="main" ref={mainRef} className="shell-narrow pt-10">
          <Report
            report={reportState.report}
            companyName={reportState.companyName}
            firstName={reportState.firstName}
            generatedAt={reportState.generatedAt}
            nextAction={reportState.nextAction}
            notice={reportState.notice}
            pdfHref={
              reportState.leadId && reportState.accessToken
                ? pdfUrl(reportState.leadId, reportState.accessToken)
                : null
            }
            onBookingClick={() => track("booking_clicked", state.sessionId, state.attribution, {})}
          />
        </main>
      </>
    );
  }

  return (
    <>
      <Header>
        {state.stage === "questions" && <Progress current={state.index + 1} total={QUESTIONS.length} />}
      </Header>

      <main id="main" ref={mainRef} className="shell-narrow py-10 md:py-14">
        {state.stage === "questions" && (
          <>
            <QuestionCard
              question={question}
              value={answers[question.id] ?? (question.type === "multichoice" ? [] : "")}
              otherValue={String(answers[OTHER_TOOL_KEY] ?? "")}
              error={error}
              onChange={(value) => setAnswer(question.id, value)}
              onOtherChange={(value) => setAnswer(OTHER_TOOL_KEY, value)}
              onAdvance={goNext}
            />

            <div className="mt-6 flex flex-col gap-3 sm:flex-row-reverse sm:justify-start">
              <button type="button" onClick={goNext} className="btn btn-primary">
                {state.index >= QUESTIONS.length - 1 ? "See what I found" : "Continue"}
                <ArrowRight size={16} aria-hidden="true" />
              </button>
              {state.index > 0 && (
                <button type="button" onClick={goBack} className="btn btn-ghost">
                  <ArrowLeft size={16} aria-hidden="true" />
                  Back
                </button>
              )}
              {!question.required && (
                <button
                  type="button"
                  onClick={() => {
                    setAnswer(question.id, question.type === "multichoice" ? [] : "");
                    goNext();
                  }}
                  className="btn btn-ghost !text-muted"
                >
                  Skip
                </button>
              )}
            </div>

            <p className="mt-8 hidden text-[12px] text-muted sm:block">
              {question.type === "longtext" ? "Ctrl + Enter" : "Enter"} to continue · Alt + ← to go back
            </p>
          </>
        )}

        {state.stage === "preview" && (
          <Preview
            findings={preview}
            loading={previewLoading}
            onContinue={() => setStage("email")}
            onBack={() => {
              setPreview([]);
              previewRequested.current = false;
              setState((current) => ({ ...current, stage: "questions", index: QUESTIONS.length - 1 }));
            }}
          />
        )}

        {state.stage === "email" && (
          <EmailCapture
            defaultFirstName={String(answers.respondent_name ?? "").split(" ")[0] ?? ""}
            submitting={submitting}
            error={error}
            fieldErrors={fieldErrors}
            onSubmit={handleSubmit}
            onBack={() => setStage("preview")}
          />
        )}

        {state.stage !== "questions" && !isComplete(answers) && (
          <p className="mt-8 text-[13px] text-muted">
            Something missing?{" "}
            <button
              type="button"
              onClick={() => setState((current) => ({ ...current, stage: "questions", index: 0 }))}
              className="text-[var(--primary)] underline underline-offset-4"
            >
              Go back through the questions
            </button>
            .
          </p>
        )}
      </main>

      <footer className="border-t border-border">
        <div className="shell-narrow flex flex-wrap items-center justify-between gap-3 py-6 text-[13px] text-muted">
          <span>Ibrahem Ahmed · Internal Systems for Small Businesses</span>
          <span className="flex gap-4">
            <a href={`${SITE_URL}/privacy`} className="hover:text-ink">
              Privacy
            </a>
            <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-ink">
              {CONTACT_EMAIL}
            </a>
          </span>
        </div>
      </footer>
    </>
  );
};

export default App;
