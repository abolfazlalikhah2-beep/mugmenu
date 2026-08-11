import { CartProvider } from "@/features/menu/client/cart-context";
import { getBusinessAccentColor } from "@/features/menu/services/menu-service";
import { darkenColor, isValidHexColor } from "@/features/menu/utils/theme-color";

export default async function CafeLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ cafeSlug: string }>;
}) {
  const { cafeSlug } = await params;
  const accentColor = await getBusinessAccentColor(cafeSlug);

  // Every text-brand/bg-brand/border-brand utility reads --color-brand (see
  // app/globals.css's @theme) — overriding it here re-themes the whole
  // customer-facing app for this business, from the dashboard's "ظاهر منو"
  // tab, with zero changes to the ~25 components that use those utilities.
  const themeStyle =
    accentColor && isValidHexColor(accentColor)
      ? ({ "--color-brand": accentColor, "--color-brand-hover": darkenColor(accentColor) } as React.CSSProperties)
      : undefined;

  return (
    <div style={themeStyle}>
      <CartProvider slug={cafeSlug}>{children}</CartProvider>
    </div>
  );
}
