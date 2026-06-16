"use client";
import { useEffect, useState } from "react";
import { CONTACT, decodeEmail } from "@/lib/data";

export function Contact() {
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    setEmail(decodeEmail());
  }, []);

  const links = [
    {
      label: "email",
      value: email ?? "loading…",
      href: email ? `mailto:${email}` : undefined,
    },
    { label: "github", value: "github.com/finnhet", href: CONTACT.github },
    { label: "linkedin", value: "finn-hettinga", href: CONTACT.linkedin },
  ];

  return (
    <div>
      <h3 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
        Get in touch
      </h3>
      <p className="mt-3 leading-relaxed text-dim">
        I&apos;m open to full-time opportunities and freelance work. Email is the
        best way to reach me.
      </p>
      <ul className="mt-6 flex flex-col gap-2">
        {links.map((l) => (
          <li key={l.label}>
            <a
              href={l.href}
              target={l.href && !l.href.startsWith("mailto") ? "_blank" : undefined}
              rel="noreferrer"
              className="group flex items-baseline gap-3 rounded-sm border border-line px-4 py-3 font-mono text-sm transition-colors duration-150 hover:border-amber"
            >
              <span className="w-16 shrink-0 text-reed">{l.label}</span>
              <span className="truncate text-ink">{l.value}</span>
              <span className="ml-auto text-dim transition-colors duration-150 group-hover:text-amber">
                ↗
              </span>
            </a>
          </li>
        ))}
      </ul>
      <p className="mt-6 font-mono text-xs text-dim">
        © {new Date().getFullYear()} Finn Hettinga
      </p>
    </div>
  );
}
