import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, RefreshCw, CheckCircle2 } from "lucide-react";
import SessionStatusChip from "@/components/SessionStatusChip";
import SalesLogin from "@/components/SalesLogin";
import SalesNavbar from "@/components/SalesNavbar";
import { mockSessions, getSessionShortId, formatINR } from "@/lib/mock-data";

const SalesPortal = () => {
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false);

  if (!loggedIn) {
    return <SalesLogin onLogin={() => setLoggedIn(true)} />;
  }

  return (
    <div className="sales-portal">
      <SalesNavbar role="bda" />

      <div className="max-w-4xl mx-auto px-6 py-8">
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
              </div>
              <div className="flex items-center gap-2">
                {/* HubSpot chip */}
                {s.hubspotSynced ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ backgroundColor: "hsl(var(--green-500) / 0.15)", color: "hsl(var(--green-300))" }}>
                    HS <CheckCircle2 size={10} />
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ backgroundColor: "hsl(var(--navy-500) / 0.5)", color: "hsl(var(--gray-400))" }}>
                    HS —
                  </span>
                )}
                <SessionStatusChip status={s.status} selfApproved={s.selfApproved} dark />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SalesPortal;
