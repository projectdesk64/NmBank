import React from 'react';
import { ArrowUpRight, ArrowDownLeft, Coffee, ShoppingBag, Smartphone, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/utils/formatters';
import { useLanguage } from '@/hooks/useLanguage';

const TRANSACTIONS = [
    { id: 1, to: 'Starbucks Coffee', date: 'Today, 10:23 AM', amount: -5.50, type: 'DEBIT', category: 'Food' },
    { id: 2, to: 'Apple Services', date: 'Yesterday, 04:15 PM', amount: -14.99, type: 'DEBIT', category: 'Tech' },
    { id: 3, to: 'Maria S. (Transfer)', date: 'Oct 12, 09:00 AM', amount: 250.00, type: 'CREDIT', category: 'Transfer' },
    { id: 4, to: 'Uber Rides', date: 'Oct 11, 08:30 PM', amount: -18.20, type: 'DEBIT', category: 'Transport' },
    { id: 5, to: 'Salary Credit', date: 'Oct 10, 09:00 AM', amount: 4500.00, type: 'CREDIT', category: 'Income' },
];

export const TransactionList = () => {
    const { language } = useLanguage();
    
    return (
        <div className="bg-white rounded-xl shadow-card-sm border border-gray-100 overflow-hidden flex flex-col h-full animate-slide-up">
            <div className="p-5 border-b border-gray-50 flex justify-between items-center">
                <h3 className="font-heading font-semibold text-nmb-charcoal">Recent Transactions</h3>
                <button className="text-nmb-orange text-sm font-medium hover:underline">View All</button>
            </div>

            <div className="flex-1 overflow-y-auto max-h-[400px]">
                {TRANSACTIONS.map((tx) => (
                    <div key={tx.id} className="group flex items-center justify-between p-4 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0 cursor-pointer">
                        <div className="flex items-center gap-4">
                            <div className={cn(
                                "w-10 h-10 rounded-full flex items-center justify-center",
                                tx.type === 'CREDIT' ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-500 group-hover:bg-white group-hover:shadow-sm transition-all"
                            )}>
                                {tx.type === 'CREDIT' ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                            </div>
                            <div>
                                <p className="font-medium text-sm text-nmb-charcoal">{tx.to}</p>
                                <p className="text-xs text-gray-400">{tx.category} • {tx.date}</p>
                            </div>
                        </div>

                        <div className="text-right">
                            <p className={cn(
                                "font-semibold text-sm",
                                tx.type === 'CREDIT' ? "text-green-600" : "text-nmb-charcoal"
                            )}>
                                {tx.type === 'DEBIT' ? '-' : '+'}{formatCurrency(Math.abs(tx.amount))}
                            </p>
                            <p className="text-xs text-gray-300">{language === 'ru' ? 'RUB' : 'USD'}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
