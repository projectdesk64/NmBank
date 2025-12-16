import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/hooks/useLanguage';
import { currentUser, Card as CardType } from '@/data/mockData';
import { CreditCard, Inbox, CheckCircle2, XCircle, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/utils/formatters';

export const Cards = () => {
  const { language } = useLanguage();
  const cards = currentUser.cards;
  const [revealedCards, setRevealedCards] = useState<Set<string>>(new Set());

  // Mask card number
  const maskCardNumber = (cardNumber: string, revealed: boolean): string => {
    if (revealed) {
      // Show last 4 digits, space every 4 digits
      return cardNumber.replace(/(.{4})/g, '$1 ').trim();
    }
    // Show only last 4 digits
    const last4 = cardNumber.slice(-4);
    return `•••• •••• •••• ${last4}`;
  };

  // Toggle card number visibility
  const toggleReveal = (cardId: string) => {
    const newRevealed = new Set(revealedCards);
    if (newRevealed.has(cardId)) {
      newRevealed.delete(cardId);
    } else {
      newRevealed.add(cardId);
    }
    setRevealedCards(newRevealed);
  };

  // Get status badge
  const getStatusBadge = (status: CardType['status']) => {
    switch (status) {
      case 'Active':
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Active
          </Badge>
        );
      case 'Blocked':
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            <XCircle className="h-3 w-3 mr-1" />
            Blocked
          </Badge>
        );
      case 'Expired':
        return (
          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
            <AlertCircle className="h-3 w-3 mr-1" />
            Expired
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // Get card gradient based on type
  const getCardGradient = (type: CardType['type'], status: CardType['status']) => {
    if (status === 'Blocked' || status === 'Expired') {
      return 'from-gray-400 to-gray-600';
    }
    if (type === 'Credit') {
      return 'from-purple-600 via-purple-700 to-indigo-800';
    }
    return 'from-blue-600 via-blue-700 to-cyan-800';
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Card */}
        <Card className="mb-6 bg-gradient-to-r from-white to-nmb-maroon/5 border-nmb-maroon/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  {language === 'ru' ? 'Всего карт' : 'Total Cards'}
                </p>
                <p className="text-3xl font-bold text-nmb-maroon">
                  {cards.length} {language === 'ru' ? 'карт' : 'Cards'}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <CreditCard className="h-8 w-8 text-nmb-maroon" />
                <span className="text-sm text-gray-600">
                  {cards.filter(c => c.status === 'Active').length} {language === 'ru' ? 'активных' : 'Active'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cards Grid */}
        {cards.length === 0 ? (
          <Card className="bg-white rounded-xl shadow-sm border border-gray-200">
            <CardContent className="p-12">
              <div className="text-center py-16">
                <Inbox className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 font-medium">
                  {language === 'ru' ? 'Нет активных карт' : 'No active cards'}
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cards.map((card) => {
              const isRevealed = revealedCards.has(card.id);
              const gradient = getCardGradient(card.type, card.status);
              
              return (
                <div
                  key={card.id}
                  className={cn(
                    "relative bg-gradient-to-br rounded-3xl p-7 shadow-2xl hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)] transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] h-[280px] flex flex-col justify-between group/card overflow-hidden",
                    gradient
                  )}
                >
                  {/* Subtle pattern overlay */}
                  <div className="absolute inset-0 opacity-10">
                    <div
                      className="absolute inset-0"
                      style={{
                        backgroundImage: `repeating-linear-gradient(
                          45deg,
                          transparent,
                          transparent 10px,
                          rgba(255,255,255,0.1) 10px,
                          rgba(255,255,255,0.1) 20px
                        )`,
                      }}
                    ></div>
                  </div>

                  {/* Top Section: Chip and Card Type */}
                  <div className="relative z-10 flex items-start justify-between">
                    <div className="relative">
                      <div className="w-12 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-md flex items-center justify-center shadow-lg">
                        <div className="w-8 h-6 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-sm"></div>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleReveal(card.id)}
                      className="p-2 rounded-full hover:bg-white/10 text-white/80 transition-colors"
                    >
                      {isRevealed ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  {/* Middle Section: Card Number */}
                  <div className="relative z-10 mt-6">
                    <p className="text-white/60 text-xs uppercase tracking-wider mb-2">
                      {language === 'ru' ? 'Номер карты' : 'Card Number'}
                    </p>
                    <p className="text-white text-2xl font-mono tracking-widest">
                      {maskCardNumber(card.cardNumber, isRevealed)}
                    </p>
                  </div>

                  {/* Bottom Section: Details */}
                  <div className="relative z-10 mt-auto">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-white/60 text-xs uppercase tracking-wider mb-1">
                          {language === 'ru' ? 'Держатель' : 'Cardholder'}
                        </p>
                        <p className="text-white text-sm font-semibold uppercase">
                          {card.cardholderName}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-white/60 text-xs uppercase tracking-wider mb-1">
                          {language === 'ru' ? 'Срок действия' : 'Expires'}
                        </p>
                        <p className="text-white text-sm font-semibold">{card.expiry}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/20">
                      <div>
                        <p className="text-white/60 text-xs uppercase tracking-wider mb-1">
                          {card.type}
                        </p>
                        {card.type === 'Debit' && card.balance !== undefined && (
                          <p className="text-white text-lg font-bold">
                            {formatCurrency(card.balance)}
                          </p>
                        )}
                        {card.type === 'Credit' && card.limit !== undefined && (
                          <p className="text-white text-lg font-bold">
                            {formatCurrency(card.limit)} {language === 'ru' ? 'лимит' : 'limit'}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        {getStatusBadge(card.status)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Cards;
