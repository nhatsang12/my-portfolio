import { useEffect, useRef, useState } from "react";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { StatusBar } from "./components/StatusBar";
import { About } from "./components/About";
import { SkillsSection } from "./components/SkillsSection";
import { ProjectsSection } from "./components/ProjectsSection";
import { Contact } from "./components/Contact";
import { useSectionReveal } from "./hooks/useSectionReveal";

export default function App() {
  const rootRef = useRef(null);
  const progressBarRef = useRef(null);
  const timeRef = useRef(null);
  const tiltRafMapRef = useRef(new WeakMap());
  const tiltPointMapRef = useRef(new WeakMap());
  const [liteMotion, setLiteMotion] = useState(false);
  const [homeRef, homeVisible] = useSectionReveal(0.05);
  const [aboutRef, aboutVisible] = useSectionReveal(0.08);
  const [skillsRef, skillsVisible] = useSectionReveal(0.08);
  const [projectsRef, projectsVisible] = useSectionReveal(0.08);
  const [contactRef, contactVisible] = useSectionReveal(0.08);

  const jumpTo = (id) => {
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

      <Header jumpTo={jumpTo} />

      <main className="site-main relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 pb-14 pt-24 sm:gap-10 sm:px-6 sm:pt-24 md:gap-12 md:pt-24">
        <Hero homeRef={homeRef} homeVisible={homeVisible} />

        <StatusBar timeRef={timeRef} />

        <About aboutRef={aboutRef} aboutVisible={aboutVisible} />

        <SkillsSection skillsRef={skillsRef} skillsVisible={skillsVisible} />

        <ProjectsSection
          projectsRef={projectsRef}
          projectsVisible={projectsVisible}
          liteMotion={liteMotion}
          onTiltMove={onTiltMove}
          onTiltLeave={onTiltLeave}
        />

        <Contact contactRef={contactRef} contactVisible={contactVisible} />
      </main>
    </div>
  );
}
