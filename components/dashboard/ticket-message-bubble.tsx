import { FileText } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TicketMessageData {
  id: string;
  authorType: "OWNER" | "AGENT";
  authorName: string;
  text: string;
  attachmentUrl: string | null;
  attachmentName: string | null;
  createdAt: Date;
}

function timeLabel(d: Date) {
  return d.toLocaleString("fa-IR", { dateStyle: "short", timeStyle: "short" });
}

export function TicketMessageBubble({ message }: { message: TicketMessageData }) {
  const mine = message.authorType === "OWNER";

  return (
    <div className={cn("flex flex-col gap-1.5", mine ? "items-end" : "items-start")}>
      <div className={cn("flex items-center gap-2", mine ? "flex-row-reverse" : "flex-row")}>
        <div
          className={cn(
            "flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-[9px] text-xs font-semibold",
            mine ? "bg-[#E5F0E6] text-brand" : "bg-[#EEF0F2] text-[#7A7A7A]"
          )}
        >
          {message.authorName.slice(0, 1)}
        </div>
        <span className="text-xs font-medium">{message.authorName}</span>
        <span className="text-[11px] font-light text-text-3">{timeLabel(message.createdAt)}</span>
      </div>
      <div
        className={cn(
          "max-w-[88%] rounded-2xl px-4 py-3.5 text-right text-sm leading-[2] font-light sm:max-w-[70%]",
          mine ? "rounded-br-[4px] bg-brand text-white" : "rounded-bl-[4px] border border-[#EEE] bg-card text-[#333]"
        )}
      >
        {message.text}
        {message.attachmentUrl && (
          <a
            href={message.attachmentUrl}
            target="_blank"
            rel="noreferrer"
            className={cn(
              "mt-3 flex items-center gap-2.5 rounded-[10px] px-3 py-2",
              mine ? "bg-white/16" : "bg-[#F6F6F6]"
            )}
          >
            <FileText size={18} className={mine ? "text-white" : "text-[#5A5A5A]"} />
            <span className="text-xs">{message.attachmentName ?? "پیوست"}</span>
          </a>
        )}
      </div>
    </div>
  );
}
