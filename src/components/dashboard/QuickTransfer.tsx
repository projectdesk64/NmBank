import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const accounts = [
  { id: "savings", name: "Savings Account", number: "****4521" },
  { id: "current", name: "Current Account", number: "****7832" },
  { id: "investment", name: "Investment Account", number: "****9156" },
];

export const QuickTransfer = () => {
  const [fromAccount, setFromAccount] = useState("");
  const [toAccount, setToAccount] = useState("");
  const [amount, setAmount] = useState("");
  const { toast } = useToast();

  const handleTransfer = () => {
    if (!fromAccount || !toAccount || !amount) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields to proceed.",
        variant: "destructive",
      });
      return;
    }

    if (fromAccount === toAccount) {
      toast({
        title: "Invalid Selection",
        description: "Source and destination accounts must be different.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Transfer Initiated",
      description: `₽${parseFloat(amount).toLocaleString()} transfer has been initiated.`,
    });

    setAmount("");
  };

  return (
    <div className="bg-card rounded-lg p-6 border border-border card-shadow">
      <h3 className="font-heading font-semibold text-lg text-foreground mb-4">
        Quick Transfer
      </h3>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="from-account" className="text-sm font-medium">
            From Account
          </Label>
          <Select value={fromAccount} onValueChange={setFromAccount}>
            <SelectTrigger id="from-account" className="bg-secondary/50">
              <SelectValue placeholder="Select source account" />
            </SelectTrigger>
            <SelectContent>
              {accounts.map((account) => (
                <SelectItem key={account.id} value={account.id}>
                  <span className="flex items-center gap-2">
                    {account.name}
                    <span className="text-muted-foreground text-xs">
                      {account.number}
                    </span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="to-account" className="text-sm font-medium">
            To Account
          </Label>
          <Select value={toAccount} onValueChange={setToAccount}>
            <SelectTrigger id="to-account" className="bg-secondary/50">
              <SelectValue placeholder="Select destination account" />
            </SelectTrigger>
            <SelectContent>
              {accounts.map((account) => (
                <SelectItem key={account.id} value={account.id}>
                  <span className="flex items-center gap-2">
                    {account.name}
                    <span className="text-muted-foreground text-xs">
                      {account.number}
                    </span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="amount" className="text-sm font-medium">
            Amount (₽)
          </Label>
          <Input
            id="amount"
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="bg-secondary/50"
          />
        </div>

        <Button
          onClick={handleTransfer}
          className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-medium"
        >
          Transfer Now
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};