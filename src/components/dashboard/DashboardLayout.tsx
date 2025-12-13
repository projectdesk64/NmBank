import React, { useState, useEffect, useRef } from 'react';
import { Search, Headphones, Bell, ArrowRight, Phone, Mail } from 'lucide-react';
import { onAuthStateChanged, User as FirebaseUser, signOut } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { useNavigate } from 'react-router-dom';
import nmbLogo from '@/assets/nmb-logo.svg';
import { Footer } from '@/components/layout/Footer';
import { useMediaQuery } from '@/hooks/use-media-query';
import { LanguageToggle } from '@/components/LanguageToggle';
import { UserAvatar } from '@/components/ui/UserAvatar';
import { CustomerDetailsModal } from '@/components/dashboard/CustomerDetailsModal';
import { useLanguage } from '@/hooks/useLanguage';

interface NavItem {
  label: string;
  icon: React.ElementType;
  path: string;
}

interface SearchableFeature {
  title: string;
  slug: string;
  category: string;
}

interface Profile {
  name?: string;
  email?: string;
  phone?: string;
  customerId?: string;
}

const titleToSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

const navItems: NavItem[] = [];

const searchableFeatures: SearchableFeature[] = [
  { title: 'Open Fixed Deposit', slug: 'fixed-deposit', category: 'Investments' },
  { title: 'Download Statement', slug: 'download-statement', category: 'Accounts' },
  { title: 'Personal Loan', slug: 'personal-loan', category: 'Loans' },
  { title: 'Pay Electricity Bill', slug: 'pay-electricity-bill', category: 'Payments' },
  { title: 'Apply for Loan', slug: 'apply-for-loan', category: 'Loans' },
  { title: 'View Account Details', slug: 'view-account-details', category: 'Accounts' },
  { title: 'Card Transaction History', slug: 'card-transaction-history', category: 'Cards' },
  { title: 'Loan Repayment', slug: 'loan-repayment', category: 'Loans' },
  { title: 'Investment Portfolio', slug: 'investment-portfolio', category: 'Investments' },
  { title: 'Insurance Policies', slug: 'insurance-policies', category: 'Insurance' },
  { title: 'Transaction History', slug: 'transaction-history', category: 'Transactions' },
  { title: 'Send Money', slug: 'send-money', category: 'Payments' },
  { title: 'Set Card Limits', slug: 'set-card-limits', category: 'Cards' },
];

export const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { t } = useLanguage();
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const navigate = useNavigate();
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

  const handleSearchResultClick = (slug: string) => {
    navigate(`/services/${slug}`);
    setSearchQuery('');
    setShowSearchDropdown(false);
  };

  const filteredFeatures = searchableFeatures.filter((feature) =>
    feature.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    feature.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const highlightMatch = (text: string, query: string) => {
    if (!query) return text;
    const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const parts = text.split(new RegExp(`(${escapedQuery})`, 'gi'));
    return parts.map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <span key={index} className="text-nmb-maroon font-semibold">{part}</span>
      ) : (
        part
      )
    );
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error signing out:', error);
      }
      // Could show a toast notification here for production
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
            <div className="flex flex-col items-center">
              <img src={nmbLogo} alt="NMB Logo" className="h-10 w-auto" />
              <span className="text-nmb-orange font-sans text-sm font-medium mt-1">New Moscow Bank</span>
            </div>
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
              />
              
              {/* Search Dropdown */}
              {showSearchDropdown && filteredFeatures.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-large border border-nmb-mist z-50 max-h-[400px] overflow-y-auto">
                  <div className="p-2">
                    {filteredFeatures.map((feature, index) => (
                      <button
                        key={index}
                        onClick={() => handleSearchResultClick(feature.slug)}
                        className="w-full flex items-center justify-between px-4 py-3 rounded-lg hover:bg-nmb-smoke transition-colors text-left group"
                        aria-label={`Search result: ${feature.title}`}
                      >
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-gray-900 group-hover:text-nmb-maroon transition-colors">
                            {highlightMatch(feature.title, searchQuery)}
                          </span>
                          <span className="text-xs text-gray-500 mt-0.5">
                            {highlightMatch(feature.category, searchQuery)}
                          </span>
                        </div>
                        <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-nmb-maroon transition-colors" />
                      </button>
                    ))}
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
      <div className="flex-1 pt-[82px]">
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
