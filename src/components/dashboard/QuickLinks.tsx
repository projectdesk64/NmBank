import React from 'react';
import { 
  TrendingUp, CreditCard, FileText, DollarSign, Globe, Gift,
  Wallet, PieChart, Shield
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
    { title: 'Exchange Rates', subtitle: 'USD, EUR, GBP Live', icon: Globe, path: '/services/rates' },
    { title: 'My Loans', subtitle: 'Track repayment', icon: DollarSign, path: '/dashboard/loans' },
    { title: 'Transaction History', subtitle: 'View past payments', icon: FileText, path: '/dashboard/transactions' },
    { title: 'Rewards & Offers', subtitle: 'Platinum privileges', icon: Gift, path: '/services/rewards' },
    { title: 'My Accounts', subtitle: 'View all accounts', icon: Wallet, path: '/dashboard/accounts' },
    { title: 'Investments', subtitle: 'Portfolio overview', icon: PieChart, path: '/dashboard/investments' },
    { title: 'Insurance', subtitle: 'Policies & coverage', icon: Shield, path: '/dashboard/insurance' },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-large">
      <h3 className="text-xl font-heading font-bold text-nmb-charcoal mb-5">{t.dashboard.quickLinks.title}</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {quickLinks.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.title}
              to={link.path}
              className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-lg hover:-translate-y-1 hover:border-orange-200 transition-all duration-300 cursor-pointer group"
            >
              <div className="w-14 h-14 rounded-2xl flex-shrink-0 flex items-center justify-center bg-gray-50 group-hover:bg-orange-50 transition-colors">
                <Icon className="w-7 h-7 text-gray-600 group-hover:text-orange-600" />
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

