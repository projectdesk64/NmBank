import {
  FileText,
  ArrowLeftRight,
  Receipt,
  PiggyBank,
  FileCheck,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const actions = [
  { id: 1, label: "Account Statement", icon: FileText },
  { id: 2, label: "Transfer Funds", icon: ArrowLeftRight },
  { id: 3, label: "Pay Bills", icon: Receipt },
  { id: 4, label: "Open Deposit", icon: PiggyBank },
  { id: 5, label: "Tax Certificate", icon: FileCheck },
];

export const FavoriteActions = () => {
  return (
    <div className="bg-card rounded-lg p-6 border border-border card-shadow">
      <h3 className="font-heading font-semibold text-lg text-foreground mb-4">
        Favorite Actions
      </h3>

      <div className="space-y-1">
        {actions.map((action, index) => (
          <button
            key={action.id}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-3 rounded-lg",
              "text-foreground hover:bg-secondary/80 transition-colors",
              "group text-left opacity-0 animate-fade-in"
            )}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
              <action.icon className="h-4 w-4 text-primary" />
            </div>
            <span className="flex-1 text-sm font-medium">{action.label}</span>
            <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
          </button>
        ))}
      </div>
    </div>
  );
};