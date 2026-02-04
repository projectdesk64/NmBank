import React, { memo } from 'react';
import { Wallet, TrendingDown, TrendingUp, PiggyBank } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/hooks/useLanguage';
import { formatCurrency } from '@/utils/formatters';

interface StatCardProps {
  title: string;
  amount: string;
  change?: string;
  changeType?: 'positive' | 'negative';
  icon: React.ElementType;
  borderColor: 'blue' | 'orange' | 'maroon';
  loading?: boolean;
  className?: string;
}

const StatCard = memo(({ title, amount, change, changeType, icon: Icon, borderColor, loading, className }: StatCardProps) => {
  const { t } = useLanguage();
  const borderColors = {
    blue: 'border-t-nmb-blue',
    orange: 'border-t-nmb-orange',
    maroon: 'border-t-nmb-maroon',
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-7 border-t-5 shadow-large animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-32 mb-4"></div>
        <div className="h-10 bg-gray-200 rounded w-40 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-24"></div>
      </div>
    );
  }

  return (
    <div className={cn(
      "bg-white rounded-2xl p-5 border-t-5 shadow-large hover:shadow-[0_8px_24px_rgba(0,0,0,0.15)] transition-all duration-300 hover:-translate-y-1",
      borderColors[borderColor],
      className
    )}>
      <div className="flex items-start justify-between mb-3 gap-3">
        <div className="flex-1 min-w-0 overflow-hidden">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-xl lg:text-2xl font-heading font-bold text-nmb-charcoal tabular-nums break-all leading-tight">
            {amount}
          </p>
        </div>
        <div className={cn(
          "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0",
          borderColor === 'blue' && 'bg-blue-50',
          borderColor === 'orange' && 'bg-orange-50',
          borderColor === 'maroon' && 'bg-red-50'
        )}>
          <Icon className={cn(
            "h-6 w-6",
            borderColor === 'blue' && 'text-nmb-blue',
            borderColor === 'orange' && 'text-nmb-orange',
            borderColor === 'maroon' && 'text-nmb-maroon'
          )} />
        </div>
      </div>
      {change && (
        <div className="flex items-center gap-1 mt-4">
          {changeType === 'positive' ? (
            <TrendingUp className="h-4 w-4 text-green-600" />
          ) : (
            <TrendingDown className="h-4 w-4 text-red-600" />
          )}
          <span className={cn(
            "text-sm font-medium tabular-nums",
            changeType === 'positive' ? 'text-green-600' : 'text-red-600'
          )}>
            {change}
          </span>
          <span className="text-sm text-gray-500">{t.dashboard.summaryStats.vsLastMonth}</span>
        </div>
      )}
    </div>
  );
});

interface SummaryStatsProps {
  totalBalance: number | string;
  monthlySpending: number;
  activeFDs: number;
  spendingChange?: number;
  loading?: boolean;
}

export const SummaryStats = memo(({
  totalBalance,
  monthlySpending,
  activeFDs,
  spendingChange = 0,
  loading = false
}: SummaryStatsProps) => {
  const { t } = useLanguage();
  const spendingChangePercent = Math.abs(spendingChange);
  const spendingChangeType = spendingChange >= 0 ? 'positive' : 'negative';

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
      <StatCard
        title={t.dashboard.summaryStats.totalBalance}
        amount={typeof totalBalance === 'string' ? totalBalance : formatCurrency(totalBalance)}
        icon={Wallet}
        borderColor="blue"
        loading={loading}
      />
      <StatCard
        title={t.dashboard.summaryStats.thisMonthSpending}
        amount={formatCurrency(monthlySpending)}
        change={`${spendingChangeType === 'positive' ? '+' : '-'}${spendingChangePercent}%`}
        changeType={spendingChangeType}
        icon={TrendingDown}
        borderColor="orange"
        loading={loading}
        className={monthlySpending === 0 ? "opacity-50 grayscale pointer-events-none select-none" : ""}
      />
      <StatCard
        title={t.dashboard.summaryStats.activeFDs}
        amount={activeFDs.toString()}
        icon={PiggyBank}
        borderColor="maroon"
        loading={loading}
      />
    </div>
  );
});

