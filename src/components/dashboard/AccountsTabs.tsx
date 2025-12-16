import { useState, useRef, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { AnimatedTabs, Tab } from '@/components/ui/animated-tabs';
import { SpendingPieChart } from '@/components/dashboard/SpendingPieChart';
import { SendMoney } from '@/components/dashboard/SendMoney';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/hooks/useLanguage';
import { formatCurrency } from '@/utils/formatters';

interface Account {
  id: string;
  type: 'savings' | 'current' | 'fd';
  accountNumber: string;
  balance: number;
  nickname?: string;
  ifsc?: string;
  branch?: string;
  interestRate?: string;
  maturityDate?: string;
}

interface AccountsTabsProps {
  accounts: Account[];
  showBalance: boolean;
  onToggleBalance: () => void;
  loading?: boolean;
  sendMoneyAccounts?: Array<{
    accountNumber: string;
    type: string;
    balance: number;
  }>;
  savingsAccountNumber?: string;
  onTransfer?: (from: string, to: string, amount: number) => Promise<void>;
  onViewDetails?: (accountType: 'savings' | 'current' | 'fd') => void;
  onManageFDs?: () => void;
}

const formatAccountNumber = (accountNumber: string, revealed: boolean) => {
  if (!accountNumber) return '•••• •••• •••• •••• ••••';
  if (revealed) {
    // Format as 20-digit Russian bank account: XXXX XXXX XXXX XXXX XXXX
    const cleaned = accountNumber.replace(/\s/g, '');
    // Pad to 20 digits if needed
    const padded = cleaned.padStart(20, '0');
    return padded.match(/.{1,4}/g)?.join(' ') || accountNumber;
  }
  // Show last 4 digits in 20-digit Russian bank account format (5 groups of 4)
  const lastFour = accountNumber.slice(-4);
  return `•••• •••• •••• •••• ${lastFour}`;
};

// Account type configurations
const accountConfig = {
  savings: {
    borderColor: 'border-t-purple-500',
  },
  current: {
    borderColor: 'border-t-blue-500',
  },
  fd: {
    borderColor: 'border-t-orange-500',
  },
};

const getAccountLabel = (type: 'savings' | 'current' | 'fd', t: any) => {
  const labels: Record<string, string> = {
    savings: t.dashboard.accounts.savingsAccount,
    current: t.dashboard.accounts.currentAccount,
    fd: t.dashboard.accounts.fixedDeposit,
  };
  return labels[type] || 'Account';
};

export const AccountsTabs = ({
  accounts,
  showBalance,
  onToggleBalance,
  loading = false,
  sendMoneyAccounts,
  savingsAccountNumber,
  onTransfer,
  onViewDetails,
  onManageFDs,
}: AccountsTabsProps) => {
  const { t, language } = useLanguage();
  const [revealedAccounts, setRevealedAccounts] = useState<Set<string>>(new Set());
  const timeoutRefs = useRef<Map<string, NodeJS.Timeout>>(new Map());

  useEffect(() => {
    return () => {
      // Cleanup all timeouts on unmount
      timeoutRefs.current.forEach((timeout) => clearTimeout(timeout));
      timeoutRefs.current.clear();
    };
  }, []);

  const toggleReveal = (accountId: string) => {
    const newRevealed = new Set(revealedAccounts);
    if (newRevealed.has(accountId)) {
      newRevealed.delete(accountId);
      // Clear existing timeout for this account if any
      const existingTimeout = timeoutRefs.current.get(accountId);
      if (existingTimeout) {
        clearTimeout(existingTimeout);
        timeoutRefs.current.delete(accountId);
      }
    } else {
      newRevealed.add(accountId);
      // Auto re-mask after 5 seconds
      const timeout = setTimeout(() => {
        setRevealedAccounts((prev) => {
          const updated = new Set(prev);
          updated.delete(accountId);
          return updated;
        });
        timeoutRefs.current.delete(accountId);
      }, 5000);
      timeoutRefs.current.set(accountId, timeout);
    }
    setRevealedAccounts(newRevealed);
  };

  if (loading) {
    return (
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-heading font-bold text-nmb-charcoal">{t.dashboard.accounts.myAccounts}</h2>
            <p className="text-sm text-gray-500 mt-1">{t.dashboard.accounts.manageAndView}</p>
          </div>
          <div className="h-10 w-32 bg-gray-200 rounded-lg animate-pulse"></div>
        </div>
        <div className="h-[220px] bg-gray-200 rounded-3xl animate-pulse"></div>
      </div>
    );
  }

  if (!accounts || accounts.length === 0) {
    return null;
  }

  // Convert accounts to tabs
  const tabs: Tab[] = accounts.map((account) => {
    const isRevealed = revealedAccounts.has(account.id);
    const config = accountConfig[account.type];
    
    // Use nickname if available, otherwise fallback to account type
    const label = account.nickname || getAccountLabel(account.type, t);

    return {
      id: account.id,
      label: label,
      content: (
        <div className="w-full">
          <div className={cn(
            "bg-white rounded-2xl p-6 border-t-4 shadow-large hover:shadow-[0_8px_24px_rgba(0,0,0,0.15)] transition-all duration-300 hover:-translate-y-1",
            config.borderColor
          )}>
            {/* Header: Account Type */}
            <div className="mb-6">
              <h3 className="text-lg font-heading font-semibold text-nmb-charcoal">
                {getAccountLabel(account.type, t)}
              </h3>
              <p className="text-sm text-gray-500 mt-0.5">{t.dashboard.accounts.accountDetails}</p>
            </div>

            {/* Account Number Section */}
            <div className="mb-6 pb-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">
                    {t.dashboard.accounts.accountNumber}
                  </p>
                  <div className="flex items-center gap-3">
                    {(() => {
                      // Check if accountNumber is a text label (not a numeric account number)
                      const isTextLabel = !/^\d/.test(account.accountNumber) && !account.accountNumber.includes('****');
                      const displayText = isTextLabel 
                        ? account.accountNumber 
                        : formatAccountNumber(account.accountNumber, isRevealed);
                      
                      return (
                        <>
                          <p className={cn(
                            "text-xl font-semibold text-nmb-charcoal",
                            isTextLabel 
                              ? "font-sans font-medium tracking-normal" 
                              : "font-mono tracking-wider"
                          )}>
                            {displayText}
                          </p>
                          {!isTextLabel && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleReveal(account.id);
                              }}
                              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors group/eye"
                              aria-label={isRevealed ? 'Hide account number' : 'Reveal account number'}
                            >
                              {isRevealed ? (
                                <EyeOff className="h-4 w-4 text-gray-600 group-hover/eye:text-nmb-charcoal transition-colors" />
                              ) : (
                                <Eye className="h-4 w-4 text-gray-400 group-hover/eye:text-nmb-charcoal transition-colors" />
                              )}
                            </button>
                          )}
                        </>
                      );
                    })()}
                  </div>
                </div>
              </div>
            </div>

             {/* Balance Section */}
             <div className="mb-6">
               <p className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">
                 {t.dashboard.accounts.availableBalance}
               </p>
               <p className="text-4xl font-heading font-bold text-nmb-charcoal tabular-nums leading-tight">
                 {showBalance ? (
                   formatCurrency(account.balance)
                 ) : (
                   <span className="inline-flex items-center gap-2">
                     <span className="text-gray-400">{language === 'ru' ? '₽' : '₹'}</span>
                     <span className="flex gap-1.5">
                       {[1, 2, 3, 4, 5, 6].map((i) => (
                         <span key={i} className="w-2.5 h-2.5 bg-gray-300 rounded-full"></span>
                       ))}
                     </span>
                   </span>
                 )}
               </p>
             </div>

             {/* Account Details Grid */}
             <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
               {/* IFSC Code */}
               {account.ifsc && (
                 <div>
                   <p className="text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">
                     {t.dashboard.accounts.ifscCode}
                   </p>
                   <p className="text-sm font-mono font-semibold text-nmb-charcoal">
                     {account.ifsc}
                   </p>
                 </div>
               )}

               {/* Branch */}
               {account.branch && (
                 <div>
                   <p className="text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">
                     {t.dashboard.accounts.branch}
                   </p>
                   <p className="text-sm font-medium text-nmb-charcoal">
                     {account.branch === 'Cyber City Main' 
                       ? t.dashboard.accounts.branchNames.cyberCityMain 
                       : account.branch}
                   </p>
                 </div>
               )}

               {/* Account Type Specific Info */}
               {account.type === 'fd' && (
                 <>
                   {account.interestRate && (
                     <div>
                       <p className="text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">
                         {t.dashboard.accounts.interestRate}
                       </p>
                       <p className="text-sm font-semibold text-green-600">
                         {account.interestRate}
                       </p>
                     </div>
                   )}
                   {account.maturityDate && (
                     <div>
                       <p className="text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">
                         {t.dashboard.accounts.maturityDate}
                       </p>
                       <p className="text-sm font-medium text-nmb-charcoal">
                         {account.maturityDate}
                       </p>
                     </div>
                   )}
                 </>
               )}

               {/* Default Account Status */}
               {account.type !== 'fd' && (
                 <>
                   <div>
                     <p className="text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">
                       {t.dashboard.accounts.accountStatus}
                     </p>
                     <div className="flex items-center gap-2">
                       <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                       <p className="text-sm font-medium text-nmb-charcoal">
                         {t.dashboard.accounts.active}
                       </p>
                     </div>
                   </div>
                   {!account.ifsc && !account.branch && (
                     <div>
                       <p className="text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">
                         {t.dashboard.accounts.accountType}
                       </p>
                       <p className="text-sm font-medium text-nmb-charcoal capitalize">
                         {getAccountLabel(account.type, t)}
                       </p>
                     </div>
                   )}
                 </>
               )}
             </div>

             {/* Footer: View Details Button */}
             {onViewDetails && (
               <div className="mt-6 pt-6 border-t border-gray-100">
                 <Button
                   onClick={(e) => {
                     e.stopPropagation();
                     onViewDetails(account.type);
                   }}
                   variant="outline"
                   className="w-full border-nmb-maroon/30 text-nmb-maroon hover:bg-nmb-maroon/10 hover:border-nmb-maroon transition-colors"
                 >
                   View Details
                 </Button>
               </div>
             )}
          </div>
        </div>
      ),
    };
  });

  return (
    <div className="mb-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-heading font-bold text-nmb-charcoal">{t.dashboard.accounts.myAccounts}</h2>
          <p className="text-sm text-gray-500 mt-1">{t.dashboard.accounts.manageAndView}</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Manage FDs Button */}
          {onManageFDs && accounts.some(acc => acc.type === 'fd') && (
            <div className="flex items-center gap-2 bg-white rounded-lg px-4 py-2.5 border border-nmb-mist shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={onManageFDs}>
              <span className="text-sm font-medium text-nmb-charcoal">Manage FDs</span>
            </div>
          )}

          {/* Toggle Balance */}
          <div className="flex items-center gap-3 bg-white rounded-lg px-4 py-2.5 border border-nmb-mist shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2">
              {showBalance ? (
                <Eye className="h-4 w-4 text-gray-600" />
              ) : (
                <EyeOff className="h-4 w-4 text-gray-400" />
              )}
              <Label
                htmlFor="balance-toggle"
                className="text-sm font-medium text-nmb-charcoal cursor-pointer select-none"
              >
                {showBalance ? t.dashboard.accounts.hideBalance : t.dashboard.accounts.showBalance}
              </Label>
            </div>
            <Switch id="balance-toggle" checked={showBalance} onCheckedChange={onToggleBalance} />
          </div>
        </div>
      </div>

      {/* Accounts and Chart Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6 items-start">
        {/* Left Column: Accounts and Send Money */}
        <div className="flex flex-col gap-0">
          {/* Animated Tabs */}
          <div className="mb-6">
            <AnimatedTabs tabs={tabs} defaultTab={accounts[0]?.id} />
          </div>

          {/* Send Money */}
          {sendMoneyAccounts && sendMoneyAccounts.length > 0 && onTransfer && (
            <SendMoney
              accounts={sendMoneyAccounts}
              onTransfer={onTransfer}
              loading={loading}
              savingsAccountNumber={savingsAccountNumber}
            />
          )}
        </div>

        {/* Right Column: Spending Pie Chart */}
        <div className="lg:sticky lg:top-6 lg:self-start">
          <SpendingPieChart />
        </div>
      </div>
    </div>
  );
};

