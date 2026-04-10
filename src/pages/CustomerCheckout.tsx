import { useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Lock, Shield, CheckCircle2, XCircle, CreditCard, Smartphone } from "lucide-react";
import ProsperrLogo from "@/components/ProsperrLogo";
import OtpInput from "@/components/OtpInput";
import PlanCard from "@/components/PlanCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { mockSession, formatINR, maskMobile } from "@/lib/mock-data";

type Step = "mobile" | "otp" | "plan" | "success" | "failed";

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

  const session = mockSession; // In real app, fetch by sessionId

  const isPrefilled = !!urlMobile;

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
    setTimeout(() => {
      setLoading(false);
      // 80% success for demo
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

  return (
    <div className="min-h-screen bg-background checkout-gradient">
      <div className="max-w-md mx-auto px-5 py-8">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <ProsperrLogo size="lg" />
        </div>

        <AnimatePresence mode="wait">
          {/* STEP 1: MOBILE */}
          {step === "mobile" && (
            <motion.div
              key="mobile"
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              <div className="text-center space-y-2">
                <h1 className="text-2xl font-bold text-foreground">Verify your mobile number</h1>
                <p className="text-muted-foreground text-sm">Enter the mobile number you gave to our advisor</p>
              </div>

              <div className="space-y-3">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium">+91</span>
                  <Input
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
                    placeholder="Enter 10-digit mobile"
                    className="pl-12 h-12 text-lg"
                  />
                </div>
                {isPrefilled && (
                  <p className="text-xs text-primary flex items-center gap-1.5 bg-primary-lighter px-3 py-2 rounded-md">
                    <Shield size={14} />
                    Prefilled by your advisor — you can edit if needed
                  </p>
                )}
              </div>

              <Button
                onClick={handleSendOtp}
                disabled={mobile.length !== 10 || loading}
                className="w-full h-12 text-base font-semibold bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Sending...
                  </span>
                ) : (
                  "Send OTP"
                )}
              </Button>

              <p className="text-center text-xs text-muted-foreground flex items-center justify-center gap-1.5">
                <Lock size={12} /> Secured by Prosperr. Your data is protected.
              </p>
            </motion.div>
          )}

          {/* STEP 2: OTP */}
          {step === "otp" && (
            <motion.div
              key="otp"
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              <button onClick={() => setStep("mobile")} className="text-sm text-primary flex items-center gap-1 -mt-2">
                <ArrowLeft size={16} /> Back
              </button>

              {otpVerified ? (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-center py-8"
                >
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
                      <button onClick={handleResendOtp} className="text-sm text-primary font-medium">
                        Resend OTP
                      </button>
                    )}
                  </div>

                  <p className="text-center text-xs text-muted-foreground">
                    This OTP is to verify your identity before payment
                  </p>
                </>
              )}
            </motion.div>
          )}

          {/* STEP 3: PLAN & PAY */}
          {step === "plan" && (
            <motion.div
              key="plan"
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              <div className="text-center">
                <h1 className="text-2xl font-bold text-foreground">Review your plan</h1>
              </div>

              <PlanCard session={session} />

              <div className="bg-muted rounded-lg p-4 text-center">
                <p className="text-sm text-muted-foreground">Total Payable</p>
                <p className="text-3xl font-bold text-foreground">{formatINR(session.payableAmount)}</p>
              </div>

              <Button
                onClick={handlePay}
                disabled={loading}
                className="w-full h-14 text-lg font-bold bg-primary text-primary-foreground hover:bg-primary/90"
              >
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
            </motion.div>
          )}

          {/* STEP 4: SUCCESS */}
          {step === "success" && (
            <motion.div
              key="success"
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25 }}
              className="space-y-6 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="relative mx-auto w-24 h-24"
              >
                <motion.div
                  initial={{ scale: 1, opacity: 0.6 }}
                  animate={{ scale: 2, opacity: 0 }}
                  transition={{ duration: 1, repeat: 1 }}
                  className="absolute inset-0 rounded-full bg-primary/20"
                />
                <div className="absolute inset-0 rounded-full bg-primary/10 flex items-center justify-center">
                  <CheckCircle2 size={48} className="text-primary" />
                </div>
              </motion.div>

              <div>
                <h1 className="text-2xl font-bold text-foreground">Payment Successful 🎉</h1>
                <p className="text-muted-foreground mt-1">
                  {formatINR(session.payableAmount)} paid · TXN: PRS{Date.now().toString().slice(-8)}
                </p>
              </div>

              <div className="bg-primary-lighter rounded-lg p-5 text-left space-y-3">
                <h3 className="font-semibold text-foreground">What's next?</h3>
                <div className="space-y-2">
                  {[
                    "You'll receive a confirmation email with your invoice",
                    "Our team will reach out to complete your account setup",
                    "You'll get access to Super Saver within 24 hours",
                  ].map((text, i) => (
                    <div key={i} className="flex gap-2">
                      <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-xs font-bold text-primary">
                        {i + 1}
                      </span>
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
          {step === "failed" && (
            <motion.div
              key="failed"
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25 }}
              className="space-y-6 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="w-24 h-24 rounded-full bg-destructive/10 flex items-center justify-center mx-auto"
              >
                <XCircle size={48} className="text-destructive" />
              </motion.div>

              <div>
                <h1 className="text-2xl font-bold text-foreground">Payment didn't go through</h1>
                <p className="text-muted-foreground mt-1">Payment was declined by your bank</p>
              </div>

              <div className="space-y-2">
                <Button
                  onClick={() => setStep("plan")}
                  className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Try Again
                </Button>
                <button className="text-sm text-primary font-medium">Contact your advisor</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CustomerCheckout;
