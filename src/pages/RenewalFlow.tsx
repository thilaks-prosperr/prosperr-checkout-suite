import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import SalesNavbar from "@/components/SalesNavbar";
import SubscriberCard from "@/components/SubscriberCard";
import { mockSubscriber, planOptions, formatINR, formatDate } from "@/lib/mock-data";

const RenewalFlow = () => {
  const navigate = useNavigate();
  const [mobile, setMobile] = useState("");
  const [subscriber, setSubscriber] = useState<typeof mockSubscriber | null>(null);
  const [searching, setSearching] = useState(false);
  const [form, setForm] = useState({
    planId: "",
    payableAmount: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);

  const handleLookup = () => {
    setSearching(true);
    setTimeout(() => {
      setSearching(false);
      setSubscriber(mockSubscriber);
    }, 1000);
  };

  const selectedPlan = planOptions.find((p) => p.id === form.planId);
  const belowMin = selectedPlan ? Number(form.payableAmount) < selectedPlan.minPrice : false;

  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate(`/checkout/sales/session/01HRX5K2J8NQPWXYZ`);
    }, 1500);
  };

  const inputClasses = "bg-sales-surface border-sales-border text-sales-foreground placeholder:text-sales-muted";

  return (
    <div className="sales-portal">
      <SalesNavbar role="bda" />

      <div className="max-w-lg mx-auto px-6 py-8">
        <button
          onClick={() => navigate("/checkout/sales")}
          className="text-sm text-sales-accent flex items-center gap-1 mb-6"
        >
          <ArrowLeft size={16} /> Back to Dashboard
        </button>

        <h1 className="text-xl font-bold text-sales-foreground mb-6">Renewal</h1>

        {/* Lookup */}
        <div className="space-y-3 mb-6">
          <label className="text-sm text-sales-muted">Enter subscriber's mobile number</label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sales-muted text-sm">+91</span>
              <Input
                value={mobile}
                onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
                placeholder="10-digit mobile"
                className={`pl-12 ${inputClasses}`}
              />
            </div>
            <Button
              onClick={handleLookup}
              disabled={mobile.length !== 10 || searching}
              className="bg-sales-accent text-sales-accent-foreground hover:bg-sales-accent/90 gap-2"
            >
              {searching ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Search size={16} />
              )}
              Lookup
            </Button>
          </div>
        </div>

        {subscriber && (
          <div className="space-y-6">
            <SubscriberCard subscriber={subscriber} dark />

            <div className="space-y-4">
              <div>
                <label className="text-sm text-sales-muted mb-1 block">Renewal Start Date</label>
                <div className={`h-10 rounded-md px-3 flex items-center text-sm bg-sales-bg border border-sales-border text-sales-muted`}>
                  {formatDate(subscriber.expiresAt)} (from original end date — non-editable)
                </div>
              </div>

              <div>
                <label className="text-sm text-sales-muted mb-1 block">Plan</label>
                <select
                  value={form.planId}
                  onChange={(e) => {
                    const plan = planOptions.find((p) => p.id === e.target.value);
                    setForm({ ...form, planId: e.target.value, payableAmount: plan ? String(plan.discountedPrice) : "" });
                  }}
                  className={`w-full h-10 rounded-md px-3 text-sm ${inputClasses} border`}
                >
                  <option value="">Select a plan</option>
                  {planOptions.map((p) => (
                    <option key={p.id} value={p.id}>{p.name} — {formatINR(p.discountedPrice)}</option>
                  ))}
                </select>
              </div>

              {selectedPlan && (
                <div>
                  <label className="text-sm text-sales-muted mb-1 block">Payable Amount</label>
                  <Input
                    type="number"
                    value={form.payableAmount}
                    onChange={(e) => setForm({ ...form, payableAmount: e.target.value })}
                    className={`${inputClasses} ${belowMin ? "border-red-500" : ""}`}
                  />
                  <p className="text-xs text-sales-muted mt-1">
                    Min: {formatINR(selectedPlan.minPrice)} · Max: {formatINR(selectedPlan.maxPrice)}
                  </p>
                  {belowMin && <p className="text-xs text-red-400 mt-1">Below minimum — requires approval</p>}
                </div>
              )}

              <div>
                <label className="text-sm text-sales-muted mb-1 block">Notes for approver</label>
                <Textarea
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="Context for approval..."
                  className={`${inputClasses} min-h-[80px]`}
                />
              </div>

              <Button
                onClick={handleSubmit}
                disabled={!form.planId || loading}
                className="w-full h-12 bg-sales-accent text-sales-accent-foreground hover:bg-sales-accent/90 gap-2"
              >
                {loading ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Send size={16} />
                )}
                {loading ? "Creating..." : "Generate Session & Request Approval"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RenewalFlow;
