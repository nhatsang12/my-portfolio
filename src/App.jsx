import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  CalendarDays,
  GitBranch,
  GraduationCap,
  Mail,
  MapPin,
  Menu,
  Phone,
  Sparkles,
  X,
} from "lucide-react";

const NAV_ITEMS = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "contact", label: "Contact" },
];

const SKILLS = [
  { name: "HTML", type: "Frontend" },
  { name: "CSS", type: "Frontend" },
  { name: "JavaScript", type: "Frontend" },
  { name: "React JS", type: "Frontend" },
  { name: "Tailwind CSS", type: "Frontend" },
  { name: "UI Animation", type: "Frontend" },
  { name: "Figma", type: "Design" },
  { name: "Git / GitHub", type: "Tools" },
];

const PROJECTS = [
  {
    name: "Event Ticketing Platform",
    period: "Feb 2026 - Mar 2026",
    team: "Team size 3",
    status: "Built",
    tech: ["React.js", "React Router", "Tailwind CSS", "Lucide React"],
    bullets: [
      "Online ticketing system with search, booking and payment flow",
      "Admin dashboard with KPI stats and per-event revenue chart",
      "Role-based access with protected routes",
    ],
    github: "https://github.com/nhatsang12/EventTicketMangement",
  },
  {
    name: "Estoria",
    period: "Mar 2026 - Present",
    team: "Team size 2",
    status: "In Progress",
    tech: ["Next.js 16", "JavaScript", "Tailwind CSS", "Recharts"],
    bullets: [
      "Modern UI with smooth transitions",
      "KYC + OCR flow reducing manual admin processing",
      "Leaflet filtering and VNPay + PayPal integration",
    ],
    github: "https://github.com/ltrungkien2307/estateplaform",
  },
];

const STRENGTHS = ["Hard-working", "Detail-oriented", "Teamwork", "Problem Solving"];

function useSectionReveal(threshold = 0.1) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(node);
        }
      },
      {
        threshold,
        rootMargin: "0px 0px -4% 0px",
      }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, isVisible];
}

