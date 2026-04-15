import { useState } from "react";
import { Copy, Check, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ShareLinkBoxProps {
  sessionId: string;
  mobile: string;
  dark?: boolean;
}

const ShareLinkBox = ({ sessionId, mobile, dark }: ShareLinkBoxProps) => {
  const [copied, setCopied] = useState(false);
  const link = `prosperr.io/checkout/session/${sessionId}/${mobile}`;
  const fullLink = `https://${link}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(fullLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsApp = () => {
    const msg = encodeURIComponent(
      `Hi! Here's your payment link for Prosperr Super Saver:\n\n${fullLink}\n\nPlease complete the payment at your convenience.`
    );
    window.open(`https://wa.me/91${mobile}?text=${msg}`, "_blank");
  };

  const cardBg = dark ? "bg-sales-surface border-sales-border" : "bg-primary-lighter border-primary/20";
  const textColor = dark ? "text-sales-foreground" : "text-foreground";
  const mutedColor = dark ? "text-sales-muted" : "text-muted-foreground";
  const codeBg = dark ? "bg-sales-bg" : "bg-muted";

  return (
    <div className={`rounded-lg border-2 p-5 space-y-4 ${cardBg}`}>
      <h4 className={`font-semibold ${textColor}`}>Payment Link Generated</h4>

      <div className={`rounded-md p-3 font-mono text-sm break-all ${codeBg} ${textColor}`}>
        {link}
      </div>

      <div className="flex gap-2">
        <Button
          onClick={handleCopy}
          variant="outline"
          className="flex-1 gap-2"
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
          {copied ? "Copied!" : "Copy Link"}
        </Button>
        <Button
          onClick={handleWhatsApp}
          className="flex-1 gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
        >
          <MessageCircle size={16} />
          Share via WhatsApp
        </Button>
      </div>

      <p className={`text-xs ${mutedColor} text-center`}>
        Or tell customer to visit: <span className={`font-medium ${textColor}`}>prosperr.io/checkout</span>
      </p>
    </div>
  );
};

export default ShareLinkBox;
