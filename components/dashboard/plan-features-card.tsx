import { Check } from "lucide-react";

function Feature({ text }: { text: string }) {
  return (
    <div className="flex items-center justify-end gap-2.5">
      <span className="text-sm font-light text-[#444]">{text}</span>
      <span className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full bg-[#E5F0E6]">
        <Check size={14} className="text-brand" />
      </span>
    </div>
  );
}

export function PlanFeaturesCard({ maxUsers, featureLabels }: { maxUsers: number; featureLabels: string[] }) {
  return (
    <div className="flex flex-col gap-3.5 rounded-[22px] bg-card p-[24px_26px] shadow-[0px_8px_17.5px_rgba(0,0,0,0.03)]">
      <div className="text-right text-base font-semibold">امکانات پلن شما</div>
      {featureLabels.map((label) => (
        <Feature key={label} text={label} />
      ))}
      <Feature text={`${maxUsers.toLocaleString("fa-IR")} کاربر مدیر`} />
    </div>
  );
}
