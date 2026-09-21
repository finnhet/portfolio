export const BIRTH_DATE = new Date("2007-08-01");

export function getAge(birth: Date = BIRTH_DATE): number {
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

export const SECTIONS = [
  { id: "home", label: "home" },
  { id: "projects", label: "projects" },
  { id: "stack", label: "stack" },
  { id: "about", label: "about" },
  { id: "contact", label: "contact" },
] as const;

export type SectionId = (typeof SECTIONS)[number]["id"];

export type Project = {
  id: string;
  title: string;
  windowTitle: string;
  tagline: string;
  description: string;
  details: string[];
  tech: string[];
  year: string;
  repo?: string;
  live?: string;
  shot: "platform" | "board" | "cat" | "site";
};

export const PROJECTS: Project[] = [
  {
    id: "stagecentrum",
    title: "Stagecentrum",
    windowTitle: "~/projects/stagecentrum",
    tagline: "Internship platform for students and companies",
    description:
      "A platform where students find internships and companies manage postings and applicants. Built full-stack with Laravel, Inertia.js and React.",
    details: [
      "Role-based auth for students, companies and admins",
      "Posting and application flow with status tracking",
      "Inertia.js between the Laravel backend and React front-end",
      "MySQL schema for matching and reporting",
    ],
    tech: ["Laravel", "Inertia.js", "React", "TypeScript", "MySQL"],
    year: "2025",
    repo: "https://github.com/finnhet/stagecentrum",
    shot: "platform",
  },
  {
    id: "aiboard",
    title: "AIboard",
    windowTitle: "~/projects/aiboard",
    tagline: "AI whiteboard tool",
    description:
      "A canvas-based whiteboard with AI features that help group and expand notes.",
    details: [
      "Freeform canvas with pan, zoom and draggable notes",
      "AI suggestions that group related notes",
      "Optimised rendering to keep the board smooth",
    ],
    tech: ["React", "TypeScript", "Canvas API", "AI"],
    year: "2025",
    repo: "https://github.com/finnhet/whiteboardai",
    shot: "board",
  },
  {
    id: "dailycat",
    title: "Daily Cat",
    windowTitle: "~/projects/dailycat",
    tagline: "One cat per day",
    description:
      "A small page that shows one cat a day. It lives on this site.",
    details: [
      "The date picks the cat, so everyone sees the same one",
      "No accounts, no feeds",
    ],
    tech: ["Next.js", "TypeScript"],
    year: "2026",
    live: "/dailycat",
    shot: "cat",
  },
  {
    id: "portfolio",
    title: "This site",
    windowTitle: "~/projects/portfolio",
    tagline: "This portfolio, styled as a desktop",
    description:
      "The site you're looking at. Sections open as windows on a desktop, with a panel, a launcher and a light/dark theme.",
    details: [
      "Draggable windows with minimize, maximize and close",
      "Taskbar, app launcher and desktop icons",
      "Light/dark theme stored locally, applied before first paint",
    ],
    tech: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
    year: "2026",
    repo: "https://github.com/finnhet/portfolio",
    shot: "site",
  },
  {
    id: "kapiteinssloep",
    title: "De Kapiteinssloep",
    windowTitle: "~/projects/kapiteinssloep",
    tagline: "Site for a handcrafted sloop builder",
    description:
      "A marketing site for a boatbuilder specialising in handcrafted sloeps. Visitors can browse the boat models and services and get in touch. Built with Next.js on the front-end and a headless CMS for content.",
    details: [
      "Overview of the custom-built boat models and pre-owned inventory",
      "Overview of services: refitting, maintenance and winter storage",
      "Contact section for enquiries",
      "Content managed through a headless CMS backend",
    ],
    tech: ["Next.js", "React", "TypeScript"],
    year: "2025",
    live: "https://dekapiteinssloep.nl",
    shot: "site",
  },
];

export type SkillLevel = "daily" | "comfortable" | "learning";

export const STACK: {
  group: string;
  windowTitle: string;
  items: { name: string; level: SkillLevel; note?: string }[];
}[] = [
  {
    group: "Backend",
    windowTitle: "~/stack/backend",
    items: [
      { name: "Laravel", level: "daily" },
      { name: "PHP", level: "daily" },
      { name: "MySQL", level: "daily" },
      { name: "Inertia.js", level: "daily" },
      { name: "REST APIs", level: "comfortable" },
    ],
  },
  {
    group: "Frontend",
    windowTitle: "~/stack/frontend",
    items: [
      { name: "React", level: "daily" },
      { name: "TypeScript", level: "daily" },
      { name: "Tailwind CSS", level: "daily" },
      { name: "Next.js", level: "comfortable" },
      { name: "React Native", level: "comfortable" },
    ],
  },
  {
    group: "Environment",
    windowTitle: "~/stack/env",
    items: [
      { name: "Arch Linux", level: "daily" },
      { name: "Git", level: "daily" },
      { name: "fish", level: "daily" },
      { name: "Golang", level: "learning" },
      { name: "Java", level: "learning" },
    ],
  },
];

// Email is stored as char codes and only decoded client-side after mount,
// so it never appears as plain text in the server-rendered HTML or JS source
// (keeps it readable for visitors but harder for bots scraping static markup).
const EMAIL_CODES = [
  99, 111, 110, 116, 97, 99, 116, 64, 102, 105, 110, 110, 104, 101, 116, 116,
  105, 110, 103, 97, 46, 110, 108,
];

export function decodeEmail(): string {
  return String.fromCharCode(...EMAIL_CODES);
}

export const CONTACT = {
  github: "https://github.com/finnhet",
  linkedin: "https://www.linkedin.com/in/finn-hettinga-742a30304/",
};

export const INTERESTS = [
  {
    name: "Music",
    detail: "Mk.gee, Tamino, Dijon.",
  },
  {
    name: "Linux",
    detail: "Arch Linux, dotfiles and customizing my setup.",
  },
  {
    name: "DIY electronics",
    detail: "Microcontrollers and small hardware projects.",
  },
  {
    name: "Gaming",
    detail: "Mostly single-player games.",
  },
];
