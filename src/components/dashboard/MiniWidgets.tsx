import { TrendingUp, Bell, Gift, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const DepositWidget = () => {
  return (
    <div className="glass-card rounded-3xl p-5 relative overflow-hidden group hover:bg-white/10 transition-colors">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-neon-purple/20 rounded-2xl">
          <TrendingUp className="h-6 w-6 text-neon-purple" />
        </div>
        <div className="flex-1">
          <h4 className="font-heading font-semibold text-white">Fixed Deposit</h4>
          <div className="mt-2 flex flex-col">
            <span className="text-2xl font-bold text-white tracking-tight">₽500,000</span>
            <span className="text-xs text-muted-foreground uppercase tracking-wider">Maturity Value</span>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-xs font-medium text-neon-lime px-2 py-1 bg-neon-lime/10 rounded-lg">
              +12% p.a.
            </span>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-white/50 hover:text-white">
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const NotificationsWidget = () => {
  const notifications = [
    { id: 1, text: "Bill payment due in 3 days", time: "2h ago", important: true },
    { id: 2, text: "New cashback offer available", time: "5h ago", important: false },
  ];

  return (
    <div className="glass-card rounded-3xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-heading font-semibold text-white flex items-center gap-2">
          <Bell className="h-4 w-4 text-neon-lime" />
          Updates
        </h4>
        <span className="text-xs bg-neon-lime text-black font-bold px-2 py-0.5 rounded-full">2</span>
      </div>
      <div className="space-y-4">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className="flex items-start gap-3 text-sm group cursor-pointer"
          >
            <div className={cn("w-2 h-2 rounded-full mt-1.5 flex-shrink-0", notification.important ? "bg-neon-lime shadow-[0_0_8px_rgba(190,242,100,0.5)]" : "bg-white/20")} />
            <div className="flex-1">
              <p className="text-white/90 leading-snug group-hover:text-white transition-colors">{notification.text}</p>
              <p className="text-xs text-white/40 mt-1 font-mono">{notification.time}</p>
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
        "rounded-3xl p-5 border border-neon-blue/20 overflow-hidden relative group",
        "bg-gradient-to-br from-neon-blue/10 via-[#0F172A] to-[#0F172A]",
      )}
    >
      <div className="absolute -right-8 -top-8 w-32 h-32 bg-neon-blue/20 rounded-full blur-2xl group-hover:bg-neon-blue/30 transition-colors duration-500" />

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-1.5 bg-neon-blue/20 rounded-lg">
            <Gift className="h-4 w-4 text-neon-blue" />
          </div>
          <span className="text-[10px] font-bold text-neon-blue uppercase tracking-widest border border-neon-blue/30 px-2 py-0.5 rounded-full">
            Special
          </span>
        </div>

        <h4 className="font-heading font-bold text-white text-lg leading-tight">
          Refer & Earn <br /><span className="text-neon-blue">₽5,000</span>
        </h4>

        <Button
          size="sm"
          className="mt-4 w-full bg-neon-blue hover:bg-neon-blue/90 text-white font-semibold rounded-xl shadow-[0_0_15px_rgba(14,165,233,0.3)]"
        >
          Invite Friends
        </Button>
      </div>
    </div>
  );
};