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
import { formatCurrency } from '@/utils/formatters';
import { currentUser as mockUser } from '@/data/mockData';

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

// Format transaction date from ISO string (for mock data)
const formatTransactionDateFromISO = (dateString: string, language: 'en' | 'ru'): string => {
  try {
    const date = new Date(dateString);
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
  const [loading, setLoading] = useState(false); // Set to false since we're using mock data
  const [showBalance, setShowBalance] = useState(true);
  const [isFDModalOpen, setIsFDModalOpen] = useState(false);
  
  // Data states (keeping for Firebase compatibility, but using mock data as primary)
  const [balance, setBalance] = useState<number>(0);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [accountDetails, setAccountDetails] = useState<AccountDetails | null>(null);
  const [fixedDeposits, setFixedDeposits] = useState<FixedDeposit[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Calculate totals from mock data
  const mockTotalBalance = useMemo(() => {
    // Sum all account balances (convert USD to RUB if needed, or just sum RUB accounts)
    // For simplicity, we'll sum all balances regardless of currency
    return mockUser.accounts.reduce((sum, acc) => {
      // Convert USD to RUB at approximate rate (1 USD = 100 RUB) or just sum RUB
      if (acc.currency === 'USD') {
        return sum + (acc.balance * 100); // Approximate conversion
      }
      return sum + acc.balance;
    }, 0);
  }, []);

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

  const mockActiveDepositsCount = useMemo(() => {
    return mockUser.deposits.filter(dep => dep.status === 'Active').length;
  }, []);

  // Get recent transactions from mock data (first 5, sorted by date descending)
  const mockRecentTransactions = useMemo(() => {
    return [...mockUser.transactions]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5)
      .map(tx => ({
        id: tx.id,
        description: tx.description,
        amount: tx.amount,
        date: formatTransactionDateFromISO(tx.date, language),
        type: tx.type as 'credit' | 'debit',
        referenceId: tx.id,
        category: tx.category,
      }));
  }, [language]);
  
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
        description: `Successfully created FD of ${formatCurrency(amount)}`,
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
  
  // Filter only active deposits (keeping for Firebase compatibility, but using mock data primarily)
  // const activeDeposits = fixedDeposits?.filter(fd => fd?.status === 'Active' || fd?.status === 'active') || [];
  // const totalFD = activeDeposits.reduce((sum, fd) => sum + (fd?.principal || 0), 0);
  // const activeFDCount = activeDeposits.length;

  // Calculate monthly spending (debits from current month) - using mock data
  const monthlySpending = useMemo(() => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    // Calculate from mock data
    const mockSpending = mockUser.transactions
      .filter(tx => {
        try {
          const txDate = new Date(tx.date);
          return txDate >= startOfMonth && tx.type === 'debit';
        } catch {
          return false;
        }
      })
      .reduce((sum, tx) => sum + Math.abs(tx.amount || 0), 0);
    
    // Fallback to Firebase transactions if available and mock data is empty
    if (mockSpending === 0 && transactions && transactions.length > 0) {
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
    }
    
    return mockSpending;
  }, [transactions]);

  // Calculate spending change (compare current month with previous month) - using mock data
  const spendingChange = useMemo(() => {
    const now = new Date();
    const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfPreviousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfPreviousMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    // Calculate from mock data
    const currentMonthSpending = mockUser.transactions
      .filter(tx => {
        try {
          const txDate = new Date(tx.date);
          return txDate >= startOfCurrentMonth && tx.type === 'debit';
        } catch {
          return false;
        }
      })
      .reduce((sum, tx) => sum + Math.abs(tx.amount || 0), 0);

    const previousMonthSpending = mockUser.transactions
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
    const accountList = [];
    
    // Add mock accounts
    mockUser.accounts.forEach((acc) => {
      accountList.push({
        id: acc.id,
        type: acc.type.toLowerCase() === 'checking' ? 'current' : 'savings' as 'savings' | 'current',
        accountNumber: acc.accountNo,
        balance: acc.balance,
        currency: acc.currency,
        iban: acc.iban,
        nickname: acc.nickname,
      });
    });

    // Filter active deposits for FD summary (using mock data)
    const activeFDs = mockUser.deposits.filter(dep => dep.status === 'Active');
    const activeFDTotal = activeFDs.reduce((sum, fd) => sum + (fd?.principal || 0), 0);

    // Always add FD summary tab with dynamic labeling
    accountList.push({
      id: 'fd-summary',
      type: 'fd' as const,
      accountNumber: activeFDs.length === 0 ? 'Start Investment' : `Total Active: ${activeFDs.length}`,
      balance: activeFDs.length === 0 ? 0 : activeFDTotal,
      nickname: 'Investment FD',
      interestRate: activeFDs.length === 0 ? 'Up to 8.5%' : (activeFDs[0]?.rate?.toString() || '7.10'),
      maturityDate: activeFDs.length === 0 ? 'N/A' : 'Various',
    });

    return accountList;
  }, []);

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
    const accountList = [];
    
    // Add accounts from the main accounts array (which includes nicknames)
    accounts.forEach((acc) => {
      // Only include savings/current accounts, not FD summary
      if (acc.type === 'savings' || acc.type === 'current') {
        accountList.push({
          accountNumber: acc.accountNumber,
          type: acc.type === 'savings' ? 'Savings' : 'Current',
          balance: acc.balance,
          nickname: acc.nickname,
        });
      }
    });

    // Add individual Fixed Deposit accounts from mock data
    const activeFDs = mockUser.deposits.filter(dep => dep.status === 'Active');
    activeFDs.forEach((fd) => {
      accountList.push({
        accountNumber: fd.id, // Use FD ID as identifier
        type: 'Fixed Deposit',
        balance: fd.principal,
        nickname: 'Fixed Deposit', // Use generic name instead of raw ID
      });
    });

    return accountList;
  }, [accounts]);

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
          monthlySpending={monthlySpending}
          activeFDs={mockActiveDepositsCount}
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
