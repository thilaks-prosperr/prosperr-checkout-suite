import { formatDate, type Subscriber } from "@/lib/mock-data";
import { AlertTriangle, User } from "lucide-react";

interface SubscriberCardProps {
  subscriber: Subscriber;
  dark?: boolean;
}

const SubscriberCard = ({ subscriber, dark }: SubscriberCardProps) => {
  const bg = dark ? "bg-sales-surface border-sales-border" : "bg-primary-lighter border-primary/20";
  const textColor = dark ? "text-sales-foreground" : "text-foreground";
  const mutedColor = dark ? "text-sales-muted" : "text-muted-foreground";
  const warnBg = dark ? "bg-amber-900/30 border-amber-700/30" : "bg-amber-50 border-amber-200";
  const warnText = dark ? "text-amber-300" : "text-amber-700";

  return (
    <div className={`rounded-lg border-2 p-5 space-y-3 ${bg}`}>
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${dark ? "bg-sales-accent/20" : "bg-primary/10"}`}>
          <User size={20} className={dark ? "text-sales-accent" : "text-primary"} />
        </div>
        <div>
          <p className={`font-semibold ${textColor}`}>{subscriber.name}</p>
          <p className={`text-sm ${mutedColor}`}>+91 {subscriber.mobile.slice(0, 5)} XXXXX</p>
        </div>
      </div>

      <div className="space-y-1">
        <p className={`text-sm ${mutedColor}`}>Current Plan: <span className={`font-medium ${textColor}`}>{subscriber.plan}</span></p>
        <p className={`text-sm ${mutedColor}`}>Active since: {formatDate(subscriber.activeSince)}</p>
        <p className={`text-sm ${mutedColor}`}>
          Expires: {formatDate(subscriber.expiresAt)} ← <span className="font-medium">{subscriber.daysRemaining} days remaining</span>
        </p>
      </div>

      <div className={`rounded-md border p-3 ${warnBg}`}>
        <p className={`text-sm flex items-center gap-2 ${warnText}`}>
          <AlertTriangle size={14} />
          This user has an active subscription.
        </p>
        <p className={`text-xs mt-1 ${mutedColor}`}>
          Renewal will extend from: {formatDate(subscriber.expiresAt)}
        </p>
        <p className={`text-xs ${mutedColor}`}>
          New end date will be: {formatDate(new Date(new Date(subscriber.expiresAt).getTime() + 365 * 24 * 60 * 60 * 1000).toISOString())}
        </p>
      </div>
    </div>
  );
};

export default SubscriberCard;
