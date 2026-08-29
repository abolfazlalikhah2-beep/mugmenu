# ماگ‌منو (Mug Menu) — راهنمای پروژه برای Claude Code

این فایل قرارداد کلی پروژه‌ست. قبل از هر تغییر یا صفحه‌ی جدید، این سند رو مرجع بگیر تا هماهنگی با چیزی که تو Claude Design ساخته شده حفظ بشه.

## معرفی پروژه
ماگ‌منو یک پلتفرم منوی دیجیتال QR چندمستأجری (multi-tenant) برای رستوران/کافه‌هاست. هر کسب‌وکار زیر یک slug اختصاصی منتشر می‌شه (مثلاً `/baradaran`). سه حالت سفارش داریم که باید به‌صورت state machine واضح پیاده بشن، نه شرط‌های پراکنده:
- **روی میز** → نیاز به: شماره میز، نام، تلفن
- **بیرون‌بر** → نیاز به: زمان تحویل تخمینی
- **ارسال با پیک** → نیاز به: آدرس، لوکیشن، زمان تحویل

مرحله‌ی فعلی: MVP (منوی عمومی + پنل مدیریت + auth) — **کامل شده**. فاز ۲ (تخفیف، گزارشات، تیکتینگ، QR generator) و فاز ۳ (پیامک، پرینتر لیبل‌زن، درگاه پرداخت، پنل سوپرادمین) بعداً اضافه می‌شن — برای این‌ها جای خالی در معماری بذار ولی پیاده‌سازی نکن مگر درخواست بشه.

**به‌روزرسانی (۱۴۰۵/۰۶/۰۳):** تصمیم قبلی («سایت مارکتینگ با وردپرس، خارج از این ریپو») لغو شد. صفحه‌ی اصلی مارکتینگ (هیرو + پیش‌نمایش منو/پنل) حالا **داخل همین اپ Next.js** روی `app/page.tsx` پیاده شده (برای کاربر بدون session)؛ برای کاربر لاگین‌شده همون رفتار قبلی (ریدایرکت به dashboard/onboarding/superadmin) دست‌نخورده باقی مونده. کامپوننت‌های مارکتینگ توی `components/marketing/` هستن (`hero-section.tsx`, `admin-panel-section.tsx`)، منبعشون طراحی «Serve Hero» توی Claude Design بود که با برند و داده‌ی نمونه‌ی خودمون (ماگ‌منو، آیتم‌های فارسی، لینک `/register` و `/demo`) جایگزین شد. صفحات مارکتینگ بعدی (تعرفه‌ها و ...) رو هم همین‌جا اضافه کن مگر خلافش گفته بشه.
- مسیر هر رستوران همچنان path-based زیر دامنه‌ی اصلی می‌مونه (`/demo`)، نه ساب‌دامین جدا به‌ازای هر رستوران.
- کوکی session (`magmenu_session`) روی دامنه‌ی پیش‌فرض (host-only) ست می‌شه؛ اگر بعداً بین چند دامنه/ساب‌دامین به اشتراک لازم شد باید `domain` رو صریح تنظیم کنیم.

## استک فنی
- Next.js (App Router) + TypeScript
- Tailwind CSS + shadcn/ui
- دیتابیس: Postgres + Prisma ORM (فعلاً یک نمونه‌ی Postgres 16 لوکال داخل همین sandbox — پایین توضیح داده شده)
- آپلود تصویر: S3-compatible storage — وصل شده (`features/uploads`، با `@aws-sdk/client-s3`). برای محصول/دسته/لوگو کسب‌وکار کار می‌کنه؛ نیاز به تنظیم `S3_ENDPOINT`/`S3_ACCESS_KEY`/`S3_SECRET_KEY`/`S3_BUCKET` در `.env` داره (مقادیر واقعی، نه placeholder دمو).
- Auth: OTP پیامکی (provider واقعی هنوز مشخص نشده — `lib/auth/otp-provider.ts` رو abstract نوشتیم، فعلاً `MockOtpProvider` فقط کد رو کنسول لاگ می‌کنه)
- زبان رابط کاربری: فارسی، `dir="rtl"` روی کل اپ

