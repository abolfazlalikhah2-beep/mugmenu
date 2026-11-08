export type HelpCategory = {
  slug: string;
  name: string;
  icon: "menu" | "dashboard" | "login" | "start" | "pos" | "order-settings" | "qr" | "categories" | "support" | "billing" | "loyalty" | "reports";
  iconBg: string;
  iconColor: string;
};

export type HelpArticleStep = {
  title: string;
  desc: string;
};

export type HelpArticle = {
  slug: string;
  categorySlug: string;
  title: string;
  updatedAt: string;
  readMinutes: number;
  intro: string;
  steps?: HelpArticleStep[];
  note?: string;
};

export const helpCategories: HelpCategory[] = [
  { slug: "start", name: "شروع کار", icon: "start", iconBg: "#eaf6ec", iconColor: "#328C3D" },
  { slug: "menu", name: "منو و محصولات", icon: "menu", iconBg: "#fdf0e3", iconColor: "#d98a2b" },
  { slug: "dashboard", name: "داشبورد", icon: "dashboard", iconBg: "#e8f1fb", iconColor: "#2f7fd6" },
  { slug: "login", name: "ورود به پنل", icon: "login", iconBg: "#eef0fb", iconColor: "#5b5fc7" },
  { slug: "pos", name: "صندوق / POS", icon: "pos", iconBg: "#e8f1fb", iconColor: "#2f7fd6" },
  { slug: "order-settings", name: "تنظیمات سفارش", icon: "order-settings", iconBg: "#fdf0e3", iconColor: "#d98a2b" },
  { slug: "qr", name: "کد و میزها", icon: "qr", iconBg: "#eaf6ec", iconColor: "#328C3D" },
  { slug: "categories", name: "دسته‌بندی‌ها", icon: "categories", iconBg: "#eef0fb", iconColor: "#5b5fc7" },
  { slug: "support", name: "پشتیبانی", icon: "support", iconBg: "#eaf6ec", iconColor: "#328C3D" },
  { slug: "billing", name: "اشتراک و پرداخت", icon: "billing", iconBg: "#fdeeee", iconColor: "#d64545" },
  { slug: "loyalty", name: "باشگاه مشتریان", icon: "loyalty", iconBg: "#fdf0e3", iconColor: "#d98a2b" },
  { slug: "reports", name: "گزارش‌ها و اکسل", icon: "reports", iconBg: "#eaf6ec", iconColor: "#328C3D" },
];

