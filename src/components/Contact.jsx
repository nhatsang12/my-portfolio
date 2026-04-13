import { Mail, GitBranch, CalendarDays } from "lucide-react";

export function Contact({ contactRef, contactVisible }) {
  return (
    <section
      ref={contactRef}
      id="contact"
      className={`section-shell contact-shell glass-card-strong scroll-mt-20 flex flex-col justify-between rounded-2xl p-4 sm:p-5 md:p-6 section-reveal ${
        contactVisible ? "is-visible" : ""
      }`}
    >
      <div className="grid h-full flex-1 gap-4 md:grid-cols-[1.2fr_0.8fr] md:items-stretch">
        <div className="flex h-full flex-col justify-between gap-6">
          <p className="section-kicker">
            <span className="section-index">04</span>
            Contact
          </p>
          <div>
            <h2 className="section-title mt-2 text-3xl font-bold text-white sm:text-4xl">Contact</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-200 sm:text-base">
              I am ready to join frontend projects with React and Tailwind, build reliable responsive layouts, and polish UI for
              real product experiences.
            </p>
          </div>

          <div className="flex flex-col gap-2.5 sm:flex-row sm:gap-3">
            <a
              href="mailto:nhatsang58@gmail.com"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-4 py-2 text-center text-sm font-semibold text-slate-900 shadow-[0_10px_24px_rgba(255,255,255,0.2)]"
            >
              <Mail size={14} />
              Send Email
            </a>
            <a
              href="https://github.com/nhatsang12"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/35 bg-white/10 px-4 py-2 text-center text-sm font-semibold text-white"
            >
              <GitBranch size={14} />
              Open GitHub
            </a>
          </div>
        </div>

        <div className="grid gap-2.5">
          <div className="neo-tile glass-tile rounded-xl p-3.5">
            <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500">Email</p>
            <p className="mt-1 text-sm font-semibold text-slate-100">nhatsang58@gmail.com</p>
          </div>
          <div className="neo-tile glass-tile rounded-xl p-3.5">
            <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500">Phone</p>
            <p className="mt-1 text-sm font-semibold text-slate-100">0394757843</p>
          </div>
          <div className="neo-tile glass-tile rounded-xl p-3.5">
            <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500">Availability</p>
            <p className="mt-1 flex items-center gap-2 text-sm font-semibold text-cyan-100">
              <CalendarDays size={14} />
              Open for internship
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
