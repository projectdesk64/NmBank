import { useState, useMemo, useRef, useEffect } from 'react';
import {
  Search, Bell, User,
  LayoutDashboard, Send, CreditCard, PiggyBank, Banknote, History
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import nmbLogo from '@/assets/nmb-logo.svg';
import { useUser } from '@/contexts/UserContext';

// --- Master Search Index ---
const SEARCH_INDEX = [
  // --- Special Client Demo Items ---
  {
    id: 'prof1',
    title: 'Customer Profile',
    subtitle: 'Auth Signer: Thynana Gopi Priyanka | ID: NMB-78229100',
    path: '/profile',
    icon: 'User',
    keywords: ['c', 'customer', 'profile', 'shravan', 'details', 'kyc']
  },
  {
    id: 'acc1',
    title: 'Account Details',
    subtitle: 'Main Savings | ...4729 | Bal: 27B ₽',
    path: '/profile',
    icon: 'CreditCard',
    keywords: ['account', 'savings', 'balance', 'details']
  },

  // --- Standard App Pages ---
  { id: 'p1', title: 'Dashboard', path: '/', icon: 'LayoutDashboard', keywords: ['home', 'main'] },
  { id: 'p2', title: 'Send Money', path: '/transfer', icon: 'Send', keywords: ['transfer', 'pay', 'send'] },
  { id: 'p3', title: 'My Cards', path: '/cards', icon: 'CreditCard', keywords: ['debit', 'credit', 'cards'] },
  { id: 'p4', title: 'Fixed Deposits', path: '/deposits', icon: 'PiggyBank', keywords: ['fd', 'investment', 'save'] },
  { id: 'p5', title: 'Loans', path: '/loans', icon: 'Banknote', keywords: ['borrow', 'emi', 'loan'] },
  { id: 'p6', title: 'Transaction History', path: '/dashboard/transactions', icon: 'History', keywords: ['history', 'statement', 'logs'] },
];

const ICON_MAP: Record<string, any> = {
  User,
  CreditCard,
  LayoutDashboard,
  Send,
  PiggyBank,
  Banknote,
  History
};

export const Header = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const filteredResults = useMemo(() => {
    if (!query.trim()) return [];

    const lowerQuery = query.toLowerCase();
    return SEARCH_INDEX.filter(item => {
      const matchTitle = item.title.toLowerCase().includes(lowerQuery);
      const matchSubtitle = item.subtitle ? item.subtitle.toLowerCase().includes(lowerQuery) : false;
      const matchKeywords = item.keywords.some(k => k.toLowerCase().includes(lowerQuery));
      return matchTitle || matchSubtitle || matchKeywords;
    });
  }, [query]);

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      // If there are results, navigate to the first one
      if (filteredResults.length > 0) {
        handleResultClick(filteredResults[0].path);
      } else {
        // Fallback to profile as per original demo behavior if no specific match/empty? 
        // Or strictly keep to search results. Sticking to results logic or profile if exact match.
        // Actually, let's just make it do nothing if no results, or maybe go to the first item if exists.
        // For a smoother demo, if they type "profile" and hit enter, it should go to profile.
      }
    }
  };

  const handleResultClick = (path: string) => {
    navigate(path);
    setQuery('');
    setIsOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 h-[72px] flex items-center justify-between">
        {/* Left: Logo */}
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-center">
            <img src={nmbLogo} alt="NMB Logo" className="h-10 w-auto" />
            <span className="text-nmb-orange font-sans text-sm font-medium mt-1">New Moscow Bank</span>
          </div>
        </div>

        {/* Center: Search */}
        <div className="hidden md:flex flex-1 max-w-md mx-8 relative" ref={searchRef}>
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            placeholder="Search for payments, services, or history..."
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-nmb-orange/20 focus:border-nmb-orange transition-all"
            onKeyDown={handleSearchKeyDown}
          />

          {/* Search Dropdown */}
          {isOpen && query && filteredResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden py-2 animate-in fade-in slide-in-from-top-2 duration-200">
              {filteredResults.map((result) => {
                const Icon = ICON_MAP[result.icon] || Search;
                return (
                  <div
                    key={result.id}
                    onClick={() => handleResultClick(result.path)}
                    className="px-4 py-3 hover:bg-gray-50 cursor-pointer flex items-center gap-3 transition-colors group"
                  >
                    <div className="p-2 rounded-lg bg-gray-100 text-gray-500 group-hover:bg-white group-hover:text-nmb-orange group-hover:shadow-sm transition-all">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">{result.title}</h4>
                      {result.subtitle && (
                        <p className="text-xs text-gray-500 mt-0.5">{result.subtitle}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-4">
          <button className="relative p-2.5 rounded-full hover:bg-gray-100 text-gray-600 transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-nmb-orange rounded-full border border-white"></span>
          </button>

          <div className="flex items-center gap-3 pl-2 border-l border-gray-200">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-sm font-semibold text-nmb-charcoal">{user.name}</span>
              <span className="text-xs text-nmb-blue font-medium">Personal Account</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-maroon p-[2px] cursor-pointer hover:shadow-md transition-shadow">
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-5 h-5 text-gray-400" />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};