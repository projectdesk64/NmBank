import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, CreditCard, Copy } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useBalanceStore } from '@/hooks/useBalanceStore';
import { useLanguage } from '@/hooks/useLanguage';
import { formatCurrency } from '@/utils/formatters';

interface AccountCardProps {
  type: 'SAVINGS' | 'CURRENT' | 'CREDIT';
  balance: number;
  number: string;
  currency?: string;
  isPrimary?: boolean;
}

export const AccountCard = ({ type, balance, number, currency = '$', isPrimary }: AccountCardProps) => {
  const { isVisible, toggleVisibility } = useBalanceStore();
  const { language } = useLanguage();

  // Format balance and split for display
  const formattedBalance = formatCurrency(balance);
  // Try to split by decimal point (works for most currencies)
  const decimalMatch = formattedBalance.match(/[.,]\d{2}/);
  const decimalPart = decimalMatch ? decimalMatch[0].substring(1) : '';
  const integerPart = decimalMatch ? formattedBalance.substring(0, decimalMatch.index) : formattedBalance;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "relative min-w-[300px] md:min-w-[340px] h-[190px] rounded-xl p-6 flex flex-col justify-between overflow-hidden cursor-pointer selection:bg-white/30",
        isPrimary
          ? "bg-gradient-maroon text-white shadow-xl shadow-nmb-maroon/20"
          : "bg-white text-nmb-charcoal border border-gray-100 shadow-card-sm hover:shadow-card-hover"
      )}
    >
      {/* Background decoration for Primary */}
      {isPrimary && (
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
      )}

      {/* Top Row: Icon + Type + Toggle */}
      <div className="flex justify-between items-start z-10">
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-sm",
            isPrimary ? "bg-white/10" : "bg-gray-100"
          )}>
            <CreditCard className={cn("w-5 h-5", isPrimary ? "text-white" : "text-nmb-maroon")} />
          </div>
          <div>
            <p className={cn("text-xs font-medium uppercase tracking-wider opacity-80", isPrimary ? "text-white" : "text-gray-500")}>
              {type} Account
            </p>
            <p className={cn("text-sm font-semibold", isPrimary ? "text-white" : "text-nmb-charcoal")}>
              New Moscow {type === 'CREDIT' ? 'Platinum' : 'Standard'}
            </p>
          </div>
        </div>

        <button
          onClick={(e) => { e.stopPropagation(); toggleVisibility(); }}
          className={cn(
            "p-2 rounded-full transition-colors",
            isPrimary ? "hover:bg-white/10 text-white/80" : "hover:bg-gray-100 text-gray-400 hover:text-gray-600"
          )}
        >
          {isVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>

      {/* Middle: Number */}
      <div className="flex items-center gap-2 mt-4 opacity-80 z-10">
        <span className="font-mono text-sm tracking-widest">
          •••• •••• •••• •••• {number.slice(-4)}
        </span>
        <Copy className="w-3 h-3 cursor-pointer hover:opacity-100 transition-opacity" />
      </div>

      {/* Bottom: Balance */}
      <div className="z-10 mt-auto">
        <p className={cn("text-xs mb-1 opacity-70", isPrimary ? "text-white" : "text-gray-500")}>
          Available Balance
        </p>
        <div className="h-9 flex items-baseline gap-1">
          <AnimatePresence mode="wait">
            {isVisible ? (
              <motion.div
                key="balance"
                initial={{ opacity: 0, filter: 'blur(4px)' }}
                animate={{ opacity: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, filter: 'blur(4px)' }}
                transition={{ duration: 0.2 }}
                className="flex items-baseline"
              >
                <span className="text-3xl font-bold tracking-tight">{integerPart}</span>
                {decimalPart && <span className="text-xl font-medium opacity-80">.{decimalPart}</span>}
              </motion.div>
            ) : (
              <motion.div
                key="masked"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-3xl font-bold tracking-widest mt-1"
              >
                ••••••
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};