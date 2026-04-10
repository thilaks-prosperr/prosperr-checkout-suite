import { useState, useEffect, useCallback } from "react";

interface ApprovalTimerProps {
  totalSeconds: number;
  startedAt: string;
  onTimeout: () => void;
  dark?: boolean;
}

const ApprovalTimer = ({ totalSeconds, startedAt, onTimeout, dark }: ApprovalTimerProps) => {
  const calcRemaining = useCallback(() => {
    const elapsed = Math.floor((Date.now() - new Date(startedAt).getTime()) / 1000);
    return Math.max(0, totalSeconds - elapsed);
  }, [totalSeconds, startedAt]);

  const [remaining, setRemaining] = useState(calcRemaining);

  useEffect(() => {
    const interval = setInterval(() => {
      const r = calcRemaining();
      setRemaining(r);
      if (r <= 0) {
        clearInterval(interval);
        onTimeout();
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [calcRemaining, onTimeout]);

  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  const progress = (remaining / totalSeconds) * 100;
  const isUrgent = remaining <= 60;

  const barColor = isUrgent
    ? "bg-red-500"
    : dark
    ? "bg-sales-accent"
    : "bg-primary";
  const trackColor = dark ? "bg-sales-border" : "bg-muted";
  const textColor = isUrgent
    ? "text-red-500"
    : dark
    ? "text-sales-foreground"
    : "text-foreground";

  return (
    <div className="space-y-2">
      <div className={`w-full h-2 rounded-full ${trackColor} overflow-hidden`}>
        <div
          className={`h-full rounded-full ${barColor} transition-all duration-1000`}
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className={`text-sm font-mono font-semibold ${textColor}`}>
        {minutes}:{seconds.toString().padStart(2, "0")} remaining
      </p>
    </div>
  );
};

export default ApprovalTimer;
