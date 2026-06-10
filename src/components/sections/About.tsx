"use client";
import { INTERESTS, getAge } from "@/lib/data";

/** The "Kate" window: readme.md plus what happens off hours. */
export function About() {
  return (
    <div className="grid gap-6 md:grid-cols-5">
      <div className="md:col-span-3">
        <h3 className="text-2xl font-semibold tracking-tight text-ink">
          Hi, I&apos;m Finn.
        </h3>
        <div className="mt-4 space-y-4 leading-relaxed text-dim">
          <p>
            I&apos;m {getAge()} and live in Friesland, in the north of the Netherlands.
            I like building things end to end: backend, frontend and everything in
            between.
          </p>
          <p>
            Most of my work is Laravel with Inertia.js and a React + TypeScript
            front-end. Outside of web development I spend my time on Linux,
            electronics and music.
          </p>
        </div>
      </div>

      <div className="rounded-sm border border-line bg-surface-2/30 p-4 md:col-span-2">
        <p className="mb-3 font-mono text-xs text-dim">~/about/offhours</p>
        <ul className="space-y-4">
          {INTERESTS.map((it) => (
            <li key={it.name}>
              <p className="font-mono text-sm text-reed">{it.name}</p>
              <p className="mt-1 text-sm leading-relaxed text-dim">{it.detail}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
