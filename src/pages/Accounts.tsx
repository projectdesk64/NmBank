import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/hooks/useLanguage';
import { currentUser, Account } from '@/data/mockData';
import { Wallet, Inbox, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

export const Accounts = () => {
  const { language } = useLanguage();
  const accounts = currentUser.accounts;

  // Format currency based on currency type
  const formatCurrency = (amount: number, currency: string): string => {
    const locale = currency === 'USD' ? 'en-US' : 'ru-RU';
    const currencyCode = currency === 'USD' ? 'USD' : 'RUB';
    
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  // Get status badge variant
  const getStatusBadge = (status: Account['status']) => {
    switch (status) {
      case 'Active':
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Active
          </Badge>
        );
      case 'Inactive':
        return (
          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
            <XCircle className="h-3 w-3 mr-1" />
            Inactive
          </Badge>
        );
      case 'Frozen':
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            <AlertCircle className="h-3 w-3 mr-1" />
            Frozen
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // Calculate total balance
  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Card */}
        <Card className="mb-6 bg-gradient-to-r from-white to-nmb-maroon/5 border-nmb-maroon/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  {language === 'ru' ? 'Общий баланс' : 'Total Balance'}
                </p>
                <p className="text-3xl font-bold text-nmb-maroon">
                  {formatCurrency(totalBalance, 'RUB')}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Wallet className="h-8 w-8 text-nmb-maroon" />
                <span className="text-sm text-gray-600">
                  {accounts.length} {language === 'ru' ? 'счетов' : 'Accounts'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Accounts Table */}
        <Card className="bg-white rounded-xl shadow-sm border border-gray-200">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-nmb-charcoal">
              {language === 'ru' ? 'Мои счета' : 'My Accounts'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {accounts.length === 0 ? (
              <div className="text-center py-16">
                <Inbox className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 font-medium">
                  {language === 'ru' ? 'Нет активных счетов' : 'No active accounts'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="font-semibold text-nmb-charcoal">
                        {language === 'ru' ? 'Номер счета' : 'Account No'}
                      </TableHead>
                      <TableHead className="font-semibold text-nmb-charcoal">
                        {language === 'ru' ? 'Тип' : 'Type'}
                      </TableHead>
                      <TableHead className="font-semibold text-nmb-charcoal">
                        {language === 'ru' ? 'Баланс' : 'Balance'}
                      </TableHead>
                      <TableHead className="font-semibold text-nmb-charcoal">
                        {language === 'ru' ? 'Валюта' : 'Currency'}
                      </TableHead>
                      <TableHead className="font-semibold text-nmb-charcoal">
                        {language === 'ru' ? 'IBAN' : 'IBAN'}
                      </TableHead>
                      <TableHead className="font-semibold text-nmb-charcoal">
                        {language === 'ru' ? 'Статус' : 'Status'}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {accounts.map((account) => (
                      <TableRow key={account.id} className="hover:bg-gray-50 transition-colors">
                        <TableCell className="font-medium text-nmb-charcoal font-mono">
                          {account.accountNo}
                        </TableCell>
                        <TableCell className="text-gray-700">
                          {account.type}
                        </TableCell>
                        <TableCell className="font-semibold text-nmb-maroon">
                          {formatCurrency(account.balance, account.currency)}
                        </TableCell>
                        <TableCell className="text-gray-700">
                          {account.currency}
                        </TableCell>
                        <TableCell className="font-mono text-sm text-gray-600">
                          {account.iban}
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(account.status)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Accounts;
