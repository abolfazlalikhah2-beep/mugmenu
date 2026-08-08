import { CartProvider } from "@/features/menu/client/cart-context";

export default async function CafeLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ cafeSlug: string }>;
}) {
  const { cafeSlug } = await params;
  return <CartProvider slug={cafeSlug}>{children}</CartProvider>;
}
