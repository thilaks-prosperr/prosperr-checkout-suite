import type { SessionStatus } from "@/lib/mock-data";
import { AlertTriangle } from "lucide-react";

const statusConfig: Record<SessionStatus, { label: string; bg: string; text: string; dot: string; pulse?: boolean }> = {
  INITIATED: { label: "Initiated", bg: "bg-muted", text: "text-muted-foreground", dot: "bg-muted-foreground" },
  OTP_SENT: { label: "OTP Sent", bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500" },
  OTP_VERIFIED: { label: "OTP Verified", bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500" },
  AWAITING_APPROVAL: { label: "Awaiting Approval", bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500", pulse: true },
  APPROVED: { label: "Approved", bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
  REJECTED: { label: "Rejected", bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500" },
  SELF_APPROVED: { label: "Self-Approved", bg: "bg-orange-50", text: "text-orange-700", dot: "bg-orange-500" },
  PAYMENT_LINK_GENERATED: { label: "Link Generated", bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
  PAYMENT_PENDING: { label: "Payment Pending", bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500", pulse: true },
  PAYMENT_COMPLETED: { label: "Completed", bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
  PAYMENT_FAILED: { label: "Failed", bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500" },
  DRAFT: { label: "Draft", bg: "bg-muted", text: "text-muted-foreground", dot: "bg-muted-foreground" },
  EXPIRED: { label: "Expired", bg: "bg-muted", text: "text-muted-foreground", dot: "bg-muted-foreground" },
  TIMEOUT: { label: "Timeout", bg: "bg-muted", text: "text-muted-foreground", dot: "bg-muted-foreground" },
};

// Dark variant for sales portal
const darkStatusConfig: Record<string, { bg: string; text: string; dot: string }> = {
  INITIATED: { bg: "bg-slate-800", text: "text-slate-300", dot: "bg-slate-400" },
  OTP_SENT: { bg: "bg-blue-900/40", text: "text-blue-300", dot: "bg-blue-400" },
  OTP_VERIFIED: { bg: "bg-blue-900/40", text: "text-blue-300", dot: "bg-blue-400" },
  AWAITING_APPROVAL: { bg: "bg-amber-900/40", text: "text-amber-300", dot: "bg-amber-400" },
  APPROVED: { bg: "bg-emerald-900/40", text: "text-emerald-300", dot: "bg-emerald-400" },
  REJECTED: { bg: "bg-red-900/40", text: "text-red-300", dot: "bg-red-400" },
  SELF_APPROVED: { bg: "bg-orange-900/40", text: "text-orange-300", dot: "bg-orange-400" },
  PAYMENT_LINK_GENERATED: { bg: "bg-emerald-900/40", text: "text-emerald-300", dot: "bg-emerald-400" },
  PAYMENT_PENDING: { bg: "bg-amber-900/40", text: "text-amber-300", dot: "bg-amber-400" },
  PAYMENT_COMPLETED: { bg: "bg-emerald-900/40", text: "text-emerald-300", dot: "bg-emerald-400" },
  PAYMENT_FAILED: { bg: "bg-red-900/40", text: "text-red-300", dot: "bg-red-400" },
  DRAFT: { bg: "bg-slate-800", text: "text-slate-300", dot: "bg-slate-400" },
  EXPIRED: { bg: "bg-slate-800", text: "text-slate-300", dot: "bg-slate-400" },
  TIMEOUT: { bg: "bg-slate-800", text: "text-slate-300", dot: "bg-slate-400" },
};

interface SessionStatusChipProps {
  status: SessionStatus;
  selfApproved?: boolean;
  dark?: boolean;
}

const SessionStatusChip = ({ status, selfApproved, dark }: SessionStatusChipProps) => {
  const config = statusConfig[status];
  const darkConf = dark ? darkStatusConfig[status] : null;
  const bg = darkConf?.bg || config.bg;
  const text = darkConf?.text || config.text;
  const dot = darkConf?.dot || config.dot;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${bg} ${text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot} ${config.pulse ? "pulse-dot" : ""}`} />
      {config.label}
      {(selfApproved || status === "SELF_APPROVED") && (
        <AlertTriangle size={12} className="text-orange-500" />
      )}
    </span>
  );
};

export default SessionStatusChip;
