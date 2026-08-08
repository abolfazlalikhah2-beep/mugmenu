import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { RatingChip, InfoRatingPill } from "@/components/ui/rating";
import { AccordionListItem } from "@/components/ui/accordion-list-item";

const swatches = [
  { name: "سبز اصلی", hex: "#328C3D", css: "#328C3D", use: "دکمه‌ها، آیکون فعال" },
  { name: "سبز موفقیت", hex: "#10D37B", css: "#10D37B", use: "وضعیت فعال / پذیرش سفارش" },
  { name: "مشکی متن", hex: "#000000", css: "#000000", use: "تیتر و متن اصلی" },
  { name: "خاکستری ۱", hex: "#5F5F5F", css: "#5F5F5F", use: "متن ثانویه" },
  { name: "خاکستری ۲", hex: "#747474", css: "#747474", use: "آیکون / لیبل" },
  { name: "خاکستری ۳", hex: "#9F9F9F", css: "#9F9F9F", use: "متن کم‌رنگ" },
  { name: "خاکستری ۴", hex: "#A7A7A7", css: "#A7A7A7", use: "لیبل اینپوت" },
  { name: "زرد ستاره", hex: "#FACB0F", css: "#FACB0F", use: "امتیاز / ستاره" },
  { name: "پس‌زمینه", hex: "#F6F6F6", css: "#F6F6F6", use: "فیلد / چیپ" },
  { name: "خط جداکننده", hex: "#EAEAEA", css: "#EAEAEA", use: "بوردر / خطوط" },
];

const typeScale = [
  { spec: "700 · 42", px: 34, w: 700, sample: "تیتر بزرگ صفحه" },
  { spec: "600 · 26", px: 24, w: 600, sample: "تیتر بخش" },
  { spec: "400 · 20", px: 20, w: 400, sample: "رستوران چلوکبابی باختر" },
  { spec: "400 · 14", px: 15, w: 400, sample: "منوی مورد نظر را انتخاب کنید" },
  { spec: "300 · 13", px: 14, w: 300, sample: "متن توضیحی سبک و خوانا" },
];

const radii = [
  { label: "کارت / مودال", px: 35 },
  { label: "پیل", px: 20 },
  { label: "دکمه / ردیف", px: 15 },
  { label: "اینپوت", px: 14 },
  { label: "چیپ", px: 10 },
];

function EyeIcon() {
  return (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none">
      <path
        d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"
        stroke="#AAAAAA"
        strokeWidth="1.4"
      />
      <circle cx="12" cy="12" r="3" stroke="#AAAAAA" strokeWidth="1.4" />
    </svg>
  );
}

function DineInIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="mr-3">
      <path
        d="M6 3v7a2 2 0 002 2M6 3v18M10 3v7a2 2 0 01-2 2M16 3c-1.5 0-2.5 2-2.5 5s1 4 2.5 4v9"
        stroke="#328C3D"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TakeawayIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="mr-3">
      <path
        d="M21 8l-9-5-9 5 9 5 9-5ZM3 8v8l9 5 9-5V8M12 13v8"
        stroke="#939393"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-mont text-[11px] uppercase tracking-[.42em] text-text-5">
      {children}
    </span>
  );
}

