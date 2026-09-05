import { ContactForm } from "@/components/marketing/contact-form";

export function ContactFormSection() {
  return (
    <section aria-labelledby="contact-form-heading" className="mx-auto max-w-[680px] px-5 py-10">
      <div className="rounded-card border border-border-line bg-card p-7.5 shadow-float sm:p-9">
        <div className="text-center">
          <h2 id="contact-form-heading" className="text-[clamp(1.4rem,3.4vw,1.9rem)] font-bold leading-[1.4] tracking-[-0.3px] text-ink">
            برای ما پیام بگذارید
          </h2>
          <p className="mt-2.5 text-sm font-light leading-[1.9] text-text-1">
            فرم زیر را پر کنید؛ تیم سِرو در اسرع وقت با شما تماس می‌گیرد.
          </p>
        </div>

        <div className="mt-7">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
