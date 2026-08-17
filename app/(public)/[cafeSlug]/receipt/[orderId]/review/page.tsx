import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getReviewFormData } from "@/features/menu/services/menu-service";
import { getMenuLangCookie } from "@/features/menu/services/menu-language-service";
import { MenuPageShell } from "@/components/menu/menu-page-shell";
import { TopBar } from "@/components/menu/top-bar";
import { ReviewForm } from "@/components/menu/review-form";
import { localizedName, menuCopy } from "@/features/menu/utils/menu-language";

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function OrderReviewPage({
  params,
}: {
  params: Promise<{ cafeSlug: string; orderId: string }>;
}) {
  const { cafeSlug, orderId } = await params;
  const data = await getReviewFormData(cafeSlug, orderId);
  if (!data) notFound();

  const lang = (await getMenuLangCookie(cafeSlug)) ?? "fa";
  const t = menuCopy(lang);

  const items = Array.from(
    new Map(data.order.items.map((line) => [line.productId, line.product])).entries()
  ).map(([productId, product]) => ({ productId, name: localizedName(lang, product.name, product.nameEn) }));

  return (
    <MenuPageShell dir={t.dir}>
      <TopBar title={t.writeReview} backHref={`/${cafeSlug}/receipt/${orderId}`} />
      <ReviewForm
        slug={cafeSlug}
        orderId={orderId}
        items={items}
        pointsEligible={data.pointsEligible}
        alreadyReviewed={data.alreadyReviewed}
        lang={lang}
      />
    </MenuPageShell>
  );
}
