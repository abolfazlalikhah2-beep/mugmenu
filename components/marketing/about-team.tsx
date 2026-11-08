const team = [
  { initial: "ف", name: "فاطمه رحیمی", role: "پشتیبانی مشتریان", color: "border-[#cfe6d2] bg-[#e9f4ea] text-brand" },
  { initial: "م", name: "محمد کاظمی", role: "مدیر فنی", color: "border-[#f1dfb8] bg-[#fbf3e3] text-[#c98a12]" },
  { initial: "ز", name: "زهرا نوری", role: "طراح محصول", color: "border-[#cfe1f5] bg-[#e8f1fb] text-[#2f7fd6]" },
  { initial: "ا", name: "امیر صادقی", role: "مدیرعامل", color: "border-[#cfe6d2] bg-[#e9f4ea] text-brand" },
];

export function AboutTeam() {
  return (
    <section aria-labelledby="team-heading" className="px-5 py-13 lg:py-19">
      <div className="mx-auto max-w-[1200px]">
        <div className="mx-auto max-w-[52ch] text-center">
          <span className="inline-flex items-center gap-1.5 rounded-pill border border-[#cfe6d2] bg-[#e9f4ea] px-3 py-1.25 text-[13px] font-medium text-brand">
            تیم ما
            <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none">
              <circle cx="9" cy="8" r="3" stroke="currentColor" strokeWidth="1.6" />
              <path d="M2.5 19c0-3.3 2.9-5 6.5-5s6.5 1.7 6.5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              <path d="M15.5 4.3a3 3 0 010 5.9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              <path d="M18 19c0-2.6-1.8-4.1-4.2-4.7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </span>
          <h2
            id="team-heading"
            className="mx-auto mt-4.5 max-w-[20ch] text-[clamp(1.4rem,2.8vw,1.9rem)] font-bold leading-[1.4] tracking-[-0.4px] text-ink"
          >
            آدم‌های پشت سرو
          </h2>
        </div>

        <div className="mt-11 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {team.map((member) => (
            <div
              key={member.name}
              className="flex flex-col items-center gap-2 rounded-card-sm border border-border-line bg-card p-6 text-center shadow-float"
            >
              <span className={`flex h-18 w-18 items-center justify-center rounded-full border text-[29px] font-extrabold ${member.color}`}>
                {member.initial}
              </span>
              <p className="text-base font-black text-ink">{member.name}</p>
              <p className="text-[13px] font-light text-text-2">{member.role}</p>
              <div className="mt-1.5 flex items-center gap-1.5">
                <a
                  href="mailto:info@serwapp.com"
                  aria-label={`ایمیل ${member.name}`}
                  className="flex h-7.5 w-7.5 items-center justify-center rounded-input border border-border-line bg-chip text-text-1 transition-colors hover:bg-brand/8 hover:text-brand"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.6" />
                    <path d="M4 7l8 6 8-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
                <a
                  href="https://instagram.com/serwapp"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`اینستاگرام ${member.name}`}
                  className="flex h-7.5 w-7.5 items-center justify-center rounded-input border border-border-line bg-chip text-text-1 transition-colors hover:bg-brand/8 hover:text-brand"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.6" />
                    <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.6" />
                    <circle cx="17.2" cy="6.8" r="1" fill="currentColor" />
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
