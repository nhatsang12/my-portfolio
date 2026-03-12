import { useState, useEffect, useRef, useCallback } from "react";

// ─── DATA ─────────────────────────────────────────────────────────────────────
const NAV_ITEMS = ["HOME", "ABOUT", "SKILLS", "WORK", "CONTACT"];

const skills = [
  { name: "React.js", type: "FRAMEWORK" },
  { name: "JavaScript", type: "LANGUAGE" },
  { name: "HTML / CSS", type: "LAYOUT" },
  { name: "Tailwind CSS", type: "STYLING" },
  { name: "Node.js", type: "BACKEND" },
  { name: "Kotlin", type: "LANGUAGE" },
  { name: "Figma", type: "DESIGN" },
  { name: "Git / GitHub", type: "TOOL" },
];

const projects = [
  {
    num: "01", name: "Event Ticketing Platform",
    tech: ["React.js", "React Router", "Tailwind CSS", "Lucide React"],
    desc: "Online ticketing system: search, book, pay for tickets - admin dashboard with KPI & revenue chart",
    year: "2026 - now", status: "BUILT",
    github: "https://github.com/nhatsang12/EventTicketMangement",
  },
  {
    num: "02", name: "Social App (Mobile)",
    tech: ["Kotlin", "XML", "Figma", "Android Studio"],
    desc: "Mobile social app with posts, Reels feed, full-screen video playback - UI designed in Figma",
    year: "2025", status: "BUILT",
    github: "https://github.com/VanVinh1604/SocialMedia",
  },
];

const TICKER_ITEMS = ["React.js", "JavaScript", "HTML", "CSS", "Tailwind CSS", "Node.js", "Kotlin", "Figma", "Git", "Android Studio", "React Router", "XML"];

// ─── COLORS ───────────────────────────────────────────────────────────────────
// CHANGED: Brightened sub, dim, mid, soft, line for better readability on dark bg
const C = {
  bg: "#04080f", paper: "#070e1a", line: "#1b3050",       // line: #0e1c30 → #1b3050
  sub: "#3d5f82", dim: "#7090b4", mid: "#90aac8",         // sub: #1a2e48→#3d5f82, dim: #4a6480→#7090b4, mid: #7a93b0→#90aac8
  soft: "#b8cede", light: "#d6e6f2",                      // soft: #a8bdd0→#b8cede, light: #ccdae8→#d6e6f2
  white: "#f1f5f9", red: "#f1f5f9", redHalf: "#f1f5f940", redFaint: "#f1f5f910",
  gradient: "radial-gradient(ellipse at 50% 50%, #0d1f38 0%, #070e1a 45%, #04080f 100%)",
};

// ─── BREAKPOINT HOOK ──────────────────────────────────────────────────────────
function useBreakpoint() {
  const [w, setW] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);
  useEffect(() => {
    const fn = () => setW(window.innerWidth);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);
  const isMobile = w <= 640;
  const isTablet = w > 640 && w <= 1024;
  return { isMobile, isTablet, isDesktop: !isMobile && !isTablet, w };
}

