import { useState, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowDownLeft, ArrowUpRight, ChevronRight, Receipt } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/hooks/useLanguage';

// Helper to format amount with ruble symbol (for dashboard display)
const formatAmount = (amount: number): string => {
  return amount.toLocaleString('ru-RU', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }) + ' ₽';
};

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  date: string;
  type: 'credit' | 'debit';
  referenceId: string;
  category?: string;
}

interface RecentTransactionsProps {
  data: Transaction[];
  loading?: boolean;
}

const formatDate = (dateString: string) => {
  // Expected format: "12 Dec 2025, 05:17 pm"
  return dateString;
};

// Helper function to translate transaction categories
const translateCategory = (category: string | undefined, t: any): string => {
  if (!category) return '';
  const categoryLower = category.toLowerCase();
  const categoryMap: Record<string, keyof typeof t.dashboard.recentTransactions.categories> = {
    'transfer': 'transfer',
    'entertainment': 'entertainment',
    'food': 'food',
    'shopping': 'shopping',
    'bills': 'bills',
    'other': 'other',
  };
  const key = categoryMap[categoryLower];
  return key ? t.dashboard.recentTransactions.categories[key] : category;
};

// Helper function to translate transaction descriptions
const translateDescription = (description: string, t: any): string => {
  const descriptionMap: Record<string, keyof typeof t.dashboard.recentTransactions.descriptions> = {
    'opening deposit': 'openingDeposit',
    'netflix': 'netflix',
    'starbucks': 'starbucks',
  };
  const key = descriptionMap[description.toLowerCase()];
  return key ? t.dashboard.recentTransactions.descriptions[key] : description;
};

export const RecentTransactions = memo(({ data, loading = false }: RecentTransactionsProps) => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-8 shadow-large mb-8 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-40 mb-6"></div>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-18 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-2xl p-8 shadow-large mb-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-heading font-bold text-nmb-charcoal">{t.dashboard.recentTransactions.title}</h3>
          <Button
            variant="link"
            className="text-nmb-blue hover:text-nmb-blue/80 p-0 h-auto font-medium"
            onClick={() => navigate('/dashboard/transactions')}
          >
            {t.dashboard.recentTransactions.viewAll}
          </Button>
        </div>

        {data.length === 0 ? (
          <div className="text-center py-12">
            <Receipt className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">{t.dashboard.recentTransactions.noRecentTransactions}</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => navigate('/dashboard/transactions')}
            >
              {t.dashboard.recentTransactions.viewTransactionHistory}
            </Button>
          </div>
        ) : (
          <div className="space-y-0">
            {data.map((transaction, index) => (
              <button
                key={transaction.id}
                onClick={() => setSelectedTransaction(transaction)}
                className={cn(
                  "w-full flex items-center gap-4 p-4 rounded-lg hover:bg-nmb-smoke transition-colors group",
                  index !== data.length - 1 && "border-b border-nmb-mist"
                )}
              >
                {/* Icon Circle */}
                <div className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0",
                  transaction.type === 'credit'
                    ? 'bg-green-50 text-green-600'
                    : 'bg-red-50 text-red-600'
                )}>
                  {transaction.type === 'credit' ? (
                    <ArrowUpRight className="h-5 w-5" />
                  ) : (
                    <ArrowDownLeft className="h-5 w-5" />
                  )}
                </div>

                {/* Description & Date */}
                <div className="flex-1 text-left min-w-0">
                  <p className="font-semibold text-nmb-charcoal mb-1 truncate">
                    {translateDescription(transaction.description, t)}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    {transaction.category && (
                      <>
                        <span>{translateCategory(transaction.category, t)}</span>
                        <span>•</span>
                      </>
                    )}
                    <span>{formatDate(transaction.date)}</span>
                  </div>
                </div>

                {/* Amount */}
                <div className="text-right flex-shrink-0">
                  <p className={cn(
                    "text-lg font-bold font-mono tabular-nums",
                    transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                  )}>
                    {transaction.type === 'credit' ? '+' : '-'}{formatAmount(Math.abs(transaction.amount))}
                  </p>
                </div>

                {/* Chevron */}
                <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-nmb-maroon transition-colors flex-shrink-0" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Transaction Detail Modal */}
      <Dialog open={!!selectedTransaction} onOpenChange={() => setSelectedTransaction(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t.dashboard.recentTransactions.transactionDetails}</DialogTitle>
            <DialogDescription>
              {t.dashboard.recentTransactions.referenceId}: {selectedTransaction?.referenceId || selectedTransaction?.id}
            </DialogDescription>
          </DialogHeader>
          {selectedTransaction && (
            <div className="space-y-4 py-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">{t.dashboard.recentTransactions.description}</p>
                <p className="font-semibold text-lg">{translateDescription(selectedTransaction.description, t)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">{t.dashboard.recentTransactions.amount}</p>
                <p className={cn(
                  "text-2xl font-bold font-mono tabular-nums",
                  selectedTransaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                )}>
                  {selectedTransaction.type === 'credit' ? '+' : '-'}{formatAmount(Math.abs(selectedTransaction.amount))}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">{t.dashboard.recentTransactions.dateTime}</p>
                <p className="font-medium">{formatDate(selectedTransaction.date)}</p>
              </div>
              {selectedTransaction.category && (
                <div>
                  <p className="text-sm text-gray-600 mb-1">{t.dashboard.recentTransactions.category}</p>
                  <p className="font-medium">{translateCategory(selectedTransaction.category, t)}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-gray-600 mb-1">{t.dashboard.recentTransactions.referenceId}</p>
                <p className="font-mono text-sm">{selectedTransaction.referenceId || selectedTransaction.id}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
});
