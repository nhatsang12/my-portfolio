import { useMemo } from "react";
import { SKILLS } from "../constants/skills";

export function SkillsSection({ skillsRef, skillsVisible }) {
  const groupedSkills = useMemo(() => {
    return SKILLS.reduce((acc, item) => {
      if (!acc[item.type]) acc[item.type] = [];
      acc[item.type].push(item.name);
      return acc;
    }, {});
  }, []);

  return (
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
  );
}
