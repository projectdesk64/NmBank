import { useState, useEffect } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, collection, query, orderBy, onSnapshot, Timestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { useLanguage } from '@/hooks/useLanguage';
import { formatCurrency } from '@/lib/utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ArrowUpRight, ArrowDownLeft, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: string;
  category: string;
  date: Timestamp | Date | null;
  status: string;
  fromAccount?: string;
  toAccount?: string;
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
      hour12: language === 'en',
    }).format(date);
  } catch (error) {
    return 'N/A';
  }
};

export const TransactionsPage = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
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
      
      // Subscribe to transactions subcollection (no limit - get all)
      const userRef = doc(db, 'users', currentUser.uid);
      const transactionsRef = collection(userRef, 'transactions');
      const transactionsQuery = query(transactionsRef, orderBy('date', 'desc'));
      
      unsubscribeTransactions = onSnapshot(
        transactionsQuery,
        (snapshot) => {
          const txs = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as Transaction[];
          setTransactions(txs);
          setLoading(false);
        },
        (error) => {
          if (import.meta.env.DEV) {
            console.error('Error fetching transactions:', error);
          }
          setLoading(false);
          toast({
            title: "Transaction History Unavailable",
            description: "We couldn't load your transaction history. Please try refreshing the page or contact support if the issue persists.",
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

  if (loading) {
    return (
      <DashboardLayout>
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-nmb-maroon" />
              <p className="text-gray-600">Loading transactions...</p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-heading font-bold text-nmb-charcoal mb-2">
            Transaction History
          </h1>
          <p className="text-gray-600">
            View all your account transactions
          </p>
        </div>

        {/* Transactions Table */}
        <div className="bg-white rounded-2xl shadow-large overflow-hidden">
          {transactions.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-600 mb-4">No transactions found</p>
              <p className="text-sm text-gray-500">
                Your transaction history will appear here once you make your first transaction.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold text-nmb-charcoal">Date & Time</TableHead>
                    <TableHead className="font-semibold text-nmb-charcoal">Description</TableHead>
                    <TableHead className="font-semibold text-nmb-charcoal">Category</TableHead>
                    <TableHead className="font-semibold text-nmb-charcoal">Type</TableHead>
                    <TableHead className="font-semibold text-nmb-charcoal text-right">Amount</TableHead>
                    <TableHead className="font-semibold text-nmb-charcoal">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((transaction) => (
                    <TableRow 
                      key={transaction.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <TableCell className="font-medium text-gray-700">
                        {formatDate(transaction.date, language)}
                      </TableCell>
                      <TableCell className="font-medium text-nmb-charcoal">
                        {transaction.description}
                      </TableCell>
                      <TableCell>
                        <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">
                          {transaction.category || 'Other'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {transaction.type === 'credit' ? (
                            <ArrowDownLeft className="h-4 w-4 text-green-600" />
                          ) : (
                            <ArrowUpRight className="h-4 w-4 text-red-600" />
                          )}
                          <span className={cn(
                            "text-sm font-medium capitalize",
                            transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                          )}>
                            {transaction.type}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className={cn(
                          "text-lg font-bold font-mono tabular-nums",
                          transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                        )}>
                          {transaction.type === 'credit' ? '+' : '-'}
                          {formatCurrency(Math.abs(transaction.amount), language)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={cn(
                          "px-2 py-1 text-xs font-medium rounded-full",
                          transaction.status === 'success' 
                            ? 'bg-green-100 text-green-700' 
                            : transaction.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                        )}>
                          {transaction.status || 'success'}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>

        {/* Summary Stats */}
        {transactions.length > 0 && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <p className="text-sm text-gray-600 mb-1">Total Transactions</p>
              <p className="text-2xl font-bold text-nmb-charcoal">{transactions.length}</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <p className="text-sm text-gray-600 mb-1">Total Credits</p>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(
                  transactions
                    .filter(tx => tx.type === 'credit')
                    .reduce((sum, tx) => sum + Math.abs(tx.amount), 0),
                  language
                )}
              </p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <p className="text-sm text-gray-600 mb-1">Total Debits</p>
              <p className="text-2xl font-bold text-red-600">
                {formatCurrency(
                  transactions
                    .filter(tx => tx.type === 'debit')
                    .reduce((sum, tx) => sum + Math.abs(tx.amount), 0),
                  language
                )}
              </p>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

