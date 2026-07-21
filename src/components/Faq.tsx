import { Plus } from "lucide-react";

// Answers here must stay in sync with the FAQPage JSON-LD in index.html.
export const faqs = [
  {
    q: "What is Ibrahem Ahmed Hassan's full name?",
    a: "My full name is Ibrahem Ahmed Hassan Adam, also written Ibrahim Ahmed Hassan Adam. I am usually found online as Ibrahem Ahmed Hassan, Ibrahem Ahmed, or Ibrahem.",
  },
  {
    q: "What does Ibrahem Ahmed Hassan do?",
    a: "I design and build AI products, internal business systems, and AI agents end to end: product structure, interfaces, databases, AI integration, automation, and deployment.",
  },
  {
    q: "What is KanyouAI?",
    a: "KanyouAI is a UK-registered AI development company I founded to close the gap between AI strategy and implementation. We build custom systems around how a business actually works.",
  },
  {
    q: "What kind of projects do you take on?",
    a: "AI product development, internal systems such as CRMs and dashboards, AI assistants and agents connected to real operations, and ongoing technical product partnership.",
  },
  {
    q: "Can you build a RAG assistant or AI agent for my company?",
    a: "Yes. I build RAG assistants grounded in company websites and documents, AI agents connected to business data and tools, and the interfaces, permissions, analytics, and deployment needed to use them safely.",
  },
  {
    q: "How does a project start?",
    a: "With a 30-minute call. You describe what your business does, where the process fails, and what the system should handle. From there I define the first useful version and a focused scope.",
  },
  {
    q: "Where are you based and do you work remotely?",
    a: "I am based in Malaysia, studying AI Engineering at Multimedia University, and work remotely with clients worldwide, including the Gulf region.",
  },
];

const Faq = () => (
  <section id="faq" className="border-t border-border py-24 md:py-32">
    <div className="shell grid items-start gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:gap-24">
      <h2 className="mx-auto max-w-[12ch] text-center text-4xl font-bold leading-[1.03] tracking-[-0.04em] md:text-5xl" data-reveal>
        Frequently asked questions.
      </h2>
      <div className="border-t border-border-strong">
        {faqs.map((item) => (
          <details key={item.q} className="faq-item border-b border-border-strong" data-reveal>
            <summary className="flex items-center justify-between gap-6 py-6 text-lg font-medium tracking-tight transition-colors hover:text-primary md:py-7 md:text-xl">
              {item.q}
              <span
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-border text-muted"
                aria-hidden="true"
              >
                <Plus size={17} className="faq-icon" />
              </span>
            </summary>
            <p className="max-w-[62ch] pb-7 leading-relaxed text-muted">{item.a}</p>
          </details>
        ))}
      </div>
    </div>
  </section>
);

export default Faq;
