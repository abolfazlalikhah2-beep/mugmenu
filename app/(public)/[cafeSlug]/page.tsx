import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { after } from "next/server";
import { UtensilsCrossed, ScrollText, Package } from "lucide-react";
import { getMenuEntryData } from "@/features/menu/services/menu-service";
import { getCustomerSession } from "@/features/customer/services/customer-session-service";
import { getAccountProfile } from "@/features/customer/services/customer-auth-service";
import { getWalletAndLoyaltySummary } from "@/features/customer/services/wallet-service";
import { getMenuLangCookie } from "@/features/menu/services/menu-language-service";
import { logMenuVisit } from "@/features/menu/services/visit-service";
import { businessHasFeature } from "@/features/plans/services/plan-service";
import { resolveHeroBackground } from "@/features/menu/utils/hero-background";
import { menuCopy, localizedName } from "@/features/menu/utils/menu-language";
import { MenuPageShell } from "@/components/menu/menu-page-shell";
import { MenuHero } from "@/components/menu/menu-hero";
import { RestaurantHeader } from "@/components/menu/restaurant-header";
import { OrderTypeRow } from "@/components/menu/order-type-row";
import { FooterBrand } from "@/components/menu/footer-brand";
import { CartFab } from "@/components/menu/cart-fab";
import { LanguageToggle } from "@/components/menu/language-toggle";
import { LanguageGate } from "@/components/menu/language-gate";
import { MenuEntryBadge } from "@/components/customer-account/menu-entry-badge";
import { MenuWalletTeaser, MenuLoginTeaser } from "@/components/customer-account/menu-wallet-teaser";

export default async function MenuEntryPage({
  params,
  searchParams,
}: {
  params: Promise<{ cafeSlug: string }>;
  searchParams: Promise<{ src?: string }>;
}) {
  const { cafeSlug } = await params;
  const [data, customerSession] = await Promise.all([
    getMenuEntryData(cafeSlug),
    getCustomerSession(cafeSlug),
  ]);
  if (!data) notFound();
  const { business, rating, recentReviews } = data;

  const { src } = await searchParams;
  const h = await headers();
  const referer = h.get("referer");
  const host = h.get("host");
  const ownOrigin = host ? `${h.get("x-forwarded-proto") ?? "https"}://${host}` : null;
  after(() => logMenuVisit(business.id, { srcParam: src, referer, ownOrigin }));

  const savedLang = business.bilingualMenuEnabled ? await getMenuLangCookie(cafeSlug) : null;
  const showGate = business.bilingualMenuEnabled && business.askLanguageOnEntry && savedLang === null;

  if (showGate) {
    return (
      <MenuPageShell dir="rtl">
        <LanguageGate slug={cafeSlug} name={business.name} nameEn={business.nameEn} />
      </MenuPageShell>
    );
  }

  const lang = savedLang ?? "fa";
  const t = menuCopy(lang);
  const displayName = localizedName(lang, business.name, business.nameEn);

  const [account, walletSummary] = customerSession
    ? await Promise.all([
        getAccountProfile(customerSession.customerAccountId),
        getWalletAndLoyaltySummary(customerSession.customerAccountId),
      ])
    : [null, null];

  const heroBackground = resolveHeroBackground(business);
  const orderingEnabled = await businessHasFeature(business.id, "order.three_mode");

  return (
    <MenuPageShell dir={t.dir}>
      <div className="relative">
        <MenuHero
          background={heroBackground}
          overlayOpacity={business.heroOverlayOpacity}
          className="h-[200px] w-full md:h-[210px]"
          priority
        />
        <MenuEntryBadge
          slug={cafeSlug}
          loggedIn={Boolean(account)}
          initial={account?.fullName.slice(0, 1)}
          label={account ? t.myAccount : t.loginRegister}
        />
        {business.bilingualMenuEnabled && (
          <LanguageToggle slug={cafeSlug} lang={lang} className="absolute top-3.5 left-3.5 z-10" />
        )}
      </div>
      <RestaurantHeader
        name={displayName}
        address={business.address}
        phone={business.phone}
        openingHours={business.openingHours}
        isAcceptingOrders={business.isAcceptingOrders}
        rating={rating}
        reviews={recentReviews}
        logoUrl={business.logoUrl}
        lang={lang}
      />
      {walletSummary ? (
        <MenuWalletTeaser
          slug={cafeSlug}
          walletBalance={walletSummary.walletBalance}
          loyaltyPoints={walletSummary.loyaltyPoints}
          lang={lang}
        />
      ) : (
        <MenuLoginTeaser slug={cafeSlug} cashbackPercent={business.cashbackPercent} lang={lang} />
      )}
      <p className={`px-4.5 pt-2.5 text-center text-sm md:px-10 ${lang === "en" ? "font-mont" : ""}`}>{t.lead}</p>
      <div className="flex flex-col gap-3 px-4.5 py-4 md:px-10 md:py-5">
        {orderingEnabled ? (
          <>
            <OrderTypeRow
              label={t.rowDineIn}
              icon={<UtensilsCrossed size={22} className="text-brand" />}
              href={`/${cafeSlug}/menu?type=dine_in`}
            />
            <OrderTypeRow
              label={t.rowVisual}
              icon={<ScrollText size={22} className="text-brand" />}
              href={`/${cafeSlug}/menu?type=view`}
            />
            <OrderTypeRow
              label={t.rowTakeaway}
              icon={<Package size={22} className="text-brand" />}
              href={`/${cafeSlug}/menu?type=takeaway`}
            />
          </>
        ) : (
          <OrderTypeRow
            label={t.rowVisual}
            icon={<ScrollText size={22} className="text-brand" />}
            href={`/${cafeSlug}/menu`}
          />
        )}
      </div>
      <FooterBrand />
      {orderingEnabled && <CartFab slug={cafeSlug} />}
    </MenuPageShell>
  );
}
