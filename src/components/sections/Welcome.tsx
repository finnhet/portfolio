"use client";
import { useDesktop } from "@/components/de/Desktop";
import { getAge } from "@/lib/data";

const PALETTE_STRIP = [
  "bg-ink",
  "bg-dim",
  "bg-line",
  "bg-surface-2",
  "bg-reed",
  "bg-water",
  "bg-amber",
  "bg-bg",
];

function FetchRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-3 font-mono text-xs leading-6">
      <dt className="w-20 shrink-0 text-reed">{label}</dt>
      <dd className="text-ink">{value}</dd>
    </div>
  );
}

export function Welcome() {
  const { open } = useDesktop();
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div>
        <p className="font-mono text-xs text-reed">full-stack web developer</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight text-ink">
          Finn Hettinga
        </h1>
        <p className="mt-4 leading-relaxed text-dim">
          I&apos;m a full-stack web developer from Friesland, the Netherlands.
          I work with Laravel, Inertia.js, React and TypeScript.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            onClick={() => open("projects")}
            className="rounded-sm bg-amber px-4 py-2 font-mono text-sm text-bg transition-opacity duration-150 hover:opacity-85"
          >
            open projects
          </button>
          <button
            onClick={() => open("contact")}
            className="rounded-sm border border-line px-4 py-2 font-mono text-sm text-ink transition-colors duration-150 hover:border-amber"
          >
            contact
          </button>
        </div>
      </div>

      <div className="rounded-sm border border-line bg-surface-2/40 p-4">
        <p className="mb-2 font-mono text-xs text-dim">fetch</p>
        <dl>
          <FetchRow label="host" value="Friesland, NL" />
          <FetchRow label="os" value="Arch Linux" />
          <FetchRow label="shell" value="fish" />
          <FetchRow label="uptime" value={`${getAge()} years`} />
          <FetchRow label="stack" value="Laravel · React · TS" />
          <FetchRow label="status" value="open to work" />
        </dl>
        <div className="mt-4 flex gap-1" aria-hidden>
          {PALETTE_STRIP.map((c, i) => (
            <span key={i} className={`h-3 w-3 rounded-[1px] border border-line/40 ${c}`} />
          ))}
        </div>
      </div>

      <p className="font-mono text-xs text-dim md:col-span-2">
        Tip: drag windows by their title bar, or open apps from the icons and the{" "}
        <span className="text-amber">❖</span> launcher.
      </p>
    </div>
  );
}