## پایگاه داده (Postgres + Prisma)
- توی این sandbox، Postgres 16 از قبل نصب بود ولی سرویسش خاموش بود؛ با `service postgresql start` روشن شده. نقش/دیتابیس با دست ساخته شده: role `magmenu` / db `magmenu` (رمز و connection string توی `.env`، از `.env.example` کپی کن).
- Prisma با driver adapter کار می‌کنه (`@prisma/adapter-pg`) نه روش قدیمی مستقیم — نسخه‌ی جدید Prisma (v7) دیگه engine خودش رو باندل نمی‌کنه، `lib/db.ts` رو الگو بگیر.
- **مهم:** هیچ‌وقت متن فارسی/دارای space رو به‌عنوان `id` صریح مدل‌ها استفاده نکن (این باگ واقعی رخ داد: صفحه‌ی جزئیات آیتم روی `/item/[id]` چون id شامل space بود 404 می‌داد). برای seed idempotent از `@@unique([businessId, name])` و مشابه استفاده کن، نه override کردن `id`.
- Migration: این sandbox غیرتعاملیه، پس `prisma migrate dev` کار نمی‌کنه (نیاز به TTY داره). به‌جاش: `prisma migrate diff --from-config-datasource --to-schema prisma/schema.prisma --script` رو بساز، بذار توی یک پوشه‌ی migration جدید، بعد `prisma migrate deploy`.
- Seed: `npx prisma db seed` — یک کسب‌وکار دمو با slug `demo` می‌سازه (رستوران چلوکبابی باختر، ۵ دسته، ۱۴ محصول، ۳ نظر) + یک اکانت owner (`09376220110` / `demo1234`).
- **هشدار AI Safety:** دستورات مخرب Prisma (`migrate reset`, و مشابه) توسط خود Prisma برای عامل‌های AI مسدود شده و نیاز به تأیید صریح کاربر + متغیر محیطی `PRISMA_USER_CONSENT_FOR_DANGEROUS_AI_ACTION` داره. همیشه قبلش از کاربر بپرس.

## Design Tokens
این‌ها از طراحی‌های موجود (Login/Register/Menu/Info) استخراج شده — منبع حقیقت رنگ و تایپوگرافی همینه. **پیاده‌سازی واقعی این توکن‌ها در `app/globals.css` (بخش `@theme`) انجام شده** — قبل از افزودن رنگ/رادیوس/سایه‌ی جدید، اول همون‌جا رو چک کن.

### رنگ‌ها
| نقش | رنگ | توکن Tailwind |
|---|---|---|
| سبز اصلی (دکمه/برند) | `#328C3D` | `brand` |
| سبز وضعیت آنلاین | `#10D37B` (با هاله‌ی `rgba(16,211,123,0.19)`) | `success` (هاله: `success/[0.19]`) |
| زرد ستاره امتیاز | `#FACB0F` | `star` |
| متن اصلی مشکی | `#000000` / `#0F0F0F` | `ink` |
| متن ثانویه تیره | `#555555` / `#565656` / `#5F5F5F` | `text-1` |
| متن خاکستری روشن | `#747474` / `#797979` / `#919191` / `#939393` | `text-2` (یا مقدار arbitrary دقیق در جایی که لازمه) |
| متن غیرفعال/placeholder | `#9F9F9F` / `#A7A7A7` / `#AAAAAA` | `text-3` / `text-4` |
| بوردر اینپوت | `#DDDDDD` / `#E3E3E3` | `border-input` |
| بوردر جداکننده (Line) | `#EAEAEA` | `border-line` |
| پس‌زمینه خاکستری روشن (اینپوت‌های select-like) | `#F6F6F6` | `chip` |
| پس‌زمینه سفید کارت | `#FFFFFF` | `card` |
| پس‌زمینه صفحه | `#F2F3F2` | `page` |
| گرادیانت هیرو | سبز گرادیانت (`green-gradient-4000x4000`) | `public/brand/green-gradient.png` |

### تایپوگرافی
- فونت اصلی فارسی: **IRANYekanFN** (وزن‌های 300 و 400) — در وب با **Vazirmatn** (بسیار نزدیک، از طریق `next/font/google`) جایگزین شده.
- فونت اکسنت برند/انگلیسی کوچک با letter-spacing بالا: **NEXT ART** (مثل "LOGIN"، "REGISTER" با `letter-spacing: 0.54em`, `text-transform: uppercase`) — فعلاً با Montserrat spaced پیاده شده.
- فونت کپی‌رایت/تاریخ انگلیسی: **Montserrat** (کلاس Tailwind: `font-mont`)
- سایز‌های رایج: هدینگ صفحه ۲۴px، بدنه ۱۲-۱۴px، برچسب کوچک ۹-۱۱px

