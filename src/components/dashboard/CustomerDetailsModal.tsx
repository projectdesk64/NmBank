import React, { useState, useEffect, useRef } from 'react';
import { X, Copy, Phone, Mail, Check, LogOut, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UserAvatar } from '@/components/ui/UserAvatar';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/hooks/useLanguage';

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

  const handleCopyCustomerId = async () => {
    if (profile?.customerId) {
      try {
        await navigator.clipboard.writeText(profile.customerId);
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
        console.error('Failed to copy:', err);
      }
    }
  };

  const displayName = profile?.name || userName || 'User';
  const displayEmail = profile?.email || '';
  const displayPhone = profile?.phone || '';

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm animate-in fade-in-0"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl animate-in fade-in-0 zoom-in-95"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
            <h2 className="text-2xl font-heading font-bold text-nmb-charcoal">{t.dashboard.customerDetails.customerProfile}</h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-nmb-charcoal hover:bg-gray-100 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-nmb-maroon/50"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Body */}
          <div className="px-6 py-6 space-y-6">
            {/* Avatar and Name Section */}
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="border-4 border-nmb-maroon/20 rounded-full p-1">
                <UserAvatar
                  name={displayName}
                  image={userPhotoURL || (profile as any)?.image}
                  size="xl"
                />
              </div>
              <div>
                <h3 className="text-3xl font-heading font-bold text-nmb-charcoal mb-2">
                  {displayName}
                </h3>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-50 border border-green-200 rounded-full">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-semibold text-green-700">{t.dashboard.customerDetails.kycVerified}</span>
                </div>
              </div>
            </div>

            {/* Customer ID Section */}
            {profile?.customerId && (
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <label className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-2 block">
                  {t.dashboard.customerDetails.customerId}
                </label>
                <div className="flex items-center justify-between gap-3">
                  <span className="font-mono text-lg font-semibold text-nmb-charcoal">
                    {profile.customerId}
                  </span>
                  <button
                    onClick={handleCopyCustomerId}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 rounded-lg transition-colors",
                      copied
                        ? "bg-green-50 text-green-700 border border-green-200"
                        : "bg-white text-nmb-maroon hover:bg-nmb-maroon/10 border border-gray-300"
                    )}
                    aria-label="Copy Customer ID"
                  >
                    {copied ? (
                      <>
                        <Check className="h-4 w-4" />
                        <span className="text-sm font-medium">{t.dashboard.customerDetails.copied}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        <span className="text-sm font-medium">{t.dashboard.customerDetails.copy}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Contact Information */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                {t.dashboard.customerDetails.contactInformation}
              </h4>
              
              {displayPhone && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="w-10 h-10 rounded-lg bg-nmb-maroon/10 flex items-center justify-center flex-shrink-0">
                    <Phone className="h-5 w-5 text-nmb-maroon" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-600 mb-0.5">{t.dashboard.customerDetails.phone}</p>
                    <p className="text-sm font-medium text-nmb-charcoal">{displayPhone}</p>
                  </div>
                </div>
              )}

              {displayEmail && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="w-10 h-10 rounded-lg bg-nmb-maroon/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="h-5 w-5 text-nmb-maroon" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-600 mb-0.5">{t.dashboard.customerDetails.email}</p>
                    <p className="text-sm font-medium text-nmb-charcoal break-words">{displayEmail}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-5 border-t border-gray-200 flex flex-col sm:flex-row gap-3">
            <Button
              onClick={() => {
                onClose();
                onLogout();
              }}
              variant="outline"
              className="flex-1 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
            >
              <LogOut className="h-4 w-4 mr-2" />
              {t.dashboard.customerDetails.logout}
            </Button>
            <Button
              onClick={() => {
                onClose();
                onEditProfile();
              }}
              className="flex-1 bg-nmb-maroon hover:bg-[#6e0e00] text-white"
            >
              <Edit className="h-4 w-4 mr-2" />
              {t.dashboard.customerDetails.editProfile}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

