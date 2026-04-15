interface ProsperrLogoProps {
  variant?: "default" | "white";
  size?: "sm" | "md" | "lg";
}

const ProsperrLogo = ({ variant = "default", size = "md" }: ProsperrLogoProps) => {
  const sizeClasses: Record<NonNullable<ProsperrLogoProps["size"]>, string> = {
    sm: "h-6",
    md: "h-8",
    lg: "h-10",
  };
  const textClasses: Record<NonNullable<ProsperrLogoProps["size"]>, string> = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-3xl",
  };
  const colorClass = variant === "white" ? "text-sales-foreground" : "text-foreground";

  return (
    <div className={`flex items-center gap-2 font-bold ${colorClass}`}>
      <img src="/prosperr-logo.svg" alt="Prosperr logo" className={sizeClasses[size]} />
      <span className={textClasses[size]}>Prosperr</span>
    </div>
  );
};

export default ProsperrLogo;
