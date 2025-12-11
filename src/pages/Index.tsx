import { useState } from "react";
import { PiggyBank, Wallet, TrendingUp } from "lucide-react";
import { Header } from "@/components/dashboard/Header";
import { WelcomeSection } from "@/components/dashboard/WelcomeSection";
import { AccountCard } from "@/components/dashboard/AccountCard";
import { QuickTransfer } from "@/components/dashboard/QuickTransfer";
import { FavoriteActions } from "@/components/dashboard/FavoriteActions";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";
import {
  DepositWidget,
  NotificationsWidget,
  OffersWidget,
} from "@/components/dashboard/MiniWidgets";

const Index = () => {
  const [showBalances, setShowBalances] = useState(true);
  const [cardBalanceVisibility, setCardBalanceVisibility] = useState({
    savings: true,
    current: true,
    investment: true,
  });

  const toggleCardBalance = (card: keyof typeof cardBalanceVisibility) => {
    setCardBalanceVisibility((prev) => ({
      ...prev,
      [card]: !prev[card],
    }));
  };

  const handleGlobalBalanceToggle = (show: boolean) => {
    setShowBalances(show);
    setCardBalanceVisibility({
      savings: show,
      current: show,
      investment: show,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <WelcomeSection
            userName="Alexei"
            lastLogin="December 11, 2024 at 09:32 AM (Moscow)"
            showBalances={showBalances}
            onToggleBalances={handleGlobalBalanceToggle}
          />
        </div>

        {/* Account Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <AccountCard
            title="Savings Account"
            balance={1250340.75}
            accountNumber="40817810099994521"
            icon={PiggyBank}
            variant="maroon"
            showBalance={cardBalanceVisibility.savings}
            onToggleBalance={() => toggleCardBalance("savings")}
            delay={0}
          />
          <AccountCard
            title="Current Account"
            balance={89450.00}
            accountNumber="40817810099997832"
            icon={Wallet}
            variant="blue"
            showBalance={cardBalanceVisibility.current}
            onToggleBalance={() => toggleCardBalance("current")}
            delay={100}
          />
          <AccountCard
            title="Investment Account"
            balance={2500000.00}
            accountNumber="40817810099999156"
            icon={TrendingUp}
            variant="orange"
            showBalance={cardBalanceVisibility.investment}
            onToggleBalance={() => toggleCardBalance("investment")}
            delay={200}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Left Column - Quick Transfer */}
          <div className="lg:col-span-2">
            <QuickTransfer />
          </div>

          {/* Right Column - Favorite Actions */}
          <div>
            <FavoriteActions />
          </div>
        </div>

        {/* Transactions Section */}
        <div className="mb-8">
          <RecentTransactions />
        </div>

        {/* Widgets Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <DepositWidget />
          <NotificationsWidget />
          <OffersWidget />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-sm text-muted-foreground text-center">
            © 2024 New Moscow Bank. All rights reserved. Licensed by Central Bank of Russia.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;