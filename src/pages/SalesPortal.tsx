import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, RefreshCw, CheckCircle2, Clock3, XCircle, ShieldAlert } from "lucide-react";
import SessionStatusChip from "@/components/SessionStatusChip";
import SalesLogin from "@/components/SalesLogin";
import SalesNavbar from "@/components/SalesNavbar";
import ApprovalCard from "@/components/ApprovalCard";
import { mockSessions, mockPendingApprovals, getSessionShortId, formatINR } from "@/lib/mock-data";

const SalesPortal = () => {
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false);
  const [role, setRole] = useState<"bda" | "superior">("bda");
  const [tab, setTab] = useState<"sessions" | "approvals">("sessions");
  const [pendingApprovals, setPendingApprovals] = useState(mockPendingApprovals);

  const approvalHistory = mockSessions
    .filter((s) => ["APPROVED", "REJECTED", "SELF_APPROVED", "FAILED", "PAYMENT_COMPLETED", "DRAFT"].includes(s.status))
    .map((s) => {
      const isRejected = s.status === "REJECTED" || s.status === "FAILED";
      const isSelfApproved = s.status === "SELF_APPROVED" || Boolean(s.selfApproved);
      const approvedBy = s.approvedBy ?? (isSelfApproved ? s.bdaName : "Supervisor");
      return {
        id: s.id,
        prospectName: s.prospectName,
        amount: s.payableAmount,
        decision: isRejected ? "REJECTED" : isSelfApproved ? "SELF_APPROVED" : "APPROVED",
        actor: approvedBy,
        reason: s.rejectionReason || s.selfApprovalReason || s.notes || "No notes",
      };
    });

  if (!loggedIn) {
    return <SalesLogin onLogin={(r) => { setRole(r || "bda"); setLoggedIn(true); }} />;
  }

  const canApprove = role === "superior";

  const handleApprove = (sessionId: string) => {
    setPendingApprovals((prev) => prev.filter((s) => s.id !== sessionId));
  };

  const handleReject = (sessionId: string, _reason: string) => {
    setPendingApprovals((prev) => prev.filter((s) => s.id !== sessionId));
  };

  return (
    <div className="sales-portal">
      <SalesNavbar role={role} />

      <div className="max-w-4xl mx-auto px-6 py-8">
        {canApprove && (
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setTab("sessions")}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                tab === "sessions" ? "text-sales-accent bg-sales-accent/10" : "text-sales-muted hover:text-sales-foreground"
              }`}
            >
              Sessions
            </button>
            <button
              onClick={() => setTab("approvals")}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                tab === "approvals" ? "text-sales-accent bg-sales-accent/10" : "text-sales-muted hover:text-sales-foreground"
              }`}
            >
              Approvals
              {pendingApprovals.length > 0 && (
                <span className="ml-2 w-5 h-5 inline-flex items-center justify-center rounded-full bg-sales-accent text-[10px] font-bold text-sales-accent-foreground">
                  {pendingApprovals.length}
                </span>
              )}
            </button>
          </div>
        )}

        {tab === "approvals" && canApprove && (
          <div className="space-y-4 mb-10">
            {pendingApprovals.length === 0 ? (
              <div className="sales-card p-8 text-center">
                <p className="text-sales-muted">No pending approvals</p>
              </div>
            ) : (
              pendingApprovals.map((s) => (
                <ApprovalCard key={s.id} session={s} onApprove={handleApprove} onReject={handleReject} />
              ))
            )}

            <div className="pt-2">
              <h2 className="text-lg font-semibold text-sales-foreground mb-3">Approval History</h2>
              <div className="space-y-3">
                {approvalHistory.length === 0 ? (
                  <div className="sales-card p-5 text-center text-sales-muted text-sm">No approval history yet</div>
                ) : (
                  approvalHistory.map((item) => (
                    <div key={item.id} className="sales-card p-4 flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-sales-foreground">{item.prospectName}</p>
                        <p className="text-xs text-sales-muted">#{getSessionShortId(item.id)} · {formatINR(item.amount)}</p>
                        <p className="text-xs text-sales-muted">By: {item.actor}</p>
                        <p className="text-xs text-sales-muted">Note: {item.reason}</p>
                      </div>
                      <span
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold"
                        style={
                          item.decision === "APPROVED"
                            ? { backgroundColor: "hsl(var(--green-500) / 0.15)", color: "hsl(var(--green-300))" }
                            : item.decision === "SELF_APPROVED"
                            ? { backgroundColor: "hsl(var(--gold) / 0.2)", color: "hsl(var(--gold-light))" }
                            : { backgroundColor: "hsl(var(--destructive) / 0.15)", color: "hsl(var(--destructive))" }
                        }
                      >
                        {item.decision === "APPROVED" ? <CheckCircle2 size={12} /> : item.decision === "SELF_APPROVED" ? <ShieldAlert size={12} /> : <XCircle size={12} />}
                        {item.decision.replaceAll("_", " ")}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {tab === "sessions" && (
          <>
        {/* Action cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          <button onClick={() => navigate("/checkout/sales/new-session")} className="sales-card sales-card-hover p-8 text-left transition-colors">
            <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: "hsl(var(--green-500) / 0.1)" }}>
              <Plus size={24} className="text-sales-accent" />
            </div>
            <h3 className="text-lg font-semibold text-sales-foreground">New Customer</h3>
            <p className="text-sm text-sales-muted mt-1">Create a session for a new prospect</p>
          </button>

          <button onClick={() => navigate("/checkout/sales/renewal")} className="sales-card sales-card-hover p-8 text-left transition-colors">
            <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: "hsl(var(--green-500) / 0.1)" }}>
              <RefreshCw size={24} className="text-sales-accent" />
            </div>
            <h3 className="text-lg font-semibold text-sales-foreground">Renewal</h3>
            <p className="text-sm text-sales-muted mt-1">Extend or renew existing subscriber</p>
          </button>
        </div>

        {/* Recent sessions */}
        <h2 className="text-lg font-semibold text-sales-foreground mb-4">My Recent Sessions</h2>
        <div className="space-y-3">
          {mockSessions.map((s) => (
            <button
              key={s.id}
              onClick={() => navigate(`/checkout/sales/session/${s.id}`)}
              className={`sales-card sales-card-hover w-full p-4 text-left transition-colors flex items-center justify-between ${
                s.selfApproved ? "border-l-4" : ""
              }`}
              style={s.selfApproved ? { borderLeftColor: "hsl(var(--gold))" } : undefined}
            >
              <div className="space-y-1">
                <p className="font-medium text-sales-foreground">{s.prospectName}</p>
                <p className="text-xs text-sales-muted">
                  #{getSessionShortId(s.id)} · {formatINR(s.payableAmount)} / {formatINR(s.planAmount)}
                </p>
                <p className="text-[10px] text-sales-muted">Flow: {s.flowType.replaceAll("_", " ")}</p>
              </div>
              <div className="flex items-center gap-2">
                {/* HubSpot chip */}
                {s.hubspotSyncStatus === "PUSHED" || s.hubspotSyncStatus === "LINKED" ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ backgroundColor: "hsl(var(--green-500) / 0.15)", color: "hsl(var(--green-300))" }}>
                    HS <CheckCircle2 size={10} />
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ backgroundColor: "hsl(var(--gray-100))", color: "hsl(var(--gray-500))" }}>
                    HS —
                  </span>
                )}
                <SessionStatusChip status={s.status} selfApproved={s.selfApproved} />
              </div>
            </button>
          ))}
        </div>

        <div className="mt-10">
          <h2 className="text-lg font-semibold text-sales-foreground mb-3 flex items-center gap-2">
            <Clock3 size={18} className="text-sales-accent" />
            Approval History
          </h2>
          <div className="space-y-3">
            {approvalHistory.length === 0 ? (
              <div className="sales-card p-5 text-center text-sales-muted text-sm">No approval history yet</div>
            ) : (
              approvalHistory.map((item) => (
                <div key={item.id} className="sales-card p-4 flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-sales-foreground">{item.prospectName}</p>
                    <p className="text-xs text-sales-muted">#{getSessionShortId(item.id)} · {formatINR(item.amount)}</p>
                    <p className="text-xs text-sales-muted">By: {item.actor}</p>
                    <p className="text-xs text-sales-muted">Note: {item.reason}</p>
                  </div>
                  <span
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold"
                    style={
                      item.decision === "APPROVED"
                        ? { backgroundColor: "hsl(var(--green-500) / 0.15)", color: "hsl(var(--green-300))" }
                        : item.decision === "SELF_APPROVED"
                        ? { backgroundColor: "hsl(var(--gold) / 0.2)", color: "hsl(var(--gold-light))" }
                        : { backgroundColor: "hsl(var(--destructive) / 0.15)", color: "hsl(var(--destructive))" }
                    }
                  >
                    {item.decision === "APPROVED" ? <CheckCircle2 size={12} /> : item.decision === "SELF_APPROVED" ? <ShieldAlert size={12} /> : <XCircle size={12} />}
                    {item.decision.replaceAll("_", " ")}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SalesPortal;
