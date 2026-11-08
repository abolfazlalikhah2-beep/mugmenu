import { ContactForm } from "@/components/marketing/contact-form";
import { ContactMap } from "@/components/marketing/contact-map";

export function ContactFormSection() {
  return (
    <section aria-labelledby="contact-form-heading" className="bg-[#f7f8f7] px-5 py-10 sm:px-36 sm:py-16">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-6 sm:flex-row sm:items-stretch">
        <ContactMap />

        <div className="flex-1 rounded-card-sm border border-[#e4e6e4] bg-card p-6 shadow-float sm:p-8">
          <h2 id="contact-form-heading" className="text-[22px] font-black leading-[1.8] text-ink">
            ارسال پیام
          </h2>
          <p className="mt-1 text-[13px] font-light leading-[1.8] text-text-2">
            فرم زیر را پر کنید؛ در اولین فرصت با شما تماس می‌گیریم.
          </p>

          <div className="mt-5">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
