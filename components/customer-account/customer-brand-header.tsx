export function CustomerBrandHeader({
  businessName,
  subtitle,
}: {
  businessName: string;
  subtitle: string;
}) {
  return (
    <div className="flex flex-col items-center gap-2.5 px-8 pt-8.5 pb-4.5 text-center">
      <div className="flex h-[74px] w-[74px] items-center justify-center rounded-[24px] bg-card text-lg font-bold text-brand shadow-float">
        {businessName.slice(0, 3)}
      </div>
      <span className="text-lg font-medium">{businessName}</span>
      <p className="text-[12.5px] font-light leading-7 text-text-3">{subtitle}</p>
    </div>
  );
}
