import React, { useState } from 'react';
import { Send, User, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/hooks/useLanguage';

export const QuickTransfer = () => {
  const { language } = useLanguage();
  const [amount, setAmount] = useState('');

  return (
    <div className="bg-white rounded-xl shadow-card-sm border border-gray-100 p-6 animate-slide-up h-full">
      <h3 className="font-heading font-semibold text-nmb-charcoal mb-6">Quick Transfer</h3>

      <div className="space-y-6">
        {/* Payees Row */}
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          <div className="flex flex-col items-center gap-2 cursor-pointer min-w-[60px]">
            <div className="w-12 h-12 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 hover:border-nmb-orange hover:text-nmb-orange transition-colors">
              <span className="text-xl">+</span>
            </div>
            <span className="text-xs font-medium text-gray-500">Add New</span>
          </div>

          {['Maria', 'Mom', 'Alex', 'Gym'].map((name, i) => (
            <div key={name} className="flex flex-col items-center gap-2 cursor-pointer min-w-[60px] group">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center overflow-hidden border-2 transition-all ${i === 0 ? 'border-nmb-orange ring-2 ring-nmb-orange/20' : 'border-transparent group-hover:border-gray-200'}`}>
                <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500 font-semibold text-xs">
                  {name[0]}
                </div>
              </div>
              <span className={`text-xs font-medium ${i === 0 ? 'text-nmb-charcoal' : 'text-gray-400'}`}>{name}</span>
            </div>
          ))}
        </div>

        {/* Amount Input */}
        <div className="relative">
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5 block">Amount</label>
          <div className="flex items-center gap-2">
            <div className="flex-1 relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">{language === 'ru' ? '₽' : '$'}</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-8 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-bold text-nmb-charcoal focus:outline-none focus:ring-2 focus:ring-nmb-orange/20 focus:border-nmb-orange transition-all"
                placeholder={language === 'ru' ? '0,00' : '0.00'}
              />
            </div>
            <button className="flex items-center gap-2 px-3 py-3 bg-gray-100 rounded-xl text-nmb-charcoal font-medium hover:bg-gray-200 transition-colors">
              {language === 'ru' ? 'RUB' : 'USD'} <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Send Button */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          className="w-full py-3.5 bg-nmb-orange text-white rounded-xl font-bold shadow-lg shadow-nmb-orange/30 hover:bg-orange-600 hover:shadow-orange-600/30 transition-all flex items-center justify-center gap-2"
        >
          Send Money <Send className="w-4 h-4" />
        </motion.button>
      </div>
    </div>
  );
};