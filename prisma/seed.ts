import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../lib/generated/prisma/client";
import { PLAN_KEYS, PLAN_DEFS, FEATURE_KEYS, FEATURE_MATRIX, type PlanKey } from "../features/plans/feature-matrix";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

interface SeededPlan {
  id: string;
  name: string;
  monthlyPrice: number;
  sixMonthPrice: number;
  annualPrice: number;
}

async function seedPlans(): Promise<Record<PlanKey, SeededPlan>> {
  const plansByKey = {} as Record<PlanKey, SeededPlan>;

  for (const key of PLAN_KEYS) {
    const def = PLAN_DEFS[key];
    const fields = {
      name: def.name,
      slug: def.slug,
      description: def.description,
      monthlyPrice: def.monthlyPrice,
      sixMonthPrice: def.sixMonthPrice,
      annualPrice: def.annualPrice,
      isOrderingEnabled: def.isOrderingEnabled,
      isCashierEnabled: def.isCashierEnabled,
      marketingFeatures: def.marketingFeatures,
      sortOrder: def.sortOrder,
    };
    const plan = await prisma.plan.upsert({
      where: { key },
      update: fields,
      create: { key, ...fields },
    });
    plansByKey[key] = plan;
  }

  for (const featureKey of FEATURE_KEYS) {
    const planEntries = FEATURE_MATRIX[featureKey];
    for (const key of PLAN_KEYS) {
      if (!(key in planEntries)) continue;
      const planId = plansByKey[key].id;
      const limitValue = planEntries[key] ?? null;
      await prisma.planFeature.upsert({
        where: { planId_featureKey: { planId, featureKey } },
        update: { limitValue },
        create: { planId, featureKey, limitValue },
      });
    }
  }

  // Any business created before Plan existed (or created without an explicit
  // plan) defaults to zomorrod so nobody loses access mid-migration — raw
  // SQL because the generated client's Business type expects planId to
  // already be non-null (its final, post-migration shape).
  await prisma.$executeRaw`UPDATE "Business" SET "planId" = ${plansByKey["zomorrod"].id} WHERE "planId" IS NULL`;

  // One-time migration off the old 3-tier plans (menu-display/menu-order/
  // menu-advanced) to the 4 gem-named tiers above, by rough tier
  // equivalence. Idempotent: findUnique returns null once an old plan's
  // already been deleted on a prior run. PlanFeature rows for the deleted
  // plan cascade-delete automatically (see Plan.features' onDelete: Cascade).
  const OLD_TO_NEW: Record<string, PlanKey> = {
    "menu-display": "firuze",
    "menu-order": "opal",
    "menu-advanced": "zomorrod",
  };
  for (const [oldKey, newKey] of Object.entries(OLD_TO_NEW)) {
    const oldPlan = await prisma.plan.findUnique({ where: { key: oldKey } });
    if (!oldPlan) continue;
    await prisma.business.updateMany({ where: { planId: oldPlan.id }, data: { planId: plansByKey[newKey].id } });
    await prisma.plan.delete({ where: { key: oldKey } });
  }

  return plansByKey;
}

/**
 * Three sample published posts so the /blog listing, the demo post page,
 * and the marketing pages that link to them (about page's blog preview,
 * site footer) all have real content instead of 404s.
 */
