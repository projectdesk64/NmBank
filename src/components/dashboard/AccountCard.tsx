import { LucideIcon, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AccountCardProps {
  title: string;
  balance: number;
  accountNumber: string;
  icon: LucideIcon;
  variant: "maroon" | "blue" | "orange";
  showBalance: boolean;
  onToggleBalance: () => void;
  delay?: number;
}

const variantStyles = {
  maroon: "bg-gradient-to-br from-primary via-primary/90 to-primary/70",
  blue: "bg-gradient-to-br from-link via-link/90 to-link/70",
  orange: "bg-gradient-to-br from-accent via-accent/90 to-accent/70",
};

export const AccountCard = ({
  title,
  balance,
  accountNumber,
  icon: Icon,
  variant,
  showBalance,
  onToggleBalance,
  delay = 0,
}: AccountCardProps) => {
  const formatBalance = (amount: number) => {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const maskedBalance = "••••••••";
  const maskedAccount = `****${accountNumber.slice(-4)}`;

  return (
    <div
      className={cn(
        "rounded-lg p-5 text-white relative overflow-hidden opacity-0 animate-slide-up",
        variantStyles[variant]
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full border-2 border-white/30" />
        <div className="absolute -right-4 -bottom-4 w-24 h-24 rounded-full border-2 border-white/20" />
      </div>

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
            <Icon className="h-5 w-5" />
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-white/80 hover:text-white hover:bg-white/10"
            onClick={onToggleBalance}
          >
            {showBalance ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>

        <p className="text-sm text-white/80 font-medium mb-1">{title}</p>
        <p className="text-2xl font-heading font-bold mb-3">
          {showBalance ? formatBalance(balance) : maskedBalance}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-xs text-white/70">{maskedAccount}</span>
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-white/90 hover:text-white hover:bg-white/10 h-7 px-2"
          >
            View Details →
          </Button>
        </div>
      </div>
    </div>
  );
};