/**
 * Pure helpers for the bilingual customer menu (Menu Language Toggle
 * dc.html): the fa/en copy dictionary and name/description fallback
 * resolution. No I/O — cookie read/write lives in
 * features/menu/services/menu-language-service.ts.
 *
 * Covers the entry page plus the category browser, item detail, cart,
 * receipt/review/survey, and customer account pages — every page under
 * `/[cafeSlug]` reads `lang` from the same cookie and renders through this
 * dictionary rather than hardcoding Persian copy.
 */

export type MenuLang = "fa" | "en";

export const MENU_LANGS: readonly MenuLang[] = ["fa", "en"];

export function isMenuLang(value: string | undefined | null): value is MenuLang {
  return value === "fa" || value === "en";
}

export const MENU_LANG_COPY = {
  fa: {
    dir: "rtl" as const,
    // ===== entry page =====
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
    openNow: "اکنون باز است",
    closedNow: "اکنون تعطیل است",
    dayClosed: "تعطیل",
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

    // ===== shared =====
    toman: "تومان",
    menuTitle: (businessName: string) => `منوی ${businessName}`,
    cartTitle: "سبد خرید",
    orderTypeDineIn: "روی میز",
    orderTypeTakeaway: "بیرون‌بر",
    orderTypeDelivery: "ارسال با پیک",
    increaseQty: "افزایش تعداد",
    decreaseQty: "کاهش تعداد",

    // ===== category browser / product card / item detail =====
    itemPhoto: "عکس بزرگ آیتم",
    quantity: "تعداد",
    addToCart: "افزودن به سبد",
    mostRelevant: "مرتبط ترین",
    newest: "جدیدترین",
    searchPlaceholder: "جستجو در منو",
    searchButtonLabel: "جستجو",
    searchNoResults: "نتیجه‌ای یافت نشد.",
    optionRequired: "الزامی",
    optionOptional: "اختیاری",
    chooseOneOption: "یک گزینه انتخاب کنید",
    noExtraCost: "بدون هزینه",
    multiSelectBadge: "چند انتخابی",
    outOfStockBadge: "ناموجود",
    outOfStockBar: "فعلاً ناموجود",
    notifyMeLabel: "اطلاع بده",
    notifyMeSub: "وقتی موجود شد",

    // ===== cart =====
    cartEmpty: "سبد شما خالی است",
    orderingDisabled: "این کافه فعلاً امکان سفارش آنلاین ندارد",
    viewMenu: "مشاهده منو",
    deliveryDetails: "جزئیات تحویل",
    mapPlaceholder: "انتخاب لوکیشن روی نقشه",
    amountDue: "مبلغ قابل پرداخت",
    placeOrder: "ثبت سفارش",
    placingOrder: "در حال ثبت…",
    orderFailed: "ثبت سفارش با خطا مواجه شد. دوباره تلاش کنید.",
    estimatedDeliveryTimeLabel: "زمان تحویل تخمینی",
    deliveryTimeLabel: "زمان تحویل",

    // ===== receipt =====
    orderPlaced: "سفارش شما ثبت شد",
    trackingCode: "کد پیگیری",
    deliveryAddress: "آدرس تحویل",
    orderSummary: "خلاصه سفارش",
    subtotal: "جمع آیتم‌ها",
    taxPackaging: "مالیات و بسته‌بندی",
    amountPaid: "مبلغ پرداخت‌شده",
    packagingFeeLabel: "بسته‌بندی",
    serviceFeeLabel: "حق سرویس",
    taxLabel: "مالیات",
    discountLineLabel: "تخفیف",
    walletRedeemedLabel: "استفاده از کیف‌پول",
    orderNoteLabel: "توضیح سفارش (اختیاری)",
    orderNotePlaceholder: "مثلاً: کباب کم‌نمک باشد",
    editOptionsLabel: "ویرایش گزینه‌ها",
    walletAvailableCredit: "اعتبار قابل استفاده",
    useWalletCredit: "استفاده از کیف‌پول در این سفارش",
    howWasExperience: "تجربه‌تان چطور بود؟",
    earnPointsReview: "با ثبت نظر امتیاز باشگاه مشتریان بگیرید",
    writeReview: "ثبت نظر",
    trackOrder: "پیگیری سفارش",
    backToMenu: "بازگشت به منو",

    // ===== survey sheet =====
    surveyTitle: "۳ سوال کوتاه، ۲۰ ثانیه",
    surveySubtitle: "اختیاری · به بهتر شدن سرویس کمک می‌کند",
    tasteQuestion: "کیفیت غذا چطور بود؟",
    speedQuestion: "سرعت تحویل چطور بود؟",
    packagingQuestion: "بسته‌بندی سفارش چطور بود؟",
    submitAnswers: "ثبت پاسخ‌ها",
    dismiss: "رد کردن",

    // ===== review form =====
    whichItemQuestion: "نظر شما درباره کدام آیتم است؟",
    optionalMultiSelect: "اختیاری · می‌توانید چند مورد را انتخاب کنید",
    whatWasGood: "چه چیزی برایتان خوب بود؟",
    commentLabel: "متن نظر",
    commentPlaceholder: "تجربه‌تان را برای بقیه بنویسید؛ طعم، گرمی غذا، بسته‌بندی…",
    anonymousLabel: "ثبت به‌صورت ناشناس",
    anonymousSub: "نام شما نمایش داده نمی‌شود",
    submitReviewBtn: "ثبت نظر",
    submittingReview: "در حال ثبت…",
    later: "بعداً",
    ratingRequired: "لطفاً امتیاز خود را انتخاب کنید.",
    thankYouReview: "ممنون از نظر شما",
    reviewShownNote: "نظر شما بعد از بررسی روی صفحه آیتم نمایش داده می‌شود.",
    viewMyReview: "مشاهده نظرم",

    // ===== account =====
    editProfile: "ویرایش",
    myAddresses: "آدرس‌های من",
    logout: "خروج از حساب",
    editProfileTitle: "ویرایش نام",
    fullNameLabel: "نام و نام خانوادگی",
    save: "ذخیره",
    saving: "در حال ذخیره…",

    // ===== wallet =====
    walletBalanceCashback: "موجودی کیف پول (کش‌بک)",
    usable: "قابل استفاده",
    walletLedgerLink: "گردش کیف پول",
    currentBalance: "موجودی فعلی",
    noTransactionsYet: "هنوز تراکنشی ثبت نشده است.",
    cashbackOrder: "کش‌بک سفارش",
    balanceAdjustment: "اصلاح موجودی",

    // ===== loyalty =====
    loyaltyPointsLabel: "امتیاز باشگاه مشتریان",
    silverTier: "سطح نقره‌ای",
    goldTier: "سطح طلایی",
    pointsWord: "امتیاز",

    // ===== recent orders / order history =====
    orderHistoryTitle: "تاریخچه سفارشات",
    recentOrdersTitle: "سفارش‌های اخیر",
    allOrders: "همه سفارش‌ها",
    noOrdersYet: "هنوز سفارشی ثبت نکرده‌اید.",
    cashbackThisOrder: "کش‌بک این سفارش",
    invoice: "فاکتور",
    filterAll: "همه",
    filterPreparing: "در حال آماده‌سازی",
    filterDelivered: "تحویل شده",
    filterCanceled: "لغو شده",
    noOrdersFound: "سفارشی یافت نشد.",

    // ===== order detail =====
    orderDetailsTitle: "جزئیات سفارش",
    orderStatusTitle: "وضعیت سفارش",
    orderItemsTitle: "اقلام سفارش",
    getInvoice: "دریافت فاکتور",
    reorder: "سفارش مجدد",

    // ===== order status timeline =====
    stepNew: "ثبت سفارش",
    stepPreparing: "در حال آماده‌سازی",
    stepReady: "آماده تحویل",
    stepDelivered: "تحویل شد",
    orderCanceledMsg: "این سفارش لغو شده است",

    // ===== order status badge =====
    statusNew: "جدید",
    statusPreparing: "در حال آماده‌سازی",
    statusReady: "آماده تحویل",
    statusDelivered: "تحویل شده",
    statusCanceled: "لغو شده",

    // ===== addresses =====
    addNewAddress: "افزودن آدرس جدید",
    forDeliveryOrders: "برای سفارش‌های ارسال با پیک",
    editAddress: "ویرایش آدرس",
    addressTitleLabel: "عنوان آدرس",
    addressTitlePlaceholder: "مثلاً خانه، محل کار",
    fullAddressLabel: "آدرس کامل",
    phoneLabel: "شماره تماس",
    setAsDefault: "تنظیم به‌عنوان آدرس پیش‌فرض",
    saveAddress: "ذخیره آدرس",
    defaultBadge: "پیش‌فرض",
    edit: "ویرایش",
    delete: "حذف",
    setDefault: "انتخاب به‌عنوان پیش‌فرض",

    // ===== login / verify =====
    loginSubtitle: "برای ثبت سفارش، دریافت کش‌بک و امتیاز باشگاه مشتریان وارد شوید",
    phoneNumberLabel: "شماره موبایل",
    getOtpCode: "دریافت کد تایید",
    sendingOtp: "در حال ارسال…",
    otpDisclaimer:
      "با ورود، قوانین و حریم خصوصی ماگ‌منو را می‌پذیرید. شماره شما فقط برای پیگیری سفارش استفاده می‌شود.",
    continueWithoutLogin: "ادامه بدون ورود",
    verifyTitle: "تایید شماره",
    otpCodeLabel: "کد تایید را وارد کنید",
    resendCode: "ارسال مجدد کد تایید",
    verifying: "در حال بررسی…",
    loginToAccount: "ورود به حساب",
  },
  en: {
    dir: "ltr" as const,
    // ===== entry page =====
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
    openNow: "Open now",
    closedNow: "Closed now",
    dayClosed: "Closed",
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

    // ===== shared =====
    toman: "Toman",
    menuTitle: (businessName: string) => `${businessName} Menu`,
    cartTitle: "Cart",
    orderTypeDineIn: "Dine in",
    orderTypeTakeaway: "Takeaway",
    orderTypeDelivery: "Delivery",
    increaseQty: "Increase quantity",
    decreaseQty: "Decrease quantity",

    // ===== category browser / product card / item detail =====
    itemPhoto: "Item photo",
    quantity: "Quantity",
    addToCart: "Add to cart",
    mostRelevant: "Most relevant",
    newest: "Newest",
    searchPlaceholder: "Search the menu",
    searchButtonLabel: "Search",
    searchNoResults: "No results found.",
    optionRequired: "Required",
    optionOptional: "Optional",
    chooseOneOption: "Choose one option",
    noExtraCost: "No extra cost",
    multiSelectBadge: "Multi-select",
    outOfStockBadge: "Out of stock",
    outOfStockBar: "Currently unavailable",
    notifyMeLabel: "Notify me",
    notifyMeSub: "when available",

    // ===== cart =====
    cartEmpty: "Your cart is empty",
    orderingDisabled: "This cafe doesn't accept online orders yet",
    viewMenu: "View menu",
    deliveryDetails: "Delivery details",
    mapPlaceholder: "Choose location on map",
    amountDue: "Amount due",
    placeOrder: "Place order",
    placingOrder: "Placing order…",
    orderFailed: "Order failed. Please try again.",
    estimatedDeliveryTimeLabel: "Estimated delivery time",
    deliveryTimeLabel: "Delivery time",

    // ===== receipt =====
    orderPlaced: "Your order has been placed",
    trackingCode: "Tracking code",
    deliveryAddress: "Delivery address",
    orderSummary: "Order summary",
    subtotal: "Subtotal",
    taxPackaging: "Tax & packaging",
    amountPaid: "Amount paid",
    packagingFeeLabel: "Packaging",
    serviceFeeLabel: "Service fee",
    taxLabel: "Tax",
    discountLineLabel: "Discount",
    walletRedeemedLabel: "Wallet credit used",
    orderNoteLabel: "Order note (optional)",
    orderNotePlaceholder: "e.g. light on salt",
    editOptionsLabel: "Edit options",
    walletAvailableCredit: "Available credit",
    useWalletCredit: "Use wallet credit on this order",
    howWasExperience: "How was your experience?",
    earnPointsReview: "Earn loyalty club points by leaving a review",
    writeReview: "Write a review",
    trackOrder: "Track order",
    backToMenu: "Back to menu",

    // ===== survey sheet =====
    surveyTitle: "3 quick questions, 20 seconds",
    surveySubtitle: "Optional · helps us improve the service",
    tasteQuestion: "How was the food quality?",
    speedQuestion: "How was the delivery speed?",
    packagingQuestion: "How was the packaging?",
    submitAnswers: "Submit answers",
    dismiss: "Dismiss",

    // ===== review form =====
    whichItemQuestion: "Which item is your review about?",
    optionalMultiSelect: "Optional · you can select more than one",
    whatWasGood: "What did you like?",
    commentLabel: "Your review",
    commentPlaceholder: "Share your experience with others — taste, temperature, packaging…",
    anonymousLabel: "Post anonymously",
    anonymousSub: "Your name won't be shown",
    submitReviewBtn: "Submit review",
    submittingReview: "Submitting…",
    later: "Later",
    ratingRequired: "Please select a rating.",
    thankYouReview: "Thanks for your review",
    reviewShownNote: "Your review will appear on the item page after it's checked.",
    viewMyReview: "View my review",

    // ===== account =====
    editProfile: "Edit",
    myAddresses: "My addresses",
    logout: "Sign out",
    editProfileTitle: "Edit name",
    fullNameLabel: "Full name",
    save: "Save",
    saving: "Saving…",

    // ===== wallet =====
    walletBalanceCashback: "Wallet balance (cashback)",
    usable: "Usable",
    walletLedgerLink: "Wallet history",
    currentBalance: "Current balance",
    noTransactionsYet: "No transactions yet.",
    cashbackOrder: "Order cashback",
    balanceAdjustment: "Balance adjustment",

    // ===== loyalty =====
    loyaltyPointsLabel: "Loyalty club points",
    silverTier: "Silver tier",
    goldTier: "Gold tier",
    pointsWord: "points",

    // ===== recent orders / order history =====
    orderHistoryTitle: "Order history",
    recentOrdersTitle: "Recent orders",
    allOrders: "All orders",
    noOrdersYet: "You haven't placed any orders yet.",
    cashbackThisOrder: "Cashback for this order",
    invoice: "Invoice",
    filterAll: "All",
    filterPreparing: "Preparing",
    filterDelivered: "Delivered",
    filterCanceled: "Canceled",
    noOrdersFound: "No orders found.",

    // ===== order detail =====
    orderDetailsTitle: "Order details",
    orderStatusTitle: "Order status",
    orderItemsTitle: "Order items",
    getInvoice: "Get invoice",
    reorder: "Reorder",

    // ===== order status timeline =====
    stepNew: "Order placed",
    stepPreparing: "Preparing",
    stepReady: "Ready for pickup",
    stepDelivered: "Delivered",
    orderCanceledMsg: "This order has been canceled",

    // ===== order status badge =====
    statusNew: "New",
    statusPreparing: "Preparing",
    statusReady: "Ready",
    statusDelivered: "Delivered",
    statusCanceled: "Canceled",

    // ===== addresses =====
    addNewAddress: "Add new address",
    forDeliveryOrders: "For delivery orders",
    editAddress: "Edit address",
    addressTitleLabel: "Address title",
    addressTitlePlaceholder: "e.g. Home, Work",
    fullAddressLabel: "Full address",
    phoneLabel: "Phone number",
    setAsDefault: "Set as default address",
    saveAddress: "Save address",
    defaultBadge: "Default",
    edit: "Edit",
    delete: "Delete",
    setDefault: "Set as default",

    // ===== login / verify =====
    loginSubtitle: "Sign in to place orders and earn cashback & loyalty points",
    phoneNumberLabel: "Mobile number",
    getOtpCode: "Get verification code",
    sendingOtp: "Sending…",
    otpDisclaimer:
      "By signing in, you agree to MagMenu's terms and privacy policy. Your number is only used to track your order.",
    continueWithoutLogin: "Continue without signing in",
    verifyTitle: "Verify number",
    otpCodeLabel: "Enter verification code",
    resendCode: "Resend code",
    verifying: "Verifying…",
    loginToAccount: "Sign in",
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

/** Locale-correct digit formatting — fa-IR (Persian digits) vs en-US (Western digits). */
export function localizedNumber(lang: MenuLang, n: number): string {
  return n.toLocaleString(lang === "en" ? "en-US" : "fa-IR");
}

export type MenuOrderType = "DINE_IN" | "TAKEAWAY" | "DELIVERY";

/** DINE_IN with a table number gets "Table 7" / "روی میز 7" instead of the generic label. */
export function orderTypeLabel(lang: MenuLang, type: MenuOrderType, tableNumber?: string | null): string {
  if (type === "DINE_IN" && tableNumber) {
    return lang === "en" ? `Table ${tableNumber}` : `روی میز ${tableNumber}`;
  }
  const t = menuCopy(lang);
  return type === "DINE_IN" ? t.orderTypeDineIn : type === "TAKEAWAY" ? t.orderTypeTakeaway : t.orderTypeDelivery;
}

export function discountLabel(lang: MenuLang, percent: number): string {
  const n = localizedNumber(lang, percent);
  return lang === "en" ? `${n}% off` : `${n}٪ تخفیف`;
}

export function reviewsPageTitle(lang: MenuLang, itemName: string): string {
  return lang === "en" ? `Reviews — ${itemName}` : `نظرات — ${itemName}`;
}

export function basedOnReviewsLabel(lang: MenuLang, count: number): string {
  const n = localizedNumber(lang, count);
  return lang === "en" ? `Based on ${n} reviews` : `بر پایه ${n} نظر`;
}

/** Product search box's "N results for «query»" counter line. */
export function searchResultsCountLabel(lang: MenuLang, count: number, query: string): string {
  const n = localizedNumber(lang, count);
  return lang === "en" ? `${n} results for "${query}"` : `${n} نتیجه برای «${query}»`;
}

export function answeredOfLabel(lang: MenuLang, answered: number): string {
  const n = localizedNumber(lang, answered);
  return lang === "en" ? `${n} of 3` : `${n} از ۳`;
}

export function earnPointsBanner(lang: MenuLang, points: number): string {
  const n = localizedNumber(lang, points);
  return lang === "en"
    ? `Earn ${n} loyalty club points by submitting a review`
    : `با ثبت نظر ${n} امتیاز باشگاه مشتریان می‌گیرید`;
}

export function pointsAddedNote(lang: MenuLang, points: number): string {
  const n = localizedNumber(lang, points);
  return lang === "en" ? `${n} points were added to your account` : `${n} امتیاز به حساب شما اضافه شد`;
}

export function cashbackNoteLabel(lang: MenuLang, percent: number): string {
  const n = localizedNumber(lang, percent);
  return lang === "en"
    ? `${n}% of every order is returned to your wallet as cashback`
    : `${n}٪ از هر سفارش به‌صورت کش‌بک به کیف پول شما برمی‌گردد`;
}

export function pointsToGoldLabel(lang: MenuLang, points: number): string {
  const n = localizedNumber(lang, points);
  return lang === "en" ? `${n} points to Gold tier` : `${n} امتیاز تا سطح طلایی`;
}

export function orderNumberLabel(lang: MenuLang, shortId: string): string {
  return lang === "en" ? `Order #${shortId}` : `سفارش #${shortId}`;
}

export function quantityLabel(lang: MenuLang, n: number): string {
  const value = localizedNumber(lang, n);
  return lang === "en" ? `Qty: ${value}` : `تعداد: ${value}`;
}

export function confirmDeleteAddressLabel(lang: MenuLang, title: string): string {
  return lang === "en" ? `Delete address "${title}"?` : `آدرس «${title}» حذف شود؟`;
}

export function verifySubtitleLabel(lang: MenuLang, phone: string): string {
  return lang === "en" ? `Verification code sent to ${phone}` : `کد تایید به شماره ${phone} پیامک شد`;
}

export function resendCountdownLabel(lang: MenuLang, seconds: number): string {
  const n = localizedNumber(lang, seconds);
  return lang === "en" ? `Resend code (${n})` : `ارسال مجدد کد (${n})`;
}

export function addAriaLabel(lang: MenuLang, name: string): string {
  return lang === "en" ? `Add ${name}` : `افزودن ${name}`;
}

/** Rating 1–5 word, review form's "تجربه‌تان چطور بود؟" star picker. */
const RATE_LABEL: Record<MenuLang, Record<1 | 2 | 3 | 4 | 5, string>> = {
  fa: { 1: "خیلی بد", 2: "بد", 3: "متوسط", 4: "خوب", 5: "عالی بود!" },
  en: { 1: "Very bad", 2: "Bad", 3: "Average", 4: "Good", 5: "Excellent!" },
};
export function rateLabel(lang: MenuLang, rating: 1 | 2 | 3 | 4 | 5): string {
  return RATE_LABEL[lang][rating];
}

/** Fixed quick-pick review tags (review-schemas.ts's TAG_OPTIONS) — Persian is the stored value, this only maps display text. */
const TAG_LABEL_EN: Record<string, string> = {
  "خوش‌طعم": "Great taste",
  "گرم و تازه": "Warm & fresh",
  "بسته‌بندی مرتب": "Neat packaging",
  "تحویل سریع": "Fast delivery",
  "مقدار مناسب": "Good portion",
  "ارزش خرید": "Good value",
};
export function tagLabel(lang: MenuLang, faTag: string): string {
  return lang === "en" ? (TAG_LABEL_EN[faTag] ?? faTag) : faTag;
}

/** Survey answer option labels (review-schemas.ts's TASTE/SPEED/PACKAGING_OPTIONS English keys). */
export const TASTE_LABEL: Record<MenuLang, Record<string, string>> = {
  fa: { EXCELLENT: "عالی", GOOD: "خوب", AVERAGE: "متوسط", POOR: "ضعیف" },
  en: { EXCELLENT: "Excellent", GOOD: "Good", AVERAGE: "Average", POOR: "Poor" },
};
export const SPEED_LABEL: Record<MenuLang, Record<string, string>> = {
  fa: { EARLY: "زودتر از انتظار", ON_TIME: "به‌موقع", LATE: "کمی دیر", VERY_LATE: "خیلی دیر" },
  en: { EARLY: "Earlier than expected", ON_TIME: "On time", LATE: "A bit late", VERY_LATE: "Very late" },
};
export const PACKAGING_LABEL: Record<MenuLang, Record<string, string>> = {
  fa: { NEAT: "مرتب و سالم", ACCEPTABLE: "قابل قبول", POOR: "نامناسب" },
  en: { NEAT: "Neat & intact", ACCEPTABLE: "Acceptable", POOR: "Poor" },
};

/** Loyalty reward labels (features/customer/services/loyalty.ts's LOYALTY_REWARDS) — Persian is the source of truth, this only maps display text. */
const REWARD_LABEL_EN: Record<string, string> = {
  "یک نوشیدنی رایگان": "One free drink",
  "۱۰٪ تخفیف سفارش بعدی": "10% off your next order",
  "دسر رایگان": "Free dessert",
};
export function rewardLabel(lang: MenuLang, faLabel: string): string {
  return lang === "en" ? (REWARD_LABEL_EN[faLabel] ?? faLabel) : faLabel;
}

/** WalletTransaction type label (features/customer's wallet ledger). */
export function walletTransactionTypeLabel(
  lang: MenuLang,
  type: "CASHBACK_EARNED" | "ADJUSTMENT" | "REDEEMED"
): string {
  const t = menuCopy(lang);
  if (type === "CASHBACK_EARNED") return t.cashbackOrder;
  if (type === "REDEEMED") return t.walletRedeemedLabel;
  return t.balanceAdjustment;
}

/** OrderStatus label shared by the dashboard's OrderStatusBadge and customer-facing order screens. */
export function orderStatusLabel(
  lang: MenuLang,
  status: "NEW" | "PREPARING" | "READY" | "DELIVERED" | "CANCELED"
): string {
  const t = menuCopy(lang);
  switch (status) {
    case "NEW":
      return t.statusNew;
    case "PREPARING":
      return t.statusPreparing;
    case "READY":
      return t.statusReady;
    case "DELIVERED":
      return t.statusDelivered;
    case "CANCELED":
      return t.statusCanceled;
  }
}
