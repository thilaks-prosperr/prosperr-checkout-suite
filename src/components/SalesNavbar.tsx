import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, User, LogOut } from "lucide-react";
import ProsperrLogo from "@/components/ProsperrLogo";

interface SalesNavbarProps {
  role: "bda" | "superior";
}

const SalesNavbar = ({ role }: SalesNavbarProps) => {
  const location = useLocation();

  const links: { to: string; label: string; icon: typeof LayoutDashboard; badge?: number }[] = [
    { to: "/checkout/sales", label: "Sessions", icon: LayoutDashboard },
  ];

  return (
    <nav className="border-b border-sales-border px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-8">
        <ProsperrLogo variant="white" size="sm" />
        <div className="flex gap-1">
          {links.map((link) => {
            const active = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  active ? "bg-sales-accent/10 text-sales-accent" : "text-sales-muted hover:text-sales-foreground"
                }`}
              >
                <link.icon size={16} />
                {link.label}
                {link.badge != null && link.badge > 0 && (
                  <span className="w-5 h-5 rounded-full bg-sales-accent text-[10px] font-bold flex items-center justify-center text-sales-accent-foreground">
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-sales-muted">
          <User size={16} />
          <span className="text-sm">{role === "bda" ? "Sales Rep" : "Supervisor"}</span>
        </div>
        <Link to="/checkout/sales" className="text-sales-muted hover:text-sales-foreground">
          <LogOut size={16} />
        </Link>
      </div>
    </nav>
  );
};

export default SalesNavbar;
