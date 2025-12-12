import React from 'react';
import { Wallet, CreditCard, TrendingUp, DollarSign, PieChart, Shield, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/useLanguage';

interface HeroSectionProps {
  userName: string;
  lastLogin: string;
}

export const HeroSection = ({ userName, lastLogin }: HeroSectionProps) => {
  const { t } = useLanguage();
  
  const quickActions = [
    { label: t.dashboard.hero.accounts, icon: Wallet, path: '/dashboard/accounts' },
    { label: t.dashboard.hero.cards, icon: CreditCard, path: '/dashboard/cards' },
    { label: t.dashboard.hero.fdRd, icon: TrendingUp, path: '/dashboard/investments' },
    { label: t.dashboard.hero.loans, icon: DollarSign, path: '/dashboard/loans' },
  ];

  return (
    <div className="relative h-[280px] bg-gradient-to-br from-nmb-charcoal via-[#1a0a0a] to-nmb-maroon rounded-b-3xl overflow-hidden mb-8">
      {/* Subtle texture overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.08),transparent_50%)] pointer-events-none"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none"></div>
      
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-10 h-full flex flex-col justify-center">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          {/* Left: Welcome Message */}
          <div className="flex-1">
            <h1 className="text-4xl lg:text-5xl font-heading font-bold text-white mb-2 drop-shadow-lg">
              {t.dashboard.hero.welcome} {userName}!
            </h1>
            <p className="text-white/90 text-sm lg:text-base mb-6 drop-shadow-md">
              {t.dashboard.hero.lastLogin} {lastLogin}
            </p>
            
            {/* Quick Action Pills */}
            <div className="flex flex-wrap gap-2.5">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Button
                    key={action.label}
                    variant="ghost"
                    className="flex items-center gap-2 px-4 h-9 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm font-medium hover:bg-white/20 transition-all border border-white/20 hover:border-white/30"
                    onClick={() => window.location.href = action.path}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{action.label}</span>
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Right: Abstract Banking Illustration */}
          <div className="hidden lg:block flex-shrink-0 w-64 h-64 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-nmb-orange/20 to-nmb-blue/20 rounded-full blur-3xl"></div>
            <div className="relative w-full h-full flex items-center justify-center">
              <div className="w-32 h-32 bg-white/10 backdrop-blur-sm rounded-2xl rotate-12 border border-white/20"></div>
              <div className="absolute w-24 h-24 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 -top-4 -right-4"></div>
              <div className="absolute w-16 h-16 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 -bottom-4 -left-4"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
