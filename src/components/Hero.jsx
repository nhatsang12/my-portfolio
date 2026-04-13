import { Mail, MapPin, Phone, GraduationCap } from "lucide-react";

export function Hero({ homeRef, homeVisible }) {
  return (
    <section
      ref={homeRef}
      id="home"
      className={`hero-shell glass-card-strong relative flex flex-col overflow-hidden scroll-mt-20 rounded-2xl p-4 sm:p-6 md:p-8 section-reveal ${
        homeVisible ? "is-visible" : ""
      }`}
    >
      <div className="float-slow pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-cyan-300/20 blur-3xl" />
      <div className="float-slow pointer-events-none absolute -bottom-20 -left-16 h-52 w-52 rounded-full bg-blue-300/15 blur-3xl [animation-delay:1200ms]" />

      <div className="grid h-full flex-1 gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="flex h-full flex-col justify-between gap-5">
          <div>
            <p className="hero-chip inline-flex rounded-full border border-cyan-300/50 bg-cyan-300/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-cyan-100">
              Intern Frontend
            </p>
            <h1
              data-text="Tieu Nhat Sang"
              className="display-title glitch-title mt-5 block bg-gradient-to-r from-white via-cyan-100 to-cyan-300 bg-clip-text text-3xl font-black leading-tight text-transparent sm:mt-6 sm:text-4xl md:text-5xl lg:text-6xl"
            >
              Tieu Nhat Sang
            </h1>
            <p className="mt-8 max-w-2xl text-sm leading-7 text-slate-300 sm:mt-10 sm:text-base">
              Final-year IT student with <span className="font-semibold text-cyan-300">2 completed team projects</span> covering React, Next.js, REST API integration and production deployment. Comfortable working across the full frontend stack and picking up new tools quickly.
            </p>
            <p className="hero-subline mt-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-200/80">
              Mission: Build Fast, Sharp, Product-ready Interface
            </p>
          </div>

          <div>
            <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">
              <a
                href="mailto:nhatsang58@gmail.com"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-cyan-300 px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-[0_10px_30px_rgba(34,211,238,0.28)]"
              >
                <Mail size={16} />
                nhatsang58@gmail.com
              </a>
            </div>
          </div>
        </div>

        <div className="info-stack grid content-evenly gap-2.5 sm:gap-3">
          <div className="neo-tile glass-tile hover-lift rounded-xl p-4">
            <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500">Location</p>
            <p className="mt-1 flex items-start gap-2 text-sm text-slate-200">
              <MapPin size={14} className="mt-0.5 text-cyan-300" />
              <span>Ho Chi Minh City</span>
            </p>
          </div>
          <div className="neo-tile glass-tile hover-lift rounded-xl p-4">
            <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500">Education</p>
            <p className="mt-1 flex items-start gap-2 text-sm text-slate-200">
              <GraduationCap size={14} className="mt-0.5 text-cyan-300" />
              Information Technology - HCMUT (2022 - Present)
            </p>
          </div>
          <div className="neo-tile glass-tile hover-lift rounded-xl p-4">
            <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500">Contact</p>
            <p className="mt-1 flex items-start gap-2 text-sm text-slate-200">
              <Phone size={14} className="mt-0.5 text-cyan-300" />
              0394757843
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
