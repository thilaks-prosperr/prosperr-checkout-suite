import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Send, Search, AlertTriangle, CheckCircle2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import SalesNavbar from "@/components/SalesNavbar";
import { planOptions, formatINR, mockSubscriber, mockHubspotContact, formatDate, calculateTaxBreakupFromGross } from "@/lib/mock-data";

const NewSession = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    hubspotContactId: "",
    hubspotDealId: "",
    hubspotOwnerId: "",
    name: "",
    mobile: "",
    alternateMobile: "",
    email: "",
    planId: "",
    payableAmount: "",
    partialPayment: false,
    upfrontAmount: "",
    preRenewal: false,
    notes: "",
    overrideReason: "",
    scenario: "FULL_PRICE" as "FULL_PRICE" | "HUBSPOT_DISCOUNT" | "BELOW_THRESHOLD",
  });
  const [loading, setLoading] = useState(false);
  const [hubspotLinked, setHubspotLinked] = useState(false);
  const [mobileCheckState, setMobileCheckState] = useState<"idle" | "loading" | "found" | "clear">("idle");
  const [showExistingBanner, setShowExistingBanner] = useState(false);
  const [showActiveSessionBanner, setShowActiveSessionBanner] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const selectedPlan = planOptions.find((p) => p.id === form.planId);
  const payable = Number(form.payableAmount) || 0;
  const upfront = Number(form.upfrontAmount) || 0;
  const remaining = Math.max(payable - upfront, 0);
  const { taxableAmount, gstAmount, cgstAmount, sgstAmount } = calculateTaxBreakupFromGross(payable);
  const discount = selectedPlan ? selectedPlan.discountedPrice - payable : 0;
  const belowMin = selectedPlan ? payable < selectedPlan.minPrice : false;
  const invalidUpfront = form.partialPayment && (upfront <= 0 || upfront >= payable);
  const hubspotThreshold = selectedPlan?.hubspotThreshold ?? 0;
  const requiresApproval = form.scenario === "BELOW_THRESHOLD";
  const isHubspotFlow = form.scenario === "HUBSPOT_DISCOUNT";

  const handleHubspotLookup = (value: string) => {
    setForm({ ...form, hubspotContactId: value });
    if (value.startsWith("hs-") && value.length > 5) {
      setHubspotLinked(true);
      setForm({
        ...form,
        hubspotContactId: value,
        hubspotDealId: "deal-19273",
        hubspotOwnerId: "owner-93",
        name: mockHubspotContact.name,
        mobile: mockHubspotContact.mobile,
        email: mockHubspotContact.email,
      });
    } else {
      setHubspotLinked(false);
    }
  };

  const handleMobileBlur = () => {
    if (form.mobile.length !== 10) return;
    setMobileCheckState("loading");
    setTimeout(() => {
      // Mock: number "8660319759" is an existing customer
      if (form.mobile === "8660319759") {
        setMobileCheckState("found");
        setShowExistingBanner(true);
        setShowActiveSessionBanner(false);
      } else if (form.mobile === "9000000000") {
        setMobileCheckState("found");
        setShowExistingBanner(false);
        setShowActiveSessionBanner(true);
      } else {
        setMobileCheckState("clear");
        setShowExistingBanner(false);
        setShowActiveSessionBanner(false);
        setTimeout(() => setMobileCheckState("idle"), 2000);
      }
    }, 800);
  };

  const handleContinueAsNew = () => {
    setShowExistingBanner(false);
    setShowConfirmModal(true);
  };

  const handleConfirmNew = () => {
    if (!form.overrideReason.trim()) return;
    setShowConfirmModal(false);
    setMobileCheckState("idle");
  };

  const handleSwitchToRenewal = () => {
    navigate(`/checkout/sales/renewal?mobile=${form.mobile}`);
  };

  const handleResumeSession = () => {
    navigate(`/checkout/sales/session/01HRX5K2J8NQPWXYZ`);
  };

  const handleSubmit = () => {
    if (showExistingBanner) return;
    if (form.scenario === "FULL_PRICE") {
      navigate("/checkout");
      return;
    }
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
        <button onClick={() => navigate("/checkout/sales")} className="text-sm text-sales-accent flex items-center gap-1 mb-6">
          <ArrowLeft size={16} /> Back to Dashboard
        </button>

        <h1 className="text-xl font-bold text-sales-foreground mb-6">New Assisted Session</h1>

        <div className="space-y-4">
          <div>
            <label className="text-sm text-sales-muted mb-1 block">Choose Scenario</label>
            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                onClick={() => setForm({ ...form, scenario: "FULL_PRICE" })}
                className={`rounded-md border px-3 py-2 text-left text-sm ${form.scenario === "FULL_PRICE" ? "border-sales-accent text-sales-foreground bg-sales-accent/10" : "border-sales-border text-sales-muted"}`}
              >
                1) Full price agreed (12k for 12k) — guide user directly to prosperr.io/checkout
              </button>
              <button
                type="button"
                onClick={() => setForm({ ...form, scenario: "HUBSPOT_DISCOUNT" })}
                className={`rounded-md border px-3 py-2 text-left text-sm ${form.scenario === "HUBSPOT_DISCOUNT" ? "border-sales-accent text-sales-foreground bg-sales-accent/10" : "border-sales-border text-sales-muted"}`}
              >
                2) HubSpot discount flow (within threshold) — no approval needed
              </button>
              <button
                type="button"
                onClick={() => setForm({ ...form, scenario: "BELOW_THRESHOLD" })}
                className={`rounded-md border px-3 py-2 text-left text-sm ${form.scenario === "BELOW_THRESHOLD" ? "border-sales-accent text-sales-foreground bg-sales-accent/10" : "border-sales-border text-sales-muted"}`}
              >
                3) Below threshold from sales portal — approval required
              </button>
            </div>
          </div>

          {/* HubSpot Contact ID */}
          <div className={isHubspotFlow ? "" : "opacity-80"}>
            <label className="text-sm text-sales-muted mb-1 block">HubSpot Contact ID (optional)</label>
            <Input
              value={form.hubspotContactId}
              onChange={(e) => handleHubspotLookup(e.target.value)}
              placeholder="e.g. hs-8472019"
              className={inputClasses}
            />
            <p className="text-xs text-sales-muted mt-1">Paste the HubSpot Contact ID to pre-fill details and sync payment status back to HubSpot automatically.</p>
            {hubspotLinked && (
              <div className="mt-2 flex items-center gap-2 text-xs font-medium px-3 py-2 rounded-md" style={{ backgroundColor: "hsl(var(--green-500) / 0.15)", color: "hsl(var(--green-300))" }}>
                <CheckCircle2 size={14} /> HubSpot sync enabled — payment status will update automatically
              </div>
            )}
            {hubspotLinked && (
              <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-sales-muted">
                <div className="rounded-md border border-sales-border px-2 py-1.5">Deal: <span className="font-medium text-sales-foreground">{form.hubspotDealId}</span></div>
                <div className="rounded-md border border-sales-border px-2 py-1.5">Owner: <span className="font-medium text-sales-foreground">{form.hubspotOwnerId}</span></div>
              </div>
            )}
            {!hubspotLinked && form.hubspotContactId === "" && (
              <div className="mt-2 flex items-center gap-2 text-xs font-medium px-3 py-2 rounded-md" style={{ backgroundColor: "hsl(var(--gold) / 0.15)", color: "hsl(var(--gold-light))" }}>
                <AlertTriangle size={14} /> No HubSpot Contact ID — you'll need to manually update HubSpot after payment
              </div>
            )}
          </div>

          <div>
            <label className="text-sm text-sales-muted mb-1 block">Prospect Name</label>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Full name" className={inputClasses} />
          </div>

          <div>
            <label className="text-sm text-sales-muted mb-1 block">Mobile Number</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sales-muted text-sm">+91</span>
              <Input
                value={form.mobile}
                onChange={(e) => setForm({ ...form, mobile: e.target.value.replace(/\D/g, "").slice(0, 10) })}
                onBlur={handleMobileBlur}
                placeholder="10-digit mobile"
                className={`pl-12 ${inputClasses}`}
              />
            </div>
            {mobileCheckState === "loading" && (
              <p className="text-xs text-sales-muted mt-2 flex items-center gap-1.5">
                <Search size={12} className="animate-pulse" /> Checking if customer exists in system...
              </p>
            )}
            {mobileCheckState === "clear" && (
              <p className="text-xs mt-2 flex items-center gap-1.5" style={{ color: "hsl(var(--green-300))" }}>
                <CheckCircle2 size={12} /> New customer — no existing subscription found
              </p>
            )}
          </div>

          {/* Existing customer banner */}
          {showExistingBanner && (
            <div className="rounded-lg p-4 space-y-3" style={{ backgroundColor: "hsl(var(--gold) / 0.12)", border: "1px solid hsl(var(--gold) / 0.3)" }}>
              <div className="flex items-start gap-2">
                <AlertTriangle size={16} style={{ color: "hsl(var(--gold-light))" }} className="mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-sales-foreground">This number belongs to an existing Prosperr user</p>
                  <p className="text-sm text-sales-muted mt-1">
                    {mockSubscriber.name} · {mockSubscriber.plan}
                  </p>
                  <p className="text-xs text-sales-muted mt-0.5">
                    Active: {formatDate(mockSubscriber.activeSince)} → {formatDate(mockSubscriber.expiresAt)} ({mockSubscriber.daysRemaining} days left)
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleContinueAsNew} className="flex-1 border-sales-border text-sales-muted text-xs">
                  Continue as New Customer
                </Button>
                <Button size="sm" onClick={handleSwitchToRenewal} className="flex-1 bg-sales-accent text-sales-accent-foreground text-xs gap-1">
                  Switch to Renewal →
                </Button>
              </div>
            </div>
          )}

          {/* Existing active assisted session banner */}
          {showActiveSessionBanner && (
            <div className="rounded-lg p-4 space-y-3 border border-sales-border bg-sales-surface-hover">
              <div className="flex items-start gap-2">
                <AlertTriangle size={16} className="mt-0.5 shrink-0 text-sales-accent" />
                <div>
                  <p className="text-sm font-semibold text-sales-foreground">An active assisted session already exists for this mobile</p>
                  <p className="text-xs text-sales-muted mt-1">
                    Session: #{mockSessionId.slice(-8)} · Status: Awaiting Approval
                  </p>
                </div>
              </div>
              <Button onClick={handleResumeSession} className="w-full bg-sales-accent text-sales-accent-foreground">
                Resume Existing Session
              </Button>
            </div>
          )}

          <div>
            <label className="text-sm text-sales-muted mb-1 block">Email (optional)</label>
            <Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="email@example.com" className={inputClasses} />
          </div>

          <div>
            <label className="text-sm text-sales-muted mb-1 block">Alternate Mobile (optional)</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sales-muted text-sm">+91</span>
              <Input
                value={form.alternateMobile}
                onChange={(e) => setForm({ ...form, alternateMobile: e.target.value.replace(/\D/g, "").slice(0, 10) })}
                placeholder="For follow-up / changed number"
                className={`pl-12 ${inputClasses}`}
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-sales-muted mb-1 block">Plan Type</label>
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
            <>
              <div>
                <label className="text-sm text-sales-muted mb-1 block">Negotiated Amount (GST Inclusive)</label>
                <Input type="number" value={form.payableAmount} onChange={(e) => setForm({ ...form, payableAmount: e.target.value })} className={`${inputClasses} ${belowMin ? "border-red-500" : ""}`} />
                <p className="text-xs text-sales-muted mt-1">Min: {formatINR(selectedPlan.minPrice)} · Max: {formatINR(selectedPlan.maxPrice)}</p>
                {belowMin && <p className="text-xs text-red-400 mt-1">Below minimum price — pricing issue.</p>}
                {discount > 0 && <p className="text-xs mt-1" style={{ color: "hsl(var(--green-300))" }}>Discount: {formatINR(discount)}</p>}
                {payable > 0 && (
                  <div className="mt-2 rounded-md border border-sales-border px-3 py-2 text-xs text-sales-muted space-y-1">
                    <p>Taxable amount: <span className="text-sales-foreground font-medium">{formatINR(taxableAmount)}</span></p>
                    <p>CGST (9%): <span className="text-sales-foreground font-medium">{formatINR(cgstAmount)}</span></p>
                    <p>SGST (9%): <span className="text-sales-foreground font-medium">{formatINR(sgstAmount)}</span></p>
                    <p>Total GST (18%): <span className="text-sales-foreground font-medium">{formatINR(gstAmount)}</span></p>
                  </div>
                )}
                {isHubspotFlow && (
                  <p className="text-xs text-sales-muted mt-1">
                    HubSpot threshold for this plan: {formatINR(hubspotThreshold)}. Current payable {formatINR(payable || 0)}.
                  </p>
                )}
                {requiresApproval && (
                  <p className="text-xs mt-1" style={{ color: "hsl(var(--gold-light))" }}>
                    Approval required: deal is below HubSpot threshold.
                  </p>
                )}
              </div>

              <div className="rounded-md border border-sales-border px-3 py-2">
                <label className="flex items-center gap-2 text-sm text-sales-foreground cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.partialPayment}
                    onChange={(e) => setForm({ ...form, partialPayment: e.target.checked, upfrontAmount: "" })}
                    className="accent-sales-accent"
                  />
                  Enable Partial Payment
                </label>
                {form.partialPayment && (
                  <div className="mt-2 space-y-1">
                    <label className="text-xs text-sales-muted block">Pay Now Amount (out of {formatINR(payable)})</label>
                    <Input
                      type="number"
                      value={form.upfrontAmount}
                      onChange={(e) => setForm({ ...form, upfrontAmount: e.target.value })}
                      className={`${inputClasses} ${invalidUpfront ? "border-red-500" : ""}`}
                    />
                    {invalidUpfront ? (
                      <p className="text-xs text-red-400">Upfront amount must be greater than 0 and less than negotiated amount.</p>
                    ) : (
                      <p className="text-xs text-sales-muted">Remaining: <span className="text-sales-foreground font-medium">{formatINR(remaining)}</span></p>
                    )}
                    <p className="text-xs text-sales-muted">Invoice should be generated only after full settlement is complete.</p>
                  </div>
                )}
              </div>
            </>
          )}

          <div>
            <label className="text-sm text-sales-muted mb-1 block">Notes for approver (optional)</label>
            <Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Any context for the approving superior..." className={`${inputClasses} min-h-[80px]`} />
          </div>

          <p className="text-xs text-sales-muted">
            Session validity is defaulted to 24 hours from creation.
          </p>

          <Button onClick={handleSubmit} disabled={!form.name || !form.mobile || !form.planId || loading || showExistingBanner || showActiveSessionBanner || invalidUpfront} className="w-full h-12 bg-sales-accent text-sales-accent-foreground hover:bg-sales-accent/90 gap-2 mt-4">
            {loading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Send size={16} />}
            {loading
              ? "Creating..."
              : form.scenario === "FULL_PRICE"
              ? "Guide Customer to prosperr.io/checkout"
              : requiresApproval
              ? "Generate Session & Request Approval"
              : "Generate Session Link (No Approval Needed)"}
          </Button>
        </div>
      </div>

      {/* Confirm new customer modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-6">
          <div className="sales-card p-6 max-w-sm space-y-4">
            <h3 className="font-semibold text-sales-foreground">⚠️ Confirm New Customer</h3>
            <p className="text-sm text-sales-muted">
              This user already has an active subscription. Creating a new session will result in a separate subscription. Are you sure this is not a renewal?
            </p>
            <div className="space-y-2">
              <label className="text-xs text-sales-muted block">Override reason (required)</label>
              <Textarea
                value={form.overrideReason}
                onChange={(e) => setForm({ ...form, overrideReason: e.target.value })}
                placeholder="Why are you creating a new session instead of renewal?"
                className="min-h-[70px] bg-sales-surface border-sales-border text-sales-foreground"
              />
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => { setShowConfirmModal(false); setShowExistingBanner(true); }} className="flex-1 border-sales-border text-sales-muted">Cancel</Button>
              <Button onClick={handleConfirmNew} disabled={!form.overrideReason.trim()} className="flex-1 bg-sales-accent text-sales-accent-foreground">Yes, this is a new purchase</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewSession;
