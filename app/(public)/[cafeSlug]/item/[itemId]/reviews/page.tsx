import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getItemReviewsData } from "@/features/menu/services/menu-service";
import { getMenuLangCookie } from "@/features/menu/services/menu-language-service";
import { MenuPageShell } from "@/components/menu/menu-page-shell";
import { TopBar } from "@/components/menu/top-bar";
import { StarIcon } from "@/components/ui/rating";
import {
  localizedName,
  menuCopy,
  reviewsPageTitle,
  basedOnReviewsLabel,
} from "@/features/menu/utils/menu-language";

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function ItemReviewsPage({
  params,
}: {
  params: Promise<{ cafeSlug: string; itemId: string }>;
}) {
  const { cafeSlug, itemId } = await params;
  const data = await getItemReviewsData(itemId);
  if (!data) notFound();
  const { product, reviews, rating, count } = data;

  const lang = (await getMenuLangCookie(cafeSlug)) ?? "fa";
  const t = menuCopy(lang);
  const name = localizedName(lang, product.name, product.nameEn);
  const align = lang === "en" ? "text-left" : "text-right";
  const dateLocale = lang === "en" ? "en-US" : "fa-IR";

  return (
    <MenuPageShell dir={t.dir}>
      <TopBar title={reviewsPageTitle(lang, name)} backHref={`/${cafeSlug}/item/${itemId}`} />
      <div className="flex flex-wrap items-center justify-between gap-3 px-4.5 pt-4 md:px-6.5">
        <div className="flex items-center gap-3">
          <div className="text-[34px] font-bold">{rating}</div>
          <div className={align}>
            <div className="flex gap-0.5">
              {[0, 1, 2, 3, 4].map((k) => (
                <StarIcon key={k} size={16} className={k < Math.round(Number(rating)) ? "" : "opacity-25"} />
              ))}
            </div>
            <div className="mt-1 text-xs text-text-3">{basedOnReviewsLabel(lang, count)}</div>
          </div>
        </div>
        <div className="flex gap-2.5">
          <span className="flex h-[34px] items-center rounded-chip border-[0.3px] border-border-chip bg-chip px-4.5 text-[13px]">
            {t.mostRelevant}
          </span>
          <span className="flex h-[34px] items-center rounded-chip bg-chip px-4.5 text-xs text-[#777] opacity-65">
            {t.newest}
          </span>
        </div>
      </div>
      <div className="px-4.5 pb-5 md:px-6.5">
        {reviews.map((rv) => (
          <div
            key={rv.id}
            className="flex items-start gap-3.5 border-b border-[#EEE] py-4.5"
          >
            <div className={`w-[116px] shrink-0 md:w-[150px] ${align}`}>
              <div className="text-sm font-bold text-[#0F0F0F]">{rv.customerName}</div>
              <div className="mt-0.5 text-[11px] font-light text-[#919191]">
                {rv.createdAt.toLocaleDateString(dateLocale, { day: "numeric", month: "long", year: "numeric" })}
              </div>
              <div className="mt-2 flex h-[22px] w-fit items-center gap-1 rounded-chip border-[0.3px] border-border-chip bg-chip px-2">
                <span className="text-xs text-text-2">{rv.rating}</span>
                <StarIcon size={12} />
              </div>
            </div>
            <div className={`flex-1 ${align}`}>
              {rv.comment && (
                <p className="m-0 text-justify text-[13px] leading-[1.9] text-text-1">
                  {rv.comment}
                </p>
              )}
              <span className="mt-2.5 inline-block rounded-chip border-[0.3px] border-border-chip bg-chip px-3 py-1 text-[9px] text-text-1">
                {name}
              </span>
            </div>
          </div>
        ))}
      </div>
    </MenuPageShell>
  );
}
