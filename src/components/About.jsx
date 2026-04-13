import { STRENGTHS } from "../constants/strengths";

export function About({ aboutRef, aboutVisible }) {
  return (
    <section
      ref={aboutRef}
      id="about"
      className={`section-shell about-shell scroll-mt-20 grid gap-3 sm:gap-4 lg:grid-cols-12 section-reveal ${
        aboutVisible ? "is-visible" : ""
      }`}
    >
      <div className="section-panel glass-card flex h-full flex-col justify-between rounded-2xl p-4 sm:p-5 md:p-6 lg:col-span-8">
        <div>
          <p className="section-kicker">
            <span className="section-index">01</span>
            About
          </p>
          <h2 className="section-title mt-2 text-3xl font-bold text-white sm:text-4xl">About Me</h2>
          <p className="mt-4 text-sm leading-7 text-slate-300 sm:text-base">
            Final-year IT student with <span className="font-semibold text-cyan-300">2 completed team projects</span>
            {" "}covering React, Next.js, REST API integration and production deployment.
            Comfortable working across the full frontend stack and picking up
            new tools quickly. A collaborative team member who takes ownership
            of tasks and follows through to delivery.
            Looking for a <span className="font-semibold text-cyan-300">Frontend Internship</span> to start my professional career.
          </p>
        </div>
        <div className="mt-5 grid gap-3 sm:max-w-md">
          <div className="neo-tile glass-tile rounded-xl p-3.5">
            <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500">Current Goal</p>
            <p className="mt-1 text-sm font-semibold text-slate-100">Frontend Internship - Real Product Team</p>
          </div>
        </div>
      </div>

      <div className="grid h-full content-evenly gap-2.5 sm:grid-cols-2 lg:col-span-4 lg:grid-cols-1">
        {STRENGTHS.map((item) => (
          <div key={item} className="neo-tile glass-tile hover-lift rounded-2xl p-3.5 sm:p-4">
            <p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Strength</p>
            <p className="mt-1 text-sm font-semibold text-slate-100">{item}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
