import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogIn, Mail, Lock, Eye, EyeOff } from "lucide-react";
import ProsperrLogo from "@/components/ProsperrLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const SalesLogin = ({ onLogin }: { onLogin: () => void }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLogin();
    }, 1000);
  };

  return (
    <div className="sales-portal flex items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center space-y-2">
          <ProsperrLogo variant="white" size="lg" />
          <h1 className="text-xl font-bold text-sales-foreground mt-4">Sales Portal</h1>
          <p className="text-sm text-sales-muted">For BDA / CSR use only</p>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-sales-muted" />
            <Input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 h-11 bg-sales-surface border-sales-border text-sales-foreground placeholder:text-sales-muted"
            />
          </div>
          <div className="relative">
            <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-sales-muted" />
            <Input
              type={showPw ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 pr-10 h-11 bg-sales-surface border-sales-border text-sales-foreground placeholder:text-sales-muted"
            />
            <button onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-sales-muted">
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          <Button
            onClick={handleLogin}
            disabled={loading}
            className="w-full h-11 bg-sales-accent text-sales-accent-foreground hover:bg-sales-accent/90 gap-2"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <LogIn size={16} />
            )}
            {loading ? "Logging in..." : "Log In"}
          </Button>
        </div>

        <p className="text-center text-xs text-sales-muted">
          Having trouble? Contact your admin
        </p>
      </div>
    </div>
  );
};

export default SalesLogin;
