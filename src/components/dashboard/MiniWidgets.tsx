import { TrendingUp, Bell, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const DepositWidget = () => {
  return (
    <div className="bg-card rounded-lg p-5 border border-border card-shadow opacity-0 animate-fade-in" style={{ animationDelay: "200ms" }}>
      <div className="flex items-start gap-3">
        <div className="p-2 bg-accent/10 rounded-lg">
          <TrendingUp className="h-5 w-5 text-accent" />
        </div>
        <div className="flex-1">
          <h4 className="font-heading font-semibold text-foreground">Fixed Deposit</h4>
          <p className="text-sm text-muted-foreground mt-1">Earn up to 12% p.a.</p>
          <div className="mt-3 flex items-baseline gap-1">
            <span className="text-xl font-bold text-foreground">₽500,000</span>
            <span className="text-xs text-muted-foreground">maturity value</span>
          </div>
          <p className="text-xs text-success mt-1">↑ ₽45,000 interest earned</p>
        </div>
      </div>
    </div>
  );
};

export const NotificationsWidget = () => {
  const notifications = [
    { id: 1, text: "Bill payment due in 3 days", time: "2h ago" },
    { id: 2, text: "New cashback offer available", time: "5h ago" },
    { id: 3, text: "Security alert: New login detected", time: "1d ago" },
  ];

  return (
    <div className="bg-card rounded-lg p-5 border border-border card-shadow opacity-0 animate-fade-in" style={{ animationDelay: "300ms" }}>
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-heading font-semibold text-foreground flex items-center gap-2">
          <Bell className="h-4 w-4 text-primary" />
          Notifications
        </h4>
        <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">3</span>
      </div>
      <div className="space-y-2">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className="flex items-start gap-2 text-sm py-2 border-b border-border last:border-0"
          >
            <div className="w-1.5 h-1.5 bg-accent rounded-full mt-1.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-foreground leading-snug">{notification.text}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{notification.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const OffersWidget = () => {
  return (
    <div 
      className={cn(
        "rounded-lg p-5 border border-accent/30 overflow-hidden relative",
        "bg-gradient-to-r from-accent/10 via-accent/5 to-transparent",
        "opacity-0 animate-fade-in"
      )}
      style={{ animationDelay: "400ms" }}
    >
      <div className="absolute -right-4 -top-4 w-24 h-24 bg-accent/10 rounded-full blur-2xl" />
      <div className="relative">
        <div className="flex items-center gap-2 mb-2">
          <Gift className="h-5 w-5 text-accent" />
          <span className="text-xs font-medium text-accent uppercase tracking-wide">Special Offer</span>
        </div>
        <h4 className="font-heading font-semibold text-foreground text-lg">
          Refer & Earn ₽5,000
        </h4>
        <p className="text-sm text-muted-foreground mt-1">
          Invite friends and earn rewards for each successful referral.
        </p>
        <Button 
          size="sm" 
          className="mt-3 bg-accent hover:bg-accent/90 text-accent-foreground"
        >
          Learn More
        </Button>
      </div>
    </div>
  );
};