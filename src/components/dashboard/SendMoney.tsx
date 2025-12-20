import { useState, useEffect, useRef } from 'react';
import { Send, ArrowRightLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { useLanguage } from '@/hooks/useLanguage';
import { formatCurrency } from '@/utils/formatters';
import { useUser } from '@/contexts/UserContext';

interface Account {
  accountNumber: string;
  type: string;
  balance: number;
  nickname?: string;
}

interface SendMoneyProps {
  accounts: Account[];
  onTransfer?: (from: string, to: string, amount: number) => Promise<void>; // Made optional
  loading?: boolean;
  savingsAccountNumber?: string; // Kept for backwards compatibility
}

const formatAccountNumber = (accountNumber: string, revealed: boolean) => {
  if (!accountNumber) return '•••• •••• •••• •••• ••••';

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

  // Regular account numbers - use 20-digit Russian bank account format
  if (revealed) {
    const cleaned = accountNumber.replace(/\s/g, '');
    // Pad to 20 digits if needed
    const padded = cleaned.padStart(20, '0');
    return padded.match(/.{1,4}/g)?.join(' ') || accountNumber;
  }
  const lastFour = accountNumber.slice(-4);
  return `•••• •••• •••• •••• ${lastFour}`;
};

const validateAccountNumber = (accountNumber: string): boolean => {
  if (!accountNumber || accountNumber.trim().length === 0) return false;
  const cleaned = accountNumber.replace(/\s/g, '');
  // Allow numeric account numbers (9-20 digits) OR FD-style IDs (alphanumeric with dashes)
  return /^\d{9,20}$/.test(cleaned) || /^[A-Za-z0-9\-_]{5,}$/.test(cleaned);
};

// Helper to get display name for accounts
const getAccountDisplayName = (account: Account): string => {
  if (account.nickname) return account.nickname;
  if (account.type === 'Fixed Deposit') {
    const lastDigits = account.accountNumber.slice(-4);
    return `Fixed Deposit (...${lastDigits})`;
  }
  return account.type;
};

export const SendMoney = ({ accounts, loading = false, onTransfer }: SendMoneyProps) => {
  const { t } = useLanguage();
  const { transferMoney } = useUser();

  const [fromAccount, setFromAccount] = useState(accounts[0]?.accountNumber || '');
  const [toAccount, setToAccount] = useState('');
  const [amount, setAmount] = useState('');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showOTPDialog, setShowOTPDialog] = useState(false);
  const [otp, setOtp] = useState('');
  const [transferring, setTransferring] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const revealTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const selectedAccount = accounts.find(acc => acc.accountNumber === fromAccount);

  // Get available "Self" accounts (accounts other than the selected one)
  const selfAccounts = accounts.filter(acc => acc.accountNumber !== fromAccount);

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

    // Validate beneficiary account number
    if (!toAccount) {
      setError(t.dashboard.sendMoney.errorFillAll);
      return;
    }
    if (!validateAccountNumber(toAccount)) {
      setError(t.dashboard.sendMoney.errorInvalidAccount);
      return;
    }

    // Prevent sending to the same account
    if (toAccount === fromAccount) {
      setError("Cannot transfer to the same account.");
      return;
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
      // Use the provided onTransfer prop if available (handles toasts), otherwise fallback to context
      if (onTransfer) {
        await onTransfer(fromAccount, toAccount, parseFloat(amount));
      } else {
        await transferMoney(fromAccount, toAccount, parseFloat(amount));
      }

      setShowOTPDialog(false);
      setAmount('');
      setToAccount('');
      setOtp('');
    } catch (err: any) {
      console.error("Transfer error:", err);
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
        <div className="flex flex-col lg:flex-row gap-8 items-end">
          {/* From Account */}
          <div className="flex-1 w-full">
            <label className="text-xs font-medium text-gray-500 mb-3 block uppercase tracking-wide">
              {t.dashboard.sendMoney.fromAccount}
            </label>
            <div className="relative">
              <Select value={fromAccount} onValueChange={setFromAccount}>
                <SelectTrigger className="h-14 bg-white border-nmb-mist rounded-xl hover:border-gray-300 transition-colors">
                  <SelectValue>
                    {selectedAccount ? (
                      <span className="text-sm font-medium text-nmb-charcoal">
                        {getAccountDisplayName(selectedAccount)}
                      </span>
                    ) : (
                      <span className="text-sm text-gray-400">Select account</span>
                    )}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent position="popper" className="z-[100]">
                  {accounts.map((account) => {
                    const displayName = getAccountDisplayName(account);
                    return (
                      <SelectItem
                        key={account.accountNumber}
                        value={account.accountNumber}
                        className="py-3 pl-10 pr-4 hover:bg-gray-50 cursor-pointer data-[state=checked]:bg-orange-50 data-[state=checked]:border-l-4 data-[state=checked]:border-orange-600 data-[state=checked]:text-nmb-charcoal"
                      >
                        <div className="flex flex-col gap-1 w-full">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-nmb-charcoal">
                              {displayName}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500 font-mono">
                              {formatAccountNumber(account.accountNumber, false)}
                            </span>
                            <span className="text-xs font-semibold text-nmb-charcoal ml-4">
                              {formatCurrency(account.balance)}
                            </span>
                          </div>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* To Account / Beneficiary */}
          <div className="flex-1 w-full">
            <label className="text-xs font-medium text-gray-500 mb-3 block uppercase tracking-wide">
              TO ACCOUNT / BENEFICIARY
            </label>
            <div className="relative flex gap-2">
              <Input
                value={toAccount}
                onChange={(e) => setToAccount(e.target.value)}
                placeholder="Enter account number..."
                className="h-14 bg-white border-nmb-mist rounded-xl text-sm placeholder:text-gray-400 hover:border-gray-300 transition-colors flex-1"
              />
              {/* Self Transfer Button - shows when there are other accounts */}
              {selfAccounts.length > 0 && (
                <div className="relative group">
                  <button
                    type="button"
                    onClick={() => {
                      // Quick fill with first available self account
                      if (selfAccounts.length === 1) {
                        setToAccount(selfAccounts[0].accountNumber);
                      }
                    }}
                    className="h-14 px-3 bg-white border border-nmb-mist rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-colors flex items-center gap-1.5 text-gray-600 hover:text-nmb-charcoal"
                    title="Fill with own account"
                  >
                    <ArrowRightLeft className="h-4 w-4" />
                    <span className="text-xs font-medium">Self</span>
                  </button>
                  {/* Dropdown for multiple self accounts */}
                  {selfAccounts.length > 1 && (
                    <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-50 min-w-[200px] py-1 hidden group-hover:block">
                      <div className="px-3 py-1.5 text-xs font-medium text-gray-500 uppercase tracking-wide border-b border-gray-100">
                        Transfer to self
                      </div>
                      {selfAccounts.map((acc) => (
                        <button
                          key={acc.accountNumber}
                          type="button"
                          onClick={() => setToAccount(acc.accountNumber)}
                          className="w-full px-3 py-2 text-left hover:bg-gray-50 transition-colors"
                        >
                          <div className="text-sm font-medium text-nmb-charcoal">
                            {getAccountDisplayName(acc)}
                          </div>
                          <div className="text-xs text-gray-500 font-mono">
                            {formatAccountNumber(acc.accountNumber, false)}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Amount */}
          <div className="flex-1 w-full">
            <label className="text-xs font-medium text-gray-500 mb-3 block uppercase tracking-wide">
              {t.dashboard.sendMoney.amount}
            </label>
            <div className="relative">
              <Input
                type="text"
                value={amount}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^\d.]/g, '');
                  setAmount(value);
                }}
                placeholder="0.00"
                className="h-14 bg-white border-nmb-mist rounded-xl font-mono tabular-nums text-sm text-right pr-8 placeholder:text-gray-400 hover:border-gray-300 transition-colors"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-nmb-charcoal font-semibold text-sm pointer-events-none">
                ₽
              </span>
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
                {formatCurrency(parseFloat(amount) || 0)}
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

