import type { SessionStatus } from "@/lib/mock-data";
import { AlertTriangle } from "lucide-react";

const statusConfig: Record<SessionStatus, { label: string; bg: string; text: string; dot: string; pulse?: boolean }> = {
  INITIATED: { label: "Initiated", bg: "bg-muted", text: "text-muted-foreground", dot: "bg-muted-foreground" },
  OTP_SENT: { label: "OTP Sent", bg: "bg-secondary", text: "text-secondary-foreground", dot: "bg-primary-light" },
  OTP_VERIFIED: { label: "OTP Verified", bg: "bg-secondary", text: "text-secondary-foreground", dot: "bg-primary-light" },
  AWAITING_APPROVAL: { label: "Awaiting Approval", bg: "bg-muted", text: "text-muted-foreground", dot: "bg-prosperr-gold", pulse: true },
  APPROVED: { label: "Approved", bg: "bg-primary-lighter", text: "text-primary", dot: "bg-primary" },
  REJECTED: { label: "Rejected", bg: "bg-destructive/10", text: "text-destructive", dot: "bg-destructive" },
  SELF_APPROVED: { label: "Self-Approved", bg: "bg-muted", text: "text-muted-foreground", dot: "bg-prosperr-gold" },
  LINK_GENERATED: { label: "Link Generated", bg: "bg-primary-lighter", text: "text-primary", dot: "bg-primary" },
  PAYMENT_PENDING: { label: "Payment Pending", bg: "bg-muted", text: "text-muted-foreground", dot: "bg-prosperr-gold", pulse: true },
  PAYMENT_COMPLETED: { label: "Completed", bg: "bg-primary-lighter", text: "text-primary", dot: "bg-primary" },
  FAILED: { label: "Failed", bg: "bg-destructive/10", text: "text-destructive", dot: "bg-destructive" },
  DRAFT: { label: "Draft", bg: "bg-muted", text: "text-muted-foreground", dot: "bg-muted-foreground" },
  EXPIRED: { label: "Expired", bg: "bg-muted", text: "text-muted-foreground", dot: "bg-muted-foreground" },
};

const darkStatusConfig: Record<string, { bg: string; text: string; dot: string }> = {
  INITIATED: { bg: "bg-prosperr-navy-600", text: "text-prosperr-gray-300", dot: "bg-prosperr-gray-400" },
  OTP_SENT: { bg: "bg-prosperr-blue-800/40", text: "text-prosperr-blue-200", dot: "bg-prosperr-blue-200" },
  OTP_VERIFIED: { bg: "bg-prosperr-blue-800/40", text: "text-prosperr-blue-200", dot: "bg-prosperr-blue-200" },
  AWAITING_APPROVAL: { bg: "bg-prosperr-gold/20", text: "text-prosperr-gold-light", dot: "bg-prosperr-gold-light" },
  APPROVED: { bg: "bg-prosperr-green-500/20", text: "text-prosperr-green-300", dot: "bg-prosperr-green-300" },
  REJECTED: { bg: "bg-red-900/40", text: "text-red-300", dot: "bg-red-400" },
  SELF_APPROVED: { bg: "bg-prosperr-gold/20", text: "text-prosperr-gold-light", dot: "bg-prosperr-gold-light" },
  LINK_GENERATED: { bg: "bg-prosperr-green-500/20", text: "text-prosperr-green-300", dot: "bg-prosperr-green-300" },
  PAYMENT_PENDING: { bg: "bg-prosperr-gold/20", text: "text-prosperr-gold-light", dot: "bg-prosperr-gold-light" },
  PAYMENT_COMPLETED: { bg: "bg-prosperr-green-500/20", text: "text-prosperr-green-300", dot: "bg-prosperr-green-300" },
  FAILED: { bg: "bg-red-900/40", text: "text-red-300", dot: "bg-red-400" },
  DRAFT: { bg: "bg-prosperr-navy-600", text: "text-prosperr-gray-300", dot: "bg-prosperr-gray-400" },
  EXPIRED: { bg: "bg-prosperr-navy-600", text: "text-prosperr-gray-300", dot: "bg-prosperr-gray-400" },
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
        <AlertTriangle size={12} className="text-prosperr-gold-light" />
      )}
    </span>
  );
};

export default SessionStatusChip;
