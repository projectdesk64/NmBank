import { Eye, EyeOff } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface WelcomeSectionProps {
  userName: string;
  lastLogin: string;
  showBalances: boolean;
  onToggleBalances: (show: boolean) => void;
}

export const WelcomeSection = ({
  userName,
  lastLogin,
  showBalances,
  onToggleBalances,
}: WelcomeSectionProps) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fade-in">
      <div>
        <h1 className="text-2xl sm:text-3xl font-heading font-semibold text-foreground">
          Welcome, {userName}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Last login: {lastLogin}
        </p>
      </div>
      
      <div className="flex items-center gap-3 bg-card rounded-lg px-4 py-2 border border-border">
        {showBalances ? (
          <Eye className="h-4 w-4 text-muted-foreground" />
        ) : (
          <EyeOff className="h-4 w-4 text-muted-foreground" />
        )}
        <Label htmlFor="balance-toggle" className="text-sm font-medium cursor-pointer">
          {showBalances ? "Hide" : "Show"} Balances
        </Label>
        <Switch
          id="balance-toggle"
          checked={showBalances}
          onCheckedChange={onToggleBalances}
        />
      </div>
    </div>
  );
};