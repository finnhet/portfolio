"use client";
import { AnimatePresence } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { DesktopContext, type DesktopState, type Win } from "@/components/de/Desktop";
import { DesktopIcons } from "@/components/de/DesktopIcons";
import { FloatWindow } from "@/components/de/FloatWindow";
import { Launcher } from "@/components/de/Launcher";
import { Panel, useTheme } from "@/components/de/Panel";
import { getApp } from "@/components/de/apps";

/** Frisian-horizon wallpaper: wide sky, water band, one low sun. */
function Wallpaper() {
  return (
    <div aria-hidden className="fixed inset-0 -z-10">
      <div className="absolute inset-0 bg-gradient-to-b from-water/25 via-bg to-bg" />
      <div className="absolute right-[16%] top-[34%] h-40 w-40 rounded-full bg-amber/15 blur-3xl" />
      <div className="absolute inset-x-0 top-[58%] h-px bg-water/30" />
      <div className="absolute inset-x-[6%] top-[63%] h-px bg-water/20" />
      <div className="absolute inset-x-[14%] top-[67%] h-px bg-water/10" />
      <div className="absolute inset-x-0 bottom-0 top-[58%] bg-gradient-to-b from-water/10 to-transparent" />
    </div>
  );
}

export default function Home() {
  const [windows, setWindows] = useState<Win[]>([
    { app: "welcome", x: 120, y: 48, z: 1, min: false, max: false },
  ]);
  const [launcherOpen, setLauncherOpen] = useState(false);
  const { dark, toggle } = useTheme();
  const zTop = useRef(1);
  const smallScreen = useRef(false);

  // Phones get every window maximized — floating windows need room.
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const apply = () => {
      smallScreen.current = mq.matches;
      if (mq.matches) setWindows((ws) => ws.map((w) => ({ ...w, max: true })));
    };
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  // Pin the document while the desktop is mounted; /dailycat scrolls normally.
  useEffect(() => {
    document.body.classList.add("wm-desktop");
    return () => document.body.classList.remove("wm-desktop");
  }, []);

  const open = useCallback((app: string) => {
    setWindows((ws) => {
      const z = ++zTop.current;
      if (ws.some((w) => w.app === app)) {
        return ws.map((w) => (w.app === app ? { ...w, min: false, z } : w));
      }
      const n = ws.length;
      return [
        ...ws,
        {
          app,
          x: 96 + ((n * 48) % 280),
          y: 36 + ((n * 36) % 220),
          z,
          min: false,
          max: smallScreen.current,
        },
      ];
    });
  }, []);

  const close = useCallback((app: string) => {
    setWindows((ws) => ws.filter((w) => w.app !== app));
  }, []);

  const focus = useCallback((app: string) => {
    setWindows((ws) => {
      const top = ws.reduce((a, b) => (a.z > b.z ? a : b), ws[0]);
      if (top?.app === app && !top.min) return ws;
      const z = ++zTop.current;
      return ws.map((w) => (w.app === app ? { ...w, z } : w));
    });
  }, []);

  const toggleMin = useCallback((app: string) => {
    setWindows((ws) =>
      ws.map((w) =>
        w.app === app ? { ...w, min: !w.min, z: w.min ? ++zTop.current : w.z } : w
      )
    );
  }, []);

  const toggleMax = useCallback((app: string) => {
    setWindows((ws) =>
      ws.map((w) => (w.app === app ? { ...w, max: !w.max, z: ++zTop.current } : w))
    );
  }, []);

  const moveTo = useCallback((app: string, x: number, y: number) => {
    setWindows((ws) => ws.map((w) => (w.app === app ? { ...w, x, y } : w)));
  }, []);

  const minimizeAll = useCallback(() => {
    setWindows((ws) => ws.map((w) => ({ ...w, min: true })));
  }, []);

  const focused = useMemo(() => {
    const visible = windows.filter((w) => !w.min);
    if (visible.length === 0) return null;
    return visible.reduce((a, b) => (a.z > b.z ? a : b)).app;
  }, [windows]);

  const desktop = useMemo<DesktopState>(
    () => ({ windows, focused, open, close, focus, toggleMin, toggleMax, moveTo, minimizeAll }),
    [windows, focused, open, close, focus, toggleMin, toggleMax, moveTo, minimizeAll]
  );

  // Esc closes the launcher first, then the focused window; t toggles theme.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const target = e.target as HTMLElement | null;
      if (target && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)))
        return;
      if (e.key === "Escape") {
        if (launcherOpen) setLauncherOpen(false);
        else if (focused) close(focused);
      } else if (e.key === "t") {
        toggle();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [launcherOpen, focused, close, toggle]);

  return (
    <DesktopContext.Provider value={desktop}>
      <Wallpaper />
      <main className="absolute inset-x-0 bottom-11 top-0 overflow-hidden" aria-label="Desktop">
        <DesktopIcons />
        <AnimatePresence>
          {windows.map((w) => (
            <FloatWindow key={w.app} win={w} app={getApp(w.app)} focused={focused === w.app} />
          ))}
        </AnimatePresence>
      </main>
      <Panel
        launcherOpen={launcherOpen}
        onToggleLauncher={() => setLauncherOpen((o) => !o)}
        dark={dark}
        onToggleTheme={toggle}
      />
      <AnimatePresence>
        {launcherOpen && <Launcher onClose={() => setLauncherOpen(false)} />}
      </AnimatePresence>
    </DesktopContext.Provider>
  );
}
