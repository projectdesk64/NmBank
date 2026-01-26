import React, { useState, useEffect, useRef } from 'react';
import { X, Copy, Phone, Mail, Check, LogOut, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UserAvatar } from '@/components/ui/UserAvatar';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/hooks/useLanguage';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

interface Profile {
  name?: string;
  email?: string;
  phone?: string;
  customerId?: string;
  joinedAt?: any;
}

interface CustomerDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: Profile | null;
  userName?: string;
  userPhotoURL?: string;
  onLogout: () => void;
  onEditProfile: () => void;
}

export const CustomerDetailsModal: React.FC<CustomerDetailsModalProps> = ({
  isOpen,
  onClose,
  profile,
  userName,
  userPhotoURL,
  onLogout,
  onEditProfile,
}) => {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);
  const copyTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [realtimeProfile, setRealtimeProfile] = useState<Profile | null>(profile);
  const [realtimeUserName, setRealtimeUserName] = useState<string | undefined>(userName);
  const [realtimeUserPhotoURL, setRealtimeUserPhotoURL] = useState<string | undefined>(userPhotoURL);

  // Real-time Firestore listener for profile updates
  useEffect(() => {
    if (!isOpen) return;

    let unsubscribeUser: (() => void) | null = null;
    let unsubscribeProfile: (() => void) | null = null;

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        // Update Firebase Auth user data
        setRealtimeUserName(currentUser.displayName || undefined);
        setRealtimeUserPhotoURL(currentUser.photoURL || undefined);

        // Subscribe to real-time profile updates from Firestore
        const userRef = doc(db, 'users', currentUser.uid);
        unsubscribeProfile = onSnapshot(
          userRef,
          (docSnap) => {
            if (docSnap.exists()) {
              const data = docSnap.data();
              const profileData = data?.profile || null;
              setRealtimeProfile(profileData);
              if (import.meta.env.DEV && profileData?.name) {
                console.log('Real-time profile updated:', profileData.name);
              }
            } else {
              setRealtimeProfile(null);
            }
          },
          (error) => {
            if (import.meta.env.DEV) {
              console.error('Error fetching real-time profile:', error);
            }
          }
        );
      } else {
        setRealtimeProfile(null);
        setRealtimeUserName(undefined);
        setRealtimeUserPhotoURL(undefined);
      }
    });

    return () => {
      unsubscribe();
      if (unsubscribeProfile) {
        unsubscribeProfile();
      }
      if (unsubscribeUser) {
        unsubscribeUser();
      }
    };
  }, [isOpen]);

  // Sync props with real-time data when modal opens
  useEffect(() => {
    if (isOpen) {
      setRealtimeProfile(profile);
      setRealtimeUserName(userName);
      setRealtimeUserPhotoURL(userPhotoURL);
    }
  }, [isOpen, profile, userName, userPhotoURL]);

  // Handle scroll locking and scrollbar compensation
  useEffect(() => {
    if (isOpen) {
      // Calculate scrollbar width before locking scroll
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      
      // Lock body scroll
      const originalOverflow = document.body.style.overflow;
      const originalPaddingRight = document.body.style.paddingRight;
      
      document.body.style.overflow = 'hidden';
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }

      return () => {
        document.body.style.overflow = originalOverflow;
        document.body.style.paddingRight = originalPaddingRight;
        // Cleanup timeout on unmount
        if (copyTimeoutRef.current) {
          clearTimeout(copyTimeoutRef.current);
        }
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Use real-time data if available, otherwise fall back to props
  const currentProfile = realtimeProfile || profile;
  const currentUserName = realtimeUserName || userName;
  const currentUserPhotoURL = realtimeUserPhotoURL || userPhotoURL;

  const handleCopyCustomerId = async () => {
    if (currentProfile?.customerId) {
      try {
        await navigator.clipboard.writeText(currentProfile.customerId);
        setCopied(true);
        // Clear existing timeout
        if (copyTimeoutRef.current) {
          clearTimeout(copyTimeoutRef.current);
        }
        copyTimeoutRef.current = setTimeout(() => {
          setCopied(false);
          copyTimeoutRef.current = null;
        }, 2000);
      } catch (err) {
        if (import.meta.env.DEV) {
          console.error('Failed to copy:', err);
        }
        // Could show a toast notification here for production
      }
    }
  };

  // Prioritize profile.name from Firestore (e.g., "Shravan Banerjee")
  // Then fall back to Firebase Auth displayName, then 'User'
  const profileName = currentProfile?.name?.trim() || '';
  const firebaseDisplayName = currentUserName?.trim() || '';
  const displayName = profileName || firebaseDisplayName || 'User';
  const displayEmail = currentProfile?.email || '';
  const displayPhone = currentProfile?.phone || '';

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm animate-in fade-in-0"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-x-hidden">
        <div
          className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl animate-in fade-in-0 zoom-in-95 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-gray-200 gap-2">
            <h2 className="text-lg sm:text-xl font-heading font-bold text-nmb-charcoal truncate">{t.dashboard.customerDetails.customerProfile}</h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-nmb-charcoal hover:bg-gray-100 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-nmb-maroon/50 flex-shrink-0"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Body */}
          <div className="px-4 sm:px-6 py-4 space-y-4 overflow-x-hidden">
            {/* Avatar and Name Section */}
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="border-2 border-nmb-maroon/20 rounded-full p-0.5">
                <UserAvatar
                  name={displayName}
                  image={currentUserPhotoURL || (currentProfile as any)?.image}
                  size="lg"
                />
              </div>
              <div className="w-full min-w-0 px-2">
                <h3 className="text-xl sm:text-2xl font-heading font-bold text-nmb-charcoal mb-1.5 break-words">
                  {displayName}
                </h3>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-50 border border-green-200 rounded-full">
                  <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                  <span className="text-xs sm:text-sm font-semibold text-green-700 whitespace-nowrap">{t.dashboard.customerDetails.kycVerified}</span>
                </div>
              </div>
            </div>

            {/* Customer ID Section */}
            {currentProfile?.customerId && (
              <div className="bg-gray-50 rounded-xl p-3 border border-gray-200 overflow-hidden">
                <label className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-1.5 block">
                  {t.dashboard.customerDetails.customerId}
                </label>
                <div className="flex items-center justify-between gap-2 min-w-0">
                  <span className="font-mono text-sm sm:text-base font-semibold text-nmb-charcoal truncate min-w-0">
                    {currentProfile.customerId}
                  </span>
                  <button
                    onClick={handleCopyCustomerId}
                    className={cn(
                      "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-colors flex-shrink-0",
                      copied
                        ? "bg-green-50 text-green-700 border border-green-200"
                        : "bg-white text-nmb-maroon hover:bg-nmb-maroon/10 border border-gray-300"
                    )}
                    aria-label="Copy Customer ID"
                  >
                    {copied ? (
                      <>
                        <Check className="h-3.5 w-3.5 flex-shrink-0" />
                        <span className="text-xs font-medium hidden sm:inline">{t.dashboard.customerDetails.copied}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5 flex-shrink-0" />
                        <span className="text-xs font-medium hidden sm:inline">{t.dashboard.customerDetails.copy}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Contact Information */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                {t.dashboard.customerDetails.contactInformation}
              </h4>
              
              {displayPhone && (
                <div className="flex items-center gap-2.5 p-2.5 bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
                  <div className="w-9 h-9 rounded-lg bg-nmb-maroon/10 flex items-center justify-center flex-shrink-0">
                    <Phone className="h-4 w-4 text-nmb-maroon" />
                  </div>
                  <div className="flex-1 min-w-0 overflow-hidden">
                    <p className="text-xs text-gray-600 mb-0.5">{t.dashboard.customerDetails.phone}</p>
                    <p className="text-sm font-medium text-nmb-charcoal truncate">{displayPhone}</p>
                  </div>
                </div>
              )}

              {displayEmail && (
                <div className="flex items-center gap-2.5 p-2.5 bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
                  <div className="w-9 h-9 rounded-lg bg-nmb-maroon/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="h-4 w-4 text-nmb-maroon" />
                  </div>
                  <div className="flex-1 min-w-0 overflow-hidden">
                    <p className="text-xs text-gray-600 mb-0.5">{t.dashboard.customerDetails.email}</p>
                    <p className="text-sm font-medium text-nmb-charcoal break-all">{displayEmail}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="px-4 sm:px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row gap-3 overflow-x-hidden">
            <Button
              onClick={() => {
                onClose();
                onLogout();
              }}
              variant="outline"
              className="flex-1 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 min-w-0"
            >
              <LogOut className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="truncate">{t.dashboard.customerDetails.logout}</span>
            </Button>
            <Button
              onClick={() => {
                onClose();
                onEditProfile();
              }}
              className="flex-1 bg-nmb-maroon hover:bg-[#6e0e00] text-white min-w-0"
            >
              <Edit className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="truncate">{t.dashboard.customerDetails.editProfile}</span>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

