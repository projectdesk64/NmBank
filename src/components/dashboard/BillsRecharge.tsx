import React from 'react';
import { Zap, Smartphone, Droplet, Wifi, Tv, Shield, TrendingUp, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/hooks/useLanguage';

interface ServiceButton {
  label: string;
  icon: React.ElementType;
  color: string;
}

export const BillsRecharge = () => {
  const { t } = useLanguage();
  
  const services: ServiceButton[] = [
    { label: t.dashboard.billsRecharge.electricity, icon: Zap, color: 'bg-yellow-100 text-yellow-600' },
    { label: t.dashboard.billsRecharge.mobilePrepaid, icon: Smartphone, color: 'bg-blue-100 text-blue-600' },
    { label: t.dashboard.billsRecharge.mobilePostpaid, icon: Smartphone, color: 'bg-indigo-100 text-indigo-600' },
    { label: t.dashboard.billsRecharge.water, icon: Droplet, color: 'bg-cyan-100 text-cyan-600' },
    { label: t.dashboard.billsRecharge.internet, icon: Wifi, color: 'bg-purple-100 text-purple-600' },
    { label: t.dashboard.billsRecharge.dth, icon: Tv, color: 'bg-pink-100 text-pink-600' },
    { label: t.dashboard.billsRecharge.insurance, icon: Shield, color: 'bg-green-100 text-green-600' },
    { label: t.dashboard.billsRecharge.mutualFunds, icon: TrendingUp, color: 'bg-orange-100 text-orange-600' },
  ];

  return (
    <div className="bg-gradient-to-br from-nmb-maroon via-[#A01800] to-nmb-orange rounded-2xl p-6 shadow-large">
      <h3 className="text-xl font-heading font-bold text-white mb-5">{t.dashboard.billsRecharge.title}</h3>
      
      <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
        {services.map((service) => {
          const Icon = service.icon;
          return (
            <button
              key={service.label}
              className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-white/10 transition-all group"
              aria-label={service.label}
            >
              <div className={cn(
                "w-16 h-16 rounded-full flex items-center justify-center transition-transform group-hover:scale-110 shadow-medium",
                service.color
              )}>
                <Icon className="h-8 w-8" />
              </div>
              <span className="text-xs font-medium text-white text-center leading-tight">
                {service.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

