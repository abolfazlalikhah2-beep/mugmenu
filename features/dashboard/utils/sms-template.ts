export interface SmsTemplateVars {
  customerName?: string;
  businessName?: string;
  trackingCode?: string;
  /** Toman amount, formatted with fa-IR grouping — e.g. the birthday gift credit (Business.birthdayGiftAmount). */
  creditAmount?: number;
}

/** Expands the {نام مشتری}/{نام مجموعه}/{کد پیگیری}/{مبلغ اعتبار} chips inserted by the composer. */
export function renderSmsTemplate(template: string, vars: SmsTemplateVars): string {
  return template
    .replaceAll("{نام مشتری}", vars.customerName ?? "")
    .replaceAll("{نام مجموعه}", vars.businessName ?? "")
    .replaceAll("{کد پیگیری}", vars.trackingCode ?? "")
    .replaceAll("{مبلغ اعتبار}", vars.creditAmount !== undefined ? vars.creditAmount.toLocaleString("fa-IR") : "");
}
