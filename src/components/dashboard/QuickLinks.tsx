import React from 'react';
import { 
  FileText, TrendingUp, Download, ArrowRight, CreditCard, 
  Send, PieChart, Shield, DollarSign, Wallet, Calendar, Settings 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/hooks/useLanguage';

interface QuickLink {
  title: string;
  subtitle: string;
  icon: React.ElementType;
  path?: string;
}

export const QuickLinks = () => {
  const { t } = useLanguage();
  
  const quickLinks: QuickLink[] = [
    { title: t.dashboard.quickLinks.accountStatement, subtitle: t.dashboard.quickLinks.downloadPdf, icon: FileText },
    { title: t.dashboard.quickLinks.openFD, subtitle: t.dashboard.quickLinks.fixedDeposit, icon: TrendingUp },
    { title: t.dashboard.quickLinks.transferMoney, subtitle: t.dashboard.quickLinks.quickTransfer, icon: Send },
    { title: t.dashboard.quickLinks.sweepInOD, subtitle: t.dashboard.quickLinks.overdraft, icon: CreditCard },
    { title: t.dashboard.quickLinks.investments, subtitle: t.dashboard.quickLinks.portfolio, icon: PieChart },
    { title: t.dashboard.quickLinks.loans, subtitle: t.dashboard.quickLinks.applyNow, icon: DollarSign },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-large">
      <h3 className="text-xl font-heading font-bold text-nmb-charcoal mb-5">{t.dashboard.quickLinks.title}</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {quickLinks.map((link) => {
          const Icon = link.icon;
          return (
            <button
              key={link.title}
              className="flex items-center gap-3 p-4 rounded-xl hover:bg-nmb-smoke transition-all group text-left"
              onClick={() => link.path && (window.location.href = link.path)}
            >
              <div className="w-10 h-10 rounded-lg bg-nmb-maroon/10 text-nmb-maroon flex items-center justify-center group-hover:bg-nmb-maroon/20 transition-colors flex-shrink-0">
                <Icon className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm text-nmb-charcoal mb-0.5 group-hover:text-nmb-maroon transition-colors">
                  {link.title}
                </h4>
                <p className="text-xs text-gray-500">{link.subtitle}</p>
              </div>
              <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-nmb-maroon transition-colors flex-shrink-0" />
            </button>
          );
        })}
      </div>
    </div>
  );
};

