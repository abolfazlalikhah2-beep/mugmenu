const logos = [
  {
    name: "پیتزا ناپل",
    icon: (
      <path d="M12 3l9 16H3z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    ),
  },
  {
    name: "بستنی برفی",
    icon: (
      <path d="M8 10a4 4 0 118 0c0 1-.4 1.8-1 2.5L12 21l-3-8.5c-.6-.7-1-1.5-1-2.5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    ),
  },
  {
    name: "کافه نارنج",
    icon: (
      <>
        <path d="M5 9h11v5a4 4 0 01-4 4H9a4 4 0 01-4-4z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M16 10h1.5a2 2 0 010 4H16" stroke="currentColor" strokeWidth="1.5" />
      </>
    ),
  },
  {
    name: "برگرلند",
    icon: (
      <path d="M4 10h16M3 14h18M5 14a7 7 0 0114 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    ),
  },
  {
    name: "رستوران شبدر",
    icon: (
      <path d="M7 3v8M5 3v5a2 2 0 002 2 2 2 0 002-2V3M17 3v18M17 3a4 4 0 00-4 4v2h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    ),
  },
  {
    name: "کافه کناری",
    icon: (
      <>
        <path d="M5 9h11v5a4 4 0 01-4 4H9a4 4 0 01-4-4z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M16 10h1.5a2 2 0 010 4H16" stroke="currentColor" strokeWidth="1.5" />
      </>
    ),
  },
];

export function LogosStrip() {
  return (
    <section aria-label="کافه‌ها و رستوران‌هایی که به سرو اعتماد کرده‌اند" className="mx-auto max-w-[1200px] px-5 pb-11">
      <p className="text-center text-[13px] font-light leading-[1.8] text-text-3">
        کافه‌ها و رستوران‌هایی که به سرو اعتماد کرده‌اند
      </p>
      <div className="mt-5 flex flex-wrap items-center justify-center gap-x-9 gap-y-4">
        {logos.map((logo) => (
          <div key={logo.name} className="flex items-center gap-2 text-text-5">
            <span className="whitespace-nowrap text-[15px] font-extrabold">{logo.name}</span>
            <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none">
              {logo.icon}
            </svg>
          </div>
        ))}
      </div>
    </section>
  );
}
