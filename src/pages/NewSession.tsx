import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import SalesNavbar from "@/components/SalesNavbar";
import { planOptions, formatINR } from "@/lib/mock-data";

const NewSession = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    mobile: "",
    email: "",
    planId: "",
    payableAmount: "",
    applyCoins: false,
    dueDate: "",
    preRenewal: false,
    notes: "",
  });
  const [loading, setLoading] = useState(false);

  const selectedPlan = planOptions.find((p) => p.id === form.planId);
  const payable = Number(form.payableAmount) || 0;
  const discount = selectedPlan ? selectedPlan.discountedPrice - payable : 0;
  const belowMin = selectedPlan ? payable < selectedPlan.minPrice : false;

  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate(`/checkout/sales/session/${mockSessionId}`);
    }, 1500);
  };

  const mockSessionId = "01HRX5K2J8NQPWXYZ";

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

        <h1 className="text-xl font-bold text-sales-foreground mb-6">New Assisted Session</h1>

        <div className="space-y-4">
          <div>
            <label className="text-sm text-sales-muted mb-1 block">Prospect Name</label>
            <Input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Full name"
              className={inputClasses}
            />
          </div>

          <div>
            <label className="text-sm text-sales-muted mb-1 block">Mobile Number</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sales-muted text-sm">+91</span>
              <Input
                value={form.mobile}
                onChange={(e) => setForm({ ...form, mobile: e.target.value.replace(/\D/g, "").slice(0, 10) })}
                placeholder="10-digit mobile"
                className={`pl-12 ${inputClasses}`}
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-sales-muted mb-1 block">Email (optional)</label>
            <Input
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="email@example.com"
              className={inputClasses}
            />
          </div>

          <div>
            <label className="text-sm text-sales-muted mb-1 block">Plan Type</label>
            <select
              value={form.planId}
              onChange={(e) => {
                const plan = planOptions.find((p) => p.id === e.target.value);
                setForm({
                  ...form,
                  planId: e.target.value,
                  payableAmount: plan ? String(plan.discountedPrice) : "",
                });
              }}
              className={`w-full h-10 rounded-md px-3 text-sm ${inputClasses} border`}
            >
              <option value="">Select a plan</option>
              {planOptions.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} — {formatINR(p.discountedPrice)}
                </option>
              ))}
            </select>
          </div>

          {selectedPlan && (
            <>
              <div>
                <label className="text-sm text-sales-muted mb-1 block">
                  Custom Payable Amount
                </label>
                <Input
                  type="number"
                  value={form.payableAmount}
                  onChange={(e) => setForm({ ...form, payableAmount: e.target.value })}
                  className={`${inputClasses} ${belowMin ? "border-red-500" : ""}`}
                />
                <p className="text-xs text-sales-muted mt-1">
                  Min: {formatINR(selectedPlan.minPrice)} · Max: {formatINR(selectedPlan.maxPrice)}
                </p>
                {belowMin && (
                  <p className="text-xs text-red-400 mt-1">Below minimum price — will require approval</p>
                )}
                {discount > 0 && (
                  <p className="text-xs text-sales-accent mt-1">Discount: {formatINR(discount)}</p>
                )}
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={form.applyCoins}
                  onChange={(e) => setForm({ ...form, applyCoins: e.target.checked })}
                  className="accent-sales-accent"
                />
                <label className="text-sm text-sales-muted">Apply Prosperr Coins (200 available)</label>
              </div>
            </>
          )}

          <div>
            <label className="text-sm text-sales-muted mb-1 block">Due Date (optional)</label>
            <Input
              type="date"
              value={form.dueDate}
              onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
              className={inputClasses}
            />
          </div>

          <div>
            <label className="text-sm text-sales-muted mb-1 block">Notes for approver (optional)</label>
            <Textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Any context for the approving superior..."
              className={`${inputClasses} min-h-[80px]`}
            />
          </div>

          <Button
            onClick={handleSubmit}
            disabled={!form.name || !form.mobile || !form.planId || loading}
            className="w-full h-12 bg-sales-accent text-sales-accent-foreground hover:bg-sales-accent/90 gap-2 mt-4"
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
    </div>
  );
};

export default NewSession;
