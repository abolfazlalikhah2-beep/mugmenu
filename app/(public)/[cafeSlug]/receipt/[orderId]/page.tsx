import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, MapPin } from "lucide-react";
import { getReceiptData } from "@/features/menu/services/menu-service";
import { getMenuLangCookie } from "@/features/menu/services/menu-language-service";
import { MenuPageShell } from "@/components/menu/menu-page-shell";
import { MenuImage } from "@/components/menu/menu-image";
import { Button } from "@/components/ui/button";
import { StarIcon } from "@/components/ui/rating";
import { SurveySheet } from "@/components/menu/survey-sheet";
import { formatToman } from "@/features/menu/utils/money";
import { localizedName, menuCopy, orderTypeLabel, type MenuLang } from "@/features/menu/utils/menu-language";

function ReceiptLine({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className={bold ? "text-base font-semibold text-brand" : "text-sm text-text-1"}>
        {label}
      </span>
      <span className={bold ? "text-base font-semibold" : "text-sm font-light text-[#777]"}>
        {value}
      </span>
    </div>
  );
}

export default async function ReceiptPage({
  params,
}: {
  params: Promise<{ cafeSlug: string; orderId: string }>;
}) {
  const { cafeSlug, orderId } = await params;
  const order = await getReceiptData(orderId);
  if (!order) notFound();

  const lang: MenuLang = (await getMenuLangCookie(cafeSlug)) ?? "fa";
  const t = menuCopy(lang);
  const align = lang === "en" ? "text-left" : "text-right";

  const subtotal = order.items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
  const detail = orderTypeLabel(lang, order.type, order.tableNumber);

  return (
    <MenuPageShell dir={t.dir}>
      <div className="flex flex-col items-center gap-3 pt-9 pb-5">
        <div className="flex h-[78px] w-[78px] items-center justify-center rounded-full bg-[#E5F0E6]">
          <Check size={38} strokeWidth={2.4} className="text-brand" />
        </div>
        <div className="text-xl font-semibold md:text-2xl">{t.orderPlaced}</div>
        <div className="text-[13px] font-light text-text-3">
          {t.trackingCode}: {order.id.slice(-8)} · {detail}
        </div>
      </div>

      {order.type === "DELIVERY" && order.address && (
        <div className="mx-4 mb-3.5 flex items-start gap-2.5 rounded-card-sm border border-[#EFEFEF] p-4 md:mx-10">
          <MapPin size={17} className="mt-0.5 shrink-0 text-brand" />
          <div className={align}>
            <div className="text-xs font-light text-text-3">{t.deliveryAddress}</div>
            <div className="mt-1 text-sm text-text-1">{order.address}</div>
          </div>
        </div>
      )}

      <div className="mx-4 flex flex-col gap-3.5 rounded-card-sm border border-[#EFEFEF] p-5 md:mx-10">
        <div className={`${align} text-[15px] font-medium text-text-1`}>{t.orderSummary}</div>
        {order.items.map((line) => (
          <div key={line.id} className="flex items-center gap-3.5 border-b border-[#F2F2F2] py-3.5 last:border-none">
            <MenuImage
              imageUrl={line.product.imageUrl}
              alt={localizedName(lang, line.product.name, line.product.nameEn)}
              className="h-[58px] w-[58px] shrink-0 rounded-2xl"
            />
            <div className={`flex-1 ${align}`}>
              <div className="text-[15px] font-medium">{localizedName(lang, line.product.name, line.product.nameEn)}</div>
              <div className="mt-1 text-[13px] font-semibold text-brand">
                {formatToman(line.unitPrice, lang)} {t.toman} × {line.quantity.toLocaleString(lang === "en" ? "en-US" : "fa-IR")}
              </div>
            </div>
          </div>
        ))}
        <ReceiptLine label={t.subtotal} value={`${formatToman(subtotal, lang)} ${t.toman}`} />
        <ReceiptLine label={t.taxPackaging} value={`${formatToman(order.business.packagingFee, lang)} ${t.toman}`} />
        <div className="h-px bg-[#F0F0F0]" />
        <ReceiptLine
          label={t.amountPaid}
          value={`${formatToman(subtotal + order.business.packagingFee, lang)} ${t.toman}`}
          bold
        />
      </div>

      {order.reviews.length === 0 && (
        <div className="mx-4 mt-3.5 flex items-center justify-between gap-3 rounded-card-sm border border-brand/[0.18] bg-brand/[0.05] p-4 md:mx-10">
          <div className="flex items-center gap-2.5">
            <StarIcon size={18} />
            <div className={align}>
              <div className="text-[13.5px] font-medium">{t.howWasExperience}</div>
              <div className="mt-0.5 text-[11.5px] font-light text-text-3">{t.earnPointsReview}</div>
            </div>
          </div>
          <Link href={`/${cafeSlug}/receipt/${orderId}/review`}>
            <Button variant="secondary" className="h-10 shrink-0 px-4 text-sm">
              {t.writeReview}
            </Button>
          </Link>
        </div>
      )}

      <div className="mx-4 my-5 flex flex-col gap-3 md:mx-10 md:flex-row">
        <Link href={`/${cafeSlug}/receipt/${orderId}`} className="flex-1">
          <Button variant="primary" className="w-full">
            {t.trackOrder}
          </Button>
        </Link>
        <Link href={`/${cafeSlug}`} className="flex-1">
          <Button variant="secondary" className="w-full">
            {t.backToMenu}
          </Button>
        </Link>
      </div>

      {!order.survey && <SurveySheet orderId={orderId} lang={lang} />}
    </MenuPageShell>
  );
}
