import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, RefreshCw } from "lucide-react";
import ProsperrLogo from "@/components/ProsperrLogo";
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
          <button
            onClick={() => navigate("/checkout/sales/new-session")}
            className="sales-card sales-card-hover p-8 text-left transition-colors"
          >
            <div className="w-12 h-12 rounded-lg bg-sales-accent/10 flex items-center justify-center mb-4">
              <Plus size={24} className="text-sales-accent" />
            </div>
            <h3 className="text-lg font-semibold text-sales-foreground">New Customer</h3>
            <p className="text-sm text-sales-muted mt-1">Create a session for a new prospect</p>
          </button>

          <button
            onClick={() => navigate("/checkout/sales/renewal")}
            className="sales-card sales-card-hover p-8 text-left transition-colors"
          >
            <div className="w-12 h-12 rounded-lg bg-sales-accent/10 flex items-center justify-center mb-4">
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
              className="sales-card sales-card-hover w-full p-4 text-left transition-colors flex items-center justify-between"
            >
              <div className="space-y-1">
                <p className="font-medium text-sales-foreground">{s.prospectName}</p>
                <p className="text-xs text-sales-muted">#{getSessionShortId(s.id)} · {formatINR(s.payableAmount)}</p>
              </div>
              <SessionStatusChip status={s.status} selfApproved={s.selfApproved} dark />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SalesPortal;
