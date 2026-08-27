import { NextResponse } from "next/server";
import { requireBusinessOwner } from "@/features/auth/services/authorize";
import { getOrdersCreatedSince } from "@/features/dashboard/services/order-mgmt-service";
import { newOrdersSinceSchema } from "@/features/dashboard/services/dashboard-schemas";

/** Polled every 10s by order-notification-provider.tsx while the dashboard tab is visible — see that file for why polling instead of a websocket. */
export async function GET(request: Request) {
  const { businessId } = await requireBusinessOwner();

  const { searchParams } = new URL(request.url);
  const parsed = newOrdersSinceSchema.safeParse({ since: searchParams.get("since") });
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const orders = await getOrdersCreatedSince(businessId, new Date(parsed.data.since));

  return NextResponse.json({
    count: orders.length,
    orders: orders.map((o) => ({
      id: o.id,
      orderNumber: o.orderNumber,
      customerName: o.customerName,
      total: o.totalPrice,
      createdAt: o.createdAt,
    })),
  });
}