// ─── SLOT MACHINE ─────────────────────────────────────────────────────────────
function SlotChar({ target, slotDelay, play, wordChars }) {
  const [char, setChar] = useState(" ");
  const [flash, setFlash] = useState(false);
  const timerRef = useRef(null);
  const intervalRef = useRef(null);
  const hasPlayed = useRef(false);

  useEffect(() => {
    if (!play || hasPlayed.current) return;
    hasPlayed.current = true;
    clearTimeout(timerRef.current);
    clearInterval(intervalRef.current);
    const letters = wordChars.filter(c => c !== " ");
    const reel = [...letters, target];
    let count = 0;
    timerRef.current = setTimeout(() => {
      intervalRef.current = setInterval(() => {
        if (count < reel.length - 1) { setChar(reel[count % (reel.length - 1)]); count++; }
        else {
          clearInterval(intervalRef.current);
          setChar(target); setFlash(true);
          setTimeout(() => setFlash(false), 280);
        }
      }, 55);
    }, slotDelay);
    return () => { clearTimeout(timerRef.current); clearInterval(intervalRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [play]);

  return (
    <span style={{
      display: "inline-block",
      color: flash ? C.red : "inherit",
      textShadow: flash ? `0 0 30px ${C.red}88` : "none",
      transition: flash ? "color 0.05s, text-shadow 0.05s" : "color 0.28s, text-shadow 0.28s",
    }}>{char}</span>
  );
}

function SlotBgText({ text, play }) {
  const chars = text.split("");
  const wordChars = chars.filter(c => c !== " ");
  return (
    <div aria-hidden="true" style={{
      position: "absolute", bottom: "-0.04em", left: "-0.01em",
      zIndex: 0, pointerEvents: "none", userSelect: "none",
      fontFamily: "'DM Serif Display', serif",
      fontWeight: 900, fontStyle: "italic",
      fontSize: "clamp(60px, 18vw, 230px)",
      lineHeight: 1, letterSpacing: "-4px", whiteSpace: "nowrap",
      color: C.white, opacity: 0.045,
    }}>
      {chars.map((ch, i) =>
        ch === " "
          ? <span key={i} style={{ display: "inline-block", width: "0.28em" }} />
          : <SlotChar key={i} target={ch} slotDelay={i * 40} play={play} wordChars={wordChars} />
      )}
    </div>
  );
}

// ─── CUSTOM CURSOR ────────────────────────────────────────────────────────────
function Cursor({ isMobile }) {
  const pos = useRef({ x: -100, y: -100 });
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const ring = useRef({ x: -100, y: -100 });
  const raf = useRef(null);

  useEffect(() => {
    if (isMobile) return;
    const move = (e) => { pos.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener("mousemove", move);
    const tick = () => {
      ring.current.x += (pos.current.x - ring.current.x) * 0.12;
      ring.current.y += (pos.current.y - ring.current.y) * 0.12;
      if (dotRef.current) dotRef.current.style.transform = `translate(${pos.current.x - 3}px,${pos.current.y - 3}px)`;
      if (ringRef.current) ringRef.current.style.transform = `translate(${ring.current.x - 16}px,${ring.current.y - 16}px)`;
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => { window.removeEventListener("mousemove", move); cancelAnimationFrame(raf.current); };
  }, [isMobile]);

  if (isMobile) return null;

  return (
    <>
      <div ref={dotRef} style={{ position: "fixed", top: 0, left: 0, width: 6, height: 6, borderRadius: "50%", background: C.red, zIndex: 9999, pointerEvents: "none", willChange: "transform" }} />
      <div ref={ringRef} style={{ position: "fixed", top: 0, left: 0, width: 32, height: 32, borderRadius: "50%", border: `1px solid ${C.red}66`, zIndex: 9998, pointerEvents: "none", willChange: "transform", transition: "width 0.2s, height 0.2s" }} />
    </>
  );
}

// ─── TICKER ───────────────────────────────────────────────────────────────────
function Ticker() {
  const repeated = [...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS];
  return (
    <div style={{
      position: "fixed", bottom: 0, left: 0, right: 0, height: 28,
      borderTop: `1px solid ${C.line}`, background: C.bg,
      overflow: "hidden", zIndex: 500, display: "flex", alignItems: "center",
    }}>
      <div style={{ display: "flex", animation: "ticker 22s linear infinite", whiteSpace: "nowrap" }}>
        {repeated.map((item, i) => (
          <span key={i} style={{ color: C.dim, fontSize: 9, fontFamily: "'DM Sans', sans-serif", letterSpacing: 3, marginRight: 40 }}>
            <span style={{ color: C.red, marginRight: 12 }}>✦</span>{item}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── TOP NAV ──────────────────────────────────────────────────────────────────
function TopNav({ activeIdx, scrollTo, isMobile }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleNav = (i) => { scrollTo(i); setMenuOpen(false); };

  return (
    <>
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, height: 52,
        borderBottom: `1px solid ${C.line}`, background: `${C.bg}ee`,
        backdropFilter: "blur(12px)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: isMobile ? "0 20px" : "0 48px", zIndex: 500,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 22, height: 22, borderRadius: 4, background: "#0d2447", border: "1px solid #1b3050", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "#90aac8", fontSize: 9, fontWeight: 900, fontFamily: "'DM Sans', sans-serif" }}>TNS</span>
          </div>
          <span style={{ color: C.dim, fontSize: 9, fontFamily: "'DM Sans', sans-serif", letterSpacing: 3 }}>PORTFOLIO.25</span>
        </div>

        {isMobile ? (
          /* Hamburger button */
          <button onClick={() => setMenuOpen(o => !o)} style={{
            background: "none", border: "none", cursor: "pointer", padding: 6,
            display: "flex", flexDirection: "column", gap: 4, zIndex: 600,
          }}>
            {[0, 1, 2].map(i => (
              <span key={i} style={{
                display: "block", width: 20, height: 1.5,
                background: menuOpen ? (i === 1 ? "transparent" : C.red) : C.mid,
                borderRadius: 1,
                transform: menuOpen
                  ? (i === 0 ? "rotate(45deg) translate(4px, 4px)" : i === 2 ? "rotate(-45deg) translate(4px, -4px)" : "none")
                  : "none",
                transition: "all 0.25s",
              }} />
            ))}
          </button>
        ) : (
          <>
            <div style={{ display: "flex", gap: 32 }}>
              {NAV_ITEMS.map((item, i) => (
                <button key={i} onClick={() => scrollTo(i)} style={{
                  background: "none", border: "none", cursor: "pointer",
                  color: i === activeIdx ? C.white : C.mid,
                  fontSize: 9, fontFamily: "'DM Sans', sans-serif", letterSpacing: 3,
                  padding: "4px 0", position: "relative",
                  transition: "color 0.3s",
                }}>
                  {i === activeIdx && (
                    <span style={{ position: "absolute", bottom: -1, left: 0, right: 0, height: 1, background: C.red }} />
                  )}
                  {item}
                </button>
              ))}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 5, height: 5, borderRadius: "50%", background: C.red, animation: "pulse_dot 2s ease-in-out infinite" }} />
              <span style={{ color: C.dim, fontSize: 9, fontFamily: "'DM Sans', sans-serif", letterSpacing: 2 }}>AVAILABLE</span>
            </div>
          </>
        )}
      </div>

      {/* Mobile full-screen menu overlay */}
      {isMobile && menuOpen && (
        <div style={{
          position: "fixed", inset: 0, background: `${C.bg}f5`,
          backdropFilter: "blur(16px)", zIndex: 490,
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 32,
        }}>
          {NAV_ITEMS.map((item, i) => (
            <button key={i} onClick={() => handleNav(i)} style={{
              background: "none", border: "none", cursor: "pointer",
              color: i === activeIdx ? C.red : C.white,
              fontSize: 28, fontFamily: "'DM Serif Display', serif", fontWeight: 900,
              letterSpacing: 2, fontStyle: i === activeIdx ? "italic" : "normal",
              transition: "color 0.2s",
            }}>
              {item}
            </button>
          ))}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 16 }}>
            <div style={{ width: 5, height: 5, borderRadius: "50%", background: C.red, animation: "pulse_dot 2s ease-in-out infinite" }} />
            <span style={{ color: C.dim, fontSize: 9, fontFamily: "'DM Sans', sans-serif", letterSpacing: 2 }}>AVAILABLE</span>
          </div>
        </div>
      )}
    </>
  );
}

// ─── HOOKS ────────────────────────────────────────────────────────────────────
function useInView(threshold = 0.3) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

function Reveal({ children, inView, delay = 0, x = 0, y = 20 }) {
  return (
    <div style={{
      opacity: inView ? 1 : 0,
      transform: inView ? "translate(0,0)" : `translate(${x}px,${y}px)`,
      transition: `opacity 0.8s ease ${delay}ms, transform 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
    }}>{children}</div>
  );
}

function SlideUp({ children, inView, delay = 0 }) {
  return (
    <div style={{ overflow: "hidden" }}>
      <div style={{
        transform: inView ? "translateY(0%)" : "translateY(110%)",
        transition: `transform 1s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
      }}>{children}</div>
    </div>
  );
}

// ─── SECTION WRAPPER ──────────────────────────────────────────────────────────
function Section({ bgText, children }) {
  const [ref, inView] = useInView(0.25);
  return (
    <div ref={ref} style={{
      width: "100vw", height: "100vh", flexShrink: 0,
      background: C.gradient, position: "relative", overflow: "hidden",
      display: "flex", flexDirection: "column",
    }}>
      <div style={{ position: "absolute", inset: 0, opacity: 0.018, backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`, backgroundSize: "256px", pointerEvents: "none", zIndex: 0 }} />
      <SlotBgText text={bgText} play={inView} />
      <div style={{ position: "relative", zIndex: 2, flex: 1, display: "flex", flexDirection: "column" }}>
        {typeof children === "function" ? children(inView) : children}
      </div>
    </div>
  );
}

// ─── HERO ─────────────────────────────────────────────────────────────────────
function HeroSection({ bp }) {
  const { isMobile, isTablet } = bp;
  const px = isMobile ? "0 20px" : isTablet ? "0 36px" : "0 56px";
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (isMobile) return;
    const handler = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 14;
      const y = (e.clientY / window.innerHeight - 0.5) * 8;
      setTilt({ x, y });
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, [isMobile]);

  return (
    <Section bgText="INTRODUCE">
      {(inView) => (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: px, paddingTop: 52, paddingBottom: 28 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 0", borderBottom: `1px solid ${C.line}`, marginBottom: "auto" }}>
            <Reveal inView={inView} delay={0}>
              <span style={{ color: C.dim, fontSize: 9, fontFamily: "'DM Sans', sans-serif", letterSpacing: 4 }}>FRONTEND DEVELOPER</span>
            </Reveal>
            {!isMobile && (
              <Reveal inView={inView} delay={60}>
                <span style={{ color: C.sub, fontSize: 9, fontFamily: "'DM Sans', sans-serif" }}>HỒ CHÍ MINH, VIỆT NAM</span>
              </Reveal>
            )}
          </div>

          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", transform: `translate(${tilt.x * 0.4}px, ${tilt.y * 0.4}px)`, transition: "transform 0.8s ease" }}>
            {["TIÊU NHẬT", "SANG"].map((line, i) => (
              <SlideUp key={i} inView={inView} delay={120 + i * 110}>
                <div style={{
                  fontSize: isMobile ? "clamp(48px, 14vw, 80px)" : "clamp(68px, 10.5vw, 148px)",
                  fontFamily: "'DM Serif Display', serif",
                  fontWeight: 900,
                  color: i === 0 ? "transparent" : C.white,
                  WebkitTextStroke: i === 1 ? "none" : `1.5px ${C.white}`,
                  letterSpacing: i === 0 ? "-3px" : "-4px",
                  lineHeight: 0.92,
                  fontStyle: i === 1 ? "normal" : "italic",
                }}>
                  {line}
                </div>
              </SlideUp>
            ))}
          </div>

          {!isMobile && (
            <Reveal inView={inView} delay={900}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, padding: "14px 0 4px" }}>
                <div style={{ width: 22, height: 34, border: `1.5px solid ${C.dim}`, borderRadius: 12, position: "relative", display: "flex", justifyContent: "center" }}>
                  <div style={{ width: 3, height: 7, background: C.red, borderRadius: 2, marginTop: 5, animation: "scroll_wheel 1.6s ease-in-out infinite" }} />
                </div>
                <span style={{ color: C.dim, fontSize: 8, fontFamily: "'DM Sans', sans-serif", letterSpacing: 4, textTransform: "uppercase" }}>Scroll to explore</span>
              </div>
            </Reveal>
          )}

          {/* Bottom stats bar */}
          <div style={{
            display: "flex", alignItems: "center",
            justifyContent: isMobile ? "flex-start" : "space-between",
            flexWrap: "wrap", gap: isMobile ? 16 : 0,
            padding: "20px 0", borderTop: `1px solid ${C.line}`,
          }}>
            {[
              { label: "EXPERIENCE", val: "Student 2022–Now" },
              { label: "PROJECTS", val: "2+ Built" },
              { label: "STACK", val: isMobile ? "React · Kotlin · Figma" : "React · HTML/CSS · Kotlin · Figma" },
              { label: "STATUS", val: "Open to Work" },
            ].map((item, i) => (
              <Reveal key={i} inView={inView} delay={500 + i * 80}>
                <div style={{ minWidth: isMobile ? "45%" : "auto" }}>
                  <div style={{ color: C.mid, fontSize: 8, fontFamily: "'DM Sans', sans-serif", letterSpacing: 3, marginBottom: 5 }}>{item.label}</div>
                  <div style={{ color: i === 3 ? C.red : C.white, fontSize: isMobile ? 11 : 12, fontFamily: "'DM Sans', sans-serif", fontWeight: 700 }}>{item.val}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      )}
    </Section>
  );
}

// ─── ABOUT ────────────────────────────────────────────────────────────────────
function AboutSection({ bp }) {
  const { isMobile, isTablet } = bp;
  const px = isMobile ? "0 20px" : isTablet ? "0 36px" : "0 56px";
  const stacked = isMobile || isTablet;

  return (
    <Section bgText="ABOUT ME">
      {(inView) => (
        <div style={{
          flex: 1, display: "flex", padding: px, paddingTop: 52, paddingBottom: 28,
          alignItems: stacked ? "flex-start" : "center",
          flexDirection: stacked ? "column" : "row",
          gap: stacked ? 24 : 64,
          overflowY: stacked ? "auto" : "visible",
        }}>
          <div style={{ flex: stacked ? "none" : "0 0 55%", width: stacked ? "100%" : "auto" }}>
            <Reveal inView={inView} delay={80}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: stacked ? 16 : 32 }}>
                <div style={{ width: 14, height: 1, background: C.red }} />
                <span style={{ color: C.red, fontSize: 8, fontFamily: "'DM Sans', sans-serif", letterSpacing: 4 }}>WHO I AM</span>
              </div>
            </Reveal>

            <div style={{ marginBottom: stacked ? 16 : 32 }}>
              {["ABOUT", "ME"].map((line, i) => (
                <SlideUp key={i} inView={inView} delay={150 + i * 100}>
                  <div style={{
                    fontSize: isMobile ? "clamp(36px, 10vw, 64px)" : "clamp(52px, 7vw, 96px)",
                    fontFamily: "'DM Serif Display', serif", fontWeight: 900,
                    color: i === 0 ? C.white : C.red,
                    fontStyle: i === 1 ? "italic" : "normal",
                    letterSpacing: -2, lineHeight: 0.9,
                  }}>{line}</div>
                </SlideUp>
              ))}
            </div>

            <Reveal inView={inView} delay={420}>
              <p style={{ color: C.soft, fontSize: isMobile ? 13 : 15, lineHeight: 1.85, maxWidth: 480, fontFamily: "'DM Sans', sans-serif", marginBottom: isMobile ? 16 : 28 }}>
                IT student at <strong style={{ color: C.red, fontWeight: 700 }}>Ho Chi Minh City University of Technology</strong> (2022 - present).
                Passionate about creating modern and user-friendly web interfaces, transforming Figma wireframes into fully functional applications.
              </p>
            </Reveal>

            <Reveal inView={inView} delay={540}>
              <div style={{ display: "flex", gap: isMobile ? 8 : 12, flexWrap: "wrap" }}>
                {["Hard-working", "Detail-Oriented", "Team work"].map((tag, i) => (
                  <span key={i} style={{
                    padding: "6px 14px", border: `1px solid ${i === 0 ? C.red + "88" : C.sub}`,
                    borderRadius: 2, color: i === 0 ? C.red : C.soft,
                    fontSize: 9, fontFamily: "'DM Sans', sans-serif", letterSpacing: 2, fontWeight: 600,
                    background: i === 0 ? C.redFaint : "transparent",
                  }}>{tag}</span>
                ))}
              </div>
            </Reveal>
          </div>

          <div style={{ flex: 1, width: stacked ? "100%" : "auto" }}>
            {[
              { n: "2022", label: "Started\nHo Chi Minh City University of Technology" },
              { n: "2+", label: "Projects\nDelivered" },
              { n: "2+", label: "Tech\nPlatforms" },
              { n: "100%", label: "Dedication\n& Passion" },
            ].map((s, i) => (
              <Reveal key={i} inView={inView} delay={300 + i * 100} x={30} y={0}>
                <div style={{ display: "flex", alignItems: "center", gap: isMobile ? 12 : 20, padding: isMobile ? "10px 0" : "16px 0", borderBottom: `1px solid ${C.line}` }}>
                  <div style={{ fontSize: isMobile ? 24 : 36, fontWeight: 900, fontFamily: "'DM Sans', sans-serif", color: C.white, minWidth: isMobile ? 56 : 80 }}>{s.n}</div>
                  <div style={{ color: C.soft, fontSize: isMobile ? 9 : 10, fontFamily: "'DM Sans', sans-serif", letterSpacing: 1, lineHeight: 1.6, whiteSpace: "pre-line", fontWeight: 600 }}>{s.label}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      )}
    </Section>
  );
}

// ─── SKILLS ───────────────────────────────────────────────────────────────────
function SkillsSection({ bp }) {
  const { isMobile, isTablet } = bp;
  const px = isMobile ? "0 20px" : isTablet ? "0 36px" : "0 56px";
  const cols = isMobile || isTablet ? 2 : 4;

  return (
    <Section bgText="MY SKILLS">
      {(inView) => (
        <div style={{ flex: 1, display: "flex", padding: px, paddingTop: 52, paddingBottom: 28, flexDirection: "column", justifyContent: "center" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: isMobile ? 28 : 52 }}>
            <div>
              <Reveal inView={inView} delay={60}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                  <div style={{ width: 14, height: 1, background: C.red }} />
                  <span style={{ color: C.red, fontSize: 8, fontFamily: "'DM Sans', sans-serif", letterSpacing: 4 }}>WHAT I USE</span>
                </div>
              </Reveal>
              {["MY", "STACK"].map((line, i) => (
                <SlideUp key={i} inView={inView} delay={140 + i * 100}>
                  <div style={{
                    fontSize: isMobile ? "clamp(36px, 10vw, 64px)" : "clamp(44px, 6vw, 80px)",
                    fontFamily: "'DM Serif Display', serif", fontWeight: 900,
                    color: i === 0 ? C.white : C.red, fontStyle: i === 1 ? "italic" : "normal",
                    letterSpacing: -2, lineHeight: 0.9,
                  }}>{line}</div>
                </SlideUp>
              ))}
            </div>
            {!isMobile && (
              <Reveal inView={inView} delay={300}>
                <p style={{ color: C.dim, fontSize: 13, maxWidth: 300, lineHeight: 1.7, fontFamily: "'DM Sans', sans-serif", textAlign: "right" }}>
                  Web & Mobile - from React.js to Kotlin Android, always learning new technologies.
                </p>
              </Reveal>
            )}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 0 }}>
            {skills.map((s, i) => (
              <Reveal key={i} inView={inView} delay={350 + i * 60} y={16}>
                <div style={{
                  padding: isMobile ? "14px 0" : "18px 0",
                  borderTop: `1px solid ${C.line}`,
                  borderRight: i % cols !== cols - 1 ? `1px solid ${C.line}` : "none",
                  paddingRight: 20, paddingLeft: i % cols !== 0 ? 20 : 0,
                  cursor: "default", transition: "background 0.2s",
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = C.redFaint; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
                >
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    <span style={{ color: C.dim, fontSize: 8, fontFamily: "'DM Sans', sans-serif", letterSpacing: 1.5, fontWeight: 600 }}>{s.type}</span>
                    <span style={{ color: C.white, fontSize: isMobile ? 12 : 14, fontWeight: 700, fontFamily: "'DM Sans', sans-serif" }}>{s.name}</span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {isMobile && (
            <Reveal inView={inView} delay={700}>
              <p style={{ color: C.dim, fontSize: 12, lineHeight: 1.7, fontFamily: "'DM Sans', sans-serif", marginTop: 24 }}>
                Web & Mobile — from React.js to Kotlin Android, always learning new technologies.
              </p>
            </Reveal>
          )}
        </div>
      )}
    </Section>
  );
}

// ─── PROJECTS ─────────────────────────────────────────────────────────────────
function ProjectsSection({ bp }) {
  const { isMobile, isTablet } = bp;
  const px = isMobile ? "0 20px" : isTablet ? "0 36px" : "0 56px";
  const negMx = isMobile ? -20 : isTablet ? -36 : -56;
  const posPx = isMobile ? 20 : isTablet ? 36 : 56;
  const [hovered, setHovered] = useState(null);

  return (
    <Section bgText="MY WORKS">
      {(inView) => (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: px, paddingTop: 52, paddingBottom: 28 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: isMobile ? 20 : 40 }}>
            <div>
              <Reveal inView={inView} delay={60}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
                  <div style={{ width: 14, height: 1, background: C.red }} />
                  <span style={{ color: C.red, fontSize: 8, fontFamily: "'DM Sans', sans-serif", letterSpacing: 4 }}>SELECTED WORK</span>
                </div>
              </Reveal>
              {["MY", "PROJECTS"].map((line, i) => (
                <SlideUp key={i} inView={inView} delay={140 + i * 100}>
                  <div style={{
                    fontSize: isMobile ? "clamp(36px, 10vw, 56px)" : "clamp(40px, 5.5vw, 72px)",
                    fontFamily: "'DM Serif Display', serif", fontWeight: 900,
                    color: i === 0 ? C.white : C.red, fontStyle: i === 1 ? "italic" : "normal",
                    letterSpacing: -2, lineHeight: 0.9,
                  }}>{line}</div>
                </SlideUp>
              ))}
            </div>
            {!isMobile && (
              <Reveal inView={inView} delay={280}>
                <div style={{ color: C.dim, fontSize: 9, fontFamily: "'DM Sans', sans-serif", letterSpacing: 2, textAlign: "right" }}>
                  <div>{projects.length} PROJECTS</div>
                  <div style={{ color: C.sub, marginTop: 4 }}>2026</div>
                </div>
              </Reveal>
            )}
          </div>

          <div style={{ flex: 1, overflowY: isMobile ? "auto" : "visible" }}>
            {projects.map((p, i) => (
              <Reveal key={i} inView={inView} delay={300 + i * 110}>
                <a
                  href={p.github} target="_blank" rel="noopener noreferrer"
                  onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}
                  style={{
                    display: "flex",
                    flexDirection: isMobile ? "column" : "row",
                    alignItems: isMobile ? "flex-start" : "center",
                    gap: isMobile ? 10 : 28,
                    padding: isMobile ? "14px 0" : "20px 0",
                    borderTop: `1px solid ${hovered === i ? C.red + "30" : C.line}`,
                    cursor: "pointer",
                    background: hovered === i ? C.redFaint : "transparent",
                    transition: "background 0.25s, border-color 0.25s",
                    marginLeft: negMx, marginRight: negMx, paddingLeft: posPx, paddingRight: posPx,
                    textDecoration: "none",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 12, width: "100%" }}>
                    <div style={{ fontSize: 11, fontFamily: "'DM Sans', sans-serif", color: hovered === i ? C.red : C.sub, minWidth: 28, transition: "color 0.25s" }}>{p.num}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ color: C.white, fontSize: isMobile ? 15 : 17, fontWeight: 800, fontFamily: "'DM Sans', sans-serif", marginBottom: 4 }}>{p.name}</div>
                      <div style={{ color: C.soft, fontSize: isMobile ? 10 : 11, fontFamily: "'DM Sans', sans-serif", letterSpacing: 0.5, lineHeight: 1.5 }}>{p.desc}</div>
                      <div style={{ marginTop: 6, display: "flex", alignItems: "center", gap: 5, color: hovered === i ? C.red : C.dim, fontSize: 9, fontFamily: "'DM Sans', sans-serif", letterSpacing: 2, transition: "color 0.25s" }}>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                        </svg>
                        {p.github.replace("https://github.com/", "")}
                      </div>
                    </div>
                    <div style={{ color: hovered === i ? C.red : C.sub, fontSize: 14, transition: "color 0.25s, transform 0.25s", transform: hovered === i ? "translateX(4px)" : "none" }}>→</div>
                  </div>
                  {!isMobile && (
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "flex-end" }}>
                      {p.tech.map((t, j) => (
                        <span key={j} style={{ padding: "4px 10px", border: `1px solid ${C.sub}`, borderRadius: 2, color: C.soft, fontSize: 9, fontFamily: "'DM Sans', sans-serif", letterSpacing: 1, fontWeight: 600 }}>{t}</span>
                      ))}
                    </div>
                  )}
                  {!isMobile && (
                    <div style={{ textAlign: "right", minWidth: 60 }}>
                      <div style={{ color: C.sub, fontSize: 9, fontFamily: "'DM Sans', sans-serif", marginBottom: 4 }}>{p.year}</div>
                      <div style={{ color: C.red, fontSize: 8, fontFamily: "'DM Sans', sans-serif", letterSpacing: 2 }}>{p.status}</div>
                    </div>
                  )}
                </a>
              </Reveal>
            ))}
            <div style={{ borderTop: `1px solid ${C.line}` }} />
          </div>
        </div>
      )}
    </Section>
  );
}

// ─── CONTACT ──────────────────────────────────────────────────────────────────
function ContactSection({ bp }) {
  const { isMobile, isTablet } = bp;
  const px = isMobile ? "0 20px" : isTablet ? "0 36px" : "0 56px";

  return (
    <Section bgText="CONTACT">
      {(inView) => (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: px, paddingTop: 52, paddingBottom: 28, justifyContent: "center" }}>
          <Reveal inView={inView} delay={60}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: isMobile ? 20 : 36 }}>
              <div style={{ width: 14, height: 1, background: C.red }} />
              <span style={{ color: C.red, fontSize: 8, fontFamily: "'DM Sans', sans-serif", letterSpacing: 4 }}>GET IN TOUCH</span>
            </div>
          </Reveal>

          <div style={{ marginBottom: isMobile ? 8 : 16 }}>
            {["LET'S BUILD", "SOMETHING"].map((line, i) => (
              <SlideUp key={i} inView={inView} delay={120 + i * 100}>
                <div style={{
                  fontSize: isMobile ? "clamp(36px, 10vw, 64px)" : "clamp(52px, 8vw, 110px)",
                  fontFamily: "'DM Serif Display', serif", fontWeight: 900,
                  color: i === 0 ? C.white : C.red, fontStyle: i === 1 ? "italic" : "normal",
                  letterSpacing: -3, lineHeight: 0.92,
                }}>{line}</div>
              </SlideUp>
            ))}
            <SlideUp inView={inView} delay={320}>
              <div style={{ fontSize: isMobile ? "clamp(36px, 10vw, 64px)" : "clamp(52px, 8vw, 110px)", fontFamily: "'DM Serif Display', serif", fontWeight: 900, color: "transparent", WebkitTextStroke: `1.5px ${C.sub}`, fontStyle: "italic", letterSpacing: -3, lineHeight: 0.92 }}>TOGETHER.</div>
            </SlideUp>
          </div>

          <div style={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            justifyContent: "space-between",
            alignItems: isMobile ? "flex-start" : "flex-end",
            gap: isMobile ? 20 : 0,
            marginTop: isMobile ? 24 : 40,
          }}>
            <Reveal inView={inView} delay={480}>
              <div>
                <div style={{ color: C.dim, fontSize: 8, fontFamily: "'DM Sans', sans-serif", letterSpacing: 3, marginBottom: 10 }}>EMAIL</div>
                <a href="mailto:nhatsang58@gmail.com" style={{ color: C.white, fontSize: isMobile ? 14 : 18, fontFamily: "'DM Sans', sans-serif", textDecoration: "none", borderBottom: `1px solid ${C.red}`, paddingBottom: 3, transition: "color 0.2s" }}
                  onMouseEnter={e => e.currentTarget.style.color = C.red}
                  onMouseLeave={e => e.currentTarget.style.color = C.white}
                >nhatsang58@gmail.com</a>
              </div>
            </Reveal>

            <Reveal inView={inView} delay={560}>
              <div style={{ display: "flex", gap: 12 }}>
                {[
                  { label: "GitHub", href: "https://github.com/nhatsang12" },
                  { label: "Phone", href: "tel:0394757843" },
                ].map((link, i) => (
                  <a key={i} href={link.href} style={{ color: C.dim, fontSize: 10, fontFamily: "'DM Sans', sans-serif", letterSpacing: 2, textDecoration: "none", padding: "10px 18px", border: `1px solid ${C.line}`, borderRadius: 2, transition: "all 0.2s" }}
                    onMouseEnter={e => { e.currentTarget.style.color = C.white; e.currentTarget.style.borderColor = C.red + "50"; e.currentTarget.style.background = C.redFaint; }}
                    onMouseLeave={e => { e.currentTarget.style.color = C.dim; e.currentTarget.style.borderColor = C.line; e.currentTarget.style.background = "transparent"; }}
                  >{link.label} ↗</a>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      )}
    </Section>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function Portfolio() {
  const bp = useBreakpoint();
  const { isMobile } = bp;

  const containerRef = useRef(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const isScrolling = useRef(false);
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const dragStartScroll = useRef(0);
  const [dragging, setDragging] = useState(false);
  const touchStartX = useRef(0);

  const scrollTo = useCallback((idx) => {
    const el = containerRef.current;
    if (!el) return;
    const clamped = Math.max(0, Math.min(idx, 4));
    el.scrollTo({ left: clamped * el.offsetWidth, behavior: "smooth" });
    setActiveIdx(clamped);
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const h = () => setActiveIdx(Math.round(el.scrollLeft / el.offsetWidth));
    el.addEventListener("scroll", h, { passive: true });
    return () => el.removeEventListener("scroll", h);
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onWheel = (e) => {
      e.preventDefault();
      if (isScrolling.current) return;
      const dir = (e.deltaY || e.deltaX) > 0 ? 1 : -1;
      scrollTo(Math.round(el.scrollLeft / el.offsetWidth) + dir);
      isScrolling.current = true;
      setTimeout(() => { isScrolling.current = false; }, 900);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [scrollTo]);

  useEffect(() => {
    const onKey = (e) => {
      if (["ArrowRight", "ArrowDown"].includes(e.key)) { e.preventDefault(); scrollTo(activeIdx + 1); }
      if (["ArrowLeft", "ArrowUp"].includes(e.key)) { e.preventDefault(); scrollTo(activeIdx - 1); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeIdx, scrollTo]);

  const onMouseDown = (e) => { isDragging.current = true; dragStartX.current = e.clientX; dragStartScroll.current = containerRef.current.scrollLeft; setDragging(true); };
  const onMouseMove = (e) => { if (!isDragging.current) return; containerRef.current.scrollLeft = dragStartScroll.current - (e.clientX - dragStartX.current); };
  const onMouseUp = (e) => {
    if (!isDragging.current) return;
    isDragging.current = false; setDragging(false);
    const dx = e.clientX - dragStartX.current;
    const cur = Math.round(containerRef.current.scrollLeft / containerRef.current.offsetWidth);
    scrollTo(cur + (Math.abs(dx) > 60 ? (dx < 0 ? 1 : -1) : 0));
  };

  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden", background: C.bg, cursor: isMobile ? "auto" : "none" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,300;1,9..40,400&family=DM+Serif+Display:ital@0;1&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'DM Sans', sans-serif; }
        ::-webkit-scrollbar { display: none; }
        a, button { cursor: ${isMobile ? "pointer" : "none"}; }
        @keyframes ticker { from { transform: translateX(0); } to { transform: translateX(-33.33%); } }
        @keyframes pulse_dot {
          0%,100% { opacity:1; box-shadow:0 0 5px #f1f5f9; }
          50%      { opacity:.35; box-shadow:0 0 2px #f1f5f940; }
        }
        @keyframes rv_fadein { from { opacity:0; transform:translateY(-4px); } to { opacity:1; transform:translateY(0); } }
        @keyframes scroll_wheel {
          0%   { opacity: 1; transform: translateY(0); }
          60%  { opacity: 0; transform: translateY(10px); }
          61%  { opacity: 0; transform: translateY(0); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <Cursor isMobile={isMobile} />
      <TopNav activeIdx={activeIdx} scrollTo={scrollTo} isMobile={isMobile} />

      <div
        ref={containerRef}
        onMouseDown={onMouseDown} onMouseMove={onMouseMove}
        onMouseUp={onMouseUp} onMouseLeave={onMouseUp}
        onTouchStart={e => { touchStartX.current = e.touches[0].clientX; }}
        onTouchEnd={e => { const dx = e.changedTouches[0].clientX - touchStartX.current; if (Math.abs(dx) > 50) scrollTo(activeIdx + (dx < 0 ? 1 : -1)); }}
        style={{
          display: "flex", width: "100%", height: "100%",
          overflowX: "auto", overflowY: "hidden",
          scrollSnapType: "x mandatory",
          cursor: dragging ? "grabbing" : (isMobile ? "auto" : "none"),
          userSelect: "none",
        }}
      >
        <div style={{ scrollSnapAlign: "start", flexShrink: 0, width: "100vw", height: "100vh" }}><HeroSection bp={bp} /></div>
        <div style={{ scrollSnapAlign: "start", flexShrink: 0, width: "100vw", height: "100vh" }}><AboutSection bp={bp} /></div>
        <div style={{ scrollSnapAlign: "start", flexShrink: 0, width: "100vw", height: "100vh" }}><SkillsSection bp={bp} /></div>
        <div style={{ scrollSnapAlign: "start", flexShrink: 0, width: "100vw", height: "100vh" }}><ProjectsSection bp={bp} /></div>
        <div style={{ scrollSnapAlign: "start", flexShrink: 0, width: "100vw", height: "100vh" }}><ContactSection bp={bp} /></div>
      </div>

      {/* Right dot nav — hidden on mobile */}
      {!isMobile && (
        <div style={{ position: "fixed", right: 28, top: "50%", transform: "translateY(-50%)", display: "flex", flexDirection: "column", gap: 8, zIndex: 600 }}>
          {NAV_ITEMS.map((_, i) => (
            <button key={i} onClick={() => scrollTo(i)} style={{
              width: 2, height: i === activeIdx ? 32 : 10,
              background: i === activeIdx ? C.red : C.sub,
              border: "none", padding: 0, borderRadius: 2,
              transition: "all 0.4s cubic-bezier(0.34,1.56,0.64,1)",
              boxShadow: i === activeIdx ? `0 0 12px ${C.red}` : "none",
            }} />
          ))}
        </div>
      )}

      {/* Bottom progress dots */}
      <div style={{ position: "fixed", bottom: isMobile ? 36 : 28, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 6, zIndex: 600 }}>
        {NAV_ITEMS.map((_, i) => (
          <div key={i} style={{
            height: 2, borderRadius: 2,
            width: i === activeIdx ? 28 : 6,
            background: i === activeIdx ? C.red : C.sub,
            transition: "all 0.4s cubic-bezier(0.34,1.56,0.64,1)",
          }} />
        ))}
      </div>

      <Ticker />
    </div>
  );
}