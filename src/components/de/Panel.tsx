"use client";
import { useEffect, useState } from "react";
import { getApp } from "./apps";
import { useDesktop } from "./Desktop";

function Clock() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    const tick = () => setNow(new Date());
    tick();
    const id = setInterval(tick, 10_000);
    return () => clearInterval(id);
  }, []);
  // Client-only so server and client markup never disagree.
  return (
    <div
      className="px-2 text-right font-mono leading-tight text-dim"
      suppressHydrationWarning
    >
      <div className="text-xs tabular-nums text-ink">
        {now ? now.toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit" }) : "--:--"}
      </div>
      <div className="hidden text-[10px] sm:block">
        {now
          ? now.toLocaleDateString("nl-NL", { day: "numeric", month: "short", year: "numeric" })
          : ""}
      </div>
    </div>
  );
}

export function useTheme() {
  const [dark, setDark] = useState<boolean | null>(null);
  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);
  const toggle = () => {
    const next = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {}
    setDark(next);
  };
  return { dark, toggle };
}

type PanelProps = {
  launcherOpen: boolean;
  onToggleLauncher: () => void;
  dark: boolean | null;
  onToggleTheme: () => void;
};

/** The bottom panel: launcher, task manager, system tray, clock, show-desktop. */
export function Panel({ launcherOpen, onToggleLauncher, dark, onToggleTheme }: PanelProps) {
  const { windows, focused, focus, toggleMin, minimizeAll } = useDesktop();

  return (
    <footer className="fixed inset-x-0 bottom-0 z-[900] flex h-11 items-stretch border-t border-line bg-bg/90 backdrop-blur-sm">
      <button
        onClick={onToggleLauncher}
        aria-label="Application launcher"
        aria-expanded={launcherOpen}
        className={`grid w-11 shrink-0 place-items-center text-lg transition-colors duration-150 ${
          launcherOpen ? "bg-surface-2 text-amber" : "text-amber hover:bg-surface-2"
        }`}
      >
        ❖
      </button>

      <div className="mx-1 my-2 w-px shrink-0 bg-line" aria-hidden />

      <div className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto px-1">
        {windows.map((w) => {
          const app = getApp(w.app);
          const active = focused === w.app && !w.min;
          return (
            <button
              key={w.app}
              onClick={() => (w.min ? toggleMin(w.app) : active ? toggleMin(w.app) : focus(w.app))}
              title={app.title}
              className={`flex h-8 shrink-0 items-center gap-1.5 rounded-sm border-b-2 px-2 font-mono text-xs transition-colors duration-150 hover:bg-surface-2 ${
                active ? "border-amber bg-surface-2 text-ink" : "border-transparent text-dim"
              } ${w.min ? "opacity-55" : ""}`}
            >
              <span
                aria-hidden
                className={`grid h-4 w-4 place-items-center rounded-sm text-[9px] text-bg ${app.tint}`}
              >
                {app.glyph}
              </span>
              <span className="hidden max-w-28 truncate sm:inline">{app.name}</span>
            </button>
          );
        })}
      </div>

      <div className="flex shrink-0 items-center gap-1 pr-0.5">
        <button
          onClick={onToggleTheme}
          aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
          title="Toggle theme [t]"
          className="grid h-8 w-8 place-items-center rounded-sm font-mono text-sm text-dim transition-colors duration-150 hover:bg-surface-2 hover:text-ink"
        >
          {dark === null ? "·" : dark ? "●" : "○"}
        </button>
        <Clock />
        <button
          onClick={minimizeAll}
          aria-label="Show desktop"
          title="Show desktop"
          className="h-full w-1.5 border-l border-line transition-colors duration-150 hover:bg-amber/50"
        />
      </div>
    </footer>
  );
}