async function seedBlog() {
  const categoryDefs = [
    { name: "منوی دیجیتال", slug: "digital-menu" },
    { name: "مدیریت سفارش", slug: "order-management" },
    { name: "آموزش پنل", slug: "panel-guide" },
  ];
  const categories: Record<string, string> = {};
  for (const c of categoryDefs) {
    const created = await prisma.blogCategory.upsert({ where: { slug: c.slug }, update: { name: c.name }, create: c });
    categories[c.name] = created.id;
  }

  const tagDefs = [
    { name: "منوی QR", slug: "qr-menu" },
    { name: "سفارش‌گیری", slug: "ordering" },
    { name: "راه‌اندازی", slug: "setup" },
  ];
  const tags: Record<string, string> = {};
  for (const t of tagDefs) {
    const created = await prisma.blogTag.upsert({ where: { slug: t.slug }, update: { name: t.name }, create: t });
    tags[t.name] = created.id;
  }

  const postDefs = [
    {
      slug: "digital-menu-qr-code",
      title: "چرا رستوران شما به منوی QR نیاز دارد؟",
      excerpt:
        "منوی کاغذی دیگر پاسخگوی نیاز رستوران‌های امروز نیست؛ در این مقاله می‌بینیم منوی QR چه مشکلاتی را حل می‌کند و راه‌اندازی آن با ماگ‌منو چقدر ساده است.",
      content: [
        "منوی کاغذی سال‌هاست بخش جدایی‌ناپذیر رستوران‌هاست، اما با تغییر عادت مشتری‌ها و رشد سفارش آنلاین، این روش دیگر پاسخگوی نیاز کسب‌وکارهای غذایی نیست. منوی QR راهی ساده و کم‌هزینه برای دیجیتال‌کردن تجربه‌ی سفارش است.",
        "منوی کاغذی چه مشکلاتی دارد؟ هر بار که قیمت‌ها تغییر می‌کند یا آیتمی به منو اضافه می‌شود، باید کل منو دوباره چاپ شود. این یعنی هزینه‌ی مداوم و منویی که همیشه کمی عقب‌تر از واقعیت است. از طرفی منوی کاغذی هیچ داده‌ای درباره‌ی رفتار مشتری در اختیار شما نمی‌گذارد.",
        "منوی QR چطور کمک می‌کند؟ با منوی QR مشتری تنها با اسکن یک کد، منوی همیشه به‌روز شما را در مرورگر گوشی‌اش می‌بیند؛ بدون نیاز به نصب هیچ اپلیکیشنی. تغییر قیمت یا افزودن آیتم جدید در لحظه اعمال می‌شود و دیگر خبری از چاپ دوباره نیست.",
        "رستوران‌هایی که به منوی دیجیتال مهاجرت کرده‌اند، به‌طور معمول زمان ثبت سفارش کوتاه‌تر و خطای سفارش کمتری را تجربه می‌کنند.",
        "از کجا شروع کنیم؟ کافی است در ماگ‌منو ثبت‌نام کنید، منوی خود را وارد کنید و کد QR را روی میزها یا ویترین رستوران قرار دهید. کل این فرایند کمتر از چند دقیقه زمان می‌برد و می‌توانید رایگان شروع کنید.",
      ].join("\n\n"),
      status: "PUBLISHED" as const,
      publishedAt: new Date("2025-08-05"),
      categories: ["منوی دیجیتال"],
      tags: ["منوی QR"],
    },
    {
      slug: "three-order-modes-explained",
      title: "سه حالت سفارش؛ کدام برای رستوران شما مناسب است؟",
      excerpt: "تفاوت سفارش روی میز، بیرون‌بر و ارسال با پیک و بهترین ترکیب برای انواع کسب‌وکار غذایی.",
      content: [
        "هر رستوران و کافه‌ای نیاز متفاوتی برای دریافت سفارش دارد؛ به همین دلیل ماگ‌منو سه حالت سفارش را جداگانه در اختیارتان می‌گذارد تا هرکدام را که به کسب‌وکارتان می‌خورد فعال کنید.",
        "روی میز: مناسب رستوران و کافه‌ی حضوری. مشتری با اسکن QR روی میز، شماره میز را می‌بیند و برای ثبت سفارش فقط نام و شماره تلفن خود را وارد می‌کند؛ سفارش مستقیم به پنل مدیریت و آشپزخانه می‌رسد.",
        "بیرون‌بر: برای مشتری‌هایی که سفارش را از رستوران تحویل می‌گیرند. در این حالت فقط یک زمان تحویل تخمینی از مشتری گرفته می‌شود تا سفارش دقیقاً سر وقت آماده باشد.",
        "ارسال با پیک: برای سفارش‌هایی که باید به آدرس مشتری ارسال شوند. مشتری آدرس، لوکیشن روی نقشه و زمان تحویل موردنظرش را مشخص می‌کند تا پیک مسیر را به‌سادگی پیدا کند.",
        "هر سه حالت را می‌توانید هم‌زمان فعال نگه دارید یا بسته به نوع کسب‌وکارتان فقط یکی-دو مورد را انتخاب کنید — تغییر تنظیمات در هر لحظه از پنل مدیریت ممکن است.",
        "کافه‌های حضوری معمولاً با «روی میز» شروع می‌کنند، فست‌فودها اغلب «بیرون‌بر» و «ارسال با پیک» را با هم فعال می‌کنند، و رستوران‌های بزرگ‌تر معمولاً هر سه حالت را همزمان ارائه می‌دهند.",
      ].join("\n\n"),
      status: "PUBLISHED" as const,
      publishedAt: new Date("2025-07-29"),
      categories: ["مدیریت سفارش"],
      tags: ["سفارش‌گیری"],
    },
    {
      slug: "setup-digital-menu-5-minutes",
      title: "راهنمای راه‌اندازی منوی دیجیتال در ۵ دقیقه",
      excerpt: "قدم‌به‌قدم یاد بگیرید چطور در کمتر از پنج دقیقه منوی دیجیتال رستوران‌تان را بسازید و منتشر کنید.",
      content: [
        "ساخت منوی دیجیتال در ماگ‌منو نیاز به هیچ دانش فنی‌ای ندارد. در پنج قدم ساده، منوی رستوران‌تان آماده و قابل اسکن می‌شود.",
        "۱. ثبت‌نام و ساخت حساب رستوران: با شماره موبایل خود ثبت‌نام کنید و نام و آدرس رستوران را وارد کنید؛ یک آدرس اختصاصی برای منوی عمومی‌تان ساخته می‌شود.",
        "۲. افزودن دسته‌بندی‌ها و محصولات: از پنل مدیریت دسته‌بندی‌ها (مثل پیش‌غذا، غذای اصلی، نوشیدنی) و محصولات هر دسته را با قیمت و توضیحات وارد کنید.",
        "۳. تنظیم اطلاعات و ساعات کاری رستوران: لوگو، رنگ برند و ساعات کاری رستوران را تنظیم کنید تا منوی عمومی دقیقاً همان چیزی را نشان دهد که مشتری انتظار دارد.",
        "می‌توانید ابتدا فقط با پلن رایگان «منو دیداری» شروع کنید و هر زمان به سفارش‌گیری آنلاین نیاز داشتید، ارتقا دهید.",
        "۴. دریافت و چاپ کد QR: از پنل، کد QR اختصاصی منو را دانلود و روی میزها، ویترین یا کارت منو چاپ کنید.",
        "۵. انتشار منو برای مشتریان: همین که کد QR در دسترس مشتری قرار گرفت، منوی دیجیتال شما آماده‌ی استفاده است — هر تغییری در پنل، بلافاصله برای مشتری قابل مشاهده خواهد بود.",
      ].join("\n\n"),
      status: "PUBLISHED" as const,
      publishedAt: new Date("2025-07-23"),
      categories: ["آموزش پنل"],
      tags: ["راه‌اندازی"],
    },
  ];

  for (const p of postDefs) {
    const post = await prisma.blogPost.upsert({
      where: { slug: p.slug },
      update: { title: p.title, excerpt: p.excerpt, content: p.content, status: p.status, publishedAt: p.publishedAt },
      create: {
        slug: p.slug,
        title: p.title,
        excerpt: p.excerpt,
        content: p.content,
        status: p.status,
        publishedAt: p.publishedAt,
      },
    });
    for (const categoryName of p.categories) {
      await prisma.blogPostCategory.upsert({
        where: { postId_categoryId: { postId: post.id, categoryId: categories[categoryName] } },
        update: {},
        create: { postId: post.id, categoryId: categories[categoryName] },
      });
    }
    for (const tagName of p.tags) {
      await prisma.blogPostTag.upsert({
        where: { postId_tagId: { postId: post.id, tagId: tags[tagName] } },
        update: {},
        create: { postId: post.id, tagId: tags[tagName] },
      });
    }
  }
}

