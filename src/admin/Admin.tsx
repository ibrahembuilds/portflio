import { useCallback, useEffect, useState } from "react";
import { Download, Loader2, RefreshCw } from "lucide-react";
import { countryLabel, EMPLOYEE_RANGES, optionLabel, ROLES, VALUE_BANDS, WEEKLY_FREQUENCY } from "../config/assessment";

/**
 * Private lead view.
 *
 * Deliberately small: the point is to make qualified Teardown leads usable, not
 * to build a CRM. The token is held in sessionStorage only, so closing the tab
 * ends the session, and it is only ever sent to this site's own API.
 */

const TOKEN_KEY = "teardown-admin-token";

type Lead = {
  id: string;
  created_at: string;
  name: string;
  email: string;
  company: string;
  website: string;
  country: string;
  employee_range: string;
  role: string;
  process_problem: string;
  weekly_frequency: string;
  people_involved: string;
  current_tools: string[];
  previous_attempts: string;
  estimated_value: string;
  marketing_consent: boolean;
  fit_status: "qualified" | "potential" | "not_current_fit";
  report_status: string;
  email_status: string;
  report_pdf_url: string;
  source: string;
  utm_source: string;
  utm_campaign: string;
};

const FIT_LABEL: Record<Lead["fit_status"], string> = {
  qualified: "Qualified",
  potential: "Potential",
  not_current_fit: "Not a current fit",
};

const FitBadge = ({ status }: { status: Lead["fit_status"] }) => (
  <span
    className={`inline-block shrink-0 rounded-md px-2 py-1 text-[11px] font-medium uppercase tracking-[0.05em] ${
      status === "qualified"
        ? "bg-[var(--primary)] text-white"
        : status === "potential"
          ? "bg-[var(--primary-soft)] text-[var(--primary-strong)]"
          : "bg-[#F1F3F7] text-muted"
    }`}
  >
    {FIT_LABEL[status]}
  </span>
);

const Field = ({ label, value }: { label: string; value: string }) => (
  <div>
    <dt className="text-[11px] font-medium uppercase tracking-[0.07em] text-muted">{label}</dt>
    <dd className="mt-0.5 text-[14px] leading-snug text-ink">{value || "—"}</dd>
  </div>
);

