import { notFound } from "next/navigation";
import { requireBusinessOwner } from "@/features/auth/services/authorize";
import { getBusiness } from "@/features/dashboard/services/settings-service";
import { getPrinters } from "@/features/dashboard/services/printer-service";
import { getProducts } from "@/features/dashboard/services/product-service";
import { getBusinessFeatureSet } from "@/features/plans/services/plan-service";
import { Topbar } from "@/components/dashboard/topbar";
import { PanelContent } from "@/components/dashboard/panel-content";
import { SettingsView } from "@/components/dashboard/settings-view";

export default async function SettingsPage() {
  const { businessId } = await requireBusinessOwner();
  const [business, printers, products, featureSet] = await Promise.all([
    getBusiness(businessId),
    getPrinters(businessId),
    getProducts(businessId),
    getBusinessFeatureSet(businessId),
  ]);
  if (!business) notFound();

  return (
    <>
      <Topbar title="تنظیمات" businessName={business.name} />
      <PanelContent>
        <SettingsView
          business={business}
          printers={printers}
          products={products}
          featureKeys={featureSet ? [...featureSet.keys] : []}
          printerLimit={featureSet?.limits["printer.connection"] ?? null}
        />
      </PanelContent>
    </>
  );
}
