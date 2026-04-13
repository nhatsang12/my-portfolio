import { Menu, Sparkles, X } from "lucide-react";
import { useState } from "react";
import { NAV_ITEMS } from "../constants/nav";

export function Header({ jumpTo }) {
  const [openMenu, setOpenMenu] = useState(false);

  return (
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
              onClick={() => {
                jumpTo(item.id);
                setOpenMenu(false);
              }}
              className="rounded-md border border-slate-500/50 bg-white/5 px-3 py-2 text-left text-xs font-semibold uppercase tracking-[0.12em]"
            >
              {item.label}
            </button>
          ))}
        </nav>
      )}
    </header>
  );
}
