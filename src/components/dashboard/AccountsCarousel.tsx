import { useState, useEffect, useRef, useCallback } from 'react';
import { Eye, EyeOff, ArrowRight, ArrowLeft } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/utils/formatters';

interface Account {
  id: string;
  type: 'savings' | 'current' | 'fd';
  accountNumber: string;
  balance: number;
  ifsc?: string;
  branch?: string;
}

interface AccountsCarouselProps {
  accounts: Account[];
  showBalance: boolean;
  onToggleBalance: () => void;
  loading?: boolean;
}

const formatAccountNumber = (accountNumber: string, revealed: boolean) => {
  if (!accountNumber) return '•••• •••• •••• •••• ••••';
  if (revealed) {
    // Format as 20-digit Russian bank account: XXXX XXXX XXXX XXXX XXXX
    const cleaned = accountNumber.replace(/\s/g, '');
    // Pad to 20 digits if needed
    const padded = cleaned.padStart(20, '0');
    return padded.match(/.{1,4}/g)?.join(' ') || accountNumber;
  }
  // Show last 4 digits in 20-digit Russian bank account format (5 groups of 4)
  const lastFour = accountNumber.slice(-4);
  return `•••• •••• •••• •••• ${lastFour}`;
};

// Credit card style gradients - more sophisticated
const accountGradients = {
  savings: 'from-purple-600 via-purple-700 to-indigo-800',
  current: 'from-blue-600 via-blue-700 to-cyan-800',
  fd: 'from-orange-600 via-rose-600 to-pink-700',
};

// Card type labels
const accountTypeLabels = {
  savings: 'SAVINGS',
  current: 'CURRENT',
  fd: 'FIXED DEPOSIT',
};

