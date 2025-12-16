import React, { useState } from 'react';
import { Wallet, TrendingUp, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/useLanguage';
import { formatCurrency } from '@/utils/formatters';

export interface Profile {
  name: string;
  email?: string;
  phone?: string;
  customerId?: string;
}

export interface SavingsAccount {
  accountNumber: string;
  balance: number;
  ifsc?: string;
  branch?: string;
}

export interface FixedDeposit {
  total: number;
  interestRate?: string;
  count?: number;
}

export interface AccountsData {
  savings: SavingsAccount;
  fixedDeposit: FixedDeposit;
}

interface AccountsRowProps {
  profile: Profile;
  accounts: AccountsData;
  showBalance?: boolean;
  onToggleBalance?: (show: boolean) => void;
}

const formatAccountNumber = (accountNumber: string) => {
  if (!accountNumber) return '•••• •••• •••• •••• ••••';
  const lastFour = accountNumber.slice(-4);
  return `•••• •••• •••• •••• ${lastFour}`;
};

export const AccountsRow = ({ 
  profile, 
  accounts, 
  showBalance: showBalanceProp,
  onToggleBalance 
}: AccountsRowProps) => {
  const { language } = useLanguage();
  const [showBalanceLocal, setShowBalanceLocal] = useState(true);
  
  // Use prop if provided, otherwise use local state
  const showBalance = showBalanceProp !== undefined ? showBalanceProp : showBalanceLocal;
  const toggleBalance = () => {
    const newValue = !showBalance;
    if (onToggleBalance) {
      onToggleBalance(newValue);
    } else {
      setShowBalanceLocal(newValue);
    }
  };

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between px-1">
        <div>
          <h2 className="text-lg font-heading font-semibold text-nmb-charcoal">
            Welcome, {profile.name}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">My Accounts</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            onClick={toggleBalance}
            className="text-banking-blue hover:text-banking-blue/80 hover:bg-banking-blue/5 gap-2 font-medium"
          >
            {showBalance ? (
              <>
                <EyeOff className="h-4 w-4" /> Hide Balances
              </>
            ) : (
              <>
                <Eye className="h-4 w-4" /> Show Balances
              </>
            )}
          </Button>
          <button className="text-sm font-medium text-nmb-orange hover:text-orange-600 transition-colors flex items-center gap-1">
            View Financial Report
          </button>
        </div>
      </div>

      {/* Account Cards Grid - HDFC Style */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Savings Account Card */}
        <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl p-6 shadow-lg border border-blue-100 hover:shadow-xl transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-gray-600 text-sm mb-1 font-medium">Savings Account</p>
              <p className="text-lg font-semibold text-slate-800">
                {formatAccountNumber(accounts.savings.accountNumber)}
              </p>
            </div>
            <Wallet className="h-8 w-8 text-blue-600" />
          </div>
          <div className="mt-6">
            <p className="text-gray-600 text-sm mb-2 font-medium">Available Balance</p>
            <p className="text-3xl font-bold text-slate-800">
              {showBalance ? formatCurrency(accounts.savings.balance) : '₽ ••••••'}
            </p>
          </div>
        </div>

        {/* FD Summary Card */}
        <div className="bg-gradient-to-br from-white to-orange-50 rounded-2xl p-6 shadow-lg border border-orange-100 hover:shadow-xl transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-gray-600 text-sm mb-1 font-medium">Total Deposits</p>
              <p className="text-3xl font-bold text-slate-800">
                {showBalance ? formatCurrency(accounts.fixedDeposit.total) : '₽ ••••••'}
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-orange-600" />
          </div>
          <div className="mt-6">
            {accounts.fixedDeposit.interestRate && (
              <span className="inline-block px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-semibold border border-orange-200">
                {accounts.fixedDeposit.interestRate} Interest
              </span>
            )}
            {accounts.fixedDeposit.count && (
              <p className="text-gray-600 text-xs mt-2">
                {accounts.fixedDeposit.count} Active Deposit{accounts.fixedDeposit.count !== 1 ? 's' : ''}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
