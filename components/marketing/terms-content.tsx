import { termsSections } from "@/components/marketing/terms-data";

export function TermsContent() {
  return (
    <section aria-label="متن قوانین و مقررات" className="mx-auto max-w-[1000px] px-5 py-6">
      <div className="flex flex-col-reverse gap-6 lg:flex-row lg:items-start lg:gap-7">
        <div className="min-w-0 flex-1 rounded-card-sm border border-border-line bg-card p-5.5 shadow-float sm:p-8">
          <div className="flex flex-col divide-y divide-border-line">
            {termsSections.map((section) => (
              <div key={section.id} id={section.id} className="scroll-mt-24 py-6 first:pt-0 last:pb-0">
                <h2 className="text-base font-bold text-ink sm:text-lg">{section.title}</h2>
                <div className="mt-3 flex flex-col gap-3">
                  {section.paragraphs.map((paragraph, index) => (
                    <p key={index} className="text-sm font-light leading-[2] text-text-1">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <nav
          aria-label="فهرست مطالب قوانین"
          className="hidden w-60 flex-none rounded-card-sm border border-border-line bg-card p-5 shadow-float lg:sticky lg:top-24 lg:block"
        >
          <div className="text-sm font-bold text-ink">فهرست</div>
          <ul className="mt-3.5 flex flex-col gap-2.5">
            {termsSections.map((section) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className="block text-[13px] font-light text-text-1 transition-colors hover:text-brand"
                >
                  {section.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  );
}
