import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { after } from "next/server";
import { getMenuMainData } from "@/features/menu/services/menu-service";
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
import { CategoryBrowser } from "@/components/menu/category-browser";
import { EntryDrawer } from "@/components/menu/entry-drawer";
import { FooterBrand } from "@/components/menu/footer-brand";
import { CartFab } from "@/components/menu/cart-fab";
import { LanguageGate } from "@/components/menu/language-gate";
import { MenuEntryBadge } from "@/components/customer-account/menu-entry-badge";
import { MenuWalletTeaser, MenuLoginTeaser } from "@/components/customer-account/menu-wallet-teaser";

export default async function MenuMainPage({
  params,
  searchParams,
}: {
  params: Promise<{ cafeSlug: string }>;
  searchParams: Promise<{ src?: string }>;
}) {
  const { cafeSlug } = await params;
  const [data, customerSession] = await Promise.all([
    getMenuMainData(cafeSlug),
    getCustomerSession(cafeSlug),
  ]);
  if (!data) notFound();
  const { business, rating, recentReviews, categories, products } = data;

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
  const [canOrderFeature, cashbackEnabled, loginEnabled] = await Promise.all([
    businessHasFeature(business.id, "order.three_mode"),
    businessHasFeature(business.id, "loyalty.cashback"),
    // menu-display has no ordering/customer accounts at all, so "ورود / ثبت‌نام" has nothing to lead to.
    businessHasFeature(business.id, "customer.wallet_login"),
  ]);
  // The plan gate alone isn't enough — a business on a paid plan can still
  // have manually toggled "سفارش‌گیری" off (dashboard "حساب کاربری"), which
  // must hide ordering here the same way order-service.ts's createOrder()
  // rejects it server-side (see order-flow.ts's orderAcceptanceError). Order
  // TYPE itself (dine-in/takeaway/delivery) is no longer chosen here — the
  // entry and category-browse screens were merged into one browse-first
  // page (Menu Flow.dc.html), so it's picked at checkout via DeliveryTabs.
  const orderingEnabled = canOrderFeature && business.isAcceptingOrders;
  const showCashbackTeaser = cashbackEnabled && business.cashbackPercent > 0;

  return (
    <MenuPageShell dir={t.dir}>
      <div className="relative">
        <MenuHero
          background={heroBackground}
          overlayOpacity={business.heroOverlayOpacity}
          className="h-[200px] w-full md:h-[223px]"
          priority
        />
        <EntryDrawer
          slug={cafeSlug}
          name={displayName}
          address={business.address}
          phone={business.phone}
          hours={business.hours}
          isAcceptingOrders={business.isAcceptingOrders}
          reviews={recentReviews}
          logoUrl={business.logoUrl}
          lang={lang}
          latitude={business.latitude}
          longitude={business.longitude}
          bilingualEnabled={business.bilingualMenuEnabled}
        />
        {loginEnabled && (
          <MenuEntryBadge
            slug={cafeSlug}
            loggedIn={Boolean(account)}
            initial={account?.fullName.slice(0, 1)}
            label={account ? t.myAccount : t.loginRegister}
          />
        )}
      </div>
      <RestaurantHeader
        name={displayName}
        address={business.address}
        phone={business.phone}
        hours={business.hours}
        isAcceptingOrders={business.isAcceptingOrders}
        rating={rating}
        reviews={recentReviews}
        logoUrl={business.logoUrl}
        lang={lang}
        latitude={business.latitude}
        longitude={business.longitude}
      />
      {walletSummary ? (
        <MenuWalletTeaser
          slug={cafeSlug}
          walletBalance={walletSummary.walletBalance}
          loyaltyPoints={walletSummary.loyaltyPoints}
          lang={lang}
        />
      ) : (
        showCashbackTeaser && (
          <MenuLoginTeaser slug={cafeSlug} cashbackPercent={business.cashbackPercent} lang={lang} />
        )
      )}
      <CategoryBrowser
        slug={cafeSlug}
        categories={categories}
        products={products}
        lang={lang}
        orderingEnabled={orderingEnabled}
      />
      <FooterBrand />
      {orderingEnabled && <CartFab slug={cafeSlug} />}
    </MenuPageShell>
  );
}
