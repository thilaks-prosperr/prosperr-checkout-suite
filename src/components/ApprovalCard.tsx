import { useState } from "react";
import { formatINR, maskMobile, type CheckoutSession, getSessionShortId } from "@/lib/mock-data";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import ApprovalTimer from "./ApprovalTimer";
import SessionStatusChip from "./SessionStatusChip";

interface ApprovalCardProps {
  session: CheckoutSession;
  onApprove: (sessionId: string) => void;
  onReject: (sessionId: string, reason: string) => void;
}

const rejectionReasons = [
  "Price too low",
  "Incomplete info",
  "Prospect not verified",
  "Other",
];

const ApprovalCard = ({ session, onApprove, onReject }: ApprovalCardProps) => {
  const [showReject, setShowReject] = useState(false);
  const [reason, setReason] = useState("");
  const [timedOut, setTimedOut] = useState(false);
  const [approved, setApproved] = useState(false);

  const discountPercent = ((session.discountAmount / session.planAmount) * 100).toFixed(1);
  const isBelowMin = session.payableAmount < 5000;

  const handleApprove = () => {
    setApproved(true);
    onApprove(session.id);
  };

  const handleReject = () => {
    if (reason) {
      onReject(session.id, reason);
    }
  };

  if (approved) {
    return (
      <div className="sales-card p-6 text-center space-y-3">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto" style={{ backgroundColor: "hsl(var(--green-500) / 0.2)" }}>
          <Check size={32} style={{ color: "hsl(var(--green-300))" }} />
        </div>
        <h3 className="text-lg font-semibold text-sales-foreground">Approved</h3>
        <p className="text-sm text-sales-muted">Session #{getSessionShortId(session.id)} has been approved.</p>
      </div>
    );
  }

  return (
    <div className="sales-card p-6 space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-sales-muted flex items-center gap-1.5">
            <span style={{ color: "hsl(var(--gold-light))" }}>🔔</span> New Approval Request
          </p>
          <p className="text-sm text-sales-muted mt-1">Session #{getSessionShortId(session.id)} · 2 min ago</p>
        </div>
        <SessionStatusChip status={session.status} />
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between text-sales-muted">
          <span>Sales Rep:</span>
          <span className="text-sales-foreground font-medium">{session.bdaName}</span>
        </div>
        <div className="flex justify-between text-sales-muted">
          <span>Prospect:</span>
          <span className="text-sales-foreground font-medium">{session.prospectName} ({maskMobile(session.prospectMobile)})</span>
        </div>
        <div className="flex justify-between text-sales-muted">
          <span>Plan:</span>
          <span className="text-sales-foreground font-medium">{session.categoryName}</span>
        </div>
        <div className="flex justify-between text-sales-muted">
          <span>Original Price:</span>
          <span className="text-sales-foreground">{formatINR(session.planAmount)}</span>
        </div>
        <div className="flex justify-between text-sales-muted">
          <span>Payable Amount:</span>
          <span className={`font-bold ${isBelowMin ? "text-red-400" : "text-sales-foreground"}`}>
            {formatINR(session.payableAmount)}
            {isBelowMin && " ← below min cap"}
          </span>
        </div>
        <div className="flex justify-between text-sales-muted">
          <span>Discount:</span>
          <span style={{ color: "hsl(var(--gold-light))" }} className="font-medium">{formatINR(session.discountAmount)} ({discountPercent}% off)</span>
        </div>
        {session.hubspotContactId && (
          <div className="flex justify-between text-sales-muted">
            <span>HubSpot ID:</span>
            <span className="text-sales-foreground font-mono text-xs">{session.hubspotContactId}</span>
          </div>
        )}
      </div>

      {session.notes && (
        <div className="rounded-md p-3 bg-muted">
          <p className="text-xs text-sales-muted mb-1">Notes:</p>
          <p className="text-sm text-sales-foreground italic">"{session.notes}"</p>
        </div>
      )}

      {!timedOut && (
        <ApprovalTimer totalSeconds={180} startedAt={session.approvalRequestedAt} onTimeout={() => setTimedOut(true)} />
      )}

      {timedOut ? (
        <p className="text-sm text-sales-muted text-center">⏱ Approval window has expired</p>
      ) : showReject ? (
        <div className="space-y-3">
          <p className="text-sm text-sales-foreground">Select rejection reason:</p>
          <div className="space-y-2">
            {rejectionReasons.map((r) => (
              <label key={r} className={`flex items-center gap-2 p-2 rounded-md cursor-pointer text-sm transition-colors ${reason === r ? "bg-red-100 text-red-700" : "text-sales-muted hover:bg-sales-surface-hover"}`}>
                <input type="radio" name="reject-reason" value={r} checked={reason === r} onChange={() => setReason(r)} className="accent-red-500" />
                {r}
              </label>
            ))}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => { setShowReject(false); setReason(""); }} className="flex-1 border-sales-border text-sales-muted">Cancel</Button>
            <Button onClick={handleReject} disabled={!reason} className="flex-1 bg-red-600 hover:bg-red-700 text-white">Confirm Rejection</Button>
          </div>
        </div>
      ) : (
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setShowReject(true)} className="flex-1 border-red-300 text-red-600 hover:bg-red-50 gap-2">
            <X size={16} /> Reject
          </Button>
          <Button onClick={handleApprove} className="flex-1 bg-sales-accent hover:bg-sales-accent/90 text-sales-accent-foreground gap-2">
            <Check size={16} /> Approve
          </Button>
        </div>
      )}
    </div>
  );
};

export default ApprovalCard;
