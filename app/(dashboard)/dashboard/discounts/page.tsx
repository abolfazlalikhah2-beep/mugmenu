import { requireBusinessOwner } from "@/features/auth/services/authorize";
import { getBusiness } from "@/features/dashboard/services/settings-service";
import { getDiscounts } from "@/features/dashboard/services/discount-service";
import { getCategories } from "@/features/dashboard/services/category-service";
import { getProducts } from "@/features/dashboard/services/product-service";
import { businessHasFeature } from "@/features/plans/services/plan-service";
import { Topbar } from "@/components/dashboard/topbar";
import { PanelContent } from "@/components/dashboard/panel-content";
import { DiscountsView } from "@/components/dashboard/discounts-view";
import { UpgradeGate } from "@/components/dashboard/upgrade-gate";

export default async function DiscountsPage() {
  const { businessId } = await requireBusinessOwner();
  const [business, hasDiscounts] = await Promise.all([
    getBusiness(businessId),
    businessHasFeature(businessId, "discount.manual_auto"),
  ]);
  if (!business) return null;

  const data = hasDiscounts
    ? await Promise.all([getDiscounts(businessId), getCategories(businessId), getProducts(businessId)])
    : null;

  return (
    <>
      <Topbar title="تخفیف‌ها" businessName={business.name} isAcceptingOrders={business.isAcceptingOrders} />
      <PanelContent>
        <UpgradeGate allowed={hasDiscounts} title="تخفیف‌های دستی و خودکار در پلن شما موجود نیست">
          {data && (
            <DiscountsView
              discounts={data[0]}
              categories={data[1].map((c) => ({ id: c.id, name: c.name }))}
              products={data[2].map((p) => ({ id: p.id, name: p.name }))}
            />
          )}
        </UpgradeGate>
      </PanelContent>
    </>
  );
}
