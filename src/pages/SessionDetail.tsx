import { useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, AlertTriangle, Save, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import SalesNavbar from "@/components/SalesNavbar";
import SessionStatusChip from "@/components/SessionStatusChip";
import SessionTimeline from "@/components/SessionTimeline";
import ApprovalTimer from "@/components/ApprovalTimer";
import ShareLinkBox from "@/components/ShareLinkBox";
import { mockSession, getSessionShortId, formatINR, formatMobile, formatDate } from "@/lib/mock-data";
import type { SessionStatus } from "@/lib/mock-data";

const SessionDetail = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const session = mockSession;

  const [status, setStatus] = useState<SessionStatus>("AWAITING_APPROVAL");
  const [timedOut, setTimedOut] = useState(false);
  const [showSelfApproveModal, setShowSelfApproveModal] = useState(false);
  const [approvedBy, setApprovedBy] = useState<string | null>(null);
  const [selfApproved, setSelfApproved] = useState(false);

  const timeline = [...session.timeline];
  if (approvedBy) {
    timeline.push({ event: `Approved by ${approvedBy}`, time: "2:37 PM", status: "APPROVED" });
    timeline.push({ event: "Payment link generated", time: "2:37 PM", status: "PAYMENT_LINK_GENERATED" });
  }
  if (selfApproved) {
    timeline.push({ event: "Approval timeout", time: "2:39 PM", status: "TIMEOUT" });
    timeline.push({ event: `Self-approved by ${session.bdaName}`, time: "2:40 PM", status: "SELF_APPROVED" });
    timeline.push({ event: "Payment link generated", time: "2:40 PM", status: "PAYMENT_LINK_GENERATED" });
  }

  // Simulate approval after 8 seconds for demo
  const handleTimeout = useCallback(() => {
    setTimedOut(true);
  }, []);

  const handleSimulateApproval = () => {
    setApprovedBy("Rahul M.");
    setStatus("PAYMENT_LINK_GENERATED");
  };

  const handleSelfApprove = () => {
    setSelfApproved(true);
    setStatus("SELF_APPROVED");
    setShowSelfApproveModal(false);
  };

  const handleSaveDraft = () => {
    setStatus("DRAFT");
  };

  const isLinkGenerated = status === "PAYMENT_LINK_GENERATED" || status === "SELF_APPROVED";

  return (
    <div className="sales-portal">
      <SalesNavbar role="bda" />

      <div className="max-w-lg mx-auto px-6 py-8">
        <button
          onClick={() => navigate("/checkout/sales")}
          className="text-sm text-sales-accent flex items-center gap-1 mb-6"
        >
          <ArrowLeft size={16} /> Back
        </button>

        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="text-xs text-sales-muted">Session</p>
            <p className="text-lg font-bold text-sales-foreground">#{getSessionShortId(session.id)}</p>
            <p className="text-xs text-sales-muted mt-1">Created at {new Date(session.createdAt).toLocaleTimeString()}</p>
          </div>
          <SessionStatusChip status={status} selfApproved={selfApproved} dark />
        </div>

        {/* Prospect Details */}
        <div className="sales-card p-4 space-y-2 mb-4">
          <h3 className="text-sm font-semibold text-sales-foreground">Prospect Details</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <span className="text-sales-muted">Name</span>
            <span className="text-sales-foreground">{session.prospectName}</span>
            <span className="text-sales-muted">Mobile</span>
            <span className="text-sales-foreground">{formatMobile(session.prospectMobile)}</span>
            <span className="text-sales-muted">Email</span>
            <span className="text-sales-foreground">{session.prospectEmail}</span>
            <span className="text-sales-muted">Plan</span>
            <span className="text-sales-foreground">{session.categoryName}</span>
            <span className="text-sales-muted">Amount</span>
            <span className="text-sales-foreground font-semibold">{formatINR(session.payableAmount)}</span>
          </div>
        </div>

        {/* Approval Section */}
        {status === "AWAITING_APPROVAL" && !timedOut && (
          <div className="sales-card p-5 mb-4 space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-amber-400 text-lg">⏳</span>
              <h3 className="font-semibold text-sales-foreground">Awaiting Approval</h3>
            </div>
            <p className="text-sm text-sales-muted">
              A superior needs to approve this session before the payment link is generated.
            </p>

            <ApprovalTimer
              totalSeconds={180}
              startedAt={session.approvalRequestedAt}
              onTimeout={handleTimeout}
              dark
            />

            <p className="text-xs text-sales-muted">
              Notified: {session.superiors.join(", ")}
            </p>

            {/* Demo: simulate approval */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleSimulateApproval}
              className="border-sales-border text-sales-accent text-xs"
            >
              🎬 Demo: Simulate Approval
            </Button>
          </div>
        )}

        {/* Timeout options */}
        {status === "AWAITING_APPROVAL" && timedOut && !selfApproved && status !== "DRAFT" && (
          <div className="sales-card p-5 mb-4 space-y-4">
            <div className="flex items-center gap-2">
              <AlertTriangle size={20} className="text-amber-400" />
              <h3 className="font-semibold text-sales-foreground">Approval Timeout</h3>
            </div>
            <p className="text-sm text-sales-muted">
              No superior responded in 3 minutes. What would you like to do?
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleSaveDraft}
                className="flex-1 border-sales-border text-sales-muted gap-2"
              >
                <Save size={16} /> Save as Draft
              </Button>
              <Button
                onClick={() => setShowSelfApproveModal(true)}
                className="flex-1 bg-amber-600 hover:bg-amber-700 text-white gap-2"
              >
                <ShieldAlert size={16} /> Proceed on My Approval
              </Button>
            </div>
          </div>
        )}

        {/* Approved banner */}
        {approvedBy && (
          <div className="rounded-lg bg-emerald-900/30 border border-emerald-700/30 p-4 mb-4 text-sm text-emerald-300 flex items-center gap-2">
            ✓ Approved by {approvedBy}
          </div>
        )}

        {/* Self-approved warning */}
        {selfApproved && (
          <div className="rounded-lg bg-orange-900/30 border border-orange-700/30 p-4 mb-4 text-sm text-orange-300 flex items-center gap-2">
            <AlertTriangle size={16} /> Self-approved — flagged for compliance review
          </div>
        )}

        {/* Draft saved */}
        {status === "DRAFT" && (
          <div className="sales-card p-5 mb-4 text-center">
            <p className="text-sales-muted text-sm">Session saved as draft. Expires in 24 hours.</p>
          </div>
        )}

        {/* Share Link */}
        {isLinkGenerated && (
          <div className="mb-4">
            <ShareLinkBox sessionId={session.id} mobile={session.prospectMobile} dark />
          </div>
        )}

        {/* Timeline */}
        <div className="sales-card p-5">
          <h3 className="text-sm font-semibold text-sales-foreground mb-4">Session Timeline</h3>
          <SessionTimeline events={timeline} dark />
        </div>
      </div>

      {/* Self-approve modal */}
      {showSelfApproveModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-6">
          <div className="sales-card p-6 max-w-sm space-y-4">
            <h3 className="font-semibold text-sales-foreground">⚠️ Self-Approval Confirmation</h3>
            <p className="text-sm text-sales-muted">
              By proceeding, you are approving this session yourself. This will be flagged and reviewed by compliance. Are you sure?
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowSelfApproveModal(false)}
                className="flex-1 border-sales-border text-sales-muted"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSelfApprove}
                className="flex-1 bg-amber-600 hover:bg-amber-700 text-white text-xs"
              >
                Yes, Proceed — I Take Responsibility
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SessionDetail;
