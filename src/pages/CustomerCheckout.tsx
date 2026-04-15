import { useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Lock, Shield, CheckCircle2, XCircle, CreditCard, Smartphone, Pencil, ChevronDown, ChevronUp, Check, MessageCircle, Users, X } from "lucide-react";
import ProsperrLogo from "@/components/ProsperrLogo";
import OtpInput from "@/components/OtpInput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { mockSession, mockSessions, formatINR, maskMobile, formatDate, planIncludes } from "@/lib/mock-data";

type Step = "mobile" | "otp" | "plan" | "success" | "failed";

const steps = [
  { key: "mobile", label: "Verify" },
  { key: "otp", label: "OTP" },
  { key: "plan", label: "Review" },
  { key: "success", label: "Done" },
];

const stepVariants = {
  enter: { opacity: 0, x: 30 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -30 },
};

const CustomerCheckout = () => {
  const { sessionId, mobile: urlMobile } = useParams();
  const [step, setStep] = useState<Step>("mobile");
  const [mobile, setMobile] = useState(urlMobile || "");
  const [loading, setLoading] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [showEditSheet, setShowEditSheet] = useState(false);
  const [dependentsOpen, setDependentsOpen] = useState(false);
  const [planDetailsOpen, setPlanDetailsOpen] = useState(false);
  const [paymentAttempts, setPaymentAttempts] = useState(0);
  const [useCoins, setUseCoins] = useState(false);

  const session = sessionId
    ? mockSessions.find((s) => s.id === sessionId) || mockSession
    : {
        ...mockSession,
        id: "ORGANIC_CHECKOUT",
        source: "WEBSITE" as const,
        flowType: "ORGANIC" as const,
        status: "INITIATED" as const,
        payableAmount: 10000,
        discountAmount: 2000,
      };
  const isPrefilled = !!urlMobile;
  const isAssisted = Boolean(sessionId);
  const isDraft = session.status === "DRAFT";
  const isExpired = session.status === "EXPIRED";
  const isRejected = session.status === "REJECTED";
  const shouldBlockPayment = isDraft || isExpired || isRejected;
  const coinDeduction = useCoins ? Math.min(session.coinBalance, session.payableAmount) : 0;
  const finalPayableAmount = Math.max(session.payableAmount - coinDeduction, 0);

  const currentStepIndex = steps.findIndex(s => s.key === step);

  const handleSendOtp = useCallback(() => {
    if (mobile.length !== 10) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep("otp");
      setResendTimer(30);
      const interval = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) { clearInterval(interval); return 0; }
          return prev - 1;
        });
      }, 1000);
    }, 1200);
  }, [mobile]);

  const handleVerifyOtp = useCallback((_otp: string) => {
    setLoading(true);
    setTimeout(() => {
      setOtpVerified(true);
      setTimeout(() => {
        setLoading(false);
        setOtpVerified(false);
        setStep("plan");
      }, 800);
    }, 800);
  }, []);

  const handlePay = useCallback(() => {
    setLoading(true);
    setPaymentAttempts((prev) => prev + 1);
    setTimeout(() => {
      setLoading(false);
      setStep(Math.random() > 0.2 ? "success" : "failed");
    }, 2000);
  }, []);

  const handleResendOtp = useCallback(() => {
    if (resendTimer > 0) return;
    setResendTimer(30);
    const interval = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) { clearInterval(interval); return 0; }
        return prev - 1;
      });
    }, 1000);
  }, [resendTimer]);

  const whatsappAdvisorUrl = `https://wa.me/91${session.bdaMobile || ""}?text=${encodeURIComponent("Hi, I need to update my details for the Prosperr session.")}`;

  const features = planIncludes[session.categoryId] || [];

  return (
    <div className="min-h-screen bg-background checkout-gradient">
      <div className="max-w-md mx-auto px-5 py-8">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <ProsperrLogo size="lg" />
        </div>

        {/* Session state alerts for assisted flows */}
        {isAssisted && isDraft && (
          <div className="mb-5 rounded-lg border border-amber-300 bg-amber-50 p-3 text-amber-800 text-sm">
            This session was saved as draft by your sales rep.
            <div className="mt-1 text-xs">Reason: {session.notes || "No reason shared"}. Please contact your sales rep or raise a support ticket.</div>
          </div>
        )}
        {isAssisted && isExpired && (
          <div className="mb-5 rounded-lg border border-red-300 bg-red-50 p-3 text-red-700 text-sm">
            This session has expired. Please contact your sales rep to continue.
          </div>
        )}
        {isAssisted && isRejected && (
          <div className="mb-5 rounded-lg border border-red-300 bg-red-50 p-3 text-red-700 text-sm">
            This session was rejected by supervisor approval policy.
            <div className="mt-1 text-xs">{session.rejectionReason || "Please contact your sales rep for next steps."}</div>
          </div>
        )}

        {/* Step Indicator */}
        {step !== "failed" && !shouldBlockPayment && (
          <div className="flex items-center justify-center gap-2 mb-8">
            {steps.map((s, i) => (
              <div key={s.key} className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  i < currentStepIndex ? "bg-primary text-primary-foreground" :
                  i === currentStepIndex ? "bg-primary text-primary-foreground" :
                  "bg-muted text-muted-foreground"
                }`}>
                  {i < currentStepIndex ? <Check size={14} /> : i + 1}
                </div>
                <span className={`text-xs font-medium hidden sm:inline ${
                  i <= currentStepIndex ? "text-foreground" : "text-muted-foreground"
                }`}>{s.label}</span>
                {i < steps.length - 1 && (
                  <div className={`w-6 h-0.5 ${i < currentStepIndex ? "bg-primary" : "bg-muted"}`} />
                )}
              </div>
            ))}
          </div>
        )}

        <AnimatePresence mode="wait">
          {/* STEP 1: MOBILE */}
          {step === "mobile" && !shouldBlockPayment && (
            <motion.div key="mobile" variants={stepVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.25 }} className="space-y-6">
              <div className="text-center space-y-2">
                <h1 className="text-2xl font-bold text-foreground">Verify your mobile number</h1>
                <p className="text-muted-foreground text-sm">Enter the mobile number you gave to our advisor</p>
              </div>
              <div className="space-y-3">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium">+91</span>
                  <Input type="tel" inputMode="numeric" maxLength={10} value={mobile} onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))} placeholder="Enter 10-digit mobile" className="pl-12 h-12 text-lg" />
                </div>
                {isPrefilled && (
                  <p className="text-xs text-primary flex items-center gap-1.5 bg-primary-lighter px-3 py-2 rounded-md">
                    <Shield size={14} /> Prefilled by your advisor — you can edit if needed
                  </p>
                )}
              </div>
              <Button onClick={handleSendOtp} disabled={mobile.length !== 10 || loading} className="w-full h-12 text-base font-semibold bg-primary text-primary-foreground hover:bg-primary/90">
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Sending...
                  </span>
                ) : "Send OTP"}
              </Button>
              <p className="text-center text-xs text-muted-foreground flex items-center justify-center gap-1.5">
                <Lock size={12} /> Secured by Prosperr. Your data is protected.
              </p>
            </motion.div>
          )}

          {/* STEP 2: OTP */}
          {step === "otp" && !shouldBlockPayment && (
            <motion.div key="otp" variants={stepVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.25 }} className="space-y-6">
              <button onClick={() => setStep("mobile")} className="text-sm text-primary flex items-center gap-1 -mt-2">
                <ArrowLeft size={16} /> Back
              </button>
              {otpVerified ? (
                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-8">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                    <CheckCircle2 size={32} className="text-primary" />
                  </div>
                  <p className="text-lg font-semibold text-primary">Verified!</p>
                </motion.div>
              ) : (
                <>
                  <div className="text-center space-y-2">
                    <h1 className="text-2xl font-bold text-foreground">Enter the OTP</h1>
                    <p className="text-muted-foreground text-sm">Sent to {maskMobile(mobile)}</p>
                  </div>
                  <OtpInput onComplete={handleVerifyOtp} disabled={loading} />
                  <div className="text-center">
                    {resendTimer > 0 ? (
                      <p className="text-sm text-muted-foreground">Resend OTP in {resendTimer}s</p>
                    ) : (
                      <button onClick={handleResendOtp} className="text-sm text-primary font-medium">Resend OTP</button>
                    )}
                  </div>
                  <p className="text-center text-xs text-muted-foreground">This OTP is to verify your identity before payment</p>
                </>
              )}
            </motion.div>
          )}

          {/* STEP 3: PLAN & PAY */}
          {step === "plan" && !shouldBlockPayment && (
            <motion.div key="plan" variants={stepVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.25 }} className="space-y-5">
              <div className="text-center">
                <h1 className="text-2xl font-bold text-foreground">Review your plan</h1>
                {isAssisted ? (
                  <p className="text-xs text-muted-foreground mt-1">
                    Session: {sessionId || session.id} · Assisted flow: {session.flowType.replaceAll("_", " ")}
                  </p>
                ) : (
                  <p className="text-xs text-muted-foreground mt-1">Organic checkout flow</p>
                )}
              </div>

              {/* Your Details card */}
              <div className="rounded-lg border border-border bg-card p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-foreground text-sm">Your Details</h3>
                  <button onClick={() => setShowEditSheet(true)} className="text-xs text-primary flex items-center gap-1 font-medium">
                    <Pencil size={12} /> Edit?
                  </button>
                </div>
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Name</span>
                    <span className="text-foreground font-medium">{session.prospectName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Mobile</span>
                    <span className="text-foreground font-medium flex items-center gap-1">
                      {maskMobile(session.prospectMobile)}
                      <CheckCircle2 size={12} className="text-primary" />
                      <span className="text-xs text-primary">Verified</span>
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Email</span>
                    <span className="text-foreground font-medium">{session.prospectEmail}</span>
                  </div>
                </div>
              </div>

              {/* Plan Card */}
              <div className="rounded-lg border-2 border-primary/20 bg-primary-lighter p-5 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-lg text-foreground">{session.categoryName}</h3>
                    <p className="text-sm text-muted-foreground">
                      Valid for {session.validity} · {formatDate(session.startDate)} – {formatDate(session.endDate)}
                    </p>
                  </div>
                </div>

                {/* Plan includes - expandable */}
                {features.length > 0 && (
                  <Collapsible open={planDetailsOpen} onOpenChange={setPlanDetailsOpen}>
                    <CollapsibleTrigger className="text-xs text-primary font-medium flex items-center gap-1">
                      What's included? {planDetailsOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="mt-2 space-y-1.5">
                        {features.map((f, i) => (
                          <p key={i} className="text-sm text-foreground flex items-center gap-2">
                            <Check size={14} className="text-primary shrink-0" /> {f}
                          </p>
                        ))}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                )}

                <div className="space-y-1">
                  {session.discountAmount > 0 && (
                    <p className="text-sm text-muted-foreground line-through">{formatINR(session.planAmount)}</p>
                  )}
                  <p className="text-3xl font-bold text-foreground">{formatINR(finalPayableAmount)}</p>
                  {session.discountAmount > 0 && (
                    <p className="text-sm font-medium text-primary">You save {formatINR(session.discountAmount)}</p>
                  )}
                  <p className="text-xs text-muted-foreground">Includes 18% GST ({formatINR(session.gstAmount)})</p>
                </div>

                {/* Dependents - expandable */}
                {session.dependents && session.dependents.length > 0 && (
                  <div className="border-t border-primary/10 pt-3">
                    <Collapsible open={dependentsOpen} onOpenChange={setDependentsOpen}>
                      <CollapsibleTrigger className="flex items-center gap-2 text-sm font-medium text-foreground w-full justify-between">
                        <span className="flex items-center gap-2">
                          <Users size={16} /> Dependents in your plan ({session.dependents.length})
                        </span>
                        {dependentsOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <div className="mt-3 space-y-3">
                          {session.dependents.map((dep, i) => (
                            <div key={i} className="bg-card/50 rounded-md p-3 space-y-1">
                              <p className="text-sm font-medium text-foreground">{dep.name}</p>
                              <p className="text-xs text-muted-foreground">Relationship: {dep.relationship}</p>
                              <p className="text-xs text-muted-foreground">Filing Type: {dep.planType}</p>
                            </div>
                          ))}
                          <p className="text-sm text-primary flex items-center gap-1">
                            <Check size={14} /> 1 Free dependent filing included
                          </p>
                          <button onClick={() => setShowEditSheet(true)} className="text-xs text-primary font-medium">
                            Something wrong? Inform your advisor
                          </button>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  </div>
                )}

                {session.coinBalance > 0 && (
                  <div className="border-t border-primary/10 pt-3 space-y-2">
                    <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
                      <input
                        type="checkbox"
                        checked={useCoins}
                        onChange={(e) => setUseCoins(e.target.checked)}
                        className="accent-primary"
                      />
                      Apply Prosperr Coins ({formatINR(session.coinBalance)} available)
                    </label>
                    {useCoins && (
                      <p className="text-sm text-muted-foreground">
                        Prosperr Coins applied: <span className="font-medium text-primary">-{formatINR(coinDeduction)}</span>
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Total Payable */}
              <div className="bg-muted rounded-lg p-4 text-center">
                <p className="text-sm text-muted-foreground">Total Payable</p>
                <p className="text-3xl font-bold text-foreground">{formatINR(finalPayableAmount)}</p>
                {paymentAttempts > 0 && (
                  <p className="text-xs text-muted-foreground mt-1">Attempt #{paymentAttempts}</p>
                )}
              </div>

              <Button onClick={handlePay} disabled={loading || shouldBlockPayment} className="w-full h-14 text-lg font-bold bg-primary text-primary-foreground hover:bg-primary/90">
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Processing...
                  </span>
                ) : (
                  <>
                    <CreditCard size={20} className="mr-2" /> Pay Now
                  </>
                )}
              </Button>

              <div className="text-center space-y-2">
                <div className="flex justify-center gap-4 opacity-40">
                  <Smartphone size={20} />
                  <CreditCard size={20} />
                </div>
                <p className="text-xs text-muted-foreground">UPI · Credit/Debit Card · Net Banking</p>
                <p className="text-xs text-muted-foreground">Payments powered by Prosperr × HDFC SmartGateway</p>
              </div>

              {/* Trust row */}
              <div className="text-center pt-2 border-t border-border">
                <p className="text-xs text-muted-foreground flex items-center justify-center gap-2">
                  <Lock size={10} /> 256-bit SSL secured · PCI DSS compliant · Powered by Prosperr
                </p>
              </div>
            </motion.div>
          )}

          {/* STEP 4: SUCCESS */}
          {step === "success" && !shouldBlockPayment && (
            <motion.div key="success" variants={stepVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.25 }} className="space-y-6 text-center">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 15 }} className="relative mx-auto w-24 h-24">
                <motion.div initial={{ scale: 1, opacity: 0.6 }} animate={{ scale: 2, opacity: 0 }} transition={{ duration: 1, repeat: 1 }} className="absolute inset-0 rounded-full bg-primary/20" />
                <div className="absolute inset-0 rounded-full bg-primary/10 flex items-center justify-center">
                  <CheckCircle2 size={48} className="text-primary" />
                </div>
              </motion.div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Payment Successful 🎉</h1>
                <p className="text-muted-foreground mt-1">{formatINR(finalPayableAmount)} paid · TXN: PRS{Date.now().toString().slice(-8)}</p>
              </div>
              <div className="bg-primary-lighter rounded-lg p-5 text-left space-y-3">
                <h3 className="font-semibold text-foreground">What's next?</h3>
                <div className="space-y-2">
                  {["You'll receive a confirmation email with your invoice", "Our team will reach out to complete your account setup", "You'll get access to Super Saver within 24 hours"].map((text, i) => (
                    <div key={i} className="flex gap-2">
                      <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-xs font-bold text-primary">{i + 1}</span>
                      <p className="text-sm text-foreground">{text}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Button variant="outline" className="w-full">Sign up on Prosperr</Button>
                <p className="text-xs text-muted-foreground">Already have an account? <a href="#" className="text-primary font-medium">Log in</a></p>
              </div>
            </motion.div>
          )}

          {/* STEP 4B: FAILED */}
          {step === "failed" && !shouldBlockPayment && (
            <motion.div key="failed" variants={stepVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.25 }} className="space-y-6 text-center">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 15 }} className="w-24 h-24 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
                <XCircle size={48} className="text-destructive" />
              </motion.div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Payment didn't go through</h1>
                <p className="text-muted-foreground mt-1">Payment was declined by your bank</p>
              </div>
              <div className="space-y-2">
                <Button onClick={() => setStep("plan")} className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90">Try Again (New Attempt)</Button>
                <button className="text-sm text-primary font-medium">Contact your advisor</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {shouldBlockPayment && (
          <div className="mt-4 text-center text-sm text-muted-foreground">
            Payment is currently unavailable for this session state.
          </div>
        )}
      </div>

      {/* Edit Details Bottom Sheet */}
      <AnimatePresence>
        {showEditSheet && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-foreground/40 z-40" onClick={() => setShowEditSheet(false)} />
            <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 300 }} className="fixed bottom-0 left-0 right-0 z-50 bg-card rounded-t-2xl p-6 max-w-md mx-auto space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-foreground">Want to change any details?</h3>
                <button onClick={() => setShowEditSheet(false)}><X size={20} className="text-muted-foreground" /></button>
              </div>
              <p className="text-sm text-muted-foreground">
                Your name, mobile, or email were filled in by your Prosperr advisor. To change them, please inform your advisor and ask them to update the session from their end.
              </p>
              <div className="bg-muted rounded-lg p-3 space-y-1">
                <p className="text-sm font-medium text-foreground">Your advisor: {session.bdaName}</p>
              </div>
              <a href={whatsappAdvisorUrl} target="_blank" rel="noopener noreferrer" className="w-full">
                <Button className="w-full bg-primary text-primary-foreground gap-2">
                  <MessageCircle size={16} /> WhatsApp your advisor
                </Button>
              </a>
              <Button variant="outline" onClick={() => setShowEditSheet(false)} className="w-full">Close</Button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CustomerCheckout;
