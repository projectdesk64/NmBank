import { useUser } from '@/contexts/UserContext';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { useLanguage } from '@/hooks/useLanguage';
import { formatCurrency } from '@/utils/formatters';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

const formatDate = (dateString: string | Date, language: 'en' | 'ru'): string => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
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

  const { user } = useUser();

  // Sort transactions by date (descending)
  const sortedTransactions = [...user.transactions].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return dateB - dateA;
  });

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
          {sortedTransactions.length === 0 ? (
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
                  {sortedTransactions.map((transaction) => (
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
                          {formatCurrency(Math.abs(transaction.amount))}
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
        {sortedTransactions.length > 0 && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <p className="text-sm text-gray-600 mb-1">Total Transactions</p>
              <p className="text-2xl font-bold text-nmb-charcoal">{sortedTransactions.length}</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <p className="text-sm text-gray-600 mb-1">Total Credits</p>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(
                  sortedTransactions
                    .filter(tx => tx.type === 'credit')
                    .reduce((sum, tx) => sum + Math.abs(tx.amount), 0)
                )}
              </p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <p className="text-sm text-gray-600 mb-1">Total Debits</p>
              <p className="text-2xl font-bold text-red-600">
                {formatCurrency(
                  sortedTransactions
                    .filter(tx => tx.type === 'debit')
                    .reduce((sum, tx) => sum + Math.abs(tx.amount), 0)
                )}
              </p>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

