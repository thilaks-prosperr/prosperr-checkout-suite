import { useState } from "react";
import SalesNavbar from "@/components/SalesNavbar";
import SalesLogin from "@/components/SalesLogin";
import ApprovalCard from "@/components/ApprovalCard";
import SessionStatusChip from "@/components/SessionStatusChip";
import { mockPendingApprovals, mockSessions, getSessionShortId, formatINR } from "@/lib/mock-data";

type Tab = "pending" | "history";

const ApprovalPortal = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [tab, setTab] = useState<Tab>("pending");
  const [pending, setPending] = useState(mockPendingApprovals);

  if (!loggedIn) {
    return <SalesLogin onLogin={() => setLoggedIn(true)} />;
  }

  const handleApprove = (sessionId: string) => {
    setPending((prev) => prev.filter((s) => s.id !== sessionId));
  };

  const handleReject = (sessionId: string, _reason: string) => {
    setPending((prev) => prev.filter((s) => s.id !== sessionId));
  };

  const tabBtn = (t: Tab, label: string, count?: number) => (
    <button
      onClick={() => setTab(t)}
      className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
        tab === t ? "text-sales-accent" : "text-sales-muted hover:text-sales-foreground"
      }`}
      style={tab === t ? { backgroundColor: "hsl(var(--green-500) / 0.1)" } : undefined}
    >
      {label}
      {count !== undefined && count > 0 && (
        <span className="ml-2 w-5 h-5 inline-flex items-center justify-center rounded-full bg-sales-accent text-[10px] font-bold text-sales-accent-foreground">
          {count}
        </span>
      )}
    </button>
  );

  return (
    <div className="sales-portal">
      <SalesNavbar role="superior" />

      <div className="max-w-2xl mx-auto px-6 py-8">
        <h1 className="text-xl font-bold text-sales-foreground mb-6">Approvals</h1>

        <div className="flex gap-2 mb-6">
          {tabBtn("pending", "Pending", pending.length)}
          {tabBtn("history", "History")}
        </div>

        {tab === "pending" && (
          <div className="space-y-4">
            {pending.length === 0 ? (
              <div className="sales-card p-8 text-center">
                <p className="text-sales-muted">No pending approvals 🎉</p>
              </div>
            ) : (
              pending.map((s) => (
                <ApprovalCard key={s.id} session={s} onApprove={handleApprove} onReject={handleReject} />
              ))
            )}
          </div>
        )}

        {tab === "history" && (
          <div className="space-y-2">
            {mockSessions.map((s) => (
              <div
                key={s.id}
                className={`sales-card p-4 flex items-center justify-between ${s.selfApproved ? "border-l-4" : ""}`}
                style={s.selfApproved ? { borderLeftColor: "hsl(var(--gold))" } : undefined}
              >
                <div className="space-y-1">
                  <p className="text-sm font-medium text-sales-foreground">
                    #{getSessionShortId(s.id)} · {s.prospectName}
                  </p>
                  <p className="text-xs text-sales-muted">
                    {s.bdaName} · {formatINR(s.payableAmount)} / {formatINR(s.planAmount)} · {((s.discountAmount / s.planAmount) * 100).toFixed(0)}% off
                  </p>
                  <p className="text-[10px] text-sales-muted">Flow: {s.flowType.replaceAll("_", " ")} · Source: {s.source}</p>
                </div>
                <SessionStatusChip status={s.status} selfApproved={s.selfApproved} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ApprovalPortal;
