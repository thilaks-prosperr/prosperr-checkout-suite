import type { TimelineEvent } from "@/lib/mock-data";
import { Check, Clock, Send, Shield, CreditCard, AlertTriangle, RefreshCw } from "lucide-react";

const iconMap: Record<string, React.ReactNode> = {
  INITIATED: <Clock size={14} />,
  OTP_SENT: <Send size={14} />,
  OTP_VERIFIED: <Shield size={14} />,
  AWAITING_APPROVAL: <Clock size={14} />,
  APPROVED: <Check size={14} />,
  REJECTED: <AlertTriangle size={14} />,
  SELF_APPROVED: <AlertTriangle size={14} />,
  LINK_GENERATED: <Send size={14} />,
  PAYMENT_PENDING: <CreditCard size={14} />,
  PAYMENT_COMPLETED: <Check size={14} />,
  FAILED: <AlertTriangle size={14} />,
  DRAFT: <Clock size={14} />,
  EXPIRED: <Clock size={14} />,
};

interface SessionTimelineProps {
  events: TimelineEvent[];
  dark?: boolean;
}

const SessionTimeline = ({ events, dark }: SessionTimelineProps) => {
  const lineColor = dark ? "bg-sales-border" : "bg-border";
  const dotBg = dark ? "bg-sales-surface border-sales-accent" : "bg-background border-primary";
  const textColor = dark ? "text-sales-foreground" : "text-foreground";
  const mutedColor = dark ? "text-sales-muted" : "text-muted-foreground";

  return (
    <div className="space-y-0">
      {events.map((event, index) => {
        const isHubspot = event.event.toLowerCase().includes("hubspot");
        return (
          <div key={index} className="flex gap-3 relative">
            {index < events.length - 1 && (
              <div className={`absolute left-[11px] top-7 w-0.5 h-[calc(100%-4px)] ${lineColor}`} />
            )}
            <div className={`w-6 h-6 rounded-full border-2 ${dotBg} flex items-center justify-center shrink-0 z-10`}>
              <span className={dark ? "text-sales-accent" : "text-primary"}>
                {isHubspot ? <RefreshCw size={14} /> : iconMap[event.status]}
              </span>
            </div>
            <div className="pb-5">
              <p className={`text-sm font-medium ${textColor}`}>{event.event}</p>
              <p className={`text-xs ${mutedColor}`}>{event.time}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SessionTimeline;
