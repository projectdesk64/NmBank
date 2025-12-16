import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/utils/formatters';

interface FixedDeposit {
  id: string;
  principal: number;
  interestRate: string;
  maturityDate: string;
  status: string;
}

interface AccountDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  balance: number;
  fixedDeposits: FixedDeposit[];
  onCreateFD: (amount: number) => Promise<void>;
}

const formatMaturityDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(date);
  } catch {
    return dateString;
  }
};

export const AccountDetailsModal: React.FC<AccountDetailsModalProps> = ({
  isOpen,
  onClose,
  balance,
  fixedDeposits,
  onCreateFD,
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [amount, setAmount] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setIsCreating(false);
      setAmount('');
      setIsSubmitting(false);
    }
  }, [isOpen]);

  // Handle scroll locking
  useEffect(() => {
    if (isOpen) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      const originalOverflow = document.body.style.overflow;
      const originalPaddingRight = document.body.style.paddingRight;
      
      document.body.style.overflow = 'hidden';
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }

      return () => {
        document.body.style.overflow = originalOverflow;
        document.body.style.paddingRight = originalPaddingRight;
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const amountNum = parseFloat(amount) || 0;
  const isValidAmount = amountNum > 0 && amountNum <= balance;
  const exceedsBalance = amountNum > balance;

  const handleConfirm = async () => {
    if (!isValidAmount || isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      await onCreateFD(amountNum);
      setIsCreating(false);
      setAmount('');
    } catch (error) {
      // Error handling is done in parent component
    } finally {
      setIsSubmitting(false);
    }
  };

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
            <h2 className="text-2xl font-heading font-bold text-nmb-charcoal">
              {isCreating ? 'Open New Fixed Deposit' : 'Fixed Deposit Portfolio'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-nmb-charcoal hover:bg-gray-100 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-nmb-maroon/50"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Body */}
          <div className="px-6 py-6">
            {!isCreating ? (
              // View A: List View
              <div className="space-y-4">
                {fixedDeposits.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>No fixed deposits yet.</p>
                    <p className="text-sm mt-2">Create your first FD to get started.</p>
                  </div>
                ) : (
                  <div className="max-h-[400px] overflow-y-auto space-y-3">
                    {fixedDeposits.map((fd) => (
                      <div
                        key={fd.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200"
                      >
                        <div className="flex-1">
                          <div className="font-semibold text-nmb-charcoal">
                            {formatCurrency(fd.principal)}
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            Rate: {fd.interestRate}% p.a.
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-nmb-charcoal">
                            {formatMaturityDate(fd.maturityDate)}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {fd.status}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              // View B: Create Mode
              <div className="space-y-6">
                {/* Investment Amount Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Investment Amount
                  </label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nmb-maroon/50 focus:border-nmb-maroon"
                    min="0"
                    step="0.01"
                  />
                  <p className={`text-sm mt-2 ${exceedsBalance ? 'text-red-600' : 'text-gray-600'}`}>
                    Available Balance: {formatCurrency(balance)}
                  </p>
                </div>

                {/* Info Box */}
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Rate:</span>
                      <span className="font-semibold text-nmb-charcoal">7.10% p.a.</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Tenure:</span>
                      <span className="font-semibold text-nmb-charcoal">1 Year</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-5 border-t border-gray-200 flex flex-col sm:flex-row gap-3">
            {!isCreating ? (
              <Button
                onClick={() => setIsCreating(true)}
                className="flex-1 bg-nmb-maroon hover:bg-[#6e0e00] text-white"
              >
                Open New FD
              </Button>
            ) : (
              <>
                <Button
                  onClick={() => {
                    setIsCreating(false);
                    setAmount('');
                  }}
                  variant="outline"
                  className="flex-1"
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleConfirm}
                  className="flex-1 bg-nmb-maroon hover:bg-[#6e0e00] text-white"
                  disabled={!isValidAmount || isSubmitting}
                >
                  {isSubmitting ? 'Creating...' : 'Confirm'}
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

