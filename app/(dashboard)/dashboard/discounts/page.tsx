import { requireBusinessOwner } from "@/features/auth/services/authorize";
import { getBusiness } from "@/features/dashboard/services/settings-service";
import { getDiscounts } from "@/features/dashboard/services/discount-service";
import { getCategories } from "@/features/dashboard/services/category-service";
import { getProducts } from "@/features/dashboard/services/product-service";
import { Topbar } from "@/components/dashboard/topbar";
import { PanelContent } from "@/components/dashboard/panel-content";
import { DiscountsView } from "@/components/dashboard/discounts-view";

export default async function DiscountsPage() {
  const { businessId } = await requireBusinessOwner();
  const [business, discounts, categories, products] = await Promise.all([
    getBusiness(businessId),
    getDiscounts(businessId),
    getCategories(businessId),
    getProducts(businessId),
  ]);
  if (!business) return null;

  return (
    <>
      <Topbar title="تخفیف‌ها" businessName={business.name} isAcceptingOrders={business.isAcceptingOrders} />
      <PanelContent>
        <DiscountsView
          discounts={discounts}
          categories={categories.map((c) => ({ id: c.id, name: c.name }))}
          products={products.map((p) => ({ id: p.id, name: p.name }))}
        />
      </PanelContent>
    </>
  );
}
