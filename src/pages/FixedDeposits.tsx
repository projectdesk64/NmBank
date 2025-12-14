import { useState, useEffect } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, onSnapshot, runTransaction, arrayUnion, Timestamp, collection, addDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { useLanguage } from '@/hooks/useLanguage';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FileText, Calculator, TrendingUp, Receipt, Inbox } from 'lucide-react';

// Local translations
const pageTranslations = {
  en: {
    totalInvestment: 'Total Investment',
    openNewDeposit: 'Open New Deposit',
    activeDeposits: 'Active Deposits',
    closed: 'Closed',
    certificateNo: 'Certificate No',
    maturity: 'Maturity',
    principal: 'Principal',
    taxCertificate: 'Tax Certificate (2-NDFL)',
    accountStatement: 'Account Statement',
    rates: 'Rates',
    calculator: 'Calculator',
    noActiveDeposits: 'No active deposits',
    noClosedDeposits: 'No closed deposits',
    featureComingSoon: 'Feature coming soon',
    investmentAmount: 'Investment Amount',
    availableBalance: 'Available Balance',
    rate: 'Rate',
    tenure: 'Tenure',
    year: 'Year',
    cancel: 'Cancel',
    confirm: 'Confirm',
    creating: 'Creating...',
    enterAmount: 'Enter amount',
    fixedDepositCreated: 'Fixed Deposit Created',
    successfullyCreated: 'Successfully created FD of',
    error: 'Error',
    userNotAuthenticated: 'User not authenticated. Please log in again.',
    insufficientBalance: 'Insufficient balance',
    failedToCreate: 'Failed to create fixed deposit. Please try again.',
    estimatedReturns: 'Estimated Returns',
    maturityAmount: 'Maturity Amount',
    interestEarned: 'Interest Earned',
    closeDeposit: 'Close / Liquidate',
    closeDepositConfirm: 'Are you sure you want to close this deposit?',
    depositClosed: 'Deposit Closed',
    depositClosedSuccess: 'Deposit closed successfully. Amount credited to your account.',
    actions: 'Actions',
    tenureYears: 'Tenure (Years)',
  },
  ru: {
    totalInvestment: 'Общая сумма вкладов',
    openNewDeposit: 'Открыть новый вклад',
    activeDeposits: 'Активные вклады',
    closed: 'Закрытые',
    certificateNo: 'Номер договора',
    maturity: 'Дата окончания',
    principal: 'Сумма',
    taxCertificate: 'Справка 2-НДФЛ',
    accountStatement: 'Выписка по счету',
    rates: 'Тарифы',
    calculator: 'Калькулятор',
    noActiveDeposits: 'Нет активных вкладов',
    noClosedDeposits: 'Нет закрытых вкладов',
    featureComingSoon: 'Функция скоро будет доступна',
    investmentAmount: 'Сумма вклада',
    availableBalance: 'Доступный баланс',
    rate: 'Ставка',
    tenure: 'Срок',
    year: 'Год',
    cancel: 'Отмена',
    confirm: 'Подтвердить',
    creating: 'Создание...',
    enterAmount: 'Введите сумму',
    fixedDepositCreated: 'Срочный вклад создан',
    successfullyCreated: 'Успешно создан вклад на сумму',
    error: 'Ошибка',
    userNotAuthenticated: 'Пользователь не аутентифицирован. Пожалуйста, войдите снова.',
    insufficientBalance: 'Недостаточно средств',
    failedToCreate: 'Не удалось создать срочный вклад. Пожалуйста, попробуйте снова.',
    estimatedReturns: 'Расчетная доходность',
    maturityAmount: 'Сумма к погашению',
    interestEarned: 'Начисленные проценты',
    closeDeposit: 'Закрыть / Ликвидировать',
    closeDepositConfirm: 'Вы уверены, что хотите закрыть этот вклад?',
    depositClosed: 'Вклад закрыт',
    depositClosedSuccess: 'Вклад успешно закрыт. Сумма зачислена на ваш счет.',
    actions: 'Действия',
    tenureYears: 'Срок (лет)',
  },
};

