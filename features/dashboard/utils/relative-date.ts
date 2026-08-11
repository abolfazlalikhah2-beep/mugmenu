import type { MenuLang } from "@/features/menu/utils/menu-language";

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function timeLabel(d: Date, lang: MenuLang) {
  return d.toLocaleTimeString(lang === "en" ? "en-US" : "fa-IR", { hour: "2-digit", minute: "2-digit", hour12: false });
}

/**
 * "امروز · HH:MM" / "دیروز · HH:MM" / "D MMMM · HH:MM" (Persian calendar) — or
 * the English equivalent ("Today"/"Yesterday"/"D MMMM") when lang is "en".
 * Defaults to Persian (see relative-date.test.ts).
 */
export function formatRelativeDateTime(date: Date, now: Date = new Date(), lang: MenuLang = "fa"): string {
  const time = timeLabel(date, lang);
  if (isSameDay(date, now)) return lang === "en" ? `Today · ${time}` : `امروز · ${time}`;

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (isSameDay(date, yesterday)) return lang === "en" ? `Yesterday · ${time}` : `دیروز · ${time}`;

  const day = date.toLocaleDateString(lang === "en" ? "en-US" : "fa-IR", { day: "numeric", month: "long" });
  return `${day} · ${time}`;
}
