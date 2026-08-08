import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../lib/generated/prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const demoBusinessFields = {
    name: "رستوران چلوکبابی باختر",
    nameEn: "Bakhtar Restaurant",
    address: "تبریز، ولیعصر، پروین اعتصامی، میدان تجارت جهانی",
    phone: "0912 123 457",
    description:
      "رستوران ما با الهام از طعم‌های اصیل و مواد اولیه تازه، تلاش می‌کند لحظاتی خوشمزه و به‌یادماندنی برای شما بسازد.",
    isAcceptingOrders: true,
    openingHoursStart: "15:00",
    openingHoursEnd: "00:00",
    acceptsDineIn: true,
    acceptsTakeaway: true,
    acceptsDelivery: true,
    acceptsOnlinePayment: false,
    acceptsCashPayment: true,
  };

  const business = await prisma.business.upsert({
    where: { slug: "demo" },
    update: demoBusinessFields,
    create: { slug: "demo", ...demoBusinessFields },
  });

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

  console.log("Seeded business:", business.slug);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
