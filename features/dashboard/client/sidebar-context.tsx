"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

interface SidebarContextValue {
  open: boolean;
  toggle: () => void;
  close: () => void;
}

const SidebarContext = createContext<SidebarContextValue | null>(null);

/**
 * Mobile nav open/closed state, shared between the hamburger button
 * (Topbar, rendered per-page) and the Sidebar itself (rendered once in the
 * dashboard layout) — closed by default so dashboard pages aren't covered
 * by the nav on load below the md breakpoint.
 */
export function SidebarProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <SidebarContext.Provider
      value={{ open, toggle: () => setOpen((v) => !v), close: () => setOpen(false) }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar(): SidebarContextValue {
  const ctx = useContext(SidebarContext);
  if (!ctx) throw new Error("useSidebar must be used within SidebarProvider");
  return ctx;
}