async function main() {
  const plansByKey = await seedPlans();

  const demoBusinessFields = {
    name: "رستوران چلوکبابی باختر",
    nameEn: "Bakhtar Restaurant",
    address: "تبریز، ولیعصر، پروین اعتصامی، میدان تجارت جهانی",
    phone: "0912 123 457",
    description:
      "رستوران ما با الهام از طعم‌های اصیل و مواد اولیه تازه، تلاش می‌کند لحظاتی خوشمزه و به‌یادماندنی برای شما بسازد.",
    isAcceptingOrders: true,
    acceptsDineIn: true,
    acceptsTakeaway: true,
    acceptsDelivery: true,
    acceptsOnlinePayment: false,
    acceptsCashPayment: true,
  };

  const business = await prisma.business.upsert({
    where: { slug: "demo" },
    update: demoBusinessFields,
    // planId only set on create, not update — re-seeding shouldn't undo a
    // plan change made through the super-admin plan switcher while testing.
    create: { slug: "demo", ...demoBusinessFields, planId: plansByKey["zomorrod"].id },
  });

  // Friday closed, Thursday shorter hours — gives the public accordion and
  // dashboard editor non-uniform demo data to show off (see business-hours.ts).
  const businessHoursDefs = Array.from({ length: 7 }, (_, dayOfWeek) => {
    if (dayOfWeek === 5) return { dayOfWeek, isClosed: true, openTime: "15:00", closeTime: "00:00" };
    if (dayOfWeek === 4) return { dayOfWeek, isClosed: false, openTime: "15:00", closeTime: "22:00" };
    return { dayOfWeek, isClosed: false, openTime: "15:00", closeTime: "00:00" };
  });
  for (const h of businessHoursDefs) {
    await prisma.businessHours.upsert({
      where: { businessId_dayOfWeek: { businessId: business.id, dayOfWeek: h.dayOfWeek } },
      update: h,
      create: { businessId: business.id, ...h },
    });
  }

  const passwordHash = await bcrypt.hash("demo1234", 10);
  await prisma.user.upsert({
    where: { phone: "09376220110" },
    update: {},
    create: {
      phone: "09376220110",
      fullName: "علیرضا محمدی",
      passwordHash,
      businessId: business.id,
    },
  });

  const categoryDefs = [
    { name: "کباب‌ها", icon: "fork", sortOrder: 0 },
    { name: "خورش‌ها", icon: "pot", sortOrder: 1 },
    { name: "پیش‌غذا", icon: "bowl", sortOrder: 2 },
    { name: "نوشیدنی", icon: "cup", sortOrder: 3 },
    { name: "دسر", icon: "cake", sortOrder: 4 },
  ];

  const categories: Record<string, string> = {};
  for (const c of categoryDefs) {
    const created = await prisma.category.upsert({
      where: { businessId_name: { businessId: business.id, name: c.name } },
      update: {},
      create: { businessId: business.id, ...c },
    });
    categories[c.name] = created.id;
  }

  const productDefs = [
    {
      category: "کباب‌ها",
      name: "چلوکباب وزیری",
      price: 385000,
      description: "یک سیخ کوبیده و یک سیخ برگ زعفرانی با برنج ایرانی",
      long: "ترکیبی از یک سیخ کباب کوبیده دست‌ساز و یک سیخ کباب برگ گوسفندی زعفرانی، سرو‌شده با برنج ایرانی دم‌کشیده، کره محلی و گوجه کبابی.",
    },
    {
      category: "کباب‌ها",
      name: "چلوکباب سلطانی",
      price: 420000,
      description: "برگ ممتاز و کوبیده مخصوص، سرو با برنج زعفرانی",
      long: "برگ ممتاز و کوبیده مخصوص، سرو‌شده با برنج زعفرانی و کره محلی.",
    },
    {
      category: "کباب‌ها",
      name: "جوجه‌کباب زعفرانی",
      price: 295000,
      description: "ران مرغ زعفرانی و ترد، همراه با برنج و ته‌دیگ",
      long: "ران مرغ زعفرانی و ترد، همراه با برنج ایرانی و ته‌دیگ سیب‌زمینی.",
    },
    {
      category: "کباب‌ها",
      name: "کباب کوبیده (۲ سیخ)",
      price: 220000,
      description: "گوشت مخلوط تازه، دو سیخ کوبیده با برنج ایرانی",
      long: "گوشت مخلوط تازه و تازه‌چرخ‌شده، دو سیخ کوبیده سرو‌شده با برنج ایرانی.",
    },
    {
      category: "کباب‌ها",
      name: "کباب برگ",
      price: 450000,
      description: "فیله گوسفندی مزه‌دار، نرم و زعفرانی",
      long: "فیله گوسفندی مزه‌دار در ماریناد مخصوص، نرم و زعفرانی.",
    },
    {
      category: "کباب‌ها",
      name: "چلو ماهیچه",
      price: 520000,
      description: "ماهیچه گوسفندی آرام‌پز با برنج زعفرانی",
      long: "ماهیچه گوسفندی آرام‌پز شده به مدت ۶ ساعت، سرو‌شده با برنج زعفرانی.",
    },
    {
      category: "خورش‌ها",
      name: "قورمه سبزی",
      price: 265000,
      description: "خورش سبزی معطر با گوشت گوسفندی و لیمو عمانی",
      long: "خورش سبزی معطر، پخته‌شده با گوشت گوسفندی، لوبیا قرمز و لیمو عمانی.",
    },
    {
      category: "خورش‌ها",
      name: "قیمه بادمجان",
      price: 250000,
      description: "خورش قیمه با بادمجان سرخ‌شده و گوشت گوسفندی",
      long: "خورش قیمه سنتی با بادمجان سرخ‌شده، لپه و گوشت گوسفندی.",
    },
    {
      category: "پیش‌غذا",
      name: "میرزاقاسمی",
      price: 145000,
      description: "بادمجان کبابی با تخم‌مرغ و سیر سرخ‌شده",
      long: "بادمجان کبابی له‌شده با تخم‌مرغ، سیر سرخ‌شده و گوجه.",
    },
    {
      category: "پیش‌غذا",
      name: "ماست و خیار",
      price: 85000,
      description: "ماست چکیده با خیار، نعنا و گردو",
      long: "ماست چکیده تازه با خیار خردشده، نعنا و گردو.",
    },
    {
      category: "نوشیدنی",
      name: "دوغ سنتی",
      price: 45000,
      description: "دوغ خانگی با نعنای تازه",
      long: "دوغ خانگی تخمیرشده با نعنای تازه، سرد و گازدار.",
    },
    {
      category: "نوشیدنی",
      name: "نوشابه قوطی",
      price: 35000,
      description: "نوشابه خنک، کوکاکولا یا فانتا",
      long: "نوشابه خنک در قوطی ۳۳۰ میلی‌لیتری.",
    },
    {
      category: "دسر",
      name: "بستنی زعفرانی",
      price: 95000,
      description: "بستنی سنتی زعفرانی با تکه‌های پسته",
      long: "بستنی سنتی زعفرانی دستی، با تکه‌های پسته و گلاب.",
    },
    {
      category: "دسر",
      name: "شله‌زرد",
      price: 75000,
      description: "دسر برنجی زعفرانی با دارچین و پسته",
      long: "دسر سنتی برنجی، زعفرانی و معطر، تزیین‌شده با دارچین و پسته.",
    },
  ];

  const products: Record<string, string> = {};
  for (const p of productDefs) {
    const created = await prisma.product.upsert({
      where: { businessId_name: { businessId: business.id, name: p.name } },
      update: {},
      create: {
        businessId: business.id,
        categoryId: categories[p.category],
        name: p.name,
        description: p.long,
        price: p.price,
      },
    });
    products[p.name] = created.id;
  }

  const vaziriId = products["چلوکباب وزیری"];
  const reviewDefs = [
    {
      customerName: "ابلفضل علیخواه",
      rating: 4,
      comment:
        "پیک غذا رو سریع رسوند خیلی تشکر. اما غذا خیلی شور بود، نشد که همه غذا رو بخوریم و لذت ببریم.",
    },
    {
      customerName: "مریم رستمی",
      rating: 5,
      comment:
        "کیفیت گوشت واقعاً عالی بود، کوبیده‌ش دست‌ساز و خوش‌طعم. حتماً دوباره سفارش می‌دم.",
    },
    {
      customerName: "سعید کاظمی",
      rating: 4,
      comment:
        "برنجش عالی بود ولی کباب برگ یه‌کم خشک شده بود. در کل راضی بودم و بسته‌بندی تمیز بود.",
    },
  ];

  for (const r of reviewDefs) {
    await prisma.review.upsert({
      where: { productId_customerName: { productId: vaziriId, customerName: r.customerName } },
      update: {},
      create: {
        businessId: business.id,
        productId: vaziriId,
        ...r,
      },
    });
  }

  // ---- Demo customer account (کیف پول کش‌بک, باشگاه مشتریان) ----
  const jojehId = products["جوجه‌کباب زعفرانی"];
  const doughId = products["دوغ سنتی"];

  const customer = await prisma.customerAccount.upsert({
    where: { businessId_phone: { businessId: business.id, phone: "09190001234" } },
    update: {},
    create: { businessId: business.id, phone: "09190001234", fullName: "سمانه رضایی" },
  });

  await prisma.customerAddress.upsert({
    where: { id: `${customer.id}-home` }, // stable synthetic id, see note below
    update: {},
    create: {
      id: `${customer.id}-home`,
      customerAccountId: customer.id,
      title: "خانه",
      text: "تبریز، ولیعصر، پروین اعتصامی، کوچه گلستان، پلاک ۱۲، واحد ۳",
      phone: "0912 345 6789",
      isDefault: true,
    },
  });

  const existingCustomerOrders = await prisma.order.count({ where: { customerAccountId: customer.id } });
  if (existingCustomerOrders === 0 && jojehId && vaziriId && doughId) {
    const now = new Date();
    const twelveDaysAgo = new Date(now.getTime() - 12 * 24 * 60 * 60 * 1000);

    const deliveredOrder = await prisma.order.create({
      data: {
        businessId: business.id,
        customerAccountId: customer.id,
        type: "TAKEAWAY",
        status: "DELIVERED",
        customerName: customer.fullName,
        customerPhone: customer.phone,
        totalPrice: 295000 * 2 + business.packagingFee,
        createdAt: twelveDaysAgo,
        updatedAt: twelveDaysAgo,
        items: { create: [{ productId: jojehId, quantity: 2, unitPrice: 295000 }] },
      },
    });

    const activeOrder = await prisma.order.create({
      data: {
        businessId: business.id,
        customerAccountId: customer.id,
        type: "DINE_IN",
        status: "NEW",
        customerName: customer.fullName,
        customerPhone: customer.phone,
        tableNumber: "7",
        totalPrice: 385000 + 45000 + business.packagingFee,
        items: {
          create: [
            { productId: vaziriId, quantity: 1, unitPrice: 385000 },
            { productId: doughId, quantity: 1, unitPrice: 45000 },
          ],
        },
      },
    });

    const { computeCashback, computeLoyaltyPointsEarned } = await import(
      "../features/customer/services/loyalty"
    );
    let walletBalance = 0;
    let loyaltyPoints = 0;
    for (const order of [deliveredOrder, activeOrder]) {
      const cashback = computeCashback(order.totalPrice);
      const points = computeLoyaltyPointsEarned(order.totalPrice);
      await prisma.walletTransaction.create({
        data: {
          customerAccountId: customer.id,
          orderId: order.id,
          type: "CASHBACK_EARNED",
          amount: cashback,
          note: "کش‌بک سفارش",
          createdAt: order.createdAt,
        },
      });
      walletBalance += cashback;
      loyaltyPoints += points;
    }
    await prisma.customerAccount.update({
      where: { id: customer.id },
      data: { walletBalance: { increment: walletBalance }, loyaltyPoints: { increment: loyaltyPoints } },
    });
  }

  // ---- Super admin bootstrap account (پنل داخلی ماگ‌منو) ----
  const superAdminPasswordHash = await bcrypt.hash("admin1234", 10);
  await prisma.user.upsert({
    where: { phone: "09120000010" },
    update: {},
    create: {
      phone: "09120000010",
      fullName: "سارا محمودی",
      passwordHash: superAdminPasswordHash,
      isSuperAdmin: true,
      platformRole: "OWNER",
      platformTeam: "مدیریت محصول",
    },
  });

  // ---- Demo subscription payment history (so the finance page isn't empty) ----
  const existingTransactions = await prisma.transaction.count({ where: { businessId: business.id } });
  if (existingTransactions === 0) {
    const now = new Date();
    const monthsAgo = (n: number) => new Date(now.getFullYear(), now.getMonth() - n, 15);
    const currentPlan = plansByKey["zomorrod"];
    await prisma.transaction.createMany({
      data: [
        { businessId: business.id, amount: currentPlan.monthlyPrice, planName: currentPlan.name, status: "PAID", createdAt: monthsAgo(0) },
        { businessId: business.id, amount: currentPlan.monthlyPrice, planName: currentPlan.name, status: "PAID", createdAt: monthsAgo(1) },
        { businessId: business.id, amount: currentPlan.monthlyPrice, planName: currentPlan.name, status: "PAID", createdAt: monthsAgo(2) },
      ],
    });
  }

  // ---- Demo support ticket (so the super-admin tickets queue isn't empty) ----
  const demoTicketSubject = "مشکل در چاپ QR کد روی میز";
  const existingTicket = await prisma.ticket.findFirst({
    where: { businessId: business.id, subject: demoTicketSubject },
  });
  if (!existingTicket) {
    await prisma.ticket.create({
      data: {
        businessId: business.id,
        subject: demoTicketSubject,
        category: "TECHNICAL",
        priority: "HIGH",
        messages: {
          create: {
            authorType: "OWNER",
            authorName: "علیرضا محمدی",
            text: "سلام، QR کد روی میز شماره ۳ درست چاپ نمی‌شه و کدر شده. می‌شه بررسی کنید؟",
          },
        },
      },
    });
  }

  await seedBlog();

  console.log("Seeded business:", business.slug);
  console.log("Seeded super admin login: 09120000010 / admin1234");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