export const helpArticles: HelpArticle[] = [
  {
    slug: "saakht-avalin-menu",
    categorySlug: "menu",
    title: "ساخت اولین منو در ۵ دقیقه",
    updatedAt: "۳ مهر ۱۴۰۵",
    readMinutes: 4,
    intro:
      "برای شروع کار با ماگ‌منو کافی است چند دسته‌بندی و چند محصول اضافه کنید تا منوی شما آماده‌ی انتشار شود. این راهنما سریع‌ترین مسیر برای رسیدن به یک منوی قابل‌انتشار را نشان می‌دهد.",
    steps: [
      { title: "یک دسته‌بندی بسازید.", desc: "از پنل مدیریت، بخش «دسته‌بندی‌ها» را باز کنید و یک دسته مثل «پیش‌غذا» یا «نوشیدنی» اضافه کنید." },
      { title: "محصول اول را اضافه کنید.", desc: "روی دکمه «افزودن محصول» بزنید، نام، قیمت و توضیح کوتاه را وارد کنید." },
      { title: "منو را منتشر کنید.", desc: "با یک کلیک منو فعال می‌شود و کد QR اختصاصی کسب‌وکار شما ساخته می‌شود." },
    ],
    note: "می‌توانید محصولات را بعداً هم ویرایش یا غیرفعال کنید؛ نیازی نیست همه‌چیز را از همان ابتدا کامل وارد کنید.",
  },
  {
    slug: "afzoodan-mahsool-ba-aks",
    categorySlug: "menu",
    title: "افزودن محصول با عکس",
    updatedAt: "۸ مهر ۱۴۰۵",
    readMinutes: 3,
    intro:
      "در زیر راهنمای گام‌به‌گام چطور می‌توانید یک محصول جدید را با قیمت و توضیحات به منوی خود اضافه کنید، آمده است.",
    steps: [
      { title: "از منوی پنل وارد «منو و محصولات» شوید.", desc: "روی دکمه «افزودن محصول» بزنید." },
      { title: "نام، قیمت و دسته را وارد و عکس را آپلود کنید.", desc: "دکمه «ذخیره» را بزنید." },
    ],
    note: "نکته: عکس‌های مربعی با کیفیت حداقل ۸۰۰ پیکسل بهترین نتیجه را دارند.",
  },
  {
    slug: "virayesh-gheymat-ha",
    categorySlug: "menu",
    title: "ویرایش قیمت‌ها",
    updatedAt: "۲ مهر ۱۴۰۵",
    readMinutes: 2,
    intro: "قیمت هر محصول را در هر زمان می‌توانید از پنل مدیریت تغییر دهید؛ تغییرات بلافاصله روی منوی عمومی اعمال می‌شود.",
    steps: [
      { title: "محصول موردنظر را از لیست انتخاب کنید.", desc: "روی آیکون ویرایش کلیک کنید." },
      { title: "قیمت جدید را وارد و ذخیره کنید.", desc: "تغییر بلافاصله روی منوی مشتریان نمایش داده می‌شود." },
    ],
  },
  {
    slug: "tanzim-takhfif-mahsool",
    categorySlug: "menu",
    title: "تنظیم تخفیف روی محصول",
    updatedAt: "۱ مهر ۱۴۰۵",
    readMinutes: 3,
    intro: "می‌توانید روی هر محصول به‌صورت درصدی یا مبلغ ثابت تخفیف اعمال کنید.",
    steps: [
      { title: "از صفحه محصول، بخش «تخفیف» را باز کنید.", desc: "نوع تخفیف (درصدی یا مبلغی) را انتخاب کنید." },
      { title: "بازه زمانی تخفیف را مشخص کنید.", desc: "در صورت نیاز تاریخ شروع و پایان تخفیف را تعیین کنید." },
    ],
  },
  {
    slug: "martab-sazi-aytem-ha",
    categorySlug: "menu",
    title: "مرتب‌سازی آیتم‌ها",
    updatedAt: "۲۸ شهریور ۱۴۰۵",
    readMinutes: 2,
    intro: "ترتیب نمایش دسته‌ها و محصولات در منوی عمومی را می‌توانید با کشیدن و رهاکردن (درگ اند دراپ) تغییر دهید.",
    steps: [{ title: "وارد «دسته‌بندی‌ها» یا «منو و محصولات» شوید.", desc: "آیتم‌ها را بکشید و در جای دلخواه رها کنید؛ ترتیب به‌صورت خودکار ذخیره می‌شود." }],
  },
  {
    slug: "chetor-qr-mizz-besazam",
    categorySlug: "qr",
    title: "چطور QR کد میز بسازم؟",
    updatedAt: "۴ مهر ۱۴۰۵",
    readMinutes: 3,
    intro: "برای سفارش «روی میز» باید برای هر میز یک کد QR اختصاصی بسازید تا مشتری با اسکن آن مستقیم سفارش ثبت کند.",
    steps: [
      { title: "به بخش «کد و میزها» بروید.", desc: "روی «افزودن میز» بزنید و شماره میز را وارد کنید." },
      { title: "کد QR میز را دانلود کنید.", desc: "فایل را چاپ و روی میز نصب کنید." },
    ],
  },
  {
    slug: "faal-kardan-sefaresh-birounbar",
    categorySlug: "order-settings",
    title: "فعال کردن سفارش بیرون‌بر",
    updatedAt: "۵ مهر ۱۴۰۵",
    readMinutes: 3,
    intro: "حالت سفارش «بیرون‌بر» را می‌توانید از تنظیمات سفارش فعال و زمان تحویل تخمینی آن را مشخص کنید.",
    steps: [
      { title: "به «تنظیمات سفارش» بروید.", desc: "کلید «بیرون‌بر» را فعال کنید." },
      { title: "زمان تحویل تخمینی را تعیین کنید.", desc: "تنظیمات را ذخیره کنید." },
    ],
  },
  {
    slug: "greftan-khoroji-excel-sefareshat",
    categorySlug: "reports",
    title: "گرفتن خروجی اکسل از سفارش‌ها",
    updatedAt: "۷ مهر ۱۴۰۵",
    readMinutes: 2,
    intro: "گزارش فروش و سفارش‌ها را می‌توانید به‌صورت فایل اکسل از پنل مدیریت دریافت کنید.",
    steps: [
      { title: "به بخش «گزارش‌ها» بروید.", desc: "بازه تاریخ موردنظر را انتخاب کنید." },
      { title: "روی «خروجی اکسل» بزنید.", desc: "فایل به‌صورت خودکار دانلود می‌شود." },
    ],
  },
  {
    slug: "tamdid-ya-ertegha-eshterak",
    categorySlug: "billing",
    title: "تمدید یا ارتقای اشتراک",
    updatedAt: "۸ مهر ۱۴۰۵",
    readMinutes: 2,
    intro: "پیش از پایان اشتراک می‌توانید آن را تمدید کنید یا به پلن بالاتر ارتقا دهید.",
    steps: [
      { title: "به بخش «اشتراک و پرداخت» بروید.", desc: "پلن جدید یا دوره تمدید را انتخاب کنید." },
      { title: "پرداخت را تکمیل کنید.", desc: "اشتراک بلافاصله فعال یا تمدید می‌شود." },
    ],
  },
  {
    slug: "varood-be-panel",
    categorySlug: "login",
    title: "ورود اولین بار به پنل",
    updatedAt: "۲۵ شهریور ۱۴۰۵",
    readMinutes: 2,
    intro: "ورود به پنل مدیریت ماگ‌منو با شماره موبایل و کد پیامکی انجام می‌شود، بدون نیاز به رمز عبور ثابت.",
    steps: [
      { title: "شماره موبایل خود را وارد کنید.", desc: "کد پیامکی ۵ رقمی دریافت می‌کنید." },
      { title: "کد را وارد کنید.", desc: "وارد پنل مدیریت کسب‌وکار خود می‌شوید." },
    ],
  },
  {
    slug: "ashnayi-ba-dashboard",
    categorySlug: "dashboard",
    title: "آشنایی اولیه با داشبورد",
    updatedAt: "۲۲ شهریور ۱۴۰۵",
    readMinutes: 3,
    intro: "داشبورد پنل مدیریت، خلاصه‌ای از وضعیت سفارش‌ها، فروش روزانه و پرفروش‌ترین آیتم‌ها را نمایش می‌دهد.",
    steps: [{ title: "پس از ورود، صفحه داشبورد باز می‌شود.", desc: "از منوی کناری به بخش‌های دیگر پنل دسترسی دارید." }],
  },
  {
    slug: "ashnayi-ba-sandogh-pos",
    categorySlug: "pos",
    title: "آشنایی با صندوق / POS",
    updatedAt: "۲۰ شهریور ۱۴۰۵",
    readMinutes: 3,
    intro: "بخش صندوق برای ثبت سفارش‌های حضوری و تسویه سریع در لحظه طراحی شده است.",
    steps: [{ title: "از منوی پنل وارد «صندوق» شوید.", desc: "محصولات را انتخاب و سفارش را ثبت کنید." }],
  },
  {
    slug: "sakht-dastebandi-jadid",
    categorySlug: "categories",
    title: "ساخت دسته‌بندی جدید",
    updatedAt: "۱۸ شهریور ۱۴۰۵",
    readMinutes: 2,
    intro: "دسته‌بندی‌ها به مشتری کمک می‌کنند سریع‌تر در منو جست‌وجو کند.",
    steps: [{ title: "به «دسته‌بندی‌ها» بروید.", desc: "روی «افزودن دسته‌بندی» بزنید و نام را وارد کنید." }],
  },
  {
    slug: "tamas-ba-poshtibani",
    categorySlug: "support",
    title: "چطور با پشتیبانی تماس بگیرم؟",
    updatedAt: "۱۵ شهریور ۱۴۰۵",
    readMinutes: 1,
    intro: "تیم پشتیبانی سِرو از طریق تلفن و چت پاسخگوی سوالات شماست.",
    steps: [{ title: "از پایین همین صفحه روی «تماس با پشتیبانی» بزنید.", desc: "یا با شماره درج‌شده در فوتر تماس بگیرید." }],
  },
  {
    slug: "fa3al-sazi-bashgah-moshtarian",
    categorySlug: "loyalty",
    title: "فعال‌سازی باشگاه مشتریان",
    updatedAt: "۱۲ شهریور ۱۴۰۵",
    readMinutes: 3,
    intro: "با باشگاه مشتریان می‌توانید به مشتریان وفادار امتیاز و تخفیف بدهید.",
    steps: [{ title: "از تنظیمات، «باشگاه مشتریان» را فعال کنید.", desc: "قوانین امتیازدهی را تعیین کنید." }],
  },
];

export function getCategoryBySlug(slug: string): HelpCategory | undefined {
  return helpCategories.find((c) => c.slug === slug);
}

export function getArticleBySlug(slug: string): HelpArticle | undefined {
  return helpArticles.find((a) => a.slug === slug);
}

export function getArticlesByCategory(categorySlug: string): HelpArticle[] {
  return helpArticles.filter((a) => a.categorySlug === categorySlug);
}

export function getArticleCount(categorySlug: string): number {
  return getArticlesByCategory(categorySlug).length;
}

export function getLatestArticles(limit = 6): HelpArticle[] {
  return helpArticles.slice(0, limit);
}

export function searchArticles(query: string): HelpArticle[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return helpArticles.filter((a) => a.title.toLowerCase().includes(q) || a.intro.toLowerCase().includes(q));
}
