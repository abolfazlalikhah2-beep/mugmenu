const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

const softwareApplicationSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "ماگ‌منو",
  alternateName: "Mug Menu",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  url: BASE_URL,
  description:
    "پلتفرم منوی دیجیتال QR چندمستأجری برای رستوران و کافه؛ سفارش‌گیری روی میز، بیرون‌بر و ارسال با پیک به‌همراه پنل مدیریت آنلاین.",
  inLanguage: "fa-IR",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "IRR",
  },
};

export function StructuredData() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApplicationSchema) }}
    />
  );
}
