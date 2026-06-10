"use client";
import type { ComponentType } from "react";
import { PROJECTS } from "@/lib/data";
import { Welcome } from "@/components/sections/Welcome";
import { ProjectsApp, ProjectDetail } from "@/components/sections/Projects";
import { Stack } from "@/components/sections/Stack";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";

export type AppDef = {
  id: string;
  /** Short name: desktop icon label, task button. */
  name: string;
  /** Window title bar text. */
  title: string;
  glyph: string;
  /** Icon background, from the palette. */
  tint: string;
  /** Preferred window width in px (clamped to the viewport). */
  width: number;
  desc: string;
  Component: ComponentType;
};

export const APPS: AppDef[] = [
  {
    id: "welcome",
    name: "welcome",
    title: "Welcome Center",
    glyph: "✦",
    tint: "bg-amber",
    width: 720,
    desc: "who I am",
    Component: Welcome,
  },
  {
    id: "projects",
    name: "projects",
    title: "Projects — ~/projects",
    glyph: "❐",
    tint: "bg-water",
    width: 760,
    desc: "things I built",
    Component: ProjectsApp,
  },
  {
    id: "stack",
    name: "stack",
    title: "Discover — installed stack",
    glyph: "⬡",
    tint: "bg-reed",
    width: 700,
    desc: "tools I use",
    Component: Stack,
  },
  {
    id: "about",
    name: "about",
    title: "readme.md — Kate",
    glyph: "¶",
    tint: "bg-dim",
    width: 740,
    desc: "about me",
    Component: About,
  },
  {
    id: "contact",
    name: "contact",
    title: "Contact",
    glyph: "@",
    tint: "bg-ink",
    width: 560,
    desc: "say hi",
    Component: Contact,
  },
];

// Each project gets its own app definition so its window has a stable
// component identity (no remount on every desktop re-render).
const PROJECT_APPS = new Map<string, AppDef>(
  PROJECTS.map((p) => {
    const Detail = () => <ProjectDetail project={p} />;
    Detail.displayName = `Project_${p.id}`;
    return [
      `project:${p.id}`,
      {
        id: `project:${p.id}`,
        name: p.id,
        title: p.windowTitle,
        glyph: "❐",
        tint: "bg-water",
        width: 660,
        desc: p.tagline,
        Component: Detail,
      },
    ];
  })
);

export function getApp(id: string): AppDef {
  const app = APPS.find((a) => a.id === id) ?? PROJECT_APPS.get(id);
  if (!app) throw new Error(`Unknown app: ${id}`);
  return app;
}
