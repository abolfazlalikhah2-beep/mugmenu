import { redirect } from "next/navigation";

// The category browser was merged into the main entry screen at
// `/${cafeSlug}` (Menu Flow.dc.html screen 1 — identity → category chips →
// product list, no order-type-picker step). This route is kept only so old
// links/QR codes/bookmarks still land somewhere real.
export default async function LegacyMenuRedirect({
  params,
}: {
  params: Promise<{ cafeSlug: string }>;
}) {
  const { cafeSlug } = await params;
  redirect(`/${cafeSlug}`);
}