### شعاع گوشه‌ها (border-radius)
- کارت‌های بزرگ/مودال: **۳۵px** (`rounded-card`)
- کارت‌های محتوای معمولی: **۲۰px** (`rounded-card-sm`)
- پیل: **۲۰px** (`rounded-pill`)
- اینپوت‌ها: **۱۴px** (`rounded-input`)
- دکمه‌های اصلی: **۱۵px** (`rounded-btn`)
- بج‌های کوچک (مثل تگ نظر / چیپ): **۱۰px** (`rounded-chip`)

### سایه‌ها
- کارت شناور کوچک: `shadow-float` → `0 8px 17.5px rgba(0,0,0,0.04)`
- کارت/مودال بزرگ: `shadow-modal` → `0 26px 41.2px 4px rgba(0,0,0,0.04)`

### RTL
- کل اپ `dir="rtl"` است (تنظیم‌شده در `app/layout.tsx`)؛ از منطق منطقی CSS استفاده کن (`start`/`end` به‌جای `left`/`right`) تا با کامپوننت‌های shadcn سازگار بمونه.

## ساختار پوشه‌ها (وضعیت فعلی)
```
/app                                         → فقط routing و صفحات (thin). منطق تجاری اینجا ممنوعه.
  page.tsx                                   → بدون session: هیرو مارکتینگ (HeroSection + AdminPanelSection). با session: ریدایرکت به dashboard/onboarding/superadmin
  layout.tsx                                → dir="rtl"، فونت‌های Vazirmatn/Montserrat
  globals.css                               → Design Tokens (@theme)
  /style-guide                              → پیاده‌سازی Style Guide.dc.html
  /(auth)/login, register, forgot-password,
         verify, change-password             → احراز هویت — از project/uploads/*.png بازسازی شده (این‌ها .dc.html نداشتن)
  /(public)/[cafeSlug]/                      → منوی عمومی مشتری نهایی — از Menu Flow.dc.html
    page.tsx / menu/ / item/[itemId]/ / item/[itemId]/reviews/ / cart/ / receipt/[orderId]/
  /(dashboard)/dashboard/                   → پنل مدیریت رستوران‌دار — از Admin Panel.dc.html / Admin Panel B.dc.html
    page.tsx / orders/ / products/ / categories/ / settings/
  /onboarding                               → آنبوردینگ اولیه‌ی رستوران‌دار بعد از ثبت‌نام
/components/marketing                       → کامپوننت‌های صفحه‌ی مارکتینگ (hero-section.tsx, admin-panel-section.tsx) — از project/Serve Hero.dc.html بازسازی شده با برند و داده‌ی ماگ‌منو
/features/<name>/                           → **معماری feature-based.** هر ماژول (auth، menu، dashboard، uploads) این لایه‌ها رو داره:
  repositories/                              → فقط اینجا Prisma صدا زده می‌شه. بدون منطق، فقط CRUD خام.
  services/                                  → منطق تجاری واقعی: اعتبارسنجی zod، rate limit، log، orchestration بین repositoryها. state machineهای خالص (بدون I/O، تست‌پذیر) هم اینجان — مثل order-flow.ts.
  routes/                                    → فقط "use server" actionهای نازک که app/ صداشون می‌زنه: پارس ورودی، صدا زدن service، مپ‌کردن نتیجه/ریدایرکت.
  client/                                    → state سمت کلاینت (مثل cart-context.tsx) — UI state هست نه منطق تجاری، جدا از سه لایه‌ی بالا.
  README.md                                  → توضیح کوتاه ماژول + نحوه‌ی تست.
/components/ui                              → کامپوننت‌های پایه (Button, Input, PasswordInput, Card, StatusBadge, RatingChip/InfoRatingPill, AccordionListItem) — hand-authored به سبک shadcn (cva + cn())، چون CLI رسمی shadcn (ui.shadcn.com) در sandbox این پروژه در دسترس نیست
/components/auth، /components/menu          → کامپوننت‌های نمایشی UI هر ماژول (فقط از features/*/routes یا services می‌خونن، مستقیم Prisma نه)
/lib                                         → فقط زیرساخت مشترک بین همه‌ی featureها: utils.ts (cn())، db.ts (Prisma client)، logger.ts، rate-limit.ts
/prisma                                       → schema.prisma، migrations/، seed.ts
/project                                    → باندل اصلی طراحی از Claude Design (فقط مرجع، ویرایش نکن)
```

