"use client";
import { motion, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import type { AppDef } from "./apps";
import { useDesktop, type Win } from "./Desktop";

function clamp(v: number, lo: number, hi: number) {
  return Math.min(Math.max(v, lo), hi);
}

function TitleButton({
  label,
  onClick,
  close = false,
  children,
}: {
  label: string;
  onClick: () => void;
  close?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      aria-label={label}
      title={label}
      onClick={onClick}
      className={`grid h-6 w-6 shrink-0 place-items-center rounded-full font-mono text-xs text-dim transition-colors duration-150 ${
        close ? "hover:bg-red-500/80 hover:text-white" : "hover:bg-surface-2 hover:text-ink"
      }`}
    >
      {children}
    </button>
  );
}

/** A floating, draggable Plasma-style window. */
export function FloatWindow({ win, app, focused }: { win: Win; app: AppDef; focused: boolean }) {
  const { close, focus, toggleMin, toggleMax, moveTo } = useDesktop();
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);

  // Manual title-bar drag: mutate left/top directly while moving (no React
  // re-render per frame), commit the final position to state on release.
  const startDrag = (e: React.PointerEvent) => {
    if (win.max || e.button !== 0) return;
    if ((e.target as HTMLElement).closest("button")) return;
    const el = ref.current;
    const desk = el?.parentElement;
    if (!el || !desk) return;
    e.preventDefault();
    const offX = e.clientX - win.x;
    const offY = e.clientY - win.y;
    let nx = win.x;
    let ny = win.y;
    const move = (ev: PointerEvent) => {
      nx = clamp(ev.clientX - offX, 96 - el.offsetWidth, desk.clientWidth - 96);
      ny = clamp(ev.clientY - offY, 0, desk.clientHeight - 40);
      el.style.left = `${nx}px`;
      el.style.top = `${ny}px`;
    };
    const up = () => {
      window.removeEventListener("pointermove", move);
      moveTo(win.app, nx, ny);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up, { once: true });
  };

  return (
    <motion.section
      ref={ref}
      aria-label={app.name}
      aria-hidden={win.min}
      inert={win.min}
      initial={reduce ? false : { opacity: 0, scale: 0.92 }}
      animate={
        win.min
          ? { opacity: 0, scale: 0.88, y: 32 }
          : { opacity: 1, scale: 1, y: 0 }
      }
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.12 } }}
      transition={{ duration: reduce ? 0 : 0.16, ease: [0.2, 0.8, 0.2, 1] }}
      onPointerDownCapture={() => focus(win.app)}
      style={
        win.max
          ? { zIndex: win.z }
          : {
              zIndex: win.z,
              left: win.x,
              top: win.y,
              width: app.width,
              maxWidth: "calc(100% - 12px)",
              maxHeight: `calc(100% - ${win.y + 8}px)`,
            }
      }
      className={`absolute flex flex-col overflow-hidden border bg-surface ${
        win.max ? "inset-0 rounded-none" : "rounded-md"
      } ${win.min ? "pointer-events-none" : ""} ${
        focused
          ? "border-amber shadow-[0_18px_50px_-12px_rgba(0,0,0,0.45)]"
          : "border-line shadow-[0_8px_24px_-12px_rgba(0,0,0,0.25)]"
      }`}
    >
      <header
        onPointerDown={startDrag}
        onDoubleClick={(e) => {
          if (!(e.target as HTMLElement).closest("button")) toggleMax(win.app);
        }}
        className={`flex shrink-0 touch-none select-none items-center gap-2 border-b px-2 py-1.5 ${
          win.max ? "" : "cursor-grab active:cursor-grabbing"
        } ${focused ? "border-amber/40 bg-surface-2/60" : "border-line bg-surface-2/30"}`}
      >
        <span
          aria-hidden
          className={`grid h-4 w-4 shrink-0 place-items-center rounded-sm text-[9px] text-bg ${app.tint}`}
        >
          {app.glyph}
        </span>
        <span
          className={`min-w-0 flex-1 truncate text-center font-mono text-xs ${
            focused ? "text-ink" : "text-dim"
          }`}
        >
          {app.title}
        </span>
        <TitleButton label="Minimize" onClick={() => toggleMin(win.app)}>
          –
        </TitleButton>
        <TitleButton label={win.max ? "Restore" : "Maximize"} onClick={() => toggleMax(win.app)}>
          {win.max ? "❐" : "□"}
        </TitleButton>
        <TitleButton label="Close" close onClick={() => close(win.app)}>
          ✕
        </TitleButton>
      </header>
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4 sm:p-6">
        <app.Component />
      </div>
    </motion.section>
  );
}
