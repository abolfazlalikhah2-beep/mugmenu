import Image from "next/image";

function BrandPanel() {
  return (
    <div className="relative flex shrink-0 items-center justify-center overflow-hidden bg-[#12833f] py-8 md:w-[55%] md:items-center md:justify-center md:rounded-tr-[82px] md:rounded-br-[82px] md:p-16">
      <Image src="/brand/green-gradient.png" alt="" fill priority className="object-cover" />
      <div className="relative z-10 flex flex-col items-center md:items-start">
        {/* logo-magmenu-white.png already bakes in the tagline under the
            wordmark; clip to just the wordmark row on mobile per the
            "remove the tagline on mobile" fix from the design review. */}
        <div className="relative h-[46px] w-[180px] overflow-hidden md:h-auto md:w-[248px]">
          <Image
            src="/brand/logo-magmenu-white.png"
            alt="ماگ‌منو"
            width={264}
            height={163}
            className="h-auto w-[180px] md:w-[248px]"
          />
        </div>
      </div>
    </div>
  );
}

export interface AuthShellProps {
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export function AuthShell({ children, footer }: AuthShellProps) {
  return (
    <div className="flex min-h-screen flex-col md:flex-row-reverse">
      <BrandPanel />
      <div className="flex flex-1 flex-col items-center px-6 py-10 md:px-10 md:py-14">
        <Image
          src="/brand/wordmark-faded.png"
          alt="ماگ‌منو"
          width={126}
          height={38}
          className="h-auto w-[100px] md:w-[126px]"
        />
        <div className="flex w-full max-w-[470px] flex-1 flex-col justify-center gap-7 py-10">
          {children}
        </div>
        <div className="flex w-full max-w-[470px] flex-col items-center gap-6">
          {footer}
          <p className="text-center text-xs font-light text-text-3">
            تمام حقوق مادی و معنوی این وبسایت محفوظ هست
            <br />
            <span className="font-mont" dir="ltr">
              All Rights Reserved. 2026
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export function AuthHeader({
  title,
  eyebrow,
  description,
}: {
  title: string;
  eyebrow: string;
  description?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2 text-right">
      <h1 className="text-2xl font-semibold">{title}</h1>
      <span className="font-mont text-xs tracking-[.3em] text-text-3 uppercase">
        {eyebrow}
      </span>
      {description}
    </div>
  );
}