## Docker
- `Dockerfile` چندمرحله‌ای: `deps` → `dev` (برای docker-compose، bind-mount زنده) / `builder` → `runner` (پروداکشن، `next.config.ts` با `output:"standalone"`).
- `docker compose up --build` → app (پورت 3000) + Postgres + MinIO (فضای ذخیره‌ی S3-compatible لوکال، هنوز به کد اپ وصل نشده).
- پروداکشن: `docker compose -f docker-compose.yml -f docker-compose.prod.yml up --build` (override فقط target build و volumeها رو عوض می‌کنه، بقیه یکیه). قبلش یک‌بار migration بزن: `docker compose -f docker-compose.yml -f docker-compose.prod.yml run --rm migrate`.
- **نکته:** override کردن `volumes` توی یک فایل compose دیگه با `[]` خالی جایگزین نمی‌شه (لیست‌ها merge می‌شن نه replace) — باید از تگ `!reset` استفاده کنی، وگرنه bind mount غیرمنتظره باقی می‌مونه.
- این sandbox خودش Docker daemon نداره، پس Dockerfile/compose فقط با `docker compose config` قابل validate هستن، نه `docker build` واقعی — قبل از merge روی یک محیط با Docker واقعی تست بشه.

### ⚠️ وضعیت Migration در پروداکشن (۱۴۰۵/۰۶/۰۷)
جدول `_prisma_migrations` در دیتابیس پروداکشن (Liara) وجود نداره/درست track نشده — اسکیمای پروداکشن قبل از این‌که Prisma Migrate رسماً استفاده بشه با تغییرات دستی/`db push` ساخته شده. نتیجه‌ش چند incident واقعی بود: enum قدیمی `OtpPurpose` توی پروداکشن مقادیر `LOGIN`/`RESET_PASSWORD` داشت که **هیچ‌وقت** توی هیچ migration این ریپو وجود نداشتن، و `BillingCycle.SIX_MONTH` + `Plan.sixMonthPrice` هم missing بودن — همه با SQL دستی از طریق PGAdmin فیکس شدن.
- **تصمیم فعلی:** `runner` stage's `CMD` دیگه `prisma migrate deploy` رو خودکار اجرا نمی‌کنه (فقط `["node", "server.js"]`). چون اگه اجرا بشه، چون `_prisma_migrations` خالیه، Prisma همه‌ی ۳۹ migration رو از اول replay می‌کنه — اولیش (`CREATE TABLE "Business"` و...) روی جدول‌هایی که از قبل با داده واقعی وجود دارن fail می‌کنه، و چون CMD با `&&` زنجیر شده، `node server.js` هیچ‌وقت اجرا نمی‌شه → کل container بالا نمیاد، هر deploy.
- **فرآیند فعلی برای migration جدید:** هر migration جدیدی که اضافه می‌شه، باید SQL معادلش رو دستی (idempotent، با `IF NOT EXISTS`/`ON CONFLICT`) از طریق PGAdmin روی پروداکشن اجرا کنی — `migrate deploy` خودکار دیگه این کار رو نمی‌کنه.
- **راه‌حل درست (بلاک‌شده):** باید یک‌بار production رو با `prisma migrate resolve --applied <name>` برای هر ۳۹ migration باینه (بعد از تایید با `prisma migrate diff` که drift دیگه‌ای نیست)، بعد `CMD` رو برگردونی. الان بلاکه چون console پروداکشن روی Liara فقط ۵۱۲ مگابایت فضای writable داره و نصب `npx prisma` باهاش fail می‌شه (ENOSPC) — نیاز به راه دیگه‌ای برای دسترسی CLI داره (مثلاً exec مستقیم به container در حال اجرا که node_modules رو از قبل داره، نه یک session جدا).

