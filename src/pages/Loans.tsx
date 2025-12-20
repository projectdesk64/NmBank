import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useLanguage } from '@/hooks/useLanguage';
import { useUser } from '@/contexts/UserContext';
import { Loan } from '@/types';
import { TrendingUp, Inbox, CheckCircle2, XCircle, AlertCircle, Calendar, DollarSign } from 'lucide-react';

import { formatCurrency } from '@/utils/formatters';

export const Loans = () => {
  const { language } = useLanguage();
  const { user } = useUser();
  const loans = user.loans.filter(loan => loan.status === 'Active');

  // Format date
  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(language === 'ru' ? 'ru-RU' : 'en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  // Calculate repayment progress
  const calculateProgress = (loan: Loan): number => {
    if (loan.tenureMonths === 0) return 100;
    return Math.round((loan.paidMonths / loan.tenureMonths) * 100);
  };

  // Get status badge
  const getStatusBadge = (status: Loan['status']) => {
    switch (status) {
      case 'Active':
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Active
          </Badge>
        );
      case 'Closed':
        return (
          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
            <XCircle className="h-3 w-3 mr-1" />
            Closed
          </Badge>
        );
      case 'Overdue':
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            <AlertCircle className="h-3 w-3 mr-1" />
            Overdue
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // Calculate total outstanding
  const totalOutstanding = loans.reduce((sum, loan) => sum + loan.outstandingBalance, 0);

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Card */}
        <Card className="mb-6 bg-gradient-to-r from-white to-nmb-maroon/5 border-nmb-maroon/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  {language === 'ru' ? 'Общая задолженность' : 'Total Outstanding'}
                </p>
                <p className="text-3xl font-bold text-nmb-maroon">
                  {formatCurrency(totalOutstanding)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-8 w-8 text-nmb-maroon" />
                <span className="text-sm text-gray-600">
                  {loans.length} {language === 'ru' ? 'активных займов' : 'Active Loans'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Loans Grid */}
        {loans.length === 0 ? (
          <Card className="bg-white rounded-xl shadow-sm border border-gray-200">
            <CardContent className="p-12">
              <div className="text-center py-16">
                <Inbox className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 font-medium">
                  {language === 'ru' ? 'Нет активных займов' : 'No active loans'}
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {loans.map((loan) => {
              const progress = calculateProgress(loan);
              const remainingMonths = loan.tenureMonths - loan.paidMonths;

              return (
                <Card
                  key={loan.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl font-bold text-nmb-charcoal mb-2">
                          {loan.loanType}
                        </CardTitle>
                        <p className="text-sm text-gray-600 font-mono">
                          {language === 'ru' ? 'Счет' : 'Account'}: {loan.accountNo}
                        </p>
                      </div>
                      {getStatusBadge(loan.status)}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Outstanding Balance */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-600 mb-1">
                        {language === 'ru' ? 'Остаток задолженности' : 'Outstanding Balance'}
                      </p>
                      <p className="text-2xl font-bold text-nmb-maroon">
                        {formatCurrency(loan.outstandingBalance)}
                      </p>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">
                          {language === 'ru' ? 'Прогресс погашения' : 'Repayment Progress'}
                        </span>
                        <span className="font-semibold text-nmb-charcoal">
                          {progress}%
                        </span>
                      </div>
                      <Progress value={progress} className="h-2" />
                      <p className="text-xs text-gray-500">
                        {loan.paidMonths} / {loan.tenureMonths} {language === 'ru' ? 'месяцев оплачено' : 'months paid'}
                      </p>
                    </div>

                    {/* Loan Details Grid */}
                    <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-200">
                      <div>
                        <p className="text-xs text-gray-600 mb-1 flex items-center gap-1">
                          <DollarSign className="h-3 w-3" />
                          {language === 'ru' ? 'EMI' : 'EMI Amount'}
                        </p>
                        <p className="font-semibold text-nmb-charcoal">
                          {formatCurrency(loan.emiAmount)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 mb-1 flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" />
                          {language === 'ru' ? 'Процентная ставка' : 'Interest Rate'}
                        </p>
                        <p className="font-semibold text-nmb-charcoal">
                          {loan.interestRate}%
                        </p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-xs text-gray-600 mb-1 flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {language === 'ru' ? 'Следующий платеж' : 'Next Payment Date'}
                        </p>
                        <p className="font-semibold text-nmb-charcoal">
                          {formatDate(loan.nextPaymentDate)}
                        </p>
                      </div>
                    </div>

                    {/* Remaining Info */}
                    <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                      <p className="text-xs text-blue-800">
                        {language === 'ru'
                          ? `Осталось ${remainingMonths} ${remainingMonths === 1 ? 'месяц' : remainingMonths < 5 ? 'месяца' : 'месяцев'} до полного погашения`
                          : `${remainingMonths} ${remainingMonths === 1 ? 'month' : 'months'} remaining`}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Loans;
