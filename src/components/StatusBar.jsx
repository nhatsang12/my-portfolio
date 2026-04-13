export function StatusBar({ timeRef }) {
  return (
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
  );
}
