import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/utils/formatters';
import { useLanguage } from '@/hooks/useLanguage';

interface SpendingData {
  name: string;
  value: number;
  color: string;
}

interface SpendingPieChartProps {
  data?: SpendingData[];
  className?: string;
}

// Default spending categories with colors (values in Russian Rubles)
const defaultSpendingData: SpendingData[] = [
  { name: 'Food & Dining', value: 0, color: '#DC8924' }, // nmb-orange
  { name: 'Shopping', value: 0, color: '#8A1200' }, // nmb-maroon
  { name: 'Transportation', value: 0, color: '#1E39C6' }, // nmb-blue
  { name: 'Bills & Utilities', value: 0, color: '#8B5CF6' }, // purple
  { name: 'Entertainment', value: 0, color: '#EC4899' }, // pink
  { name: 'Others', value: 0, color: '#64748B' }, // gray
];

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    const total = payload.reduce((sum: number, entry: any) => sum + entry.value, 0);
    const percentage = ((data.value / total) * 100).toFixed(1);

    return (
      <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
        <p className="font-semibold text-nmb-charcoal">{data.name}</p>
        <p className="text-sm text-gray-600 mt-1">
          {formatCurrency(data.value)}
        </p>
        <p className="text-xs text-gray-500 mt-1">{percentage}% of total</p>
      </div>
    );
  }
  return null;
};

export const SpendingPieChart = ({
  data = defaultSpendingData,
  className
}: SpendingPieChartProps) => {
  const { t, language } = useLanguage();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const totalSpending = data.reduce((sum, item) => sum + item.value, 0);

  // Handle zero state
  const isZeroState = totalSpending === 0;
  const chartData = isZeroState ? [{ name: 'No Spending', value: 1, color: '#F3F4F6' }] : data;

  const handleMouseEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  const handleMouseLeave = () => {
    if (selectedIndex === null) {
      setActiveIndex(null);
    }
  };

  const handleClick = (index: number) => {
    setSelectedIndex(selectedIndex === index ? null : index);
    setActiveIndex(selectedIndex === index ? null : index);
  };

  return (
    <div className={cn(
      "bg-white rounded-2xl p-6 border border-nmb-mist shadow-large transition-all duration-300",
      !isZeroState && "hover:shadow-[0_8px_24px_rgba(0,0,0,0.15)]",
      isZeroState && "opacity-60 select-none",
      className
    )}>
      <div className="mb-5">
        <h3 className="text-lg font-heading font-semibold text-nmb-charcoal mb-1">
          {t.dashboard.spendingOverview.title}
        </h3>
        <p className="text-sm text-gray-500">{t.dashboard.spendingOverview.thisMonthExpenses}</p>
      </div>

      {/* Total Spending */}
      <div className="mb-6 pb-5 border-b border-gray-100">
        <p className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">
          {t.dashboard.spendingOverview.totalSpending}
        </p>
        <p className="text-3xl font-heading font-bold text-nmb-charcoal tabular-nums">
          {formatCurrency(totalSpending)}
        </p>
      </div>

      {/* Pie Chart */}
      <div className="mb-6">
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={75}
              innerRadius={40}
              fill="#8884d8"
              dataKey="value"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={handleClick}
              animationBegin={0}
              animationDuration={600}
              paddingAngle={isZeroState ? 0 : 2}
            >
              {chartData.map((entry, index) => {
                const isActive = activeIndex === index || selectedIndex === index;
                return (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    stroke={isActive && !isZeroState ? entry.color : '#fff'}
                    strokeWidth={isActive && !isZeroState ? 4 : 2}
                    opacity={activeIndex !== null && activeIndex !== index && selectedIndex !== index ? 0.5 : 1}
                    style={{
                      filter: isActive && !isZeroState ? 'brightness(1.15) drop-shadow(0 4px 8px rgba(0,0,0,0.2))' : 'none',
                      transition: 'all 0.3s ease',
                      cursor: isZeroState ? 'default' : 'pointer',
                      transform: isActive && !isZeroState ? 'scale(1.05)' : 'scale(1)',
                      transformOrigin: 'center',
                    }}
                  />
                );
              })}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend - Hide on zero state to reduce clutter or keep simple */}
      <div className={cn("space-y-1.5", isZeroState && "opacity-50 pointer-events-none")}>
        {data.map((item, index) => {
          const percentage = totalSpending > 0 ? ((item.value / totalSpending) * 100).toFixed(1) : '0.0';
          const isActive = activeIndex === index || selectedIndex === index;
          return (
            <div
              key={item.name}
              className={cn(
                "flex items-center justify-between p-2.5 rounded-lg transition-all duration-200 cursor-pointer",
                isActive
                  ? "bg-gray-50 border border-gray-200"
                  : "hover:bg-gray-50/50"
              )}
              onMouseEnter={() => handleMouseEnter(null, index)}
              onMouseLeave={handleMouseLeave}
              onClick={() => handleClick(index)}
              style={{
                opacity: activeIndex !== null && activeIndex !== index && selectedIndex !== index ? 0.5 : 1,
              }}
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div
                  className={cn(
                    "w-3 h-3 rounded-full flex-shrink-0 transition-transform",
                    isActive && "scale-125"
                  )}
                  style={{ backgroundColor: item.color }}
                />
                <span className={cn(
                  "text-sm font-medium truncate",
                  isActive ? "text-nmb-charcoal font-semibold" : "text-nmb-charcoal"
                )}>
                  {item.name}
                </span>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0 ml-2">
                <span className={cn(
                  "text-sm tabular-nums",
                  isActive ? "font-semibold text-nmb-charcoal" : "font-medium text-gray-700"
                )}>
                  {formatCurrency(item.value)}
                </span>
                <span className={cn(
                  "text-xs w-12 text-right tabular-nums",
                  isActive ? "text-gray-600 font-medium" : "text-gray-500"
                )}>
                  {percentage}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

