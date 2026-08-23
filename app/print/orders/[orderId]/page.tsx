import { notFound } from "next/navigation";
import { getOrderForPrintAction } from "@/features/dashboard/routes/actions";
import { KitchenReceipt } from "@/components/dashboard/kitchen-receipt";

// Deliberately outside app/(dashboard) — that group's layout.tsx renders the
// sidebar/topbar shell, which a full-bleed 80mm print ticket must not have.
export default async function OrderPrintPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;
  const order = await getOrderForPrintAction(orderId);
  if (!order) notFound();

  return <KitchenReceipt order={order} />;
}
