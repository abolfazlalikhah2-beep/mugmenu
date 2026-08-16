import { requireBusinessOwner } from "@/features/auth/services/authorize";
import { getBusiness } from "@/features/dashboard/services/settings-service";
import { getProducts } from "@/features/dashboard/services/product-service";
import { getCategories } from "@/features/dashboard/services/category-service";
import { getBusinessFeatureSet } from "@/features/plans/services/plan-service";
import { Topbar } from "@/components/dashboard/topbar";
import { PanelContent } from "@/components/dashboard/panel-content";
import { ProductsView } from "@/components/dashboard/products-view";

export default async function ProductsPage() {
  const { businessId } = await requireBusinessOwner();
  const [business, products, categories, featureSet] = await Promise.all([
    getBusiness(businessId),
    getProducts(businessId),
    getCategories(businessId),
    getBusinessFeatureSet(businessId),
  ]);
  if (!business) return null;

  return (
    <>
      <Topbar title="محصولات" businessName={business.name} isAcceptingOrders={business.isAcceptingOrders} />
      <PanelContent>
        <ProductsView
          products={products}
          categories={categories.map((c) => ({ id: c.id, name: c.name }))}
          featureKeys={featureSet ? [...featureSet.keys] : []}
        />
      </PanelContent>
    </>
  );
}
