export interface SmsTemplateVars {
  customerName?: string;
  businessName?: string;
  trackingCode?: string;
}

/** Expands the {نام مشتری}/{نام مجموعه}/{کد پیگیری} chips inserted by the composer. */
export function renderSmsTemplate(template: string, vars: SmsTemplateVars): string {
  return template
    .replaceAll("{نام مشتری}", vars.customerName ?? "")
    .replaceAll("{نام مجموعه}", vars.businessName ?? "")
    .replaceAll("{کد پیگیری}", vars.trackingCode ?? "");
}
