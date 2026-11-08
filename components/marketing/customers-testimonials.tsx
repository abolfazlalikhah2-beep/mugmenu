import Image from "next/image";

const testimonials = [
  {
    quote: "گزارش‌های فروش کمک کرد بفهمیم کدوم آیتم‌ها پرفروش‌ترن و منو رو بهینه کنیم.",
    name: "مریم احمدی",
    role: "فست‌فود برگرلند · اصفهان",
    image: "/marketing/home/testi-1.jpg",
    avatarColor: "border-[#f1dfb8] bg-[#fbf3e3] text-[#c98a12]",
    initial: "م",
  },
  {
    quote: "سفارش سر میز زمان انتظار مشتری‌ها رو نصف کرد. پنلش هم واقعاً ساده‌ست.",
    name: "علی رضایی",
    role: "مالک رستوران شبدر · قم",
    image: "/marketing/home/testi-2.jpg",
    avatarColor: "border-[#cfe1f5] bg-[#e8f1fb] text-[#2f7fd6]",
    initial: "ع",
  },
  {
    quote: "از وقتی منومون QR شد دیگه نیازی به چاپ منو نداریم و قیمت‌ها رو تو یه دقیقه عوض می‌کنیم.",
    name: "سارا محمدی",
    role: "مدیر کافه لیمو · تهران",
    image: "/marketing/home/testi-3.jpg",
    avatarColor: "border-[#cfe6d2] bg-[#e9f4ea] text-brand",
    initial: "س",
  },
  {
    quote: "باشگاه مشتریان باعث شد مشتری‌ها بیشتر برگردن و میانگین خرید ماهانه بالاتر بره.",
    name: "رضا حسینی",
    role: "رستوران حافظ · قم",
    image: "/marketing/customers/card-lamb.png",
    avatarColor: "border-[#cfe6d2] bg-[#e9f4ea] text-brand",
    initial: "ر",
  },
  {
    quote: "مشتری‌ها عکس محصولات رو می‌بینن و راحت‌تر تصمیم می‌گیرن، فروش شیرینی‌های جدید بیشتر شد.",
    name: "نگار موسوی",
    role: "شیرینی برفی · مشهد",
    image: "/marketing/customers/card-cake.png",
    avatarColor: "border-[#f1dfb8] bg-[#fbf3e3] text-[#c98a12]",
    initial: "ن",
  },
  {
    quote: "پشتیبانی سریع جواب میده و راه‌اندازی اولیه کمتر از یک روز طول کشید.",
    name: "حسین کریمی",
    role: "کافه نارنج · شیراز",
    image: "/marketing/customers/card-kenari-products.png",
    avatarColor: "border-[#cfe1f5] bg-[#e8f1fb] text-[#2f7fd6]",
    initial: "ح",
  },
];

export function CustomersTestimonials() {
  return (
    <section aria-labelledby="customers-testimonials-heading" className="px-5 py-13">
      <div className="mx-auto max-w-[1200px]">
        <div className="mx-auto max-w-[52ch] text-center">
          <span className="inline-flex items-center gap-1.5 rounded-pill bg-brand/10 px-4 py-1.5 text-sm font-medium text-brand">
            نظرات
            <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M12 20s-7-4.4-9.5-8.4C.7 8.1 2.3 4.5 6 4a5 5 0 016 2.3A5 5 0 0118 4c3.7.5 5.3 4.1 3.5 7.6C19 15.6 12 20 12 20z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
            </svg>
          </span>
          <h2
            id="customers-testimonials-heading"
            className="mx-auto mt-4.5 max-w-[20ch] text-[clamp(1.4rem,2.8vw,1.9rem)] font-bold leading-[1.4] tracking-[-0.4px] text-ink"
          >
            از زبان خود مشتری‌ها
          </h2>
        </div>

        <div className="mt-11 grid gap-5 [grid-template-columns:repeat(auto-fit,minmax(300px,1fr))]">
          {testimonials.map((t) => (
            <div key={t.name} className="flex flex-col gap-3.5 rounded-card-sm border border-border-line bg-card p-6 shadow-float">
              <div className="flex items-center justify-between">
                <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" className="text-text-3">
                  <path d="M7 15a4 4 0 01-4-4V8a2 2 0 012-2h3v6H5a3 3 0 003 3zM19 15a4 4 0 01-4-4V8a2 2 0 012-2h3v6h-3a3 3 0 003 3z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
                </svg>
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-star">
                      <path d="M12 2l2.9 6.6 7.1.7-5.4 4.7 1.6 7-6.2-3.7-6.2 3.7 1.6-7L2 9.3l7.1-.7z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-sm font-medium leading-[2] text-ink">«{t.quote}»</p>
              <div className="h-px w-full bg-border-line" />
              <div className="flex items-center gap-2.5">
                <div className="relative h-10 w-10 flex-none overflow-hidden rounded-xl">
                  <Image src={t.image} alt="" fill sizes="40px" className="object-cover" />
                </div>
                <div className="min-w-0 flex-1 leading-[1.8]">
                  <div className="text-sm font-extrabold text-ink">{t.name}</div>
                  <div className="text-xs font-light text-text-1">{t.role}</div>
                </div>
                <span className={`flex h-10 w-10 flex-none items-center justify-center rounded-full border text-base font-extrabold ${t.avatarColor}`}>
                  {t.initial}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
