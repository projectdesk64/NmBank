import React from 'react';
import { Smartphone, Zap, QrCode, CreditCard, FileText, Wifi, Gift, MoreHorizontal } from 'lucide-react';

const ACTIONS = [
    { icon: Smartphone, label: 'Mobile Recharges', color: 'bg-blue-50 text-blue-600' },
    { icon: Zap, label: 'Utility Bills', color: 'bg-yellow-50 text-yellow-600' },
    { icon: QrCode, label: 'Scan & Pay', color: 'bg-nmb-orange/10 text-nmb-orange' },
    { icon: CreditCard, label: 'Card Payment', color: 'bg-purple-50 text-purple-600' },
    { icon: Wifi, label: 'Internet', color: 'bg-indigo-50 text-indigo-600' },
    { icon: FileText, label: 'Statement', color: 'bg-gray-50 text-gray-600' },
    { icon: Gift, label: 'Rewards', color: 'bg-pink-50 text-pink-600' },
    { icon: MoreHorizontal, label: 'More', color: 'bg-gray-50 text-gray-400' },
];

export const ActionGrid = () => {
    return (
        <div className="bg-white rounded-xl shadow-card-sm border border-gray-100 p-6 h-full animate-slide-up" style={{ animationDelay: '100ms' }}>
            <h3 className="font-heading font-semibold text-nmb-charcoal mb-4">Quick Actions</h3>
            <div className="grid grid-cols-4 gap-4">
                {ACTIONS.map((action) => (
                    <button key={action.label} className="flex flex-col items-center gap-2 group">
                        <div className={`w-12 h-12 rounded-xl ${action.color} flex items-center justify-center transition-transform group-hover:scale-105 group-hover:shadow-md`}>
                            <action.icon className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] md:text-xs font-medium text-center text-gray-600 leading-tight max-w-[60px]">
                            {action.label}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
};
