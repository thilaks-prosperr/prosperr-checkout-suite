import { Leaf } from "lucide-react";

interface ProsperrLogoProps {
  variant?: "default" | "white";
  size?: "sm" | "md" | "lg";
}

const ProsperrLogo = ({ variant = "default", size = "md" }: ProsperrLogoProps) => {
  const sizeClasses = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-3xl",
  };
  const iconSizes = { sm: 16, md: 20, lg: 24 };
  const colorClass = variant === "white" ? "text-sales-foreground" : "text-primary";

  return (
    <div className={`flex items-center gap-1.5 font-bold ${sizeClasses[size]} ${colorClass}`}>
      <Leaf size={iconSizes[size]} className="text-primary-light" />
      <span>Prosperr</span>
    </div>
  );
};

export default ProsperrLogo;
