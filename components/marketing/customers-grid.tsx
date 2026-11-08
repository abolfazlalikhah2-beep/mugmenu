import Image from "next/image";

const categories = ["شیرینی و بستنی", "فست‌فود", "رستوران", "کافه", "همه"];

const customers = [
  {
    name: "برگرلند",
    plan: "پلن اوپال",
    location: "اصفهان · فست‌فود",
    image: "/marketing/customers/card-burger.png",
  },
  {
    name: "رستوران شبدر",
    plan: "پلن زمرد",
    location: "قم · رستوران",
    image: "/marketing/customers/card-kebab.png",
  },
  {
    name: "کافه کناری",
    plan: "پلن اوپال",
    location: "تهران · کافه",
    image: "/marketing/customers/card-cafe.png",
  },
  {
    name: "رستوران حافظ",
    plan: "پلن زمرد",
    location: "قم · رستوران",
    image: "/marketing/customers/card-lamb.png",
  },
  {
    name: "شیرینی برفی",
    plan: "پلن فیروزه",
    location: "مشهد · شیرینی",
    image: "/marketing/customers/card-cake.png",
  },
  {
    name: "کافه نارنج",
    plan: "پلن یشم",
    location: "شیراز · کافه",
    image: "/marketing/customers/card-kenari-products.png",
  },
];

export function CustomersGrid() {
  return (
    <section aria-label="نمونه کسب‌وکارهای مشتری" className="px-5 pb-13 pt-4">
      <div className="mx-auto max-w-[1200px]">
        <div className="flex flex-wrap items-center justify-center gap-2">
          {categories.map((label) => (
            <button
              key={label}
              type="button"
              className={
                label === "همه"
                  ? "rounded-pill bg-brand px-4 py-2 text-[13px] font-medium text-white"
                  : "rounded-pill border border-border-line bg-card px-4 py-2 text-[13px] font-medium text-text-1"
              }
            >
              {label}
            </button>
          ))}
        </div>

        <div className="mt-9 grid gap-5 [grid-template-columns:repeat(auto-fit,minmax(300px,1fr))]">
          {customers.map((c) => (
            <div key={c.name} className="flex flex-col gap-2 rounded-card-sm border border-border-line bg-card p-2 shadow-float">
              <div className="relative h-50 w-full overflow-hidden rounded-[18px]">
                <Image src={c.image} alt={c.name} fill sizes="(min-width: 1024px) 370px, 90vw" className="object-cover" />
              </div>
              <div className="flex flex-col gap-1.5 px-3 pb-3 pt-1">
                <div className="flex items-center justify-between">
                  <span className="rounded-pill border border-[#cfe6d2] bg-[#e9f4ea] px-3 py-1.25 text-xs font-medium text-brand">
                    {c.plan}
                  </span>
                  <span className="text-[17px] font-black text-ink">{c.name}</span>
                </div>
                <div className="flex items-center justify-end gap-1.5 text-xs font-light text-text-2">
                  <span>{c.location}</span>
                  <Image src="/marketing/customers/icon-location.svg" alt="" width={14} height={14} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
