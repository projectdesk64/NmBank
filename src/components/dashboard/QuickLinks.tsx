import React from 'react';
import { 
  TrendingUp, CreditCard, FileText, DollarSign, Settings, LayoutGrid
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';

interface QuickLink {
  title: string;
  icon: React.ElementType;
  path: string;
}

export const QuickLinks = () => {
  const { t } = useLanguage();
  
  const quickLinks: QuickLink[] = [
    { title: 'Open Fixed Deposit', icon: TrendingUp, path: '/dashboard/fixed-deposits' },
    { title: 'Manage Cards', icon: CreditCard, path: '/dashboard/cards' },
    { title: 'Transaction History', icon: FileText, path: '/dashboard/transactions' },
    { title: 'My Loans', icon: DollarSign, path: '/dashboard/loans' },
    { title: 'Profile & Settings', icon: Settings, path: '/dashboard/settings' },
    { title: 'Services Hub', icon: LayoutGrid, path: '/dashboard/services' },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-large">
      <h3 className="text-xl font-heading font-bold text-nmb-charcoal mb-5">{t.dashboard.quickLinks.title}</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {quickLinks.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.title}
              to={link.path}
              className="flex flex-col items-center justify-center gap-3 p-4 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md hover:border-orange-100 transition-all group"
            >
              <div className="w-12 h-12 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center group-hover:bg-orange-100 transition-colors">
                <Icon className="h-6 w-6" />
              </div>
              <h4 className="font-semibold text-sm text-nmb-charcoal text-center group-hover:text-orange-600 transition-colors">
                {link.title}
              </h4>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

