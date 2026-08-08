import { requireBusinessOwner } from "@/features/auth/services/authorize";
import { getBusiness } from "@/features/dashboard/services/settings-service";
import { getCategories } from "@/features/dashboard/services/category-service";
import { Topbar } from "@/components/dashboard/topbar";
import { PanelContent } from "@/components/dashboard/panel-content";
import { CategoriesView } from "@/components/dashboard/categories-view";

export default async function CategoriesPage() {
  const { businessId } = await requireBusinessOwner();
  const [business, categories] = await Promise.all([getBusiness(businessId), getCategories(businessId)]);
  if (!business) return null;

  return (
    <>
      <Topbar title="دسته‌بندی" businessName={business.name} isAcceptingOrders={business.isAcceptingOrders} />
      <PanelContent>
        <CategoriesView categories={categories} />
      </PanelContent>
    </>
  );
}
