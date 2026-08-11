import "server-only";
import { cookies } from "next/headers";
import * as repo from "@/features/menu/repositories/menu-repository";
import { isMenuLang, type MenuLang } from "@/features/menu/utils/menu-language";

const COOKIE_PREFIX = "magmenu_lang_";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

function cookieName(slug: string) {
  return `${COOKIE_PREFIX}${slug}`;
}

/** Null means "no choice saved yet" — the entry page uses that to decide whether to show the language gate. */
export async function getMenuLangCookie(slug: string): Promise<MenuLang | null> {
  const store = await cookies();
  const value = store.get(cookieName(slug))?.value;
  return isMenuLang(value) ? value : null;
}

/**
 * Persists the customer's language choice for this business. When the
 * business has "ذخیره زبان مشتری" (rememberCustomerLanguage) turned off, the
 * cookie is session-only (no maxAge) so the next visit asks again.
 */
export async function setMenuLangCookie(slug: string, lang: MenuLang) {
  const business = await repo.getBusiness(slug);
  const remember = business?.rememberCustomerLanguage ?? true;

  const store = await cookies();
  store.set(cookieName(slug), lang, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    ...(remember ? { maxAge: MAX_AGE_SECONDS } : {}),
  });
}
