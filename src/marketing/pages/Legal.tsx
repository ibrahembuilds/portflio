import { CONTACT_EMAIL, OWNER, PRIVACY_POLICY_VERSION } from "../../config/site";
import { PageHeader } from "../components/Section";

const LAST_UPDATED = "15 September 2026";

/**
 * The privacy text describes the data flow the Systems Teardown assessment
 * actually implements. If that flow changes, PRIVACY_POLICY_VERSION in
 * src/config/site.ts must be bumped — every stored marketing consent records
 * the version it was given against.
 */
export const Privacy = () => (
  <>
    <PageHeader
      eyebrow="Privacy"
      title="What I collect, why, and what I do with it."
      body={`Last updated ${LAST_UPDATED}. Policy version ${PRIVACY_POLICY_VERSION}.`}
    />

    <section className="section">
      <div className="shell-narrow prose-block text-[16px] leading-relaxed text-muted">
        <h2 className="text-ink">Who is responsible</h2>
        <p>
          {OWNER.legalName}, trading as {OWNER.name}, is responsible for the personal data collected through
          ibrahemahmed.com and audit.ibrahemahmed.com. You can reach me at{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>

        <h2 className="text-ink">The marketing site</h2>
        <p>
          The pages on ibrahemahmed.com do not set advertising cookies and do not require an account. I record anonymous
          page and funnel counts so I can see which pages lead to an assessment being started. Those counts do not
          include your name, your email address or anything you typed. The page counts are measured by Vercel Web
          Analytics, which is cookieless and is already the host of this site. It does not run on the assessment at
          audit.ibrahemahmed.com at all.
        </p>

        <h2 className="text-ink">The Systems Teardown assessment</h2>
        <p>
          The assessment at audit.ibrahemahmed.com asks about your business and one process inside it. While you are
          answering, your progress is stored in your own browser so a refresh does not lose your work. Nothing is sent to
          me until you submit.
        </p>
        <p>When you request your report, I store:</p>
        <ul>
          <li>your first name and work email address</li>
          <li>your company name, website and country</li>
          <li>your role and the size range of your team</li>
          <li>your answers about the process you described</li>
          <li>the report generated from those answers</li>
          <li>how you arrived at the site, including campaign tags if your link carried them</li>
        </ul>
        <p>
          I use this to produce your Systems Report, to send it to you, and to decide whether a Systems Teardown call is
          likely to be useful to you. The legal basis is my legitimate interest in responding to a business enquiry you
          started, and performing steps at your request before entering a contract.
        </p>

        <h2 className="text-ink">If you give me your company website</h2>
        <p>
          Supplying a website is optional. If you do, my server requests the public page at that address to understand
          what your business does — the same information any visitor would see. I do not attempt to access anything
          behind a login, and I do not draw conclusions about your internal operations from it. Everything the report
          says about how your business runs comes from the answers you gave.
        </p>

        <h2 className="text-ink">Automated processing</h2>
        <p>
          Your answers are sent to a language model provider to help draft the report. The draft is checked against a
          fixed structure before it is shown to you. The report is preliminary and is not a decision about you — it is a
          starting point for a conversation. I read every enquiry myself.
        </p>

        <h2 className="text-ink">Marketing is separate</h2>
        <p>
          Asking for your report does not subscribe you to anything. There is a separate, optional checkbox, unticked by
          default, for occasional practical ideas about improving business systems. If you tick it, I store that choice,
          the time you made it, and the version of this policy that was in force. You can withdraw at any time by
          replying to any message or emailing <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>

        <h2 className="text-ink">Who else processes it</h2>
        <p>
          I keep the number of providers small. Today they are: Vercel (website hosting and the database the enquiry is
          stored in), Resend (sending your report by email), and the language model provider used to draft the report.
          Each processes the data only to provide that service to me.
        </p>

        <h2 className="text-ink">How long I keep it</h2>
        <p>
          Enquiries are kept for up to 24 months from your last contact with me, so I can find our history if you come
          back. If you become a client, records connected to the work are kept for as long as I am required to keep
          business records. You can ask me to delete your enquiry sooner.
        </p>

        <h2 className="text-ink">Your rights</h2>
        <p>
          You can ask for a copy of what I hold about you, ask me to correct it, ask me to delete it, or object to how I
          am using it. Email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> and I will respond within 30 days.
          If you are in the UK or the EU and you are not satisfied with my response, you can complain to your national
          data protection authority.
        </p>

        <h2 className="text-ink">Changes</h2>
        <p>
          When this policy changes, the version number at the top changes with it. Consents already recorded stay tied to
          the version that was in force when they were given.
        </p>
      </div>
    </section>
  </>
);

export const Terms = () => (
  <>
    <PageHeader
      eyebrow="Terms"
      title="Terms of use."
      body={`Last updated ${LAST_UPDATED}.`}
    />

    <section className="section">
      <div className="shell-narrow prose-block text-[16px] leading-relaxed text-muted">
        <h2 className="text-ink">What this site is</h2>
        <p>
          ibrahemahmed.com and audit.ibrahemahmed.com describe software development services offered by{" "}
          {OWNER.legalName}. Nothing on either site is an offer to contract, a quotation, or a commitment to deliver any
          particular feature, price or date.
        </p>

        <h2 className="text-ink">The Systems Report is preliminary</h2>
        <p>
          The report produced by the assessment is generated from a short set of questions you answered about your own
          business. It is a preliminary view intended to start a conversation. It is not an audit, not professional
          advice, and not a substitute for reviewing your operations properly.
        </p>
        <p>
          Where the report does not have enough information to say something, it says so rather than estimating. You
          should not make an investment, staffing or operational decision on the basis of the report alone.
        </p>

        <h2 className="text-ink">Accuracy of what you submit</h2>
        <p>
          The report reflects the answers you gave. If those answers are incomplete or inaccurate, the report will be
          too. Please do not submit anyone else's personal data, confidential information belonging to a third party, or
          anything covered by a duty of confidence.
        </p>

        <h2 className="text-ink">Scope, price and dates</h2>
        <p>
          Any work I carry out is governed by a separate written agreement covering scope, price, timing and ownership.
          Prices and delivery dates are set in that agreement after a Systems Teardown, not before. Nothing on this site
          fixes a price or a date.
        </p>

        <h2 className="text-ink">Acceptable use</h2>
        <p>
          Do not attempt to disrupt the assessment, submit automated or bulk requests, or use it for any purpose other
          than assessing your own business. I apply rate limits and may decline requests that look automated.
        </p>

        <h2 className="text-ink">Links to other sites</h2>
        <p>
          Links to client websites and public code repositories are provided so you can inspect the work. I am not
          responsible for the content of sites I do not operate.
        </p>

        <h2 className="text-ink">Liability</h2>
        <p>
          The site and the preliminary report are provided as they are. To the extent permitted by law, I am not liable
          for losses arising from reliance on the site or the report. Nothing here limits liability that cannot be
          limited by law.
        </p>

        <h2 className="text-ink">Contact</h2>
        <p>
          Questions about these terms: <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>
      </div>
    </section>
  </>
);
