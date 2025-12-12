import React from 'react';
import { Search, Bell, Menu, User } from 'lucide-react';
import nmbLogo from '@/assets/nmb-logo.svg';

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 h-18 flex items-center justify-between">
        {/* Left: Logo */}
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-center">
            <img src={nmbLogo} alt="NMB Logo" className="h-10 w-auto" />
            <span className="text-nmb-orange font-sans text-sm font-medium mt-1">New Moscow Bank</span>
          </div>
        </div>

        {/* Center: Search */}
        <div className="hidden md:flex flex-1 max-w-md mx-8 relative">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Search for payments, services, or history..."
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-nmb-orange/20 focus:border-nmb-orange transition-all"
          />
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-4">
          <button className="relative p-2.5 rounded-full hover:bg-gray-100 text-gray-600 transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-nmb-orange rounded-full border border-white"></span>
          </button>

          <div className="flex items-center gap-3 pl-2 border-l border-gray-200">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-sm font-semibold text-nmb-charcoal">Alex Johnson</span>
              <span className="text-xs text-nmb-blue font-medium">Personal Account</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-maroon p-[2px] cursor-pointer hover:shadow-md transition-shadow">
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                {/* Placeholder Avatar */}
                <User className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};