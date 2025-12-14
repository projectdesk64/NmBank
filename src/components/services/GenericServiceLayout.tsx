import React from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/hooks/useLanguage';
import { Inbox, CheckCircle2, XCircle, AlertCircle, Clock } from 'lucide-react';

interface GenericServiceLayoutProps {
  title: string;
  data: any[];
  columns: Array<{
    key: string;
    label: string;
    render?: (value: any, row: any) => React.ReactNode;
  }>;
  summary?: {
    label: string;
    value: string | number;
    icon?: React.ComponentType<{ className?: string }>;
  };
}

export const GenericServiceLayout: React.FC<GenericServiceLayoutProps> = ({
  title,
  data,
  columns,
  summary,
}) => {
  const { language } = useLanguage();

  // Format currency
  const formatCurrency = (amount: number, currency: string = 'RUB'): string => {
    const locale = currency === 'USD' ? 'en-US' : 'ru-RU';
    const currencyCode = currency === 'USD' ? 'USD' : 'RUB';
    
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

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

  // Get status badge
  const getStatusBadge = (status: string) => {
    const statusLower = status.toLowerCase();
    if (statusLower === 'active' || statusLower === 'success' || statusLower === 'paid') {
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
          <CheckCircle2 className="h-3 w-3 mr-1" />
          {status}
        </Badge>
      );
    }
    if (statusLower === 'pending' || statusLower === 'expired') {
      return (
        <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
          <Clock className="h-3 w-3 mr-1" />
          {status}
        </Badge>
      );
    }
    if (statusLower === 'failed' || statusLower === 'overdue' || statusLower === 'cancelled' || statusLower === 'blocked') {
      return (
        <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
          <XCircle className="h-3 w-3 mr-1" />
          {status}
        </Badge>
      );
    }
    return <Badge>{status}</Badge>;
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Card */}
        {summary && (
          <Card className="mb-6 bg-gradient-to-r from-white to-nmb-maroon/5 border-nmb-maroon/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    {summary.label}
                  </p>
                  <p className="text-3xl font-bold text-nmb-maroon">
                    {summary.value}
                  </p>
                </div>
                {summary.icon && (
                  <div className="flex items-center gap-2">
                    <summary.icon className="h-8 w-8 text-nmb-maroon" />
                    <span className="text-sm text-gray-600">
                      {data.length} {language === 'ru' ? 'записей' : 'Items'}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Data Table */}
        <Card className="bg-white rounded-xl shadow-sm border border-gray-200">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-nmb-charcoal">
              {title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data.length === 0 ? (
              <div className="text-center py-16">
                <Inbox className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 font-medium">
                  {language === 'ru' ? 'Нет данных' : 'No data available'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      {columns.map((column) => (
                        <TableHead key={column.key} className="font-semibold text-nmb-charcoal">
                          {column.label}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.map((row, index) => (
                      <TableRow key={row.id || index} className="hover:bg-gray-50 transition-colors">
                        {columns.map((column) => {
                          const value = row[column.key];
                          return (
                            <TableCell key={column.key} className="text-gray-700">
                              {column.render
                                ? column.render(value, row)
                                : typeof value === 'number' && value > 1000
                                ? formatCurrency(value)
                                : value}
                            </TableCell>
                          );
                        })}
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
