import { useState, useEffect, useMemo } from 'react';
import { useUser } from '@/contexts/UserContext';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { useLanguage } from '@/hooks/useLanguage';
import { formatCurrency } from '@/utils/formatters';
import { Transaction } from '@/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowUpRight, ArrowDownLeft, ChevronLeft, ChevronRight, Filter, X, Search, Download } from 'lucide-react';
import { cn } from '@/lib/utils';

const formatDate = (dateString: string | Date, language: 'en' | 'ru'): string => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    const locale = language === 'ru' ? 'ru-RU' : 'en-GB';
    
    // Format date and time together in a compact format
    return new Intl.DateTimeFormat(locale, {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: language === 'en'
    }).format(date);
  } catch (error) {
    return 'N/A';
  }
};

export const TransactionsPage = () => {
  const { language } = useLanguage();
  const { user } = useUser();

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, typeFilter, dateFilter]);

  // Calculate Running Balance Dynamically (or use balance field for new transactions)
  const transactionsWithBalance = useMemo(() => {
    // Check if transaction is a new January 2026 transaction by ID pattern
    const isNewTransaction = (t: Transaction) => {
      return t.id?.startsWith('t_jan26_2026_') || t.id?.startsWith('t_jan24_2026_');
    };

    // Separate new transactions from old transactions
    const newTransactions = user.transactions.filter(isNewTransaction);
    const oldTransactions = user.transactions.filter(t => !isNewTransaction(t));

    // 1. For new transactions, preserve exact order from mock data (already newest first: Jan 26 before Jan 24)
    //    Don't sort or reverse - keep them in the exact order they appear in mockData.ts
    
    // 2. For old transactions, first sort Oldest -> Newest to calculate balances correctly
    const sortedOldAsc = oldTransactions.sort((a, b) =>
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    let currentBalance = 0;

    // 3. Calculate balance for old transactions (must be done chronologically)
    const oldTransactionsWithBalance = sortedOldAsc.map(t => {
      if (t.type === 'credit') {
        currentBalance += t.amount;
      } else {
        currentBalance -= t.amount;
      }
      return { ...t, runningBalance: currentBalance, isNewTransaction: false };
    });

    // 4. Reverse old transactions to show newest first
    const oldTransactionsDesc = oldTransactionsWithBalance.reverse();

    // 5. Process new transactions (use balance field directly, preserve order)
    const newTransactionsWithBalance = newTransactions.map(t => {
      return { 
        ...t, 
        runningBalance: t.balance !== undefined && t.balance !== null ? t.balance : 0, 
        isNewTransaction: true 
      };
    });

    // 6. Combine: new transactions first (in exact order from mock data), then old transactions (newest first)
    return [...newTransactionsWithBalance, ...oldTransactionsDesc];
  }, [user.transactions]);

  // Filter Logic
  const filteredTransactions = transactionsWithBalance.filter(tx => {
    // 1. Search Query (Description or Amount)
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesDescription = tx.description.toLowerCase().includes(query);
      const matchesAmount = tx.amount.toString().includes(query);
      if (!matchesDescription && !matchesAmount) return false;
    }

    // 2. Status Filter
    if (statusFilter !== 'all' && (tx.status || 'success') !== statusFilter) return false;

    // 3. Type Filter
    if (typeFilter !== 'all' && tx.type !== typeFilter) return false;

    // 4. Date Filter
    if (dateFilter !== 'all') {
      const txDate = new Date(tx.date);
      const now = new Date();

      if (dateFilter === 'last30') {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(now.getDate() - 30);
        if (txDate < thirtyDaysAgo) return false;
      } else if (dateFilter === 'last90') {
        const ninetyDaysAgo = new Date();
        ninetyDaysAgo.setDate(now.getDate() - 90);
        if (txDate < ninetyDaysAgo) return false;
      } else if (dateFilter === 'thisYear') {
        if (txDate.getFullYear() !== now.getFullYear()) return false;
      } else if (dateFilter === 'lastYear') {
        if (txDate.getFullYear() !== now.getFullYear() - 1) return false;
      } else if (dateFilter === '2025') {
        if (txDate.getFullYear() !== 2025) return false;
      } else if (dateFilter === 'older') {
        if (txDate.getFullYear() >= 2024) return false;
      }
    }

    return true;
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTransactions = filteredTransactions.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setTypeFilter('all');
    setDateFilter('all');
  };

  const hasActiveFilters = searchQuery !== '' || statusFilter !== 'all' || typeFilter !== 'all' || dateFilter !== 'all';

  return (
    <DashboardLayout>
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-heading font-bold text-nmb-charcoal mb-2">
              Transaction History
            </h1>
            <p className="text-gray-600">
              View all your account transactions
            </p>
          </div>
          <Button className="bg-nmb-maroon hover:bg-nmb-maroon/90 text-white gap-2">
            <Download className="h-4 w-4" />
            Download Statement
          </Button>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-col gap-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search Bar */}
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search transactions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Filter Dropdowns */}
            <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
              <div className="w-full md:w-40">
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="credit">Credit</SelectItem>
                    <SelectItem value="debit">Debit</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="w-full md:w-40">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="success">Success</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="w-full md:w-40">
                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Date" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="last30">Last 30 Days</SelectItem>
                    <SelectItem value="last90">Last 90 Days</SelectItem>
                    <SelectItem value="thisYear">This Year</SelectItem>
                    <SelectItem value="lastYear">Last Year</SelectItem>
                    <SelectItem value="older">Older</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {hasActiveFilters && (
            <div className="flex justify-end">
              <Button
                variant="ghost"
                onClick={clearFilters}
                size="sm"
                className="text-red-500 hover:text-red-600 hover:bg-red-50 h-8"
              >
                <X className="h-3 w-3 mr-2" />
                Clear Filters
              </Button>
            </div>
          )}
        </div>

        {/* Transactions Table */}
        <div className="bg-white rounded-2xl shadow-large overflow-hidden">
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-16">
              <Filter className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">No transactions match your search or filters</p>
              <Button variant="link" onClick={clearFilters} className="text-nmb-maroon">
                Clear all filters
              </Button>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="font-semibold text-nmb-charcoal">Date</TableHead>
                      <TableHead className="font-semibold text-nmb-charcoal">Description</TableHead>
                      <TableHead className="font-semibold text-nmb-charcoal">Category</TableHead>
                      <TableHead className="font-semibold text-nmb-charcoal">Type</TableHead>
                      <TableHead className="font-semibold text-nmb-charcoal text-right">Amount</TableHead>
                      <TableHead className="font-semibold text-nmb-charcoal text-right">Balance</TableHead>
                      <TableHead className="font-semibold text-nmb-charcoal">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentTransactions.map((transaction) => (
                      <TableRow
                        key={transaction.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <TableCell className="font-medium text-gray-700 whitespace-nowrap text-sm">
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
                            {formatCurrency(
                              (transaction as any).isNewTransaction 
                                ? Math.abs(transaction.amount) / 100 
                                : Math.abs(transaction.amount)
                            )}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <span className="text-sm font-bold text-gray-900 font-mono tabular-nums">
                            {formattedBalance(transaction.runningBalance, (transaction as any).isNewTransaction)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className={cn(
                            "px-2 py-1 text-xs font-medium rounded-full",
                            transaction.status === 'success' || transaction.status === 'completed'
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

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50/50">
                  <div className="text-sm text-gray-500">
                    Showing <span className="font-medium">{startIndex + 1}</span> to <span className="font-medium">{Math.min(endIndex, filteredTransactions.length)}</span> of <span className="font-medium">{filteredTransactions.length}</span> results
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="h-8 w-8 p-0"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(page)}
                        className={cn(
                          "h-8 w-8 p-0",
                          currentPage === page ? "bg-nmb-maroon hover:bg-nmb-maroon/90" : ""
                        )}
                      >
                        {page}
                      </Button>
                    ))}

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="h-8 w-8 p-0"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Summary Stats */}
        {transactionsWithBalance.length > 0 && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <p className="text-sm text-gray-600 mb-1">Total Transactions</p>
              <p className="text-2xl font-bold text-nmb-charcoal">{transactionsWithBalance.length}</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <p className="text-sm text-gray-600 mb-1">Total Credits</p>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(
                  transactionsWithBalance
                    .filter(tx => tx.type === 'credit')
                    .reduce((sum, tx) => {
                      const amount = (tx as any).isNewTransaction ? Math.abs(tx.amount) / 100 : Math.abs(tx.amount);
                      return sum + amount;
                    }, 0)
                )}
              </p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <p className="text-sm text-gray-600 mb-1">Total Debits</p>
              <p className="text-2xl font-bold text-red-600">
                {formatCurrency(
                  transactionsWithBalance
                    .filter(tx => tx.type === 'debit')
                    .reduce((sum, tx) => {
                      const amount = (tx as any).isNewTransaction ? Math.abs(tx.amount) / 100 : Math.abs(tx.amount);
                      return sum + amount;
                    }, 0)
                )}
              </p>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

// Helper for formatted balance display
const formattedBalance = (amount: number, isNewTransaction?: boolean) => {
  // For new transactions, balance is stored in kopecks, convert to rubles (divide by 100)
  // For old transactions, balance is already in rubles
  const rubles = isNewTransaction ? amount / 100 : amount;
  
  // Format with Russian locale: spaces for thousands, comma for decimal
  // Allow 1-2 decimal places (don't force trailing zeros)
  return rubles.toLocaleString('ru-RU', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }) + ' ₽';
};
