import {
  ShoppingCart,
  Coffee,
  Utensils,
  Zap,
  CreditCard,
  ArrowDownLeft,
  ArrowUpRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface Transaction {
  id: string;
  description: string;
  category: string;
  amount: number;
  date: string;
  type: "credit" | "debit";
  icon: typeof ShoppingCart;
}

const transactions: Transaction[] = [
  {
    id: "1",
    description: "Salary Deposit",
    category: "Income",
    amount: 150000,
    date: "Dec 10, 2024",
    type: "credit",
    icon: ArrowDownLeft,
  },
  {
    id: "2",
    description: "Pyaterochka",
    category: "Groceries",
    amount: 3250,
    date: "Dec 09, 2024",
    type: "debit",
    icon: ShoppingCart,
  },
  {
    id: "3",
    description: "Coffee House",
    category: "Dining",
    amount: 450,
    date: "Dec 09, 2024",
    type: "debit",
    icon: Coffee,
  },
  {
    id: "4",
    description: "Moscow Power",
    category: "Utilities",
    amount: 2800,
    date: "Dec 08, 2024",
    type: "debit",
    icon: Zap,
  },
  {
    id: "5",
    description: "Restaurant Pushkin",
    category: "Dining",
    amount: 8500,
    date: "Dec 07, 2024",
    type: "debit",
    icon: Utensils,
  },
  {
    id: "6",
    description: "Transfer from Ivan",
    category: "Transfer",
    amount: 25000,
    date: "Dec 06, 2024",
    type: "credit",
    icon: ArrowDownLeft,
  },
  {
    id: "7",
    description: "Card Payment",
    category: "Shopping",
    amount: 12000,
    date: "Dec 05, 2024",
    type: "debit",
    icon: CreditCard,
  },
];

export const RecentTransactions = () => {
  const formatAmount = (amount: number, type: "credit" | "debit") => {
    const formatted = new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
      minimumFractionDigits: 0,
    }).format(amount);
    return type === "credit" ? `+${formatted}` : `-${formatted}`;
  };

  return (
    <div className="bg-card rounded-lg border border-border card-shadow">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="font-heading font-semibold text-lg text-foreground">
            Recent Transactions
          </h3>
          <Button variant="link" className="text-link hover:text-link/80 p-0 h-auto">
            View All →
          </Button>
        </div>
      </div>

      <div className="divide-y divide-border">
        {transactions.map((transaction, index) => (
          <div
            key={transaction.id}
            className={cn(
              "flex items-center gap-4 px-6 py-4 hover:bg-secondary/30 transition-colors",
              "opacity-0 animate-fade-in"
            )}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div
              className={cn(
                "p-2.5 rounded-lg",
                transaction.type === "credit"
                  ? "bg-success/10 text-success"
                  : "bg-primary/10 text-primary"
              )}
            >
              <transaction.icon className="h-4 w-4" />
            </div>

            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground truncate">
                {transaction.description}
              </p>
              <p className="text-sm text-muted-foreground">{transaction.category}</p>
            </div>

            <div className="text-right">
              <p
                className={cn(
                  "font-semibold",
                  transaction.type === "credit" ? "text-success" : "text-foreground"
                )}
              >
                {formatAmount(transaction.amount, transaction.type)}
              </p>
              <p className="text-xs text-muted-foreground">{transaction.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};