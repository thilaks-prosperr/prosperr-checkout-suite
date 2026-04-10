import { formatINR, formatDate, type CheckoutSession } from "@/lib/mock-data";
import { Check, Users } from "lucide-react";

interface PlanCardProps {
  session: CheckoutSession;
}

const PlanCard = ({ session }: PlanCardProps) => {
  const hasDiscount = session.discountAmount > 0;
  const hasCoins = session.consumedCoins > 0;

  return (
    <div className="rounded-lg border-2 border-primary/20 bg-primary-lighter p-5 space-y-4">
      <div>
        <h3 className="font-bold text-lg text-foreground">{session.categoryName}</h3>
        <p className="text-sm text-muted-foreground">
          Valid for {session.validity} · {formatDate(session.startDate)} – {formatDate(session.endDate)}
        </p>
      </div>

      <div className="space-y-1">
        {hasDiscount && (
          <p className="text-sm text-muted-foreground line-through">{formatINR(session.planAmount)}</p>
        )}
        <p className="text-3xl font-bold text-foreground">{formatINR(session.payableAmount)}</p>
        {hasDiscount && (
          <p className="text-sm font-medium text-primary">You save {formatINR(session.discountAmount)}</p>
        )}
        <p className="text-xs text-muted-foreground">Includes 18% GST ({formatINR(session.gstAmount)})</p>
      </div>

      {session.dependents && session.dependents.length > 0 && (
        <div className="border-t border-primary/10 pt-3">
          <div className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
            <Users size={16} />
            Dependents in your plan:
          </div>
          {session.dependents.map((dep, i) => (
            <p key={i} className="text-sm text-muted-foreground ml-6">{dep.name} — {dep.planType}</p>
          ))}
          <p className="text-sm text-primary mt-1 ml-6 flex items-center gap-1">
            <Check size={14} /> 1 Free dependent filing included
          </p>
        </div>
      )}

      {hasCoins && (
        <div className="border-t border-primary/10 pt-3">
          <p className="text-sm text-muted-foreground">
            Prosperr Coins applied: <span className="font-medium text-primary">-{formatINR(session.consumedCoins)}</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default PlanCard;
