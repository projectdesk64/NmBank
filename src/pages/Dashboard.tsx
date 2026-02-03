import { useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { useNavigate } from 'react-router-dom';
import { HeroSection } from '@/components/dashboard/HeroSection';
import { SummaryStats } from '@/components/dashboard/SummaryStats';
import { AccountsTabs } from '@/components/dashboard/AccountsTabs';
import { BillsRecharge } from '@/components/dashboard/BillsRecharge';
import { QuickLinks } from '@/components/dashboard/QuickLinks';
import { FavouriteLinks } from '@/components/dashboard/FavouriteLinks';
import { RecentTransactions, Transaction as RecentTransaction } from '@/components/dashboard/RecentTransactions';
import { AccountDetailsModal } from '@/components/dashboard/AccountDetailsModal';
import { toast } from '@/hooks/use-toast';
import { useLanguage } from '@/hooks/useLanguage';
import { formatCurrency } from '@/utils/formatters';

import { useUser } from '@/contexts/UserContext';


// Helper to handle date formatting safely
const formatDate = (dateStr: string | null | undefined, language: 'en' | 'ru'): string => {
  if (!dateStr) return 'N/A';
  try {
    const date = new Date(dateStr);
    const locale = language === 'ru' ? 'ru-RU' : 'en-IN';
    return new Intl.DateTimeFormat(locale, {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  } catch {
    return 'N/A';
  }
};



const formatTransactionDate = (dateStr: string | null | undefined, language: 'en' | 'ru'): string => {
  if (!dateStr) return 'N/A';
  return formatTransactionDateFromISO(dateStr, language);
};

// Format transaction date from ISO string (for mock data)
// Dynamically compares with current date - shows "Today" only if transaction date matches today's date
const formatTransactionDateFromISO = (dateString: string, language: 'en' | 'ru'): string => {
  try {
    const date = new Date(dateString);
    const now = new Date();

    // Get today's date at midnight for accurate comparison
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Get yesterday's date for comparison
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Get transaction date at midnight (ignore time for date comparison)
    const transactionDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    const locale = language === 'ru' ? 'ru-RU' : 'en-IN';

    // Compare dates (not times) - this ensures "Today" only shows when dates actually match
    if (transactionDate.getTime() === today.getTime()) {
      // Transaction is from today - show "Today"
      const todayText = language === 'ru' ? 'Сегодня' : 'Today';
      return `${todayText}, ${date.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit', hour12: language === 'en' })}`;
    } else if (transactionDate.getTime() === yesterday.getTime()) {
      // Transaction is from yesterday - show "Yesterday"
      const yesterdayText = language === 'ru' ? 'Вчера' : 'Yesterday';
      return `${yesterdayText}, ${date.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit', hour12: language === 'en' })}`;
    } else {
      // Transaction is from another day - show full date (e.g., "26 Jan 2026, 05:14 PM")
      return new Intl.DateTimeFormat(locale, {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: language === 'en',
      }).format(date);
    }
  } catch (error) {
    return 'N/A';
  }
};

export const Dashboard = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const { user, transferMoney } = useUser();
  const [loading] = useState(false);
  const [showBalance, setShowBalance] = useState(true);
  const [isFDModalOpen, setIsFDModalOpen] = useState(false);

  // Derived state from user context
  const balance = user.accounts.reduce((sum, acc) => sum + acc.balance, 0);
  const profile = { name: user.name, email: user.email, phone: '', customerId: user.id, joinedAt: null }; // Mapping user to profile structure if needed
  const fixedDeposits = useMemo(() => {
    return user.accounts
      .filter((acc) => acc.type === 'Fixed Deposit')
      .map((acc) => ({
        id: acc.id,
        certificateNo: acc.accountNumber,
        principal: acc.balance,
        rate: acc.interestRate || 0,
        maturityDate: acc.maturityDate || new Date().toISOString(),
        accruedInterest: 0,
        status: (acc.status === 'Active' ? 'Active' : 'Closed') as 'Active' | 'Closed',
        nickname: acc.nickname
      }));
  }, [user.accounts]);
  const transactions = user.transactions || [];
  const accountDetails = useMemo(() => {
    return user.accounts.find(a => ['savings', 'checking', 'current'].includes(a.type.toLowerCase())) || user.accounts[0] || null;
  }, [user.accounts]);

  // Calculate live balance from transaction history
  const liveBalance = useMemo(() => {
    // Check if transaction is a new January 2026 transaction by ID pattern
    const isNewTransaction = (t: typeof user.transactions[0]) => {
      return t.id?.startsWith('t_jan26_2026_') || t.id?.startsWith('t_jan24_2026_') || t.id?.startsWith('t_feb03_2026_');
    };

    // Sort Oldest -> Newest to simulate history (optional, but good for accuracy)
    const sorted = [...user.transactions].sort((a, b) =>
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // Replay transactions to get final sum
    // For new transactions, amounts are in kopecks (divide by 100)
    // For old transactions, amounts are already in rubles
    return sorted.reduce((acc, t) => {
      let amount = typeof t.amount === 'string' ? parseFloat(t.amount) : t.amount;
      // Convert kopecks to rubles for new transactions
      if (isNewTransaction(t)) {
        amount = amount / 100;
      }
      return t.type === 'credit' ? acc + amount : acc - amount;
    }, 0);
  }, [user.transactions]);

  const formatIndianRuble = (amount: number) => {
    // Format using Indian locale for the commas (lakhs/crores format)
    // en-IN locale uses period for decimal separator, which matches desired format
    const formatted = amount.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    return formatted + ' ₽';
  };

  // Calculate totals from context data
  const mockTotalBalance = formatIndianRuble(liveBalance);

  // Active loans count (available for future use)
  // const mockActiveLoans = useMemo(() => {
  //   return mockUser.loans.filter(loan => loan.status === 'Active').length;
  // }, []);

  // Total deposits value (available for future use)
  // const mockTotalDeposits = useMemo(() => {
  //   return mockUser.deposits
  //     .filter(dep => dep.status === 'Active')
  //     .reduce((sum, dep) => sum + dep.principal, 0);
  // }, []);

  const mockActiveDepositsCount = 1;

  // Get recent transactions from context (first 5)
  const mockRecentTransactions = useMemo(() => {
    // Check if transaction is a new January 2026 transaction by ID pattern
    const isNewTransaction = (t: typeof user.transactions[0]) => {
      return t.id?.startsWith('t_jan26_2026_') || t.id?.startsWith('t_jan24_2026_') || t.id?.startsWith('t_feb03_2026_');
    };

    // Generate referenceId if not provided in transaction data
    const generateReferenceId = (index: number) => {
      // Fallback: Generate a consistent ID based on transaction index
      // Base timestamp: 1769427869697, increment by index
      const baseTimestamp = 1769427869697;
      const transactionIndex = user.transactions.length - index; // Reverse index for newest first
      return `txn-${baseTimestamp + transactionIndex}`;
    };

    const sortedTransactions = [...user.transactions]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);

    // Find original index in full transactions array for fallback ID generation
    const getOriginalIndex = (tx: typeof user.transactions[0]) => {
      return user.transactions.findIndex(t => t.id === tx.id);
    };

    return sortedTransactions.map((tx) => {
      // Use date directly from transaction (should already include time if provided)
      const originalIndex = getOriginalIndex(tx);

      return {
        id: tx.id,
        description: tx.description,
        // For new transactions, divide by 100 (kopecks to rubles)
        amount: isNewTransaction(tx) ? tx.amount / 100 : tx.amount,
        date: formatTransactionDateFromISO(tx.date, language),
        type: tx.type as 'credit' | 'debit',
        // Use referenceId from transaction if provided, otherwise generate one
        referenceId: tx.referenceId || generateReferenceId(originalIndex),
        category: tx.category,
      };
    });
  }, [user.transactions, language]);

  // Removed Firebase subscription effect

  const handleTransfer = async (from: string, to: string, amount: number) => {
    try {
      await transferMoney(from, to, amount);
      toast({
        title: "Transfer Successful",
        description: `Successfully transferred ${formatCurrency(amount)} to ${to}`,
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Transfer failed. Please try again.';
      toast({
        title: "Transfer Failed",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    }
  };

  const handleCreateFD = async (_amount: number) => {
    // Placeholder for future FD creation logic using UserContext
    toast({
      title: "Feature Coming Soon",
      description: "Creating fixed deposits via this demo is not yet supported in the context.",
    });
    // To allow logic flow without crashing
    setIsFDModalOpen(false);
  };

  const lastLoginDate = user.lastLogin || (profile?.joinedAt ? formatDate(profile.joinedAt, language) : 'N/A');

  // Filter only active deposits (keeping for Firebase compatibility, but using mock data primarily)
  // const activeDeposits = fixedDeposits?.filter(fd => fd?.status === 'Active' || fd?.status === 'active') || [];
  // const totalFD = activeDeposits.reduce((sum, fd) => sum + (fd?.principal || 0), 0);
  // const activeFDCount = activeDeposits.length;

  // Calculate monthly spending (debits from current month) - using mock data
  // Use the provided mock spending stats if available
  const displayMonthlySpending = 0;

  // Calculate spending change (compare current month with previous month) - using mock data
  const spendingChange = useMemo(() => {
    const now = new Date();
    const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfPreviousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfPreviousMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    // Calculate from context data
    const currentMonthSpending = user.transactions
      .filter(tx => {
        try {
          const txDate = new Date(tx.date);
          return txDate >= startOfCurrentMonth && tx.type === 'debit';
        } catch {
          return false;
        }
      })
      .reduce((sum, tx) => sum + Math.abs(tx.amount || 0), 0);

    const previousMonthSpending = user.transactions
      .filter(tx => {
        try {
          const txDate = new Date(tx.date);
          return txDate >= startOfPreviousMonth && txDate <= endOfPreviousMonth && tx.type === 'debit';
        } catch {
          return false;
        }
      })
      .reduce((sum, tx) => sum + Math.abs(tx.amount || 0), 0);

    if (previousMonthSpending === 0) {
      return currentMonthSpending > 0 ? 100 : 0; // New spending or no change
    }

    const change = ((currentMonthSpending - previousMonthSpending) / previousMonthSpending) * 100;
    return Math.round(change * 10) / 10; // Round to 1 decimal place
  }, []);

  // Prepare accounts for carousel (using mock data)
  const accounts = useMemo(() => {
    return user.accounts.map((acc) => {
      let type: 'savings' | 'current' | 'fd' = 'savings';
      if (acc.type === 'Fixed Deposit') {
        type = 'fd';
      } else if (acc.type.toLowerCase() === 'checking') {
        type = 'current';
      }

      return {
        id: acc.id,
        type: type,
        accountNumber: acc.accountNo,
        balance: type === 'savings' ? formatIndianRuble(liveBalance) : acc.balance,
        currency: acc.currency,
        iban: acc.iban,
        nickname: acc.nickname,
        // Add specific properties for FD if needed by the component
        interestRate: acc.interestRate?.toString(),
        maturityDate: acc.maturityDate,
        status: acc.status,
      };
    });
  }, [user.accounts]);

  // Transform transactions for RecentTransactions component (fallback to Firebase if available)
  const transformedTransactions: RecentTransaction[] = useMemo(() => {
    // Prefer mock data, fallback to Firebase transactions if available
    if (mockRecentTransactions.length > 0) {
      return mockRecentTransactions;
    }
    if (!transactions || transactions.length === 0) return [];
    return transactions.map((tx) => ({
      id: tx?.id || '',
      description: tx?.description || 'Transaction',
      amount: tx?.amount || 0,
      date: formatTransactionDate(tx?.date || null, language),
      type: tx?.type === 'credit' ? 'credit' : 'debit',
      referenceId: tx?.id || '',
      category: tx?.category || 'Other',
    }));
  }, [transactions, language, mockRecentTransactions]);

  // Prepare accounts for SendMoney component
  const sendMoneyAccounts = useMemo(() => {
    return user.accounts.map((acc) => ({
      accountNumber: acc.accountNumber,
      type: acc.type,
      balance: acc.balance,
      nickname: acc.nickname,
    }));
  }, [user.accounts]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-[280px] bg-gray-200 rounded-3xl"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-2xl"></div>
              ))}
            </div>
            <div className="h-64 bg-gray-200 rounded-2xl"></div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-6">
        {/* Hero Section */}
        <HeroSection
          userName={profile?.name || 'User'}
          lastLogin={lastLoginDate}
        />

        {/* Summary Stats */}
        <SummaryStats
          totalBalance={mockTotalBalance}
          monthlySpending={displayMonthlySpending}
          activeFDs={mockActiveDepositsCount}
          spendingChange={spendingChange}
          loading={loading}
        />

        {/* My Accounts Tabs */}
        <div className="mb-6">


          <AccountsTabs
            accounts={accounts}
            showBalance={showBalance}
            onToggleBalance={() => setShowBalance(!showBalance)}
            loading={loading}
            sendMoneyAccounts={sendMoneyAccounts}
            savingsAccountNumber={accountDetails?.accountNumber}
            onTransfer={handleTransfer}
            onManageFDs={() => setIsFDModalOpen(true)}
            onViewDetails={(accountType) => {
              if (accountType === 'fd') {
                navigate('/dashboard/fixed-deposits');
              } else if (accountType === 'savings' || accountType === 'current') {
                // Show savings account details
                if (accountDetails) {
                  toast({
                    title: `${accountType === 'current' ? 'Current' : 'Savings'} Account Details`,
                    description: `Account: ${accountDetails.accountNumber} | IFSC: ${accountDetails.ifsc} | Branch: ${accountDetails.branch}`,
                  });
                }
              }
            }}
          />
        </div>


        {/* Bills & Recharge */}
        <div className="mb-6">
          <BillsRecharge />
        </div>

        {/* Split Layout: Quick Links (60%) + Favourite Links (40%) */}
        <div className="grid grid-cols-1 lg:grid-cols-[60%_40%] gap-6 mb-6">
          {/* Quick Links */}
          <QuickLinks />

          {/* Favourite Links */}
          <FavouriteLinks />
        </div>

        {/* Recent Transactions */}
        <div className="mb-6">
          <RecentTransactions
            data={mockRecentTransactions.length > 0 ? mockRecentTransactions : transformedTransactions}
            loading={loading}
          />
        </div>
      </div>

      {/* Account Details Modal */}
      <AccountDetailsModal
        isOpen={isFDModalOpen}
        onClose={() => setIsFDModalOpen(false)}
        balance={balance}
        fixedDeposits={fixedDeposits}
        onCreateFD={handleCreateFD}
      />
    </DashboardLayout>
  );
};
