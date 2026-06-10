"use client";
import { APPS } from "./apps";
import { useDesktop } from "./Desktop";

/** Desktop icons, top-left. Single click opens — as Plasma intended. */
export function DesktopIcons() {
  const { open } = useDesktop();
  const iconCls =
    "flex w-20 flex-col items-center gap-1.5 rounded-sm p-2 transition-colors duration-100 hover:bg-surface/70 focus-visible:bg-surface/70";
  return (
    <div className="absolute left-2 top-2 z-0 flex max-h-full flex-col flex-wrap content-start gap-1">
      {APPS.map((app) => (
        <button key={app.id} onClick={() => open(app.id)} className={iconCls}>
          <span
            aria-hidden
            className={`grid h-11 w-11 place-items-center rounded-xl text-xl text-bg shadow-sm ${app.tint}`}
          >
            {app.glyph}
          </span>
          <span className="max-w-full truncate font-mono text-[11px] text-ink">{app.name}</span>
        </button>
      ))}
      <a href="/dailycat" className={iconCls}>
        <span
          aria-hidden
          className="grid h-11 w-11 place-items-center rounded-xl bg-surface-2 text-xl shadow-sm"
        >
          🐈
        </span>
        <span className="max-w-full truncate font-mono text-[11px] text-ink">daily cat</span>
      </a>
    </div>
  );
}
