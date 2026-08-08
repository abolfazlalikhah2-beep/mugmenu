import { notFound } from "next/navigation";
import { getItemReviewsData } from "@/features/menu/services/menu-service";
import { MenuPageShell } from "@/components/menu/menu-page-shell";
import { TopBar } from "@/components/menu/top-bar";
import { StarIcon } from "@/components/ui/rating";

export default async function ItemReviewsPage({
  params,
}: {
  params: Promise<{ cafeSlug: string; itemId: string }>;
}) {
  const { cafeSlug, itemId } = await params;
  const data = await getItemReviewsData(itemId);
  if (!data) notFound();
  const { product, reviews, rating, count } = data;

  return (
    <MenuPageShell>
      <TopBar title={`نظرات — ${product.name}`} backHref={`/${cafeSlug}/item/${itemId}`} />
      <div className="flex flex-wrap items-center justify-between gap-3 px-4.5 pt-4 md:px-6.5">
        <div className="flex items-center gap-3">
          <div className="text-[34px] font-bold">{rating}</div>
          <div className="text-right">
            <div className="flex gap-0.5">
              {[0, 1, 2, 3, 4].map((k) => (
                <StarIcon key={k} size={16} className={k < Math.round(Number(rating)) ? "" : "opacity-25"} />
              ))}
            </div>
            <div className="mt-1 text-xs text-text-3">بر پایه {count} نظر</div>
          </div>
        </div>
        <div className="flex gap-2.5">
          <span className="flex h-[34px] items-center rounded-chip border-[0.3px] border-border-chip bg-chip px-4.5 text-[13px]">
            مرتبط ترین
          </span>
          <span className="flex h-[34px] items-center rounded-chip bg-chip px-4.5 text-xs text-[#777] opacity-65">
            جدیدترین
          </span>
        </div>
      </div>
      <div className="px-4.5 pb-5 md:px-6.5">
        {reviews.map((rv) => (
          <div
            key={rv.id}
            className="flex items-start gap-3.5 border-b border-[#EEE] py-4.5"
          >
            <div className="w-[116px] shrink-0 text-right md:w-[150px]">
              <div className="text-sm font-bold text-[#0F0F0F]">{rv.customerName}</div>
              <div className="mt-0.5 text-[11px] font-light text-[#919191]">
                {rv.createdAt.toLocaleDateString("fa-IR", { day: "numeric", month: "long", year: "numeric" })}
              </div>
              <div className="mt-2 flex h-[22px] w-fit items-center gap-1 rounded-chip border-[0.3px] border-border-chip bg-chip px-2">
                <span className="text-xs text-text-2">{rv.rating}</span>
                <StarIcon size={12} />
              </div>
            </div>
            <div className="flex-1 text-right">
              {rv.comment && (
                <p className="m-0 text-justify text-[13px] leading-[1.9] text-text-1">
                  {rv.comment}
                </p>
              )}
              <span className="mt-2.5 inline-block rounded-chip border-[0.3px] border-border-chip bg-chip px-3 py-1 text-[9px] text-text-1">
                {product.name}
              </span>
            </div>
          </div>
        ))}
      </div>
    </MenuPageShell>
  );
}