export default function StyleGuidePage() {
  return (
    <div className="mx-auto flex max-w-[1180px] flex-col gap-14 px-10 pt-16 pb-[120px]">
      {/* ===== HERO / BRAND ===== */}
      <header className="flex flex-wrap items-stretch gap-7">
        <div className="flex flex-1 basis-[460px] flex-col justify-center gap-3.5 rounded-card bg-card p-11 shadow-modal">
          <div className="flex items-center gap-3">
            <span className="h-[9px] w-[9px] rounded-full bg-brand" />
            <span className="text-[13px] font-medium tracking-[.02em] text-brand">
              دیزاین‌سیستم · ماگ‌منو
            </span>
          </div>
          <h1 className="text-[42px] font-bold leading-[1.25]">
            راهنمای طراحی و کامپوننت‌ها
          </h1>
          <p className="max-w-[52ch] text-[15px] leading-[2] font-light text-text-1">
            سند مرجع تیم کد. زبان طراحی، رنگ‌ها، تایپوگرافی، شعاع گوشه‌ها، سایه‌ها و
            کامپوننت‌های پایه‌ی محصول — استخراج‌شده از صفحات پیاده‌سازی‌شده (Login /
            Register / Menu / Info).
          </p>
          <div className="mt-2 flex flex-wrap gap-2.5">
            <span className="font-mont text-[11px] tracking-[.42em] text-text-3 uppercase">
              MAG&nbsp;MENU&nbsp;· DESIGN&nbsp;SYSTEM · V1
            </span>
          </div>
        </div>
        <div className="relative flex min-h-[260px] flex-1 basis-[320px] items-center justify-center overflow-hidden rounded-card bg-[#12833f]">
          <Image src="/brand/green-gradient.png" alt="" fill className="object-cover" />
          <Image
            src="/brand/logo-magmenu-white.png"
            alt="ماگ‌منو"
            width={210}
            height={130}
            className="relative h-auto w-[210px] drop-shadow-[0_8px_24px_rgba(0,0,0,.18)]"
          />
        </div>
      </header>

      {/* ===== COLORS ===== */}
      <section className="flex flex-col gap-[22px]">
        <div className="flex flex-col gap-1">
          <Eyebrow>COLORS</Eyebrow>
          <h2 className="text-2xl font-semibold">پالت رنگ</h2>
        </div>

        <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-[18px]">
          {swatches.map((c) => (
            <Card key={c.hex} className="flex flex-col">
              <div
                className="h-24 border-b border-black/[0.04]"
                style={{ background: c.css }}
              />
              <div className="flex flex-col gap-[3px] px-4 py-3.5">
                <span className="text-sm font-medium">{c.name}</span>
                <span className="text-right font-mont text-xs text-text-3" dir="ltr">
                  {c.hex}
                </span>
                <span className="text-xs font-light text-text-3">{c.use}</span>
              </div>
            </Card>
          ))}
        </div>

        <Card className="flex flex-wrap items-center gap-[22px] p-[22px]">
          <div className="relative h-[150px] w-[220px] overflow-hidden rounded-[20px] bg-[#12833f]">
            <Image src="/brand/green-gradient.png" alt="" fill className="object-cover" />
          </div>
          <div className="min-w-[240px] flex-1">
            <div className="mb-1.5 text-base font-medium">
              گرادیانت برند (پس‌زمینه احراز هویت)
            </div>
            <p className="text-[13px] leading-[2] font-light text-text-1">
              فایل اصلی: <span className="font-mont">green-gradient.png</span>. در
              صفحات ورود/ثبت‌نام روی پنل سمت راست با شعاع{" "}
              <span className="font-mont">0 82px 82px 0</span> استفاده می‌شود. لوگوی
              سفید و متن سفید روی این گرادیانت قرار می‌گیرند.
            </p>
          </div>
        </Card>
      </section>

      {/* ===== TYPOGRAPHY ===== */}
      <section className="flex flex-col gap-[22px]">
        <div className="flex flex-col gap-1">
          <Eyebrow>TYPOGRAPHY</Eyebrow>
          <h2 className="text-2xl font-semibold">تایپوگرافی</h2>
          <p className="mt-1 text-[13px] font-light text-text-1">
            فونت فارسی: <b className="font-semibold">IRANYekanFN</b> — در این نمونه با{" "}
            <b className="font-semibold">Vazirmatn</b> (وب، بسیار نزدیک) نمایش داده
            شده. برندینگ انگلیسی: <b className="font-semibold">Montserrat / NEXT ART</b>
            .
          </p>
        </div>

        <Card className="flex flex-col gap-[26px] p-[34px_40px]">
          {typeScale.map((t) => (
            <div
              key={t.spec}
              className="flex items-baseline justify-between gap-6 border-b border-border-line pb-[22px]"
            >
              <span className="font-mont text-xs whitespace-nowrap text-text-3">
                {t.spec}
              </span>
              <span
                className="flex-1 text-right"
                style={{ fontSize: t.px, fontWeight: t.w }}
              >
                {t.sample}
              </span>
            </div>
          ))}
          <div className="flex items-baseline justify-between gap-6">
            <span className="font-mont text-xs whitespace-nowrap text-text-3">
              Montserrat · 15 · spaced
            </span>
            <span className="flex-1 text-right font-mont text-[15px] font-normal tracking-[.54em] text-[#C3C3C3] uppercase">
              LOGIN
            </span>
          </div>
        </Card>
      </section>

      {/* ===== RADII + SHADOWS ===== */}
      <section className="grid grid-cols-2 gap-6">
        <Card className="flex flex-col gap-5 p-[30px_32px]">
          <div>
            <Eyebrow>RADIUS</Eyebrow>
            <h2 className="mt-1 text-[22px] font-semibold">شعاع گوشه‌ها</h2>
          </div>
          <div className="flex flex-wrap gap-[18px]">
            {radii.map((r) => (
              <div key={r.label} className="flex flex-col items-center gap-2.5">
                <div
                  className="h-[84px] w-[84px] border border-border-line bg-chip"
                  style={{ borderRadius: r.px }}
                />
                <span className="text-[13px] font-medium">{r.label}</span>
                <span className="font-mont text-xs text-text-3">{r.px}px</span>
              </div>
            ))}
          </div>
        </Card>
        <Card className="flex flex-col gap-5 p-[30px_32px]">
          <div>
            <Eyebrow>ELEVATION</Eyebrow>
            <h2 className="mt-1 text-[22px] font-semibold">سایه‌ها</h2>
          </div>
          <div className="flex flex-wrap gap-[26px] p-2">
            <div className="flex flex-col items-center gap-3.5">
              <div className="h-[84px] w-[120px] rounded-2xl bg-card shadow-float" />
              <span className="text-[13px] font-medium">کارت شناور</span>
              <span className="font-mont text-[11px] text-text-3" dir="ltr">
                0 8 17.5 · 0.04
              </span>
            </div>
            <div className="flex flex-col items-center gap-3.5">
              <div className="h-[84px] w-[120px] rounded-2xl bg-card shadow-modal" />
              <span className="text-[13px] font-medium">مودال / کارت بزرگ</span>
              <span className="font-mont text-[11px] text-text-3" dir="ltr">
                0 26 41.2 4 · 0.04
              </span>
            </div>
          </div>
        </Card>
      </section>

      {/* ===== COMPONENTS ===== */}
      <section className="flex flex-col gap-[22px]">
        <div className="flex flex-col gap-1">
          <Eyebrow>COMPONENTS</Eyebrow>
          <h2 className="text-2xl font-semibold">کامپوننت‌های پایه</h2>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <Card className="flex flex-col gap-5 p-[30px_32px]">
            <div className="text-base font-semibold">اینپوت</div>
            <Input
              label="شماره تلفن همراه خود را وارد کنید"
              defaultValue="0937 622 0110"
              dir="ltr"
              className="text-right"
              readOnly
            />
            <Input
              label="رمز عبور شما"
              type="password"
              defaultValue="*************"
              icon={<EyeIcon />}
              readOnly
            />
          </Card>

          <Card className="flex flex-col gap-4.5 p-[30px_32px]">
            <div className="text-base font-semibold">دکمه‌ها</div>
            <Button variant="primary">ورود</Button>
            <Button variant="secondary">دکمه ثانویه</Button>
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="chip">مرتبط ترین</Button>
              <Button variant="chipMuted">جدیدترین</Button>
            </div>
            <Button variant="primary" disabled>
              غیرفعال
            </Button>
          </Card>

          <Card className="flex flex-col gap-4.5 p-[30px_32px]">
            <div className="text-base font-semibold">بج وضعیت</div>
            <StatusBadge status="online" />
            <StatusBadge status="offline" />
            <RatingChip rating="4.4" />
          </Card>

          <Card className="flex flex-col gap-4 p-[30px_32px]">
            <div className="text-base font-semibold">آیتم لیست (آکاردئون)</div>
            <AccordionListItem label="بر روی میز" icon={<DineInIcon />} />
            <AccordionListItem
              label="سفارش بیرون بر"
              icon={<TakeawayIcon />}
              muted
            />
          </Card>
        </div>

        <Card className="flex flex-col gap-4.5 p-[30px_32px]">
          <div className="text-base font-semibold">پیل اطلاعات و امتیاز</div>
          <InfoRatingPill rating="4.4" label="اطلاعات مجموعه ما" />
        </Card>
      </section>

      <footer className="flex items-center justify-center gap-3 pt-2">
        <span className="h-px w-[120px] bg-border-line" />
        <span className="text-xs font-light text-text-1">دیزاین‌سیستم ماگ‌منو · نسخه ۱</span>
        <span className="h-px w-[120px] bg-border-line" />
      </footer>
    </div>
  );
}
