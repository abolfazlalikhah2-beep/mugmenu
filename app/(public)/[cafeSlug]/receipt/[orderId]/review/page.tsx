import { notFound } from "next/navigation";
import { getReviewFormData } from "@/features/menu/services/menu-service";
import { MenuPageShell } from "@/components/menu/menu-page-shell";
import { TopBar } from "@/components/menu/top-bar";
import { ReviewForm } from "@/components/menu/review-form";

export default async function OrderReviewPage({
  params,
}: {
  params: Promise<{ cafeSlug: string; orderId: string }>;
}) {
  const { cafeSlug, orderId } = await params;
  const data = await getReviewFormData(orderId);
  if (!data) notFound();

  const items = Array.from(
    new Map(data.order.items.map((line) => [line.productId, line.product.name])).entries()
  ).map(([productId, name]) => ({ productId, name }));

  return (
    <MenuPageShell>
      <TopBar title="ثبت نظر" backHref={`/${cafeSlug}/receipt/${orderId}`} />
      <ReviewForm
        slug={cafeSlug}
        orderId={orderId}
        items={items}
        pointsEligible={data.pointsEligible}
        alreadyReviewed={data.alreadyReviewed}
      />
    </MenuPageShell>
  );
}
