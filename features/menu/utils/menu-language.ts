/**
 * Pure helpers for the bilingual customer menu (Menu Language Toggle
 * dc.html): the fa/en copy dictionary and name/description fallback
 * resolution. No I/O — cookie read/write lives in
 * features/menu/services/menu-language-service.ts.
 */

export type MenuLang = "fa" | "en";

export const MENU_LANGS: readonly MenuLang[] = ["fa", "en"];

export function isMenuLang(value: string | undefined | null): value is MenuLang {
  return value === "fa" || value === "en";
}

export const MENU_LANG_COPY = {
  fa: {
    dir: "rtl" as const,
    acceptingOrders: "سفارش می‌پذیریم",
    closed: "فعلاً بسته است",
    infoButton: "اطلاعات مجموعه ما",
    lead: "منوی مورد نظر را بر اساس سفارش خود انتخاب کنید:",
    rowDineIn: "بر روی میز",
    rowVisual: "منو دیداری",
    rowTakeaway: "سفارش بیرون بر",
    myAccount: "حساب من",
    loginRegister: "ورود / ثبت‌نام",
    walletLabel: "کیف پول شما",
    points: "امتیاز",
    loginTeaserSub: "ورود سریع با شماره موبایل",
    login: "ورود",
    infoHours: "ساعت کاری",
    infoPhone: "شماره تماس",
    infoAbout: "درباره رستوران",
    infoAboutText:
      "رستوران ما با الهام از طعم‌های اصیل و مواد اولیه تازه، تلاش می‌کند لحظاتی خوشمزه و به‌یادماندنی برای شما بسازد. غذا فقط یک وعده نیست، بلکه تجربه‌ای دلنشین است که با عشق، کیفیت و احترام همراه است.",
    infoReviews: "نظرات کاربران",
    close: "بستن",
    gateTitle: "زبان منو را انتخاب کنید",
    gateSubtitle: "Please choose your language",
    gateFaTitle: "فارسی",
    gateFaSub: "منوی راست‌چین",
    gateEnTitle: "English",
    gateEnSub: "Left-to-right menu",
    gateContinue: "ورود به منو / Continue",
    gateFootnote:
      "انتخاب شما ذخیره می‌شود و دفعه بعد مستقیم وارد همان زبان می‌شوید؛ از تاگل FA/EN در هدر هم قابل تغییر است.",
  },
  en: {
    dir: "ltr" as const,
    acceptingOrders: "Accepting orders",
    closed: "Closed for now",
    infoButton: "About us",
    lead: "Choose a menu based on your order type:",
    rowDineIn: "Dine in",
    rowVisual: "Visual menu",
    rowTakeaway: "Takeaway",
    myAccount: "My account",
    loginRegister: "Sign in / Register",
    walletLabel: "Your wallet",
    points: "points",
    loginTeaserSub: "Quick sign-in with your phone number",
    login: "Sign in",
    infoHours: "Opening hours",
    infoPhone: "Phone number",
    infoAbout: "About the restaurant",
    infoAboutText:
      "Inspired by authentic flavors and fresh ingredients, we work to create delicious, memorable moments for you. Food isn't just a meal — it's a warm experience served with love, quality and respect.",
    infoReviews: "Customer reviews",
    close: "Close",
    gateTitle: "Please choose your language",
    gateSubtitle: "زبان منو را انتخاب کنید",
    gateFaTitle: "فارسی",
    gateFaSub: "RTL menu",
    gateEnTitle: "English",
    gateEnSub: "Left-to-right menu",
    gateContinue: "Continue / ورود به منو",
    gateFootnote:
      "Your choice is saved, and you'll land directly in that language next time; you can also switch anytime with the FA/EN toggle in the header.",
  },
} as const;

export function menuCopy(lang: MenuLang) {
  return MENU_LANG_COPY[lang];
}

/** Business/product display name with an EN fallback to the Persian value when untranslated. */
export function localizedName(lang: MenuLang, fa: string, en: string | null | undefined): string {
  if (lang === "en" && en && en.trim().length > 0) return en;
  return fa;
}

export function localizedText(
  lang: MenuLang,
  fa: string | null | undefined,
  en: string | null | undefined
): string | null {
  if (lang === "en" && en && en.trim().length > 0) return en;
  return fa ?? null;
}
