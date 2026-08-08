import { notFound } from "next/navigation";
import { UtensilsCrossed, ScrollText, Package } from "lucide-react";
import { getMenuEntryData } from "@/features/menu/services/menu-service";
import { MenuPageShell } from "@/components/menu/menu-page-shell";
import { MenuImage } from "@/components/menu/menu-image";
import { RestaurantHeader } from "@/components/menu/restaurant-header";
import { OrderTypeRow } from "@/components/menu/order-type-row";
import { FooterBrand } from "@/components/menu/footer-brand";
import { CartFab } from "@/components/menu/cart-fab";

export default async function MenuEntryPage({
  params,
}: {
  params: Promise<{ cafeSlug: string }>;
}) {
  const { cafeSlug } = await params;
  const data = await getMenuEntryData(cafeSlug);
  if (!data) notFound();
  const { business, rating, recentReviews } = data;

  return (
    <MenuPageShell>
      <MenuImage label="بنر فضای رستوران" className="h-[200px] w-full md:h-[210px]" />
      <RestaurantHeader
        name={business.name}
        address={business.address}
        phone={business.phone}
        openingHours={business.openingHours}
        isAcceptingOrders={business.isAcceptingOrders}
        rating={rating}
        reviews={recentReviews}
      />
      <p className="px-4.5 pt-2.5 text-center text-sm md:px-10">
        منوی مورد نظر را بر اساس سفارش خود انتخاب کنید:
      </p>
      <div className="flex flex-col gap-3 px-4.5 py-4 md:px-10 md:py-5">
        <OrderTypeRow
          label="بر روی میز"
          icon={<UtensilsCrossed size={22} className="text-brand" />}
          href={`/${cafeSlug}/menu?type=dine_in`}
        />
        <OrderTypeRow
          label="منو دیداری"
          icon={<ScrollText size={22} className="text-brand" />}
          href={`/${cafeSlug}/menu?type=view`}
        />
        <OrderTypeRow
          label="سفارش بیرون بر"
          icon={<Package size={22} className="text-brand" />}
          href={`/${cafeSlug}/menu?type=takeaway`}
        />
      </div>
      <FooterBrand />
      <CartFab slug={cafeSlug} />
    </MenuPageShell>
  );
}