interface FixedDeposit {
  id: string;
  principal: number;
  interestRate: string;
  maturityDate: string;
  status: string;
}

export const FixedDeposits = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [fixedDeposits, setFixedDeposits] = useState<FixedDeposit[]>([]);
  const [balance, setBalance] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRatesOpen, setIsRatesOpen] = useState(false);
  const [isCalcOpen, setIsCalcOpen] = useState(false);
  const [amount, setAmount] = useState<string>('');
  const [calcAmount, setCalcAmount] = useState<string>('');
  const [calcTenure, setCalcTenure] = useState<string>('1');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const translations = pageTranslations[language];

  // RUB Currency Formatter - Always use Russian Rubles format
  const formatRUB = (amount: number): string => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  // Real-time subscription to user data
  useEffect(() => {
    let unsubscribeUser: (() => void) | null = null;

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        navigate('/login');
        return;
      }
      setUser(currentUser);

      // Subscribe to user document for real-time updates
      const userRef = doc(db, 'users', currentUser.uid);
      unsubscribeUser = onSnapshot(
        userRef,
        (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            setBalance(data?.balance || 0);
            // Handle null/undefined fixedDeposits as empty array
            setFixedDeposits(data?.fixedDeposits || []);
            setLoading(false);
          } else {
            setLoading(false);
          }
        },
        (error) => {
          if (import.meta.env.DEV) {
            console.error('Error fetching user data:', error);
          }
          setLoading(false);
          toast({
            title: translations.error,
            description: 'Unable to load account information. Please check your connection and try refreshing the page.',
            variant: 'destructive',
          });
        }
      );
    });

    return () => {
      unsubscribe();
      if (unsubscribeUser) {
        unsubscribeUser();
      }
    };
  }, [navigate, translations.error]);

  // Calculate total principal of active deposits
  const totalPrincipal = fixedDeposits
    .filter((fd) => fd.status === 'Active')
    .reduce((sum, fd) => sum + (fd?.principal || 0), 0);

  // Filter deposits by status
  const activeDeposits = fixedDeposits.filter((fd) => fd.status === 'Active');
  const closedDeposits = fixedDeposits.filter((fd) => fd.status !== 'Active');

  // Handle service button clicks
  const handleServiceClick = (service?: string) => {
    if (service === 'rates') {
      setIsRatesOpen(true);
    } else if (service === 'calculator') {
      setIsCalcOpen(true);
    } else {
      toast({
        title: translations.featureComingSoon,
        description: translations.featureComingSoon,
      });
    }
  };

  // Calculate estimated returns for calculator
  const calculateReturns = () => {
    const principal = parseFloat(calcAmount) || 0;
    const years = parseFloat(calcTenure) || 1;
    const rate = 0.071; // 7.1% annual rate (0.071 as decimal)
    
    if (principal <= 0 || years <= 0) {
      return { maturity: 0, interest: 0 };
    }
    
    // Maturity = Amount + (Amount * 0.071 * Years)
    const interest = principal * rate * years;
    const maturity = principal + interest;
    
    return { maturity, interest };
  };

  // Handle FD closure
  const handleCloseFD = async (fd: FixedDeposit) => {
    if (!user) {
      toast({
        title: translations.error,
        description: translations.userNotAuthenticated,
        variant: 'destructive',
      });
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to close this deposit of ${formatRUB(fd.principal)}? The funds will be returned to your main balance.`
    );
    if (!confirmed) {
      return;
    }

    try {
      const userRef = doc(db, 'users', user.uid);
      
      // Create transaction record
      const newTransaction = {
        description: language === 'ru' 
          ? `Закрытие вклада - ${formatFDId(fd.id)}`
          : `Closure of Deposit - ${formatFDId(fd.id)}`,
        amount: fd.principal,
        type: 'credit',
        category: 'Investment',
        date: Timestamp.now(),
        status: 'success',
      };

      await runTransaction(db, async (transaction) => {
        const userSnap = await transaction.get(userRef);

        if (!userSnap.exists()) {
          throw new Error('User not found');
        }

        const data = userSnap.data();
        const currentBalance = data?.balance || 0;
        const currentFDs = data?.fixedDeposits || [];

        // Update FD status to 'Closed' and credit balance
        const updatedFDs = currentFDs.map((currentFD: FixedDeposit) =>
          currentFD.id === fd.id ? { ...currentFD, status: 'Closed' } : currentFD
        );

        transaction.update(userRef, {
          balance: currentBalance + fd.principal,
          fixedDeposits: updatedFDs,
          transactions: arrayUnion(newTransaction),
        });
      });

      // Add transaction to subcollection
      const transactionsRef = collection(userRef, 'transactions');
      await addDoc(transactionsRef, newTransaction);

      toast({
        title: translations.depositClosed,
        description: translations.depositClosedSuccess,
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to close deposit. Please try again.';
      toast({
        title: translations.error,
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  // Handle FD creation
  const handleCreateFD = async () => {
    if (!user) {
      toast({
        title: translations.error,
        description: translations.userNotAuthenticated,
        variant: 'destructive',
      });
      return;
    }

    const amountNum = parseFloat(amount);
    if (!amountNum || amountNum <= 0) {
      toast({
        title: translations.error,
        description: 'Please enter a valid amount',
        variant: 'destructive',
      });
      return;
    }

    if (amountNum > balance) {
      toast({
        title: translations.error,
        description: translations.insufficientBalance,
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const userRef = doc(db, 'users', user.uid);

      // Calculate maturity date (1 year from now)
      const maturityDate = new Date();
      maturityDate.setFullYear(maturityDate.getFullYear() + 1);
      const maturityDateISO = maturityDate.toISOString();

      // Create new FD object
      const newFD = {
        id: `FD-${Date.now()}`,
        principal: amountNum,
        interestRate: '7.10',
        maturityDate: maturityDateISO,
        status: 'Active',
      };

      // Create transaction record
      const newTransaction = {
        description: `Fixed Deposit - ${newFD.id}`,
        amount: amountNum,
        type: 'debit',
        category: 'Investment',
        date: Timestamp.now(),
        status: 'success',
      };

      await runTransaction(db, async (transaction) => {
        const userSnap = await transaction.get(userRef);

        if (!userSnap.exists()) {
          throw new Error('User not found');
        }

        const data = userSnap.data();
        const currentBalance = data?.balance || 0;

        if (amountNum > currentBalance) {
          throw new Error(translations.insufficientBalance);
        }

        // Update user document
        transaction.update(userRef, {
          balance: currentBalance - amountNum,
          fixedDeposits: arrayUnion(newFD),
          transactions: arrayUnion(newTransaction),
        });
      });

      // Add transaction to subcollection (for transaction history)
      const transactionsRef = collection(userRef, 'transactions');
      await addDoc(transactionsRef, newTransaction);

      toast({
        title: translations.fixedDepositCreated,
        description: `${translations.successfullyCreated} ${formatRUB(amountNum)}`,
      });

      setIsModalOpen(false);
      setAmount('');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : translations.failedToCreate;
      toast({
        title: translations.error,
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format FD ID
  const formatFDId = (id: string): string => {
    // Extract last 4 digits or use last 4 chars
    const last4 = id.slice(-4);
    return `NMB-FD-${last4}`;
  };

  // Format maturity date
  const formatMaturityDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(language === 'ru' ? 'ru-RU' : 'en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  // Format interest rate
  const formatInterestRate = (rate: string): string => {
    // Remove % if present and add it back
    const numRate = parseFloat(rate.replace('%', ''));
    return isNaN(numRate) ? rate : `${numRate}%`;
  };

  // Loading skeleton
  if (loading) {
    return (
      <DashboardLayout>
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-8">
          <div className="space-y-6">
            {/* Tier 1 Skeleton */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-8 w-48" />
                  </div>
                  <Skeleton className="h-10 w-40" />
                </div>
              </CardContent>
            </Card>

            {/* Tier 2 Skeleton */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>

            {/* Tier 3 Skeleton */}
            <Card>
              <CardContent className="p-6">
                <Skeleton className="h-10 w-full mb-4" />
                <Skeleton className="h-64 w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-8">
        {/* Tier 1: Summary Card */}
        <Card className="mb-6 bg-gradient-to-r from-white to-nmb-maroon/5 border-nmb-maroon/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{translations.totalInvestment}</p>
                <p className="text-3xl font-bold text-nmb-maroon">
                  {formatRUB(totalPrincipal)}
                </p>
              </div>
              <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-nmb-maroon hover:bg-[#6e0e00] text-white px-6 py-6 text-lg">
                    {translations.openNewDeposit}
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>{translations.openNewDeposit}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="amount">{translations.investmentAmount}</Label>
                      <Input
                        id="amount"
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder={translations.enterAmount}
                        min="0"
                        step="0.01"
                      />
                      <p className="text-sm text-gray-600">
                        {translations.availableBalance}: {formatRUB(balance)}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">{translations.rate}:</span>
                        <span className="font-semibold">7.10% p.a.</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">{translations.tenure}:</span>
                        <span className="font-semibold">1 {translations.year}</span>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsModalOpen(false)} disabled={isSubmitting}>
                      {translations.cancel}
                    </Button>
                    <Button
                      onClick={handleCreateFD}
                      disabled={isSubmitting || !amount || parseFloat(amount) <= 0 || parseFloat(amount) > balance}
                      className="bg-nmb-maroon hover:bg-[#6e0e00] text-white"
                    >
                      {isSubmitting ? translations.creating : translations.confirm}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>

        {/* Tier 2: Service Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Button
            variant="outline"
            className="h-24 flex flex-col items-center justify-center gap-2 hover:bg-nmb-smoke transition-colors"
            onClick={() => handleServiceClick()}
          >
            <FileText className="h-6 w-6 text-nmb-maroon" />
            <span className="text-sm font-medium">2-NDFL</span>
          </Button>
          <Button
            variant="outline"
            className="h-24 flex flex-col items-center justify-center gap-2 hover:bg-nmb-smoke transition-colors"
            onClick={() => handleServiceClick()}
          >
            <Receipt className="h-6 w-6 text-nmb-maroon" />
            <span className="text-sm font-medium">{translations.accountStatement}</span>
          </Button>
          <Button
            variant="outline"
            className="h-24 flex flex-col items-center justify-center gap-2 hover:bg-nmb-smoke transition-colors"
            onClick={() => handleServiceClick('rates')}
          >
            <TrendingUp className="h-6 w-6 text-nmb-maroon" />
            <span className="text-sm font-medium">{translations.rates}</span>
          </Button>
          <Button
            variant="outline"
            className="h-24 flex flex-col items-center justify-center gap-2 hover:bg-nmb-smoke transition-colors"
            onClick={() => handleServiceClick('calculator')}
          >
            <Calculator className="h-6 w-6 text-nmb-maroon" />
            <span className="text-sm font-medium">{translations.calculator}</span>
          </Button>
        </div>

        {/* Tier 3: Data Table */}
        <Card>
          <CardHeader>
            <CardTitle>{translations.activeDeposits}</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="active" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="active">{translations.activeDeposits}</TabsTrigger>
                <TabsTrigger value="closed">{translations.closed}</TabsTrigger>
              </TabsList>
              <TabsContent value="active" className="mt-0">
                {activeDeposits.length === 0 ? (
                  <div className="text-center py-16">
                    <Inbox className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 font-medium">{translations.noActiveDeposits}</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50">
                          <TableHead className="font-semibold text-nmb-charcoal">{translations.certificateNo}</TableHead>
                          <TableHead className="font-semibold text-nmb-charcoal">{translations.principal}</TableHead>
                          <TableHead className="font-semibold text-nmb-charcoal">Rate</TableHead>
                          <TableHead className="font-semibold text-nmb-charcoal">{translations.maturity}</TableHead>
                          <TableHead className="font-semibold text-nmb-charcoal">{translations.actions}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {activeDeposits.map((fd) => (
                          <TableRow key={fd.id} className="hover:bg-gray-50 transition-colors">
                            <TableCell className="font-medium text-nmb-charcoal">{formatFDId(fd.id)}</TableCell>
                            <TableCell className="font-semibold">
                              {formatRUB(fd.principal)}
                            </TableCell>
                            <TableCell>{formatInterestRate(fd.interestRate)}</TableCell>
                            <TableCell>{formatMaturityDate(fd.maturityDate)}</TableCell>
                            <TableCell>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleCloseFD(fd)}
                                className="text-xs"
                              >
                                {translations.closeDeposit}
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </TabsContent>
              <TabsContent value="closed" className="mt-0">
                {closedDeposits.length === 0 ? (
                  <div className="text-center py-16">
                    <Inbox className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 font-medium">{translations.noClosedDeposits}</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50">
                          <TableHead className="font-semibold text-nmb-charcoal">{translations.certificateNo}</TableHead>
                          <TableHead className="font-semibold text-nmb-charcoal">{translations.principal}</TableHead>
                          <TableHead className="font-semibold text-nmb-charcoal">Rate</TableHead>
                          <TableHead className="font-semibold text-nmb-charcoal">{translations.maturity}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {closedDeposits.map((fd) => (
                          <TableRow key={fd.id} className="hover:bg-gray-50 transition-colors">
                            <TableCell className="font-medium text-nmb-charcoal">{formatFDId(fd.id)}</TableCell>
                            <TableCell className="font-semibold">
                              {formatRUB(fd.principal)}
                            </TableCell>
                            <TableCell>{formatInterestRate(fd.interestRate)}</TableCell>
                            <TableCell>{formatMaturityDate(fd.maturityDate)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Rates Modal */}
        <Dialog open={isRatesOpen} onOpenChange={setIsRatesOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{translations.rates}</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="font-semibold text-nmb-charcoal">Tenure</TableHead>
                      <TableHead className="font-semibold text-nmb-charcoal">Interest Rate</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>7 - 14 Days</TableCell>
                      <TableCell className="font-semibold">3.00%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>15 - 45 Days</TableCell>
                      <TableCell className="font-semibold">4.50%</TableCell>
                    </TableRow>
                    <TableRow className="bg-nmb-maroon/10">
                      <TableCell className="font-semibold">1 Year</TableCell>
                      <TableCell className="font-semibold text-nmb-maroon">7.10%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>5 Years</TableCell>
                      <TableCell className="font-semibold">8.50%</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsRatesOpen(false)}>
                {translations.cancel}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Calculator Modal */}
        <Dialog open={isCalcOpen} onOpenChange={setIsCalcOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{translations.calculator}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="calc-amount">{translations.investmentAmount}</Label>
                <Input
                  id="calc-amount"
                  type="number"
                  value={calcAmount}
                  onChange={(e) => setCalcAmount(e.target.value)}
                  placeholder={translations.enterAmount}
                  min="0"
                  step="0.01"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="calc-tenure">{translations.tenureYears}</Label>
                <Input
                  id="calc-tenure"
                  type="number"
                  value={calcTenure}
                  onChange={(e) => setCalcTenure(e.target.value)}
                  placeholder="1"
                  min="0.1"
                  step="0.1"
                />
              </div>
              
              {/* Estimated Returns Display */}
              {calcAmount && parseFloat(calcAmount) > 0 && calcTenure && parseFloat(calcTenure) > 0 && (
                <div className="bg-gray-50 rounded-lg p-4 space-y-3 border border-gray-200">
                  <h4 className="font-semibold text-nmb-charcoal mb-2">{translations.estimatedReturns}</h4>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">{translations.interestEarned}:</span>
                    <span className="font-semibold text-nmb-maroon">
                      {formatRUB(calculateReturns().interest)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-gray-300">
                    <span className="text-sm font-medium text-gray-700">{translations.maturityAmount}:</span>
                    <span className="text-lg font-bold text-nmb-maroon">
                      {formatRUB(calculateReturns().maturity)}
                    </span>
                  </div>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCalcOpen(false)}>
                {translations.cancel}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

