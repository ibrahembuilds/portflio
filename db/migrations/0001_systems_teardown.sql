-- Systems Teardown storage.
--
-- Apply against Vercel Postgres before the assessment goes live:
--   psql "$POSTGRES_URL" -f db/migrations/0001_systems_teardown.sql
--
-- Nothing in this schema is reachable from the browser. The application
-- connects with the server-side POSTGRES_URL only; no anonymous role is
-- granted any privilege here, which is what keeps lead data server-side.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS teardown_leads (
  id                          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at                  timestamptz NOT NULL DEFAULT now(),
  updated_at                  timestamptz NOT NULL DEFAULT now(),

  session_id                  uuid NOT NULL,
  -- Included in the report URL. A lead id on its own reveals nothing.
  access_token                text NOT NULL,

  name                        text NOT NULL,
  email                       text NOT NULL,
  company                     text NOT NULL,
  website                     text NOT NULL DEFAULT '',
  country                     text NOT NULL,
  employee_range              text NOT NULL,
  role                        text NOT NULL,

  process_problem             text NOT NULL,
  weekly_frequency            text NOT NULL,
  people_involved             text NOT NULL,
  current_tools               jsonb NOT NULL DEFAULT '[]'::jsonb,
  previous_attempts           text NOT NULL DEFAULT '',
  estimated_value             text NOT NULL,

  -- Marketing consent is stored separately from the report request, with the
  -- time it was given and the privacy policy version it was given against.
  marketing_consent           boolean NOT NULL DEFAULT false,
  marketing_consent_timestamp timestamptz,
  privacy_policy_version      text NOT NULL,

  assessment_answers_json     jsonb NOT NULL,
  website_context_json        jsonb,
  report_json                 jsonb,
  report_pdf_url              text NOT NULL DEFAULT '',

  fit_status                  text NOT NULL CHECK (fit_status IN ('qualified', 'potential', 'not_current_fit')),
  report_status               text NOT NULL DEFAULT 'pending',
  email_status                text NOT NULL DEFAULT 'pending'
                              CHECK (email_status IN ('pending', 'sent', 'failed', 'not_configured')),

  source                      text NOT NULL DEFAULT 'audit',
  utm_source                  text NOT NULL DEFAULT '',
  utm_medium                  text NOT NULL DEFAULT '',
  utm_campaign                text NOT NULL DEFAULT '',
  referrer                    text NOT NULL DEFAULT ''
);

CREATE INDEX IF NOT EXISTS teardown_leads_created_at_idx ON teardown_leads (created_at DESC);
CREATE INDEX IF NOT EXISTS teardown_leads_fit_status_idx ON teardown_leads (fit_status, created_at DESC);
CREATE INDEX IF NOT EXISTS teardown_leads_email_idx      ON teardown_leads (lower(email));
CREATE INDEX IF NOT EXISTS teardown_leads_session_idx    ON teardown_leads (session_id);

-- Funnel counts only. No answer text, no email address.
CREATE TABLE IF NOT EXISTS teardown_events (
  id           bigserial PRIMARY KEY,
  created_at   timestamptz NOT NULL DEFAULT now(),
  session_id   uuid NOT NULL,
  event        text NOT NULL,
  properties   jsonb NOT NULL DEFAULT '{}'::jsonb,
  utm_source   text NOT NULL DEFAULT '',
  utm_medium   text NOT NULL DEFAULT '',
  utm_campaign text NOT NULL DEFAULT '',
  referrer     text NOT NULL DEFAULT ''
);

CREATE INDEX IF NOT EXISTS teardown_events_created_at_idx ON teardown_events (created_at DESC);
CREATE INDEX IF NOT EXISTS teardown_events_event_idx      ON teardown_events (event, created_at DESC);

-- Fixed-window rate limiting. Shared across serverless instances, which a
-- per-instance in-memory counter cannot be.
CREATE TABLE IF NOT EXISTS teardown_rate_limits (
  bucket_key   text        NOT NULL,
  window_start timestamptz NOT NULL,
  hits         integer     NOT NULL DEFAULT 0,
  PRIMARY KEY (bucket_key, window_start)
);

CREATE INDEX IF NOT EXISTS teardown_rate_limits_window_idx ON teardown_rate_limits (window_start);

-- Housekeeping: run periodically, or leave it — the table is tiny.
-- DELETE FROM teardown_rate_limits WHERE window_start < now() - interval '1 day';
