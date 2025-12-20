import { Header } from "@/components/dashboard/Header";
import { useUser } from "@/contexts/UserContext";
import { AccountCard } from "@/components/dashboard/AccountCard";
import { QuickTransfer } from "@/components/dashboard/QuickTransfer";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ActionList } from "@/components/dashboard/ActionList";
import { useBalanceStore } from "@/hooks/useBalanceStore";

export const Index = () => {
  const { isVisible, toggleVisibility } = useBalanceStore();
  const { user } = useUser();


  return (
    <div className="min-h-screen bg-background pb-12 font-body selection:bg-banking-blue/20">
      <Header />

      <main className="container-centered pt-8 space-y-8">

        {/* Welcome Section */}
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-heading font-bold text-maroon tracking-tight">Welcome, {user.name.split(' ')[0]}</h1>
            <p className="text-muted-foreground mt-1 text-sm font-medium">Last login: {user.lastLogin || "First Session"}</p>
          </div>
          <Button
            variant="ghost"
            onClick={toggleVisibility}
            className="text-banking-blue hover:text-banking-blue/80 hover:bg-banking-blue/5 gap-2 font-medium"
          >
            {isVisible ? (
              <>
                <EyeOff className="h-4 w-4" /> Hide Balances
              </>
            ) : (
              <>
                <Eye className="h-4 w-4" /> Show Balances
              </>
            )}
          </Button>
        </div>

        {/* Account Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <AccountCard
            type="SAVINGS"
            balance={1250340.75}
            number="4521"
            isPrimary={true}
          />
          <AccountCard
            type="CURRENT"
            balance={89450.00}
            number="7832"
          />
          <AccountCard
            type="CREDIT"
            balance={2500000.00}
            number="9156"
          />
        </div>

        {/* Two-Column Main Area */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">

          {/* Left: Quick Transfer & Transactions (Span 8) */}
          <div className="md:col-span-8 space-y-8">
            <QuickTransfer />
            <RecentTransactions data={[]} />
          </div>

          {/* Right: Favorite Actions (Span 4) */}
          <div className="md:col-span-4 space-y-6">
            <ActionList />

            {/* Optional Mini Widget Space */}
            <div className="card-premium p-6 bg-gradient-to-br from-[#1E39C6] to-[#152a96] text-white border-none">
              <h4 className="font-heading font-semibold text-lg mb-2 text-white">Open Fixed Deposit</h4>
              <p className="text-white/80 text-sm mb-4">Earn up to 12% p.a. with our new tax-saving deposits.</p>
              <Button variant="secondary" className="w-full bg-white text-banking-blue hover:bg-white/90 font-semibold border-none">
                View Details
              </Button>
            </div>
          </div>

        </div>
      </main>
    </div>
  );

};

export default Index;