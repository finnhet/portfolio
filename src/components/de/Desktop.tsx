"use client";
import { createContext, useContext } from "react";

/** One managed window on the desktop. `app` doubles as the window id. */
export type Win = {
  app: string;
  x: number;
  y: number;
  z: number;
  min: boolean;
  max: boolean;
};

export type DesktopState = {
  windows: Win[];
  /** App id of the topmost non-minimized window. */
  focused: string | null;
  open: (app: string) => void;
  close: (app: string) => void;
  focus: (app: string) => void;
  toggleMin: (app: string) => void;
  toggleMax: (app: string) => void;
  moveTo: (app: string, x: number, y: number) => void;
  minimizeAll: () => void;
};

export const DesktopContext = createContext<DesktopState | null>(null);

export function useDesktop(): DesktopState {
  const ctx = useContext(DesktopContext);
  if (!ctx) throw new Error("useDesktop must be used inside <DesktopContext.Provider>");
  return ctx;
}
