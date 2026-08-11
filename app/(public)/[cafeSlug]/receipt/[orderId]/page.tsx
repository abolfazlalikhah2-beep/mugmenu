import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, MapPin } from "lucide-react";
import { getReceiptData } from "@/features/menu/services/menu-service";
import { MenuPageShell } from "@/components/menu/menu-page-shell";
import { MenuImage } from "@/components/menu/menu-image";
import { Button } from "@/components/ui/button";
import { StarIcon } from "@/components/ui/rating";
import { SurveySheet } from "@/components/menu/survey-sheet";
import { formatToman } from "@/features/menu/utils/money";

const TYPE_LABEL: Record<string, string> = {
  DINE_IN: "روی میز",
  TAKEAWAY: "بیرون‌بر",
  DELIVERY: "ارسال با پیک",
};

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

  const subtotal = order.items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
  const detail =
    order.type === "DINE_IN" ? `روی میز ${order.tableNumber ?? ""}` : TYPE_LABEL[order.type];

  return (
    <MenuPageShell>
      <div className="flex flex-col items-center gap-3 pt-9 pb-5">
        <div className="flex h-[78px] w-[78px] items-center justify-center rounded-full bg-[#E5F0E6]">
          <Check size={38} strokeWidth={2.4} className="text-brand" />
        </div>
        <div className="text-xl font-semibold md:text-2xl">سفارش شما ثبت شد</div>
        <div className="text-[13px] font-light text-text-3">
          کد پیگیری: {order.id.slice(-8)} · {detail}
        </div>
      </div>

      {order.type === "DELIVERY" && order.address && (
        <div className="mx-4 mb-3.5 flex items-start gap-2.5 rounded-card-sm border border-[#EFEFEF] p-4 md:mx-10">
          <MapPin size={17} className="mt-0.5 shrink-0 text-brand" />
          <div className="text-right">
            <div className="text-xs font-light text-text-3">آدرس تحویل</div>
            <div className="mt-1 text-sm text-text-1">{order.address}</div>
          </div>
        </div>
      )}

      <div className="mx-4 flex flex-col gap-3.5 rounded-card-sm border border-[#EFEFEF] p-5 md:mx-10">
        <div className="text-right text-[15px] font-medium text-text-1">خلاصه سفارش</div>
        {order.items.map((line) => (
          <div key={line.id} className="flex items-center gap-3.5 border-b border-[#F2F2F2] py-3.5 last:border-none">
            <MenuImage
              imageUrl={line.product.imageUrl}
              alt={line.product.name}
              className="h-[58px] w-[58px] shrink-0 rounded-2xl"
            />
            <div className="flex-1 text-right">
              <div className="text-[15px] font-medium">{line.product.name}</div>
              <div className="mt-1 text-[13px] font-semibold text-brand">
                {formatToman(line.unitPrice)} تومان × {line.quantity}
              </div>
            </div>
          </div>
        ))}
        <ReceiptLine label="جمع سفارش" value={`${formatToman(subtotal)} تومان`} />
        <ReceiptLine label="مالیات و بسته‌بندی" value={`${formatToman(order.business.packagingFee)} تومان`} />
        <div className="h-px bg-[#F0F0F0]" />
        <ReceiptLine
          label="مبلغ پرداخت‌شده"
          value={`${formatToman(subtotal + order.business.packagingFee)} تومان`}
          bold
        />
      </div>

      {order.reviews.length === 0 && (
        <div className="mx-4 mt-3.5 flex items-center justify-between gap-3 rounded-card-sm border border-brand/[0.18] bg-brand/[0.05] p-4 md:mx-10">
          <div className="flex items-center gap-2.5">
            <StarIcon size={18} />
            <div className="text-right">
              <div className="text-[13.5px] font-medium">تجربه‌تان چطور بود؟</div>
              <div className="mt-0.5 text-[11.5px] font-light text-text-3">با ثبت نظر امتیاز باشگاه مشتریان بگیرید</div>
            </div>
          </div>
          <Link href={`/${cafeSlug}/receipt/${orderId}/review`}>
            <Button variant="secondary" className="h-10 shrink-0 px-4 text-sm">
              ثبت نظر
            </Button>
          </Link>
        </div>
      )}

      <div className="mx-4 my-5 flex flex-col gap-3 md:mx-10 md:flex-row">
        <Link href={`/${cafeSlug}/receipt/${orderId}`} className="flex-1">
          <Button variant="primary" className="w-full">
            پیگیری سفارش
          </Button>
        </Link>
        <Link href={`/${cafeSlug}`} className="flex-1">
          <Button variant="secondary" className="w-full">
            بازگشت به منو
          </Button>
        </Link>
      </div>

      {!order.survey && <SurveySheet orderId={orderId} />}
    </MenuPageShell>
  );
}
