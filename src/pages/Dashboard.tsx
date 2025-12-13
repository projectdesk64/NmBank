import { useState, useEffect, useMemo } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, onSnapshot, collection, query, orderBy, limit, Timestamp, runTransaction, arrayUnion, addDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { useNavigate } from 'react-router-dom';
import { performTransfer } from '@/lib/transactionService';
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
import { formatCurrency } from '@/lib/utils';

interface Profile {
  name: string;
  email: string;
  phone: string;
  customerId: string;
  joinedAt: Timestamp | null;
}

interface AccountDetails {
  accountNumber: string;
  ifsc: string;
  branch: string;
  type: string;
}

interface FixedDeposit {
  id: string;
  principal: number;
  interestRate: string;
  maturityDate: string;
  status: string;
}

interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: string;
  category: string;
  date: Timestamp | Date | null;
  status: string;
}

type TimestampType = Timestamp | Date | string | null;

const formatDate = (timestamp: TimestampType, language: 'en' | 'ru'): string => {
  if (!timestamp) return 'N/A';
  try {
    const date = timestamp instanceof Timestamp 
      ? timestamp.toDate() 
      : timestamp instanceof Date 
        ? timestamp 
        : new Date(timestamp);
    const locale = language === 'ru' ? 'ru-RU' : 'en-IN';
    return new Intl.DateTimeFormat(locale, {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  } catch (error) {
    return 'N/A';
  }
};

const formatTransactionDate = (timestamp: TimestampType, language: 'en' | 'ru'): string => {
  if (!timestamp) return 'N/A';
  try {
    const date = timestamp instanceof Timestamp 
      ? timestamp.toDate() 
      : timestamp instanceof Date 
        ? timestamp 
        : new Date(timestamp);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const transactionDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const locale = language === 'ru' ? 'ru-RU' : 'en-IN';
    
    if (transactionDate.getTime() === today.getTime()) {
      const todayText = language === 'ru' ? 'Сегодня' : 'Today';
      return `${todayText}, ${date.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit', hour12: language === 'en' })}`;
    } else if (transactionDate.getTime() === yesterday.getTime()) {
      const yesterdayText = language === 'ru' ? 'Вчера' : 'Yesterday';
      return `${yesterdayText}, ${date.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit', hour12: language === 'en' })}`;
    } else {
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
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [showBalance, setShowBalance] = useState(true);
  const [isFDModalOpen, setIsFDModalOpen] = useState(false);
  
  // Data states
  const [balance, setBalance] = useState<number>(0);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [accountDetails, setAccountDetails] = useState<AccountDetails | null>(null);
  const [fixedDeposits, setFixedDeposits] = useState<FixedDeposit[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  
  useEffect(() => {
    let unsubscribeUser: (() => void) | null = null;
    let unsubscribeTransactions: (() => void) | null = null;

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        navigate('/login');
        return;
      }
      setUser(currentUser);
      
      // Subscribe to user document
      const userRef = doc(db, 'users', currentUser.uid);
      unsubscribeUser = onSnapshot(
        userRef,
        (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            setBalance(data?.balance || 0);
            setProfile(data?.profile || null);
            setAccountDetails(data?.accountDetails || null);
            setFixedDeposits(data?.fixedDeposits || []);
            setLoading(false);
          } else {
            setLoading(false);
          }
        },
        (error) => {
          if (import.meta.env.DEV) {
            console.error('Error fetching user data:', error);
          }
          setLoading(false);
          toast({
            title: "Unable to Load Account",
            description: "We couldn't load your account information. Please check your connection and try refreshing the page.",
            variant: "destructive",
          });
        }
      );

      // Subscribe to transactions subcollection
      const transactionsRef = collection(userRef, 'transactions');
      const transactionsQuery = query(transactionsRef, orderBy('date', 'desc'), limit(8));
      unsubscribeTransactions = onSnapshot(
        transactionsQuery,
        (snapshot) => {
          const txs = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as Transaction[];
          setTransactions(txs);
        },
        (error) => {
          if (import.meta.env.DEV) {
            console.error('Error fetching transactions:', error);
          }
          toast({
            title: "Transaction History Unavailable",
            description: "We couldn't load your recent transactions. Please try refreshing the page or contact support if the issue persists.",
            variant: "destructive",
          });
        }
      );
    });

    return () => {
      unsubscribe();
      if (unsubscribeUser) unsubscribeUser();
      if (unsubscribeTransactions) unsubscribeTransactions();
    };
  }, [navigate]);

  const handleTransfer = async (from: string, to: string, amount: number) => {
    if (!user) {
      toast({
        title: "Error",
        description: "User not authenticated. Please log in again.",
        variant: "destructive",
      });
      throw new Error('User not authenticated');
    }
    
    try {
      await performTransfer({
        userId: user.uid,
        fromAccount: from,
        toAccount: to,
        amount,
        description: `Transfer to ${to}`,
      });
      toast({
        title: "Transfer Successful",
        description: `Successfully transferred ${formatCurrency(amount, language)} to ${to}`,
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

  const handleCreateFD = async (amount: number) => {
    if (!user) {
      toast({
        title: "Error",
        description: "User not authenticated. Please log in again.",
        variant: "destructive",
      });
      throw new Error('User not authenticated');
    }

    try {
      const userRef = doc(db, "users", user.uid);
      
      // Calculate maturity date (1 year from now)
      const maturityDate = new Date();
      maturityDate.setFullYear(maturityDate.getFullYear() + 1);
      const maturityDateISO = maturityDate.toISOString();

      // Create new FD object
      const newFD = {
        id: `FD-${Date.now()}`,
        principal: amount,
        interestRate: "7.10",
        maturityDate: maturityDateISO,
        status: "Active",
      };

      // Create transaction record
      const newTransaction = {
        description: `Fixed Deposit - ${newFD.id}`,
        amount: amount,
        type: "debit",
        category: "Investment",
        date: Timestamp.now(),
        status: "success",
      };

      await runTransaction(db, async (transaction) => {
        const userSnap = await transaction.get(userRef);
        
        if (!userSnap.exists()) {
          throw new Error("User not found");
        }

        const data = userSnap.data();
        const currentBalance = data?.balance || 0;

        if (amount > currentBalance) {
          throw new Error("Insufficient balance");
        }

        // Update user document
        transaction.update(userRef, {
          balance: currentBalance - amount,
          fixedDeposits: arrayUnion(newFD),
          transactions: arrayUnion(newTransaction),
        });
      });

      // Add transaction to subcollection (for transaction history)
      const transactionsRef = collection(userRef, "transactions");
      await addDoc(transactionsRef, newTransaction);

      toast({
        title: "Fixed Deposit Created",
        description: `Successfully created FD of ${formatCurrency(amount, language)}`,
      });
      setIsFDModalOpen(false);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create fixed deposit. Please try again.';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    }
  };

  const lastLoginDate = profile?.joinedAt ? formatDate(profile.joinedAt, language) : 'N/A';
  const totalFD = fixedDeposits?.reduce((sum, fd) => sum + (fd?.principal || 0), 0) || 0;
  const activeFDCount = fixedDeposits?.filter(fd => fd?.status === 'active').length || 0;

  // Calculate monthly spending (debits from current month)
  const monthlySpending = useMemo(() => {
    if (!transactions || transactions.length === 0) return 0;
    
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    return transactions
      .filter(tx => {
        if (!tx.date) return false;
        try {
          const txDate = tx.date instanceof Timestamp 
            ? tx.date.toDate() 
            : tx.date instanceof Date 
              ? tx.date 
              : new Date(tx.date);
          return txDate >= startOfMonth && tx.type === 'debit';
        } catch {
          return false;
        }
      })
      .reduce((sum, tx) => sum + Math.abs(tx.amount || 0), 0);
  }, [transactions]);

  // Calculate spending change (compare current month with previous month)
  const spendingChange = useMemo(() => {
    if (!transactions || transactions.length === 0) return 0;
    
    const now = new Date();
    const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfPreviousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfPreviousMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    const currentMonthSpending = transactions
      .filter(tx => {
        if (!tx.date) return false;
        try {
          const txDate = tx.date instanceof Timestamp 
            ? tx.date.toDate() 
            : tx.date instanceof Date 
              ? tx.date 
              : new Date(tx.date);
          return txDate >= startOfCurrentMonth && tx.type === 'debit';
        } catch {
          return false;
        }
      })
      .reduce((sum, tx) => sum + Math.abs(tx.amount || 0), 0);

    const previousMonthSpending = transactions
      .filter(tx => {
        if (!tx.date) return false;
        try {
          const txDate = tx.date instanceof Timestamp 
            ? tx.date.toDate() 
            : tx.date instanceof Date 
              ? tx.date 
              : new Date(tx.date);
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
  }, [transactions]);

  // Prepare accounts for carousel
  const accounts = useMemo(() => {
    const accountList = [];
    
    if (accountDetails) {
      accountList.push({
        id: 'savings-1',
        type: accountDetails.type.toLowerCase().includes('current') ? 'current' : 'savings' as 'savings' | 'current',
        accountNumber: accountDetails.accountNumber,
        balance: balance,
        ifsc: accountDetails.ifsc,
        branch: accountDetails.branch,
      });
    }

    // Add single FD summary tab (aggregates all FDs)
    if (fixedDeposits && fixedDeposits.length > 0) {
      accountList.push({
        id: 'fd-summary',
        type: 'fd' as const,
        accountNumber: `Total Active: ${fixedDeposits.length}`,
        balance: totalFD,
        interestRate: fixedDeposits[0]?.interestRate || '7.10',
        maturityDate: 'Various',
      });
    }

    return accountList;
  }, [accountDetails, balance, fixedDeposits]);

  // Transform transactions for RecentTransactions component
  const transformedTransactions: RecentTransaction[] = useMemo(() => {
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
  }, [transactions, language]);

  // Prepare accounts for SendMoney component
  const sendMoneyAccounts = useMemo(() => {
    if (!accountDetails) return [];
    return [{
      accountNumber: accountDetails.accountNumber,
      type: accountDetails.type,
      balance: balance,
    }];
  }, [accountDetails, balance]);

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
          totalBalance={balance + totalFD}
          monthlySpending={monthlySpending}
          activeFDs={activeFDCount}
          spendingChange={spendingChange}
          loading={loading}
        />

        {/* My Accounts Tabs */}
        {accounts.length > 0 && (
          <div className="mb-6">
            <AccountsTabs
              accounts={accounts}
              showBalance={showBalance}
              onToggleBalance={() => setShowBalance(!showBalance)}
              loading={loading}
              sendMoneyAccounts={sendMoneyAccounts}
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
        )}

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
            data={transformedTransactions} 
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
