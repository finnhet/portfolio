"use client";
import { motion } from "framer-motion";
import { APPS } from "./apps";
import { useDesktop } from "./Desktop";
import { CONTACT } from "@/lib/data";

const SHORTCUTS = [
  { label: "daily cat", href: "/dailycat", external: false },
  { label: "github", href: CONTACT.github, external: true },
  { label: "linkedin", href: CONTACT.linkedin, external: true },
  { label: "email", href: `mailto:${CONTACT.email}`, external: false },
];

/** Kickoff-style application launcher, anchored to the panel's launcher button. */
export function Launcher({ onClose }: { onClose: () => void }) {
  const { open } = useDesktop();
  return (
    <>
      {/* click-away layer */}
      <div className="fixed inset-0 z-[940]" onClick={onClose} aria-hidden />
      <motion.div
        role="menu"
        aria-label="Application launcher"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10, transition: { duration: 0.1 } }}
        transition={{ duration: 0.15, ease: [0.2, 0.8, 0.2, 1] }}
        className="fixed bottom-12 left-1 z-[950] w-80 max-w-[calc(100vw-8px)] overflow-hidden rounded-md border border-line bg-surface shadow-[0_18px_50px_-12px_rgba(0,0,0,0.45)]"
      >
        <div className="flex items-center gap-3 border-b border-line bg-surface-2/40 p-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-amber font-mono text-sm text-bg">
            FH
          </span>
          <div className="min-w-0">
            <p className="truncate font-semibold tracking-tight text-ink">Finn Hettinga</p>
            <p className="truncate font-mono text-xs text-dim">full-stack web developer</p>
          </div>
        </div>

        <ul className="p-1">
          {APPS.map((app) => (
            <li key={app.id}>
              <button
                role="menuitem"
                onClick={() => {
                  open(app.id);
                  onClose();
                }}
                className="flex w-full items-center gap-3 rounded-sm px-2 py-2 text-left transition-colors duration-100 hover:bg-surface-2"
              >
                <span
                  aria-hidden
                  className={`grid h-8 w-8 shrink-0 place-items-center rounded-md text-sm text-bg ${app.tint}`}
                >
                  {app.glyph}
                </span>
                <span className="min-w-0">
                  <span className="block font-mono text-sm text-ink">{app.name}</span>
                  <span className="block truncate text-xs text-dim">{app.desc}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>

        <div className="grid grid-cols-2 gap-1 border-t border-line p-1">
          {SHORTCUTS.map((s) => (
            <a
              key={s.label}
              role="menuitem"
              href={s.href}
              target={s.external ? "_blank" : undefined}
              rel={s.external ? "noreferrer" : undefined}
              onClick={onClose}
              className="rounded-sm px-2 py-1.5 font-mono text-xs text-dim transition-colors duration-100 hover:bg-surface-2 hover:text-ink"
            >
              {s.label} ↗
            </a>
          ))}
        </div>

      </motion.div>
    </>
  );
}