export default function App() {
  const rootRef = useRef(null);
  const progressBarRef = useRef(null);
  const timeRef = useRef(null);
  const tiltRafMapRef = useRef(new WeakMap());
  const tiltPointMapRef = useRef(new WeakMap());
  const [openMenu, setOpenMenu] = useState(false);
  const [liteMotion, setLiteMotion] = useState(false);
  const [homeRef, homeVisible] = useSectionReveal(0.05);
  const [aboutRef, aboutVisible] = useSectionReveal(0.08);
  const [skillsRef, skillsVisible] = useSectionReveal(0.08);
  const [projectsRef, projectsVisible] = useSectionReveal(0.08);
  const [contactRef, contactVisible] = useSectionReveal(0.08);

  const groupedSkills = useMemo(() => {
    return SKILLS.reduce((acc, item) => {
      if (!acc[item.type]) acc[item.type] = [];
      acc[item.type].push(item.name);
      return acc;
    }, {});
  }, []);

  const jumpTo = (id) => {
    setOpenMenu(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  useEffect(() => {
    let timer = 0;
    const formatter = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Ho_Chi_Minh",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });

    const syncClock = () => {
      if (timeRef.current) {
        timeRef.current.textContent = `${formatter.format(new Date())} (GMT+7)`;
      }
      const msUntilNextSecond = 1000 - (Date.now() % 1000);
      timer = window.setTimeout(syncClock, msUntilNextSecond);
    };

    syncClock();
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarsePointerQuery = window.matchMedia("(hover: none), (pointer: coarse)");

    const evaluateMotionProfile = () => {
      const lowCpu = typeof navigator.hardwareConcurrency === "number" && navigator.hardwareConcurrency <= 6;
      const lowMemory = typeof navigator.deviceMemory === "number" && navigator.deviceMemory <= 6;
      setLiteMotion(reducedMotionQuery.matches || coarsePointerQuery.matches || lowCpu || lowMemory);
    };

    const listen = (query) => {
      if (typeof query.addEventListener === "function") {
        query.addEventListener("change", evaluateMotionProfile);
        return () => query.removeEventListener("change", evaluateMotionProfile);
      }

      if (typeof query.addListener === "function") {
        query.addListener(evaluateMotionProfile);
        return () => query.removeListener(evaluateMotionProfile);
      }

      return () => {};
    };

    evaluateMotionProfile();
    const cleanupReduced = listen(reducedMotionQuery);
    const cleanupCoarse = listen(coarsePointerQuery);

    return () => {
      cleanupReduced();
      cleanupCoarse();
    };
  }, []);

  useEffect(() => {
    if (liteMotion) return;

    let raf = 0;
    let pointerX = window.innerWidth * 0.5;
    let pointerY = window.innerHeight * 0.35;

    const paint = () => {
      raf = 0;
      const root = rootRef.current;
      if (!root) return;
      root.style.setProperty("--cursor-x", `${pointerX}px`);
      root.style.setProperty("--cursor-y", `${pointerY}px`);
    };

    const onMove = (event) => {
      pointerX = event.clientX;
      pointerY = event.clientY;
      if (!raf) raf = window.requestAnimationFrame(paint);
    };

    paint();
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, [liteMotion]);

  useEffect(() => {
    if (liteMotion) return;

    const root = rootRef.current;
    if (!root) return;

    let idleTimer = 0;
    const onScroll = () => {
      root.classList.add("is-scrolling");
      if (idleTimer) window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(() => {
        root.classList.remove("is-scrolling");
      }, 140);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (idleTimer) window.clearTimeout(idleTimer);
      root.classList.remove("is-scrolling");
    };
  }, [liteMotion]);

  useEffect(() => {
    let raf = 0;
    const bar = progressBarRef.current;
    if (!bar) return;

    const paintProgress = () => {
      raf = 0;
      const doc = document.documentElement;
      const max = Math.max(1, doc.scrollHeight - window.innerHeight);
      const ratio = Math.min(1, Math.max(0, window.scrollY / max));
      bar.style.transform = `scaleX(${ratio})`;
    };

    const queuePaint = () => {
      if (!raf) raf = window.requestAnimationFrame(paintProgress);
    };

    queuePaint();
    window.addEventListener("scroll", queuePaint, { passive: true });
    window.addEventListener("resize", queuePaint);
    return () => {
      window.removeEventListener("scroll", queuePaint);
      window.removeEventListener("resize", queuePaint);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, []);

  const onTiltMove = (event) => {
    if (liteMotion) return;

    const card = event.currentTarget;
    tiltPointMapRef.current.set(card, { x: event.clientX, y: event.clientY });
    if (tiltRafMapRef.current.has(card)) return;

    const frame = window.requestAnimationFrame(() => {
      tiltRafMapRef.current.delete(card);
      const point = tiltPointMapRef.current.get(card);
      if (!point) return;

      const rect = card.getBoundingClientRect();
      const px = (point.x - rect.left) / rect.width;
      const py = (point.y - rect.top) / rect.height;
      const rotateY = (px - 0.5) * 10;
      const rotateX = (0.5 - py) * 8;

      card.style.setProperty("--tilt-rx", `${rotateX.toFixed(2)}deg`);
      card.style.setProperty("--tilt-ry", `${rotateY.toFixed(2)}deg`);
      card.style.setProperty("--tilt-px", `${(px * 100).toFixed(1)}%`);
      card.style.setProperty("--tilt-py", `${(py * 100).toFixed(1)}%`);
    });

    tiltRafMapRef.current.set(card, frame);
  };

  const onTiltLeave = (event) => {
    const card = event.currentTarget;
    const frame = tiltRafMapRef.current.get(card);
    if (frame) {
      window.cancelAnimationFrame(frame);
      tiltRafMapRef.current.delete(card);
    }

    tiltPointMapRef.current.delete(card);
    card.style.setProperty("--tilt-rx", "0deg");
    card.style.setProperty("--tilt-ry", "0deg");
    card.style.setProperty("--tilt-px", "50%");
    card.style.setProperty("--tilt-py", "50%");
  };

  return (
    <div
      ref={rootRef}
      className={`site-root theme-noir relative isolate min-h-screen overflow-x-hidden ${
        liteMotion ? "fx-lite" : ""
      }`}
    >
      {!liteMotion && <div className="cursor-aura pointer-events-none fixed inset-0 z-[6]" />}
      <div className="galaxy-bg pointer-events-none fixed inset-0 z-0">
        <div className="galaxy-vignette" />
        {!liteMotion && <div className="galaxy-noise" />}
        <div className="galaxy-grid" />
        <div className="galaxy-wave" />
        <div className="galaxy-orb galaxy-orb-cyan" />
        <div className="galaxy-orb galaxy-orb-blue" />
        {!liteMotion && <div className="galaxy-orb galaxy-orb-violet" />}
        <div className="stars stars-a" />
        {!liteMotion && <div className="stars stars-b" />}
        {!liteMotion && (
          <div className="shooting-stars">
            <span className="shooting-star s1" />
            <span className="shooting-star s2" />
            <span className="shooting-star s3" />
          </div>
        )}
      </div>
      <div className="scroll-progress-wrap">
        <div ref={progressBarRef} className="scroll-progress-bar" />
      </div>

      <header className="site-header fixed left-0 right-0 top-0 z-50 border-b border-slate-700/50 bg-black/35 backdrop-blur-sm">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <button
            onClick={() => jumpTo("home")}
            className="inline-flex items-center gap-1.5 rounded-md border border-cyan-300/40 bg-cyan-300/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-cyan-100 shadow-[0_0_22px_rgba(34,211,238,0.25)]"
          >
            <Sparkles size={12} />
            TNS
          </button>

          <nav className="hidden items-center gap-1 md:flex">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => jumpTo(item.id)}
                className="rounded-md px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-slate-200/90 transition hover:bg-white/10 hover:text-cyan-100"
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
           
            <button
              className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-500/60 bg-white/5 text-slate-100 md:hidden"
              onClick={() => setOpenMenu((v) => !v)}
              aria-label="Toggle menu"
            >
              {openMenu ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>
        </div>

        {openMenu && (
          <nav className="grid grid-cols-2 gap-2 border-t border-slate-700/60 bg-slate-950/70 px-4 py-3 md:hidden">
            <div className="col-span-2 mb-1 inline-flex items-center gap-2 rounded-md border border-cyan-300/35 bg-cyan-300/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-cyan-100">
              <span className="status-dot" />
              Tech-Noir Mode
            </div>
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => jumpTo(item.id)}
                className="rounded-md border border-slate-500/50 bg-white/5 px-3 py-2 text-left text-xs font-semibold uppercase tracking-[0.12em]"
              >
                {item.label}
              </button>
            ))}
          </nav>
        )}
      </header>

      <main className="site-main relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 pb-14 pt-24 sm:gap-10 sm:px-6 sm:pt-24 md:gap-12 md:pt-24">
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
                  4th-year IT student at HUTECH University with hands-on experience building web applications using React.js and
                  Tailwind CSS. Passionate about clean UI and eager to grow within a professional frontend team.
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
                  <span>168 Nguyen Gia Tri, Binh Thanh, Ho Chi Minh City</span>
                </p>
              </div>
              <div className="neo-tile glass-tile hover-lift rounded-xl p-4">
                <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500">Education</p>
                <p className="mt-1 flex items-start gap-2 text-sm text-slate-200">
                  <GraduationCap size={14} className="mt-0.5 text-cyan-300" />
                  Information Technology - HUTECH (2022 - Present)
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

       

        <section className="hud-strip section-reveal is-visible grid gap-2 rounded-2xl border border-cyan-300/25 bg-slate-950/40 px-4 py-3 sm:grid-cols-3">
          <div className="hud-item">
            <span className="status-dot" />
            <span>SYSTEM ONLINE</span>
          </div>
          <div className="hud-item">
            <span className="text-slate-400">LOCAL TIME:</span>
            <span ref={timeRef}>--:--:-- (GMT+7)</span>
          </div>
          <div className="hud-item">
            <span className="text-slate-400">STATUS:</span>
            <span>Open for Internship</span>
          </div>
        </section>

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
                4th-year IT student at HUTECH University with hands-on experience building web applications using React.js and
                Tailwind CSS. Passionate about clean UI and eager to grow within a professional frontend team.
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

        <section
          ref={skillsRef}
          id="skills"
          className={`section-shell skills-shell glass-card scroll-mt-20 flex flex-col justify-between rounded-2xl p-4 sm:p-5 md:p-6 section-reveal ${
            skillsVisible ? "is-visible" : ""
          }`}
        >
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="section-kicker">
                <span className="section-index">02</span>
                Skills
              </p>
              <h2 className="section-title mt-2 text-3xl font-bold text-white sm:text-4xl">Skills</h2>
            </div>
            <p className="max-w-xs text-sm text-slate-300">Focused on frontend fundamentals, UI implementation, and team collaboration tools.</p>
          </div>

          <div className="mt-4 grid flex-1 content-evenly gap-3 md:grid-cols-2 lg:grid-cols-3">
            {Object.keys(groupedSkills).map((group) => (
              <div key={group} className="skill-panel neo-tile glass-tile hover-lift rounded-xl p-4">
                <p className="mb-3 text-[11px] uppercase tracking-[0.12em] text-slate-500">{group}</p>
                <div className="flex flex-wrap gap-2">
                  {groupedSkills[group].map((item) => (
                    <span key={item} className="rounded-md border border-slate-400/40 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-100">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section
          ref={projectsRef}
          id="projects"
          className={`section-shell projects-shell scroll-mt-20 flex flex-col justify-between section-reveal ${
            projectsVisible ? "is-visible" : ""
          }`}
        >
          <p className="section-kicker">
            <span className="section-index">03</span>
            Projects
          </p>
          <h2 className="section-title mt-2 text-3xl font-bold text-white sm:text-4xl">Projects</h2>

          <div className="mt-4 grid flex-1 content-stretch gap-3 sm:gap-4 lg:grid-cols-2">
            {PROJECTS.map((project, index) => (
              <article
                key={project.name}
                className={`tilt-card project-shell glass-card hover-lift flex h-full flex-col rounded-2xl p-4 sm:p-5 ${
                  index % 2 === 1 ? "project-shell-alt" : ""
                }`}
                onMouseMove={liteMotion ? undefined : onTiltMove}
                onMouseLeave={liteMotion ? undefined : onTiltLeave}
              >
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-base font-bold text-white sm:text-lg">{project.name}</h3>
                    <p className="mt-1 text-xs text-slate-400">{project.period}</p>
                    <p className="mt-1 text-xs text-slate-500">{project.team}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="project-index">#{String(index + 1).padStart(2, "0")}</span>
                    <span className="rounded-full border border-cyan-300/50 bg-cyan-300/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-cyan-100">
                      {project.status}
                    </span>
                  </div>
                </div>

                <ul className="space-y-2 text-sm leading-6 text-slate-300">
                  {project.bullets.map((bullet) => (
                    <li key={bullet} className="flex items-start gap-2">
                      <BriefcaseBusiness size={14} className="mt-1 shrink-0 text-cyan-300" />
                      {bullet}
                    </li>
                  ))}
                </ul>

                <div className="mt-4 flex flex-wrap gap-2">
                  {project.tech.map((tech) => (
                    <span key={tech} className="rounded-md border border-slate-400/40 bg-white/5 px-2.5 py-1 text-[11px] text-slate-200">
                      {tech}
                    </span>
                  ))}
                </div>

                <a
                  href={project.github}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-400/50 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:border-cyan-300/60 hover:text-cyan-100 sm:w-auto"
                >
                  <GitBranch size={15} />
                  View GitHub
                  <ArrowUpRight size={14} />
                </a>
              </article>
            ))}
          </div>
        </section>

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
      </main>
    </div>
  );
}
