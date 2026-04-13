import { BriefcaseBusiness, GitBranch, ExternalLink, ArrowUpRight } from "lucide-react";
import { PROJECTS } from "../constants/projects";

export function ProjectsSection({ projectsRef, projectsVisible, liteMotion, onTiltMove, onTiltLeave }) {
  return (
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

            <div className="mt-5 flex flex-wrap gap-2">
              <a
                href={project.github}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-slate-400/50 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:border-cyan-300/60 hover:text-cyan-100"
              >
                <GitBranch size={15} />
                View GitHub
                <ArrowUpRight size={14} />
              </a>
              {project.demo && (
                <a
                  href={project.demo}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-cyan-300/40 bg-cyan-300/10 px-4 py-2 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-300/20"
                >
                  <ExternalLink size={14} />
                  Live Demo
                </a>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