## امنیت
- **Secrets**: فقط در `.env` (که gitignore شده)؛ `.env.example` رو برای مقادیر placeholder به‌روز نگه دار. `SESSION_SECRET` رو با `openssl rand -hex 32` بساز.
- **Session**: JWT امضاشده با `jose` (`features/auth/services/session-service.ts`)، نه یک کوکی JSON ساده — قبلاً یه‌بار همین‌جوری بود و قابل جعل از سمت کلاینت بود، همین الان فیکس شده.
- **Validation**: هر ورودی سمت سرور (auth actions، create order) با schema صریح zod چک می‌شه (`*-schemas.ts` توی هر feature) قبل از رسیدن به منطق تجاری.
- **Rate limiting**: `lib/rate-limit.ts` (in-memory، فقط برای یک instance — وقتی بیشتر از یک replica اجرا شد باید بره روی Redis یا مشابه). الان روی login (۵ تلاش/۱۵ دقیقه) و ارسال OTP (۳ بار/۱۰ دقیقه) فعاله.
- **Authorization**: `requireSession()` / `requireBusinessOwner()` توی `features/auth/services/authorize.ts` — هر route محافظت‌شده (پنل مدیریت) باید یکی از این‌ها رو صدا بزنه، نه فقط چک "لاگین هست یا نه".

## قابل‌دیباگ‌بودن (Logging)
- `lib/logger.ts`: لاگ ساختاریافته JSON-line با سطح (`info`/`warn`/`error`) + `requestId`.
- `proxy.ts` (قبلاً `middleware.ts` — این convention توی Next 16 منسوخ شده) یک `x-request-id` روی هر ریکوئست می‌ذاره؛ همون id رو `logger` از `headers()` می‌خونه، پس با یک `requestId` می‌شه همه‌ی لاگ‌های یک ریکوئست رو گرفت.
- به‌جای `console.log` پراکنده، همیشه از `logger.info/warn/error(event, fields)` استفاده کن.

## تست
- Vitest (`npm run test`). منطق حساس (بخصوص state machine سه‌حالته‌ی سفارش در `features/menu/services/order-flow.ts` و schemaهای zod auth) باید unit test داشته باشه قبل از merge — این‌ها pure functionهای بدون I/O هستن، تست‌نوشتن سریعه.
- برای فیچرهای جدید (پنل مدیریت و بعدی‌ها) همین الگو رو ادامه بده: منطق حساس رو به یک ماژول pure توی `services/` منتقل کن، بعد تستش کن.

## قراردادهای کد
- Naming صفحات باید با نام‌گذاری طراحی‌ها یکی باشه (مثل `Login`, `Register`, `Menu`, `info`) تا رفت‌وبرگشت با Claude Design گنگ نشه.
- منطق سه‌حالته‌ی سفارش متمرکزه توی `features/menu/services/order-flow.ts` (pure state machine، تست‌شده) + `order-service.ts` (orchestration واقعی: zod، repository، log) — نه پخش در کامپوننت‌ها یا duplicate بین کلاینت و سرور.
- هر مودال (ایجاد/ویرایش محصول، دسته‌بندی، تخفیف و ...) باید حالت‌های خالی/پر/خطا/لودینگ رو صریح مدیریت کنه.
- قبل از اتصال provider واقعی SMS/پرداخت/پرینتر، اینترفیس abstract بنویس تا جایگزینی بعدی راحت باشه (این‌ها در فاز ۳ متصل می‌شن).
- shadcn CLI (`npx shadcn@latest add ...`) در این sandbox کار نمی‌کنه چون هاست `ui.shadcn.com` مسدوده؛ کامپوننت‌های جدید رو دستی به سبک shadcn (radix + cva + `cn()`) در `components/ui` بساز.

## Definition of Done برای هر تسک
- [ ] موبایل first تست شده (۹۰٪ ترافیک موبایله طبق مستندات محصول)
- [ ] RTL درست رندر می‌شه
- [ ] با Design Tokens بالا هماهنگه (رنگ/فونت/رادیوس/سایه)
- [ ] Lint، type-check، و `npm run test` پاس شده
- [ ] ورودی سمت سرور با zod چک می‌شه؛ route محافظت‌شده authorization (نه فقط authentication) داره
- [ ] منطق حساس/state machine جدید یک واحد pure و تست‌شده‌ست

## هماهنگی با Claude Design
بعد از تکمیل هر بخش در Claude Code، برای طراحی صفحات بعدی از `/design-sync` در Claude Design استفاده کن تا کامپوننت‌های واقعی این پروژه (نه از صفر) پایه‌ی طراحی‌های جدید بشن.
