"use client";
import type { ReactNode } from "react";
import { useDesktop } from "@/components/de/Desktop";
import { PROJECTS, type Project } from "@/lib/data";

export function Badge({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-sm border border-line bg-surface-2 px-1.5 py-0.5 font-mono text-[11px] text-dim">
      {children}
    </span>
  );
}

/** Low-detail wireframe "screenshot" drawn with divs, one variant per project. */
export function MockShot({
  shot,
  className = "aspect-[16/9]",
}: {
  shot: Project["shot"];
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={`flex flex-col overflow-hidden rounded-sm border border-line bg-surface-2 ${className}`}
    >
      <div className="flex items-center gap-1 border-b border-line px-2 py-1">
        <span className="h-1.5 w-1.5 rounded-full bg-line" />
        <span className="h-1.5 w-1.5 rounded-full bg-line" />
        <span className="ml-1 h-1.5 w-16 rounded-full bg-line/70" />
      </div>

      {shot === "platform" && (
        <div className="flex flex-1 gap-2 p-2">
          <div className="flex w-1/4 flex-col gap-1.5 rounded-[2px] bg-surface p-1.5">
            <span className="h-1.5 w-3/4 rounded-full bg-reed/60" />
            <span className="h-1.5 w-2/3 rounded-full bg-line" />
            <span className="h-1.5 w-2/3 rounded-full bg-line" />
          </div>
          <div className="flex flex-1 flex-col gap-1.5">
            <span className="h-2 w-1/3 rounded-full bg-ink/30" />
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex items-center gap-1.5 rounded-[2px] bg-surface p-1.5">
                <span className={`h-1.5 w-1.5 rounded-full ${i === 0 ? "bg-amber" : "bg-reed/60"}`} />
                <span className="h-1.5 flex-1 rounded-full bg-line" />
                <span className="h-1.5 w-8 rounded-full bg-water/50" />
              </div>
            ))}
          </div>
        </div>
      )}

      {shot === "board" && (
        <div className="relative flex-1">
          <span className="absolute left-[12%] top-[18%] h-8 w-14 rounded-[2px] bg-reed/45" />
          <span className="absolute left-[38%] top-[42%] h-8 w-14 rounded-[2px] bg-water/45" />
          <span className="absolute left-[20%] top-[62%] h-7 w-12 rounded-[2px] bg-surface" />
          <span className="absolute right-[14%] top-[22%] h-9 w-16 rounded-[2px] bg-amber/50" />
          <span className="absolute bottom-[14%] right-[10%] h-12 w-24 rounded-[2px] border border-dashed border-dim/50" />
        </div>
      )}

      {shot === "cat" && (
        <div className="flex flex-1 flex-col items-center justify-center gap-2">
          <div className="relative">
            <span className="absolute -top-2 left-1 h-4 w-4 bg-dim/60 [clip-path:polygon(0%_100%,50%_0%,100%_100%)]" />
            <span className="absolute -top-2 right-1 h-4 w-4 bg-dim/60 [clip-path:polygon(0%_100%,50%_0%,100%_100%)]" />
            <div className="flex h-12 w-12 items-center justify-center gap-2 rounded-full bg-dim/60">
              <span className="h-1.5 w-1.5 rounded-full bg-surface-2" />
              <span className="h-1.5 w-1.5 rounded-full bg-surface-2" />
            </div>
          </div>
          <span className="h-1.5 w-20 rounded-full bg-line" />
        </div>
      )}

      {shot === "site" && (
        <div className="flex flex-1 flex-col gap-1.5 p-2">
          <div className="flex items-center justify-between rounded-[2px] bg-surface px-1.5 py-1">
            <span className="h-1.5 w-10 rounded-full bg-line" />
            <span className="h-1.5 w-14 rounded-full bg-amber/60" />
          </div>
          <div className="grid flex-1 grid-cols-5 gap-1.5">
            <span className="col-span-3 rounded-[2px] border border-amber/60 bg-surface" />
            <div className="col-span-2 flex flex-col gap-1.5">
              <span className="flex-1 rounded-[2px] bg-surface" />
              <span className="flex-1 rounded-[2px] bg-surface" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/** The "Projects" app: a file-manager-ish index. Each entry opens its own window. */
export function ProjectsApp() {
  const { open } = useDesktop();
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {PROJECTS.map((p) => (
        <button
          key={p.id}
          onClick={() => open(`project:${p.id}`)}
          className="group flex flex-col rounded-sm border border-line bg-surface-2/30 p-3 text-left transition-colors duration-150 hover:border-amber"
        >
          <MockShot shot={p.shot} className="aspect-[2/1]" />
          <span className="mt-3 flex items-baseline justify-between gap-2">
            <span className="font-semibold tracking-tight text-ink">{p.title}</span>
            <span className="font-mono text-xs text-dim">{p.year}</span>
          </span>
          <span className="mt-1 block text-sm text-dim">{p.tagline}</span>
          <span className="mt-2 block font-mono text-[11px] text-dim opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100">
            open in new window →
          </span>
        </button>
      ))}
    </div>
  );
}

/** One project's own window content. */
export function ProjectDetail({ project }: { project: Project }) {
  return (
    <div>
      <MockShot shot={project.shot} />
      <div className="mt-5 flex items-baseline justify-between gap-3">
        <h3 className="text-2xl font-semibold tracking-tight text-ink">{project.title}</h3>
        <span className="font-mono text-xs text-dim">{project.year}</span>
      </div>
      <p className="mt-3 leading-relaxed text-dim">{project.description}</p>
      <ul className="mt-4 space-y-1.5">
        {project.details.map((d) => (
          <li key={d} className="flex gap-2 text-sm leading-relaxed text-dim">
            <span aria-hidden className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-reed" />
            {d}
          </li>
        ))}
      </ul>
      <div className="mt-5 flex flex-wrap gap-1.5">
        {project.tech.map((t) => (
          <Badge key={t}>{t}</Badge>
        ))}
      </div>
      <div className="mt-6 flex gap-3 font-mono text-sm">
        {project.repo && (
          <a
            href={project.repo}
            target="_blank"
            rel="noreferrer"
            className="rounded-sm border border-line px-3 py-1.5 text-ink transition-colors duration-150 hover:border-amber"
          >
            source ↗
          </a>
        )}
        {project.live && (
          <a
            href={project.live}
            className="rounded-sm bg-amber px-3 py-1.5 text-bg transition-opacity duration-150 hover:opacity-85"
          >
            visit ↗
          </a>
        )}
      </div>
    </div>
  );
}
