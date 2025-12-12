import React from 'react';
import { TrendingUp, Plus } from 'lucide-react';

export const FDWidget = () => {
    return (
        <div className="bg-gradient-maroon rounded-xl p-6 text-white shadow-xl shadow-nmb-maroon/20 relative overflow-hidden group cursor-pointer animate-slide-up" style={{ animationDelay: '100ms' }}>
            {/* Decor */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-8 -mt-8 blur-2xl group-hover:bg-white/20 transition-all" />

            <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                    <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                        <TrendingUp className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xs font-medium bg-white/20 px-2 py-1 rounded text-white/90">
                        +6.5% p.a.
                    </span>
                </div>

                <h3 className="font-heading font-bold text-lg mb-1">Open Fixed Deposit</h3>
                <p className="text-white/70 text-sm mb-4">
                    Grow your savings with guaranteed returns.
                </p>

                <button className="w-full py-2 bg-white text-nmb-maroon text-sm font-bold rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-1">
                    Start Now <Plus className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};
