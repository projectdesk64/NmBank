import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Search, Headphones, Bell, Phone, Mail, User, CreditCard,
  LayoutDashboard, Send, PiggyBank, Banknote, History
} from 'lucide-react';
import { onAuthStateChanged, User as FirebaseUser, signOut } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import nmbLogo from '@/assets/nmb-logo.svg';
import { Footer } from '@/components/layout/Footer';
import { LanguageToggle } from '@/components/LanguageToggle';
import { UserAvatar } from '@/components/ui/UserAvatar';
import { CustomerDetailsModal } from '@/components/dashboard/CustomerDetailsModal';
import { useLanguage } from '@/hooks/useLanguage';

interface Profile {
  name?: string;
  email?: string;
  phone?: string;
  customerId?: string;
}

// --- Master Search Index ---
const SEARCH_INDEX = [
  // --- Special Client Demo Items ---
  {
    id: 'prof1',
    title: 'Customer Profile',
    subtitle: 'Auth Signer: Thynana Gopi Priyanka | ID: NMB-78229100',
    path: '/profile',
    icon: 'User',
    keywords: ['customer', 'profile', 'shravan', 'details', 'kyc']
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
  History,
  Search
};

export const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { t } = useLanguage();
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const isDashboardHome = location.pathname === '/dashboard';
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let unsubscribeUser: (() => void) | null = null;

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        // Subscribe to user document
        const userRef = doc(db, 'users', currentUser.uid);
        unsubscribeUser = onSnapshot(
          userRef,
          (docSnap) => {
            if (docSnap.exists()) {
              const data = docSnap.data();
              setProfile(data?.profile || null);
            }
          },
          (error) => {
            if (import.meta.env.DEV) {
              console.error('Error fetching profile:', error);
            }
          }
        );
      } else {
        setProfile(null);
      }
    });

    return () => {
      unsubscribe();
      if (unsubscribeUser) {
        unsubscribeUser();
      }
    };
  }, []);

  useEffect(() => {
    setShowSearchDropdown(searchQuery.length > 0);
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchResultClick = (path: string) => {
    navigate(path);
    setSearchQuery('');
    setShowSearchDropdown(false);
  };

  // Demo Suggestions Constant
  const filteredFeatures = useMemo(() => {
    if (!searchQuery.trim()) return [];

    const lowerQuery = searchQuery.toLowerCase();
    return SEARCH_INDEX.filter(item => {
      const matchTitle = item.title.toLowerCase().includes(lowerQuery);
      const matchSubtitle = item.subtitle ? item.subtitle.toLowerCase().includes(lowerQuery) : false;
      const matchKeywords = item.keywords.some(k => k.toLowerCase().includes(lowerQuery));
      return matchTitle || matchSubtitle || matchKeywords;
    });
  }, [searchQuery]);

  const handleLogout = async () => {
    try {
      // 1. Clear all local/session storage to remove sensitive cached data
      localStorage.clear();
      sessionStorage.clear();

      // 2. Sign out from Firebase
      await signOut(auth);

      // 3. Redirect to login
      navigate('/login');
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Logout failed:', error);
      }
      // Fallback redirect even if error
      navigate('/login');
    }
  };


  return (
    <div className="min-h-screen bg-nmb-smoke font-sans text-nmb-charcoal flex flex-col overflow-x-hidden">
      {/* Bar 1 - Top Utility Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-nmb-maroon text-white text-xs h-10 flex items-center">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 flex items-center justify-between w-full">
          {/* Left: Phone + Email with icons, separated by vertical line */}
          <div className="flex items-center gap-4">
            <a
              href="tel:+74957969355"
              className="flex items-center gap-2 hover:text-white/80 transition-colors"
            >
              <Phone className="h-3.5 w-3.5" />
              <span>+7 (495) 796-93-55</span>
            </a>
            <div className="h-4 w-px bg-white/30"></div>
            <a
              href="mailto:info@nmbank.ru"
              className="flex items-center gap-2 hover:text-white/80 transition-colors"
            >
              <Mail className="h-3.5 w-3.5" />
              <span>info@nmbank.ru</span>
            </a>
          </div>
          {/* Right: Language Toggle */}
          <LanguageToggle className="text-white" />
        </div>
      </div>

      {/* Top Bar - Fixed 72px */}
      <div className="fixed top-10 left-0 right-0 z-50 h-[72px] bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 h-full flex items-center justify-between">
          {/* Left: Logo + Classic */}
          <div className="flex items-center gap-3">
            <Link to="/dashboard" className="flex flex-col items-center cursor-pointer hover:opacity-90 transition-opacity">
              <img src={nmbLogo} alt="NMB Logo" className="h-10 w-auto" />
              <span className="text-nmb-orange font-sans text-sm font-medium mt-1">New Moscow Bank</span>
            </Link>
          </div>

          {/* Center: Search Pill */}
          <div className="flex-1 flex justify-center max-w-[500px] mx-4">
            <div ref={searchRef} className="relative w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 z-10" />
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => searchQuery.length > 0 && setShowSearchDropdown(true)}
                placeholder={t.dashboard.layout.searchPlaceholder}
                className="w-full pl-12 pr-4 py-3 bg-white rounded-full text-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-nmb-orange/50 transition-all text-sm"
                aria-label="Search"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    if (filteredFeatures.length > 0) {
                      handleSearchResultClick(filteredFeatures[0].path);
                    }
                  }
                }}
              />

              {/* Search Dropdown */}
              {showSearchDropdown && filteredFeatures.length > 0 && (
                <div className="absolute top-full left-0 mt-2 w-full min-w-[500px] bg-white rounded-xl shadow-large border border-nmb-mist z-50 max-h-[400px] overflow-y-auto">
                  <div className="p-2">
                    {filteredFeatures.map((feature) => {
                      const Icon = ICON_MAP[feature.icon] || Search;
                      return (
                        <button
                          key={feature.id}
                          onClick={() => handleSearchResultClick(feature.path)}
                          className="w-full flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-nmb-smoke transition-colors text-left group"
                          aria-label={`Search result: ${feature.title}`}
                        >
                          <div className="p-2 rounded-full bg-nmb-smoke group-hover:bg-white transition-colors text-nmb-charcoal">
                            <Icon className="w-5 h-5" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-nmb-charcoal group-hover:text-nmb-maroon transition-colors">
                              {feature.title}
                            </span>
                            {feature.subtitle && (
                              <span className="text-xs text-gray-400 font-medium">
                                {feature.subtitle}
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {showSearchDropdown && searchQuery.length > 0 && filteredFeatures.length === 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-large border border-nmb-mist z-50 p-4">
                  <p className="text-sm text-gray-500 text-center">
                    {t.dashboard.layout.noResultsFound} "{searchQuery}"
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right: Icons + Avatar */}
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              className="p-2 text-nmb-charcoal hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Support"
            >
              <Headphones className="h-6 w-6" />
            </button>
            <button
              className="relative p-2 text-nmb-charcoal hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Notifications"
            >
              <Bell className="h-6 w-6" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-nmb-orange rounded-full"></span>
            </button>
            <button
              onClick={() => setIsProfileModalOpen(true)}
              className="focus:outline-none cursor-pointer hover:opacity-80 transition-opacity"
              aria-label="User Profile"
            >
              <div className="border-2 border-gray-200 rounded-full">
                <UserAvatar
                  name={profile?.name || user?.displayName || 'User'}
                  image={user?.photoURL || (profile as any)?.image}
                  size="md"
                />
              </div>
            </button>
          </div>
        </div>
      </div>


      {/* Scrollable Content Area */}
      <div className={`flex-1 ${isDashboardHome ? 'pt-20' : 'pt-28'}`}>
        {children}
      </div>

      {/* Footer */}
      <Footer />

      {/* Customer Details Modal */}
      <CustomerDetailsModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        profile={profile}
        userName={user?.displayName || undefined}
        userPhotoURL={user?.photoURL || undefined}
        onLogout={handleLogout}
        onEditProfile={() => navigate('/dashboard/settings')}
      />
    </div>
  );
};
