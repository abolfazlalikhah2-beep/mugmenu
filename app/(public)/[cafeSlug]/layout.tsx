import type { Metadata } from "next";
import { CartProvider } from "@/features/menu/client/cart-context";
import { getBusinessAccentColor, getBusinessSeoData } from "@/features/menu/services/menu-service";
import { darkenColor, isValidHexColor } from "@/features/menu/utils/theme-color";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ cafeSlug: string }>;
}): Promise<Metadata> {
  const { cafeSlug } = await params;
  const business = await getBusinessSeoData(cafeSlug);
  if (!business) return {};

  const description = business.description || business.address || undefined;

  return {
    title: business.name,
    description,
    openGraph: {
      title: business.name,
      description,
      type: "website",
      images: business.logoUrl ? [business.logoUrl] : undefined,
    },
  };
}

export default async function CafeLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ cafeSlug: string }>;
}) {
  const { cafeSlug } = await params;
  const [accentColor, business] = await Promise.all([
    getBusinessAccentColor(cafeSlug),
    getBusinessSeoData(cafeSlug),
  ]);

  // Every text-brand/bg-brand/border-brand utility reads --color-brand (see
  // app/globals.css's @theme) — overriding it here re-themes the whole
  // customer-facing app for this business, from the dashboard's "ظاهر منو"
  // tab, with zero changes to the ~25 components that use those utilities.
  const themeStyle =
    accentColor && isValidHexColor(accentColor)
      ? ({ "--color-brand": accentColor, "--color-brand-hover": darkenColor(accentColor) } as React.CSSProperties)
      : undefined;

  const jsonLd = business && {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: business.name,
    image: business.logoUrl ?? undefined,
    url: `${BASE_URL}/${cafeSlug}`,
    address: business.address ? { "@type": "PostalAddress", streetAddress: business.address } : undefined,
  };

  return (
    <div style={themeStyle}>
      {jsonLd && (
        <script
          type="application/ld+json"
          // JSON-LD needs a raw <script> tag; business name/address are dashboard-editable so
          // escape "<" to keep a value like "</script>" from breaking out of the tag.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
        />
      )}
      <CartProvider slug={cafeSlug}>{children}</CartProvider>
    </div>
  );
}
