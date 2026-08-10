import { Wallet } from "lucide-react";
import { ServerToggle } from "@/components/dashboard/server-toggle";
import { toggleGatewayEnabledAction } from "@/features/superadmin/routes/actions";

export function GatewayStatusRow({
  connected,
  enabled,
}: {
  connected: boolean;
  enabled: boolean;
}) {
  return (
    <div
      className="flex items-center justify-between gap-3 rounded-2xl border p-[14px_16px]"
      style={{ borderColor: enabled ? "#EFEFEF" : "#F0F0F0", background: enabled ? "#FAFBFA" : "#fff" }}
    >
      <div className="flex items-center gap-3">
        <div
          className="flex h-[42px] w-[42px] items-center justify-center rounded-xl"
          style={{ background: enabled ? "#EAF3EB" : "#F4F5F4" }}
        >
          <Wallet size={20} className={enabled ? "text-brand" : "text-[#9A9A9A]"} />
        </div>
        <div className="text-right">
          <div className="text-sm font-medium">زرین‌پال</div>
          <div className="mt-0.5 text-[11px] font-light text-text-3">
            {connected ? "متصل · درگاه اصلی دریافت حق اشتراک" : "هنوز اتصالی تست نشده است"}
          </div>
        </div>
      </div>
      <ServerToggle initial={enabled} action={toggleGatewayEnabledAction} />
    </div>
  );
}
