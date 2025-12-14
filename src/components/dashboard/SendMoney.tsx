import React, { useState, useEffect, useRef } from 'react';
import { Send, Eye, EyeOff, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { formatCurrency } from '@/lib/utils';
import { useLanguage } from '@/hooks/useLanguage';

interface Account {
  accountNumber: string;
  type: string;
  balance: number;
}

interface SendMoneyProps {
  accounts: Account[];
  onTransfer: (from: string, to: string, amount: number) => Promise<void>;
  loading?: boolean;
  savingsAccountNumber?: string; // User's savings account for FD liquidation
}

const formatAccountNumber = (accountNumber: string, revealed: boolean) => {
  if (!accountNumber) return '****';
  
  // Handle FD accounts (they have IDs like "FD-1234567890")
  const isFD = accountNumber.startsWith('FD-') || accountNumber.startsWith('fd_');
  
  if (isFD) {
    // For FD accounts, show the full ID or a shortened version
    if (revealed) {
      return accountNumber;
    }
    // Show last 6 characters for FD
    return `****${accountNumber.slice(-6)}`;
  }
  
  // Regular account numbers
  if (revealed) {
    return accountNumber;
  }
  return `****${accountNumber.slice(-4)}`;
};

const validateAccountNumber = (accountNumber: string): boolean => {
  if (!accountNumber || accountNumber.trim().length === 0) return false;
  // Account number should be numeric and between 9-18 digits (standard banking range)
  const cleaned = accountNumber.replace(/\s/g, '');
  return /^\d{9,18}$/.test(cleaned);
};

export const SendMoney = ({ accounts, onTransfer, loading = false, savingsAccountNumber }: SendMoneyProps) => {
  const { t, language } = useLanguage();
  const [fromAccount, setFromAccount] = useState(accounts[0]?.accountNumber || '');
  const [toAccount, setToAccount] = useState('');
  const [amount, setAmount] = useState('');
  const [revealedFrom, setRevealedFrom] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showOTPDialog, setShowOTPDialog] = useState(false);
  const [otp, setOtp] = useState('');
  const [transferring, setTransferring] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const revealTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const selectedAccount = accounts.find(acc => acc.accountNumber === fromAccount);
  const isFDAccount = selectedAccount?.type === 'Fixed Deposit';

  // Auto-populate "To Account" when FD is selected
  useEffect(() => {
    if (isFDAccount && savingsAccountNumber) {
      setToAccount(savingsAccountNumber);
    } else if (!isFDAccount) {
      // Clear toAccount when switching away from FD
      setToAccount('');
    }
  }, [isFDAccount, savingsAccountNumber]);

  useEffect(() => {
    return () => {
      if (revealTimeoutRef.current) {
        clearTimeout(revealTimeoutRef.current);
      }
    };
  }, []);

  const handleProceed = () => {
    const amountNum = parseFloat(amount);
    
    // Validate all fields
    if (!fromAccount || !amount || isNaN(amountNum) || amountNum <= 0) {
      setError(t.dashboard.sendMoney.errorFillAll);
      return;
    }

    // For FD accounts, toAccount should be auto-filled with savings account
    if (isFDAccount) {
      if (!savingsAccountNumber) {
        setError("Savings account not found. Cannot liquidate Fixed Deposit.");
        return;
      }
      // Ensure toAccount is set to savings account
      if (toAccount !== savingsAccountNumber) {
        setToAccount(savingsAccountNumber);
      }
    } else {
      // For regular transfers, validate beneficiary account number
      if (!toAccount) {
        setError(t.dashboard.sendMoney.errorFillAll);
        return;
      }
      if (!validateAccountNumber(toAccount)) {
        setError(t.dashboard.sendMoney.errorInvalidAccount);
        return;
      }
    }

    // Validate amount
    if (amountNum <= 0) {
      setError(t.dashboard.sendMoney.errorAmountGreater);
      return;
    }

    if (amountNum < 1) {
      setError(t.dashboard.sendMoney.errorMinAmount);
      return;
    }

    // Check balance
    if (selectedAccount && amountNum > selectedAccount.balance) {
      setError(t.dashboard.sendMoney.errorInsufficientBalance);
      return;
    }

    setError(null);
    setShowConfirmDialog(true);
  };

  const handleConfirm = () => {
    setShowConfirmDialog(false);
    setShowOTPDialog(true);
  };

  const handleOTPSubmit = async () => {
    if (otp.length !== 6) {
      setError(t.dashboard.sendMoney.errorInvalidOTP);
      return;
    }
    
    setTransferring(true);
    setError(null);
    
    try {
      await onTransfer(fromAccount, toAccount, parseFloat(amount));
      setShowOTPDialog(false);
      setAmount('');
      setToAccount('');
      setOtp('');
    } catch (err: any) {
      setError(err.message || t.dashboard.sendMoney.errorTransferFailed);
    } finally {
      setTransferring(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-nmb-smoke rounded-2xl p-6 shadow-large animate-pulse">
        <div className="h-6 bg-gray-300 rounded w-32 mb-6"></div>
        <div className="flex flex-col lg:flex-row gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex-1 h-14 bg-gray-300 rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-nmb-smoke rounded-2xl p-6 shadow-large">
        {/* Title */}
        <h3 className="text-xl font-heading font-bold text-nmb-charcoal mb-6">{t.dashboard.sendMoney.title}</h3>
        
        {/* Form Fields - Horizontal Layout */}
        <div className="flex flex-col lg:flex-row gap-4 items-end">
          {/* From Account */}
          <div className="flex-1 w-full">
            <label className="text-xs font-medium text-gray-500 mb-2 block uppercase tracking-wide">
              {t.dashboard.sendMoney.fromAccount}
            </label>
            <div className="relative">
              <Select value={fromAccount} onValueChange={setFromAccount}>
                <SelectTrigger className="h-14 bg-white border-nmb-mist rounded-xl hover:border-gray-300 transition-colors">
                  <SelectValue>
                    <div className="flex items-center justify-between w-full pr-2">
                      <span className="font-mono text-sm text-nmb-charcoal">
                        {formatAccountNumber(fromAccount, revealedFrom)}
                      </span>
                      <span
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          // Clear existing timeout
                          if (revealTimeoutRef.current) {
                            clearTimeout(revealTimeoutRef.current);
                            revealTimeoutRef.current = null;
                          }
                          setRevealedFrom(!revealedFrom);
                          if (!revealedFrom) {
                            revealTimeoutRef.current = setTimeout(() => {
                              setRevealedFrom(false);
                              revealTimeoutRef.current = null;
                            }, 5000);
                          }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.stopPropagation();
                            e.preventDefault();
                            // Clear existing timeout
                            if (revealTimeoutRef.current) {
                              clearTimeout(revealTimeoutRef.current);
                              revealTimeoutRef.current = null;
                            }
                            setRevealedFrom(!revealedFrom);
                            if (!revealedFrom) {
                              revealTimeoutRef.current = setTimeout(() => {
                                setRevealedFrom(false);
                                revealTimeoutRef.current = null;
                              }, 5000);
                            }
                          }
                        }}
                        role="button"
                        tabIndex={0}
                        className="p-1.5 hover:bg-nmb-smoke rounded-lg transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-nmb-orange/50"
                        aria-label={revealedFrom ? 'Hide account' : 'Reveal account'}
                      >
                        {revealedFrom ? (
                          <EyeOff className="h-4 w-4 text-gray-600" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-600" />
                        )}
                      </span>
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent position="popper" className="z-[100]">
                  {accounts.map((account) => {
                    const isFD = account.type === 'Fixed Deposit';
                    return (
                      <SelectItem key={account.accountNumber} value={account.accountNumber}>
                        <div className="flex items-center justify-between w-full">
                          <span className="font-mono text-sm">
                            {formatAccountNumber(account.accountNumber, false)}
                          </span>
                          <span className="text-xs text-gray-500 ml-2">
                            {account.type}
                          </span>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* To Account */}
          <div className="flex-1 w-full">
            <label className="text-xs font-medium text-gray-500 mb-2 block uppercase tracking-wide">
              {isFDAccount ? "TO ACCOUNT (AUTO)" : t.dashboard.sendMoney.toAccount}
            </label>
            {isFDAccount ? (
              <div className="h-14 bg-gray-50 border-nmb-mist rounded-xl flex items-center px-4">
                <span className="font-mono text-sm text-nmb-charcoal">
                  {formatAccountNumber(savingsAccountNumber || '', false)}
                </span>
                <span className="ml-2 text-xs text-gray-500">(Your Savings Account)</span>
              </div>
            ) : (
              <Input
                value={toAccount}
                onChange={(e) => setToAccount(e.target.value)}
                placeholder={t.dashboard.sendMoney.toAccountPlaceholder}
                className="h-14 bg-white border-nmb-mist rounded-xl text-sm placeholder:text-gray-400 hover:border-gray-300 transition-colors"
              />
            )}
          </div>

          {/* Amount */}
          <div className="flex-1 w-full">
            <label className="text-xs font-medium text-gray-500 mb-2 block uppercase tracking-wide">
              {t.dashboard.sendMoney.amount}
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-nmb-charcoal font-semibold text-sm">
                {language === 'ru' ? '₽' : '$'}
              </span>
              <Input
                type="text"
                value={amount}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^\d.]/g, '');
                  setAmount(value);
                }}
                placeholder={language === 'ru' ? '0,00' : '0.00'}
                className="h-14 bg-white border-nmb-mist rounded-xl font-mono tabular-nums text-sm pl-8 placeholder:text-gray-400 hover:border-gray-300 transition-colors"
              />
            </div>
          </div>

          {/* Proceed Button */}
          <div className="flex items-end">
            <Button
              onClick={handleProceed}
              disabled={transferring}
              className="h-14 px-8 bg-nmb-maroon hover:bg-[#6e0e00] text-white font-semibold rounded-xl shadow-medium hover:shadow-large transition-all flex items-center gap-2"
            >
              <Send className="h-4 w-4" />
              {t.dashboard.sendMoney.proceed}
            </Button>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {error}
          </div>
        )}
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t.dashboard.sendMoney.confirmTransfer}</DialogTitle>
            <DialogDescription>
              {t.dashboard.sendMoney.reviewDetails}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <p className="text-sm text-gray-600">{t.dashboard.sendMoney.fromAccount}</p>
              <p className="font-mono font-semibold">{formatAccountNumber(fromAccount, false)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">{t.dashboard.sendMoney.toAccount}</p>
              <p className="font-mono font-semibold">{toAccount}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">{t.dashboard.sendMoney.amount}</p>
              <p className="text-2xl font-bold text-nmb-charcoal tabular-nums">
                {formatCurrency(parseFloat(amount) || 0, language, { maximumFractionDigits: 0 })}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              {t.dashboard.sendMoney.cancel}
            </Button>
            <Button onClick={handleConfirm} className="bg-nmb-maroon hover:bg-[#6e0e00]">
              {t.dashboard.sendMoney.confirm}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* OTP Dialog */}
      <Dialog open={showOTPDialog} onOpenChange={setShowOTPDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t.dashboard.sendMoney.enterOTP}</DialogTitle>
            <DialogDescription>
              {t.dashboard.sendMoney.otpDescription}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <InputOTP maxLength={6} value={otp} onChange={setOtp}>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowOTPDialog(false)}>
              {t.dashboard.sendMoney.cancel}
            </Button>
            <Button 
              onClick={handleOTPSubmit} 
              disabled={transferring || otp.length !== 6}
              className="bg-nmb-maroon hover:bg-[#6e0e00]"
            >
              {transferring ? t.dashboard.sendMoney.processing : t.dashboard.sendMoney.submit}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

