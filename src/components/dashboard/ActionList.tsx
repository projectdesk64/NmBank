import { ArrowUpRight, FileText, Zap, Receipt, Landmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const actions = [
    { id: 1, label: "Transfer Funds", icon: ArrowUpRight, color: "text-banking-blue bg-banking-blue/10" },
    { id: 2, label: "Pay Bills", icon: Receipt, color: "text-warm-orange bg-warm-orange/10" },
    { id: 3, label: "Account Statement", icon: FileText, color: "text-maroon bg-maroon/10" },
    { id: 4, label: "Open Deposit", icon: Landmark, color: "text-emerald-600 bg-emerald-600/10" },
    { id: 5, label: "Tax Certificate", icon: Zap, color: "text-purple-600 bg-purple-600/10" },
];

export const ActionList = () => {
    return (
        <div className="card-premium p-6">
            <h3 className="font-heading font-semibold text-lg text-foreground mb-4 flex items-center gap-2">
                Favorite Actions
            </h3>
            <div className="space-y-2">
                {actions.map((action) => (
                    <Button
                        key={action.id}
                        variant="ghost"
                        className="w-full justify-start h-14 rounded-xl hover:bg-black/5 group"
                    >
                        <div className={cn("h-10 w-10 rounded-lg flex items-center justify-center mr-3 transition-colors", action.color)}>
                            <action.icon className="h-5 w-5" />
                        </div>
                        <span className="font-body font-medium text-foreground group-hover:translate-x-1 transition-transform">{action.label}</span>
                    </Button>
                ))}
            </div>
        </div>
    );
};
