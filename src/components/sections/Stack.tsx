"use client";
import { STACK, type SkillLevel } from "@/lib/data";

const LEVEL_GLYPH: Record<SkillLevel, { glyph: string; cls: string; label: string }> = {
  daily: { glyph: "●", cls: "text-amber", label: "installed — daily driver" },
  comfortable: { glyph: "◐", cls: "text-reed", label: "installed" },
  learning: { glyph: "○", cls: "text-water", label: "learning" },
};

/** The "Discover" app: the stack as an installed-software list. */
export function Stack() {
  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-3">
        {STACK.map((group) => (
          <div key={group.group} className="rounded-sm border border-line bg-surface-2/30 p-3">
            <h3 className="font-semibold tracking-tight text-ink">{group.group}</h3>
            <ul className="mt-3 space-y-2">
              {group.items.map((item) => {
                const lvl = LEVEL_GLYPH[item.level];
                return (
                  <li key={item.name} className="flex items-baseline gap-2 font-mono text-sm">
                    <span aria-hidden className={lvl.cls}>
                      {lvl.glyph}
                    </span>
                    <span className="sr-only">{lvl.label}:</span>
                    <span className="text-ink">{item.name}</span>
                    {item.note && <span className="text-xs text-dim">— {item.note}</span>}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
      <p className="mt-4 font-mono text-xs text-dim">
        <span className="text-amber">●</span> daily driver&ensp;
        <span className="text-reed">◐</span> comfortable&ensp;
        <span className="text-water">○</span> learning
      </p>
    </div>
  );
}