const Admin = () => {
  const [token, setToken] = useState("");
  const [input, setInput] = useState("");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | Lead["fit_status"]>("all");

  useEffect(() => {
    try {
      const saved = window.sessionStorage.getItem(TOKEN_KEY);
      if (saved) setToken(saved);
    } catch {
      /* private window: the token just has to be entered again */
    }
  }, []);

  const load = useCallback(async (value: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/admin/leads?limit=200", {
        headers: { authorization: `Bearer ${value}` },
      });

      if (response.status === 401) {
        setError("That token wasn't accepted.");
        setToken("");
        try {
          window.sessionStorage.removeItem(TOKEN_KEY);
        } catch {
          /* ignore */
        }
        return;
      }
      if (response.status === 503) {
        setError("Admin access isn't configured on the server (TEARDOWN_ADMIN_TOKEN is unset).");
        setToken("");
        return;
      }
      if (!response.ok) {
        setError(`Request failed (${response.status}).`);
        return;
      }

      const payload = (await response.json()) as { leads: Lead[] };
      setLeads(payload.leads ?? []);
      try {
        window.sessionStorage.setItem(TOKEN_KEY, value);
      } catch {
        /* ignore */
      }
    } catch {
      setError("Couldn't reach the server.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (token) void load(token);
  }, [token, load]);

  const downloadCsv = async () => {
    const response = await fetch("/api/admin/leads?format=csv&limit=500", {
      headers: { authorization: `Bearer ${token}` },
    });
    if (!response.ok) {
      setError(`Export failed (${response.status}).`);
      return;
    }
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "teardown-leads.csv";
    anchor.click();
    URL.revokeObjectURL(url);
  };

  if (!token) {
    return (
      <main className="shell-narrow py-20">
        <h1 className="text-[1.5rem] font-semibold tracking-[-0.022em]">Teardown leads</h1>
        <p className="mt-3 text-[15px] text-muted">Enter the admin token to continue.</p>

        <form
          className="mt-6 flex flex-col gap-3 sm:flex-row"
          onSubmit={(event) => {
            event.preventDefault();
            if (input.trim()) setToken(input.trim());
          }}
        >
          <label htmlFor="token" className="sr-only">
            Admin token
          </label>
          <input
            id="token"
            type="password"
            autoComplete="off"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            className="w-full rounded-lg border border-[var(--border-strong)] bg-surface px-4 py-3 text-[16px] outline-none focus:border-[var(--primary)]"
          />
          <button type="submit" className="btn btn-primary shrink-0">
            Open
          </button>
        </form>

        <div aria-live="polite">
          {error && <p className="mt-4 text-[14px] font-medium text-[var(--primary-strong)]">{error}</p>}
        </div>
      </main>
    );
  }

  const visible = filter === "all" ? leads : leads.filter((lead) => lead.fit_status === filter);

  return (
    <main className="shell py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-[1.5rem] font-semibold tracking-[-0.022em]">
          Teardown leads <span className="text-muted">({leads.length})</span>
        </h1>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => void load(token)} className="btn btn-secondary !py-2 !text-[14px]">
            <RefreshCw size={15} aria-hidden="true" />
            Refresh
          </button>
          <button type="button" onClick={() => void downloadCsv()} className="btn btn-secondary !py-2 !text-[14px]">
            <Download size={15} aria-hidden="true" />
            Export CSV
          </button>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2" role="group" aria-label="Filter by fit">
        {(["all", "qualified", "potential", "not_current_fit"] as const).map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setFilter(value)}
            aria-pressed={filter === value}
            className={`rounded-md border px-3 py-1.5 text-[13px] ${
              filter === value
                ? "border-[var(--primary)] bg-[var(--primary-soft)] text-[var(--primary-strong)]"
                : "border-border bg-surface text-muted"
            }`}
          >
            {value === "all" ? "All" : FIT_LABEL[value]}
          </button>
        ))}
      </div>

      <div aria-live="polite">
        {error && <p className="mt-4 text-[14px] font-medium text-[var(--primary-strong)]">{error}</p>}
        {loading && (
          <p className="mt-6 flex items-center gap-2 text-[15px] text-muted">
            <Loader2 size={16} className="animate-spin" aria-hidden="true" />
            Loading…
          </p>
        )}
      </div>

      {!loading && visible.length === 0 && <p className="mt-8 text-[15px] text-muted">No leads yet.</p>}

      <ul className="mt-6 grid gap-4">
        {visible.map((lead) => (
          <li key={lead.id} className="card p-5 md:p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-[1.0625rem] font-semibold leading-snug">{lead.company}</h2>
                <p className="mt-0.5 text-[14px] text-muted">
                  {lead.name} ·{" "}
                  <a href={`mailto:${lead.email}`} className="text-[var(--primary)] underline-offset-4 hover:underline">
                    {lead.email}
                  </a>
                </p>
              </div>
              <div className="flex items-center gap-2">
                <FitBadge status={lead.fit_status} />
                <span className="text-[12px] text-muted">
                  {new Date(lead.created_at).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>

            <dl className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Field label="Role" value={optionLabel(ROLES, lead.role)} />
              <Field label="Country" value={countryLabel(lead.country)} />
              <Field label="Team size" value={optionLabel(EMPLOYEE_RANGES, lead.employee_range)} />
              <Field label="Frequency" value={optionLabel(WEEKLY_FREQUENCY, lead.weekly_frequency)} />
              <Field label="Who does it" value={lead.people_involved} />
              <Field label="Tools" value={lead.current_tools.join(", ")} />
              <Field label="Stated value" value={optionLabel(VALUE_BANDS, lead.estimated_value)} />
              <Field label="Website" value={lead.website} />
            </dl>

            <div className="mt-5 border-t border-border pt-4">
              <p className="text-[11px] font-medium uppercase tracking-[0.07em] text-muted">Problem described</p>
              <p className="mt-1.5 text-[14.5px] leading-relaxed text-ink">{lead.process_problem}</p>
            </div>

            {lead.previous_attempts && (
              <div className="mt-4">
                <p className="text-[11px] font-medium uppercase tracking-[0.07em] text-muted">Already tried</p>
                <p className="mt-1.5 text-[14.5px] leading-relaxed text-muted">{lead.previous_attempts}</p>
              </div>
            )}

            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-border pt-4 text-[12px] text-muted">
              <span>Source: {lead.source || "—"}</span>
              {lead.utm_source && <span>UTM: {lead.utm_source}</span>}
              {lead.utm_campaign && <span>Campaign: {lead.utm_campaign}</span>}
              <span>Report: {lead.report_status}</span>
              <span>Email: {lead.email_status}</span>
              <span>Marketing: {lead.marketing_consent ? "opted in" : "no"}</span>
              {lead.report_pdf_url && (
                <a
                  href={lead.report_pdf_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--primary)] underline-offset-4 hover:underline"
                >
                  Open report
                </a>
              )}
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
};

export default Admin;
