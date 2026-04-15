import { Link } from "react-router-dom";
import ProsperrLogo from "@/components/ProsperrLogo";
import { CreditCard, Users } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background checkout-gradient flex flex-col items-center justify-center p-6">
      <ProsperrLogo size="lg" />
      <h1 className="text-2xl font-bold text-foreground mt-6 mb-2">Prosperr Assisted Checkout</h1>
      <p className="text-muted-foreground text-center max-w-md mb-8">
        Payment collection system for the Super Saver product
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-xl">
        <Link to="/checkout" className="block">
          <div className="border border-border rounded-lg p-6 text-center hover:border-primary/40 transition-colors space-y-3">
            <CreditCard size={28} className="mx-auto text-primary" />
            <h3 className="font-semibold text-foreground">Customer Checkout</h3>
            <p className="text-xs text-muted-foreground">Payment flow for prospects</p>
          </div>
        </Link>
        <Link to="/checkout/sales" className="block">
          <div className="border border-border rounded-lg p-6 text-center hover:border-primary/40 transition-colors space-y-3">
            <Users size={28} className="mx-auto text-primary" />
            <h3 className="font-semibold text-foreground">Sales Portal</h3>
            <p className="text-xs text-muted-foreground">BDA / CSR dashboard</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Index;
