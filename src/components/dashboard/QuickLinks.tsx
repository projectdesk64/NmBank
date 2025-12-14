import React from 'react';
import { 
  TrendingUp, CreditCard, FileText, DollarSign, Settings, LayoutGrid
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';

interface QuickLink {
  title: string;
  subtitle: string;
  icon: React.ElementType;
  path: string;
}

export const QuickLinks = () => {
  const { t } = useLanguage();
  
  const quickLinks: QuickLink[] = [
    { title: 'Open Fixed Deposit', subtitle: 'Guaranteed returns', icon: TrendingUp, path: '/dashboard/fixed-deposits' },
    { title: 'Manage Cards', subtitle: 'Lock, block & limit', icon: CreditCard, path: '/dashboard/cards' },
    { title: 'Transaction History', subtitle: 'View past payments', icon: FileText, path: '/dashboard/transactions' },
    { title: 'My Loans', subtitle: 'Track repayment', icon: DollarSign, path: '/dashboard/loans' },
    { title: 'Profile & Settings', subtitle: 'Update personal info', icon: Settings, path: '/dashboard/settings' },
    { title: 'Services Hub', subtitle: 'All bank services', icon: LayoutGrid, path: '/dashboard/services' },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-large">
      <h3 className="text-xl font-heading font-bold text-nmb-charcoal mb-5">{t.dashboard.quickLinks.title}</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {quickLinks.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.title}
              to={link.path}
              className="flex items-center gap-4 p-4 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 hover:border-orange-100 transition-all duration-200 group"
            >
              <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-orange-50 text-orange-600 group-hover:bg-orange-100 transition-colors flex-shrink-0">
                <Icon className="h-6 w-6" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-sm text-nmb-charcoal group-hover:text-orange-600 transition-colors">
                  {link.title}
                </h4>
                <p className="text-xs text-gray-500 mt-0.5">
                  {link.subtitle}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