export const AccountsCarousel = ({
  accounts,
  showBalance,
  onToggleBalance,
  loading = false
}: AccountsCarouselProps) => {
  // const { language } = useLanguage(); // Removed unused language
  const [revealedAccounts, setRevealedAccounts] = useState<Set<string>>(new Set());
  const [scrollPosition, setScrollPosition] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  const toggleReveal = (accountId: string) => {
    const newRevealed = new Set(revealedAccounts);
    if (newRevealed.has(accountId)) {
      newRevealed.delete(accountId);
      // Auto re-mask after 5 seconds
      setTimeout(() => {
        setRevealedAccounts(prev => {
          const updated = new Set(prev);
          updated.delete(accountId);
          return updated;
        });
      }, 5000);
    } else {
      newRevealed.add(accountId);
    }
    setRevealedAccounts(newRevealed);
  };

  const checkScrollability = useCallback(() => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    setScrollPosition(scrollLeft);
  }, []);

  useEffect(() => {
    const scrollElement = scrollRef.current;
    if (scrollElement) {
      scrollElement.addEventListener('scroll', checkScrollability);
      checkScrollability();
      return () => scrollElement.removeEventListener('scroll', checkScrollability);
    }
  }, [accounts, checkScrollability]);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const cardWidth = 380; // Card width + gap
    const currentScroll = scrollRef.current.scrollLeft;
    const scrollAmount = direction === 'left'
      ? currentScroll - cardWidth
      : currentScroll + cardWidth;

    scrollRef.current.scrollTo({
      left: scrollAmount,
      behavior: 'smooth'
    });
  };

  if (loading) {
    return (
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-heading font-bold text-nmb-charcoal">My Accounts</h2>
            <p className="text-sm text-gray-500 mt-1">Manage and view your accounts</p>
          </div>
          <div className="h-10 w-32 bg-gray-200 rounded-lg animate-pulse"></div>
        </div>
        <div className="flex gap-5 overflow-hidden">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex-shrink-0 w-[360px] h-[220px] bg-white rounded-3xl shadow-large animate-pulse overflow-hidden">
              <div className="h-full bg-gradient-to-br from-gray-200 to-gray-300 rounded-3xl"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8">
      {/* Header Section - Redesigned */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-heading font-bold text-nmb-charcoal">My Accounts</h2>
          <p className="text-sm text-gray-500 mt-1">Manage and view your accounts</p>
        </div>

        {/* Toggle Balance - Redesigned with Switch */}
        <div className="flex items-center gap-3 bg-white rounded-lg px-4 py-2.5 border border-nmb-mist shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2">
            {showBalance ? (
              <Eye className="h-4 w-4 text-gray-600" />
            ) : (
              <EyeOff className="h-4 w-4 text-gray-400" />
            )}
            <Label
              htmlFor="balance-toggle"
              className="text-sm font-medium text-nmb-charcoal cursor-pointer select-none"
            >
              {showBalance ? 'Hide' : 'Show'} Balance
            </Label>
          </div>
          <Switch
            id="balance-toggle"
            checked={showBalance}
            onCheckedChange={onToggleBalance}
          />
        </div>
      </div>

      {/* Carousel Container */}
      <div className="relative group">
        {/* Scroll Buttons - Enhanced Design */}
        {canScrollLeft && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 lg:-translate-x-4 z-20 w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-white shadow-lg border border-nmb-mist flex items-center justify-center hover:bg-nmb-smoke hover:shadow-xl transition-all duration-200 active:scale-95"
            aria-label="Scroll left"
          >
            <ArrowLeft className="h-5 w-5 text-nmb-charcoal" />
          </button>
        )}

        {canScrollRight && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 lg:translate-x-4 z-20 w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-white shadow-lg border border-nmb-mist flex items-center justify-center hover:bg-nmb-smoke hover:shadow-xl transition-all duration-200 active:scale-95"
            aria-label="Scroll right"
          >
            <ArrowRight className="h-5 w-5 text-nmb-charcoal" />
          </button>
        )}

        {/* Accounts Scroll Container - Enhanced */}
        <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory scroll-smooth"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch'
          }}
          onScroll={checkScrollability}
        >
          {accounts.map((account) => {
            const isRevealed = revealedAccounts.has(account.id);
            const gradient = accountGradients[account.type];
            const accountLabel = accountTypeLabels[account.type];

            return (
              <div
                key={account.id}
                className="flex-shrink-0 w-[360px] snap-start"
              >
                <div className={cn(
                  "relative bg-gradient-to-br rounded-3xl p-7 shadow-2xl hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)] transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] h-[220px] flex flex-col justify-between group/card overflow-hidden",
                  gradient
                )}>
                  {/* Subtle pattern overlay for card texture */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                      backgroundImage: `repeating-linear-gradient(
                        45deg,
                        transparent,
                        transparent 10px,
                        rgba(255,255,255,0.1) 10px,
                        rgba(255,255,255,0.1) 20px
                      )`
                    }}></div>
                  </div>

                  {/* Top Section: Chip and Account Type */}
                  <div className="relative z-10 flex items-start justify-between">
                    {/* Credit Card Chip */}
                    <div className="relative">
                      <div className="w-12 h-10 bg-gradient-to-br from-yellow-400/40 via-yellow-300/30 to-yellow-500/40 rounded-md border border-white/20 shadow-lg backdrop-blur-sm">
                        <div className="absolute inset-1 bg-gradient-to-br from-yellow-200/50 to-transparent rounded-sm"></div>
                        <div className="absolute bottom-1 left-1 right-1 h-0.5 bg-white/30 rounded-full"></div>
                        <div className="absolute bottom-2 left-1.5 right-1.5 h-0.5 bg-white/20 rounded-full"></div>
                      </div>
                    </div>

                    {/* Account Type Label */}
                    <div className="text-right">
                      <p className="text-white/60 text-[10px] font-semibold uppercase tracking-[0.15em] mb-1">
                        {accountLabel}
                      </p>
                      <p className="text-white/40 text-[9px] uppercase tracking-widest">
                        ACCOUNT
                      </p>
                    </div>
                  </div>

                  {/* Middle Section: Account Number */}
                  <div className="relative z-10 flex-1 flex flex-col justify-center">
                    <div className="mb-1">
                      <p className="text-white/50 text-[10px] uppercase tracking-wider mb-3 font-medium">
                        Account Number
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="text-white font-mono font-bold text-2xl tracking-[0.15em]">
                        {formatAccountNumber(account.accountNumber, isRevealed)}
                      </p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleReveal(account.id);
                        }}
                        className="p-2 hover:bg-white/15 rounded-lg transition-all duration-200 group/eye flex-shrink-0"
                        aria-label={isRevealed ? 'Hide account number' : 'Reveal account number'}
                      >
                        {isRevealed ? (
                          <EyeOff className="h-4 w-4 text-white/80 group-hover/eye:text-white transition-colors" />
                        ) : (
                          <Eye className="h-4 w-4 text-white/60 group-hover/eye:text-white transition-colors" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Bottom Section: Balance */}
                  <div className="relative z-10 flex items-end justify-between">
                    <div className="flex-1">
                      <p className="text-white/60 text-[10px] uppercase tracking-wider mb-2 font-medium">
                        Available Balance
                      </p>
                      <p className="text-3xl font-heading font-bold text-white tabular-nums leading-tight">
                        {showBalance ? formatCurrency(account.balance) : (
                          <span className="inline-flex items-center gap-1.5">
                            <span className="text-white/80">₽</span>
                            <span className="flex gap-1.5">
                              {[1, 2, 3, 4, 5, 6].map((i) => (
                                <span key={i} className="w-2.5 h-2.5 bg-white/50 rounded-full"></span>
                              ))}
                            </span>
                          </span>
                        )}
                      </p>
                    </div>

                    {/* Subtle decorative element */}
                    <div className="opacity-20">
                      <div className="w-16 h-10 bg-white/10 rounded-lg backdrop-blur-sm border border-white/10"></div>
                    </div>
                  </div>

                  {/* Shine effect on hover */}
                  <div className="absolute inset-0 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 translate-x-[-200%] group-hover/card:translate-x-[200%] transition-transform duration-1000"></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Scroll Indicator Dots - Mobile Only */}
        {accounts.length > 1 && (
          <div className="flex justify-center gap-2 mt-4 lg:hidden">
            {accounts.map((_, index) => {
              const isActive = Math.round(scrollPosition / 380) === index;
              return (
                <div
                  key={index}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-200",
                    isActive
                      ? "w-6 bg-nmb-blue"
                      : "w-1.5 bg-gray-300"
                  )}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

