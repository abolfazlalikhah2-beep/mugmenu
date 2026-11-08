export function ContactPageHero() {
  return (
    <section
      aria-labelledby="contact-page-heading"
      className="relative overflow-hidden bg-gradient-to-b from-[#f3faf4] to-white px-5 pb-6 pt-13 sm:px-36 sm:pb-9 sm:pt-18"
    >
      <div aria-hidden="true" className="pointer-events-none absolute -right-15 -top-22.5 h-80 w-80 rounded-full bg-brand opacity-12 blur-[44px]" />
      <div aria-hidden="true" className="pointer-events-none absolute top-10 -left-20 h-70 w-70 rounded-full bg-brand opacity-10 blur-[44px]" />

      <div className="relative mx-auto max-w-[54ch] text-center">
        <span className="inline-flex items-center gap-1.5 rounded-pill border border-[#cfe6d2] bg-[#e9f4ea] px-3 py-1.25 text-xs font-semibold text-brand">
          تماس با ما
          <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path
              d="M4 5.5c0-1 .8-1.8 1.8-1.8H8c.8 0 1.5.5 1.7 1.3l.7 2.4c.2.7 0 1.4-.5 1.9l-1 1a13 13 0 006 6l1-1c.5-.5 1.2-.7 1.9-.5l2.4.7c.8.2 1.3.9 1.3 1.7v2.2c0 1-.8 1.8-1.8 1.8C10.4 21.2 2.8 13.6 2.8 5.5"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>

        <h1
          id="contact-page-heading"
          className="mt-3 text-[clamp(1.6rem,3.6vw,2rem)] font-extrabold leading-[1.5] tracking-[-0.3px] text-ink"
        >
          سؤالی داری؟ ما اینجاییم
        </h1>

        <p className="mx-auto mt-3 max-w-[40ch] text-[15px] font-light leading-[1.8] text-text-2">
          از شنبه تا پنجشنبه، ساعت ۹ تا ۱۸ پاسخگوی شما هستیم.
        </p>
      </div>
    </section>
  );
}
