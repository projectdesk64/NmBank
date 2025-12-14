// Centralized Mock Data for Banking Application
// This file provides mock data structure for Accounts, Cards, Fixed Deposits, Loans, and Transactions

export interface Account {
  id: string;
  accountNo: string;
  balance: number;
  currency: string;
  status: 'Active' | 'Inactive' | 'Frozen';
  iban: string;
  type: 'Checking' | 'Savings';
}

export interface Card {
  id: string;
  type: 'Debit' | 'Credit';
  cardNumber: string; // Will be masked when displayed
  expiry: string; // Format: MM/YY
  cvv: string;
  status: 'Active' | 'Blocked' | 'Expired';
  balance?: number; // For debit cards
  limit?: number; // For credit cards
  cardholderName: string;
}

export interface FixedDeposit {
  id: string;
  certificateNo: string;
  principal: number;
  rate: number; // Interest rate as percentage
  maturityDate: string; // ISO date string
  accruedInterest: number;
  status: 'Active' | 'Matured' | 'Closed';
}

export interface Loan {
  id: string;
  loanType: string;
  accountNo: string;
  outstandingBalance: number;
  originalAmount: number;
  emiAmount: number;
  nextPaymentDate: string; // ISO date string
  interestRate: number; // Interest rate as percentage
  status: 'Active' | 'Closed' | 'Overdue';
  tenureMonths: number;
  paidMonths: number;
}

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: 'credit' | 'debit';
  date: string; // ISO date string
  category: string;
  accountId?: string;
  cardId?: string;
  status: 'success' | 'pending' | 'failed';
  merchant?: string;
}

export interface Investment {
  id: string;
  name: string;
  type: 'Stocks' | 'Bonds' | 'Mutual Funds' | 'ETFs' | 'Real Estate';
  value: number;
  roi: number; // Return on Investment as percentage
  purchaseDate: string; // ISO date string
  quantity?: number;
  currentPrice?: number;
}

export interface Insurance {
  id: string;
  policyNo: string;
  provider: string;
  coverageAmount: number;
  expiry: string; // ISO date string
  type: 'Life' | 'Health' | 'Auto' | 'Home' | 'Travel';
  premium: number;
  status: 'Active' | 'Expired' | 'Cancelled';
}

export interface Payment {
  id: string;
  biller: string;
  amount: number;
  dueDate: string; // ISO date string
  status: 'paid' | 'pending' | 'overdue';
  category: 'Utilities' | 'Credit Card' | 'Loan' | 'Insurance' | 'Subscription' | 'Other';
  paymentDate?: string; // ISO date string
  accountId?: string;
}

export interface ExchangeRate {
  currency: string;
  buy: number;
  sell: number;
}

export interface Reward {
  title: string;
  description: string;
  validUntil: string; // ISO date string
}

export interface CurrentUser {
  accounts: Account[];
  cards: Card[];
  deposits: FixedDeposit[];
  loans: Loan[];
  transactions: Transaction[];
  investments: Investment[];
  insurance: Insurance[];
  payments: Payment[];
  rates: ExchangeRate[];
  rewards: Reward[];
}

// Mock Data - Current User
export const currentUser: CurrentUser = {
  accounts: [
    {
      id: 'acc-001',
      accountNo: '4002123456789',
      balance: 1250340.75,
      currency: 'RUB',
      status: 'Active',
      iban: 'RU12345678901234567890123456',
      type: 'Savings',
    },
    {
      id: 'acc-002',
      accountNo: '4002987654321',
      balance: 89450.00,
      currency: 'RUB',
      status: 'Active',
      iban: 'RU98765432109876543210987654',
      type: 'Checking',
    },
    {
      id: 'acc-003',
      accountNo: '4002555555555',
      balance: 250000.00,
      currency: 'USD',
      status: 'Active',
      iban: 'US12345678901234567890123456',
      type: 'Savings',
    },
  ],

  cards: [
    {
      id: 'card-001',
      type: 'Debit',
      cardNumber: '4532123456789012',
      expiry: '12/26',
      cvv: '123',
      status: 'Active',
      balance: 1250340.75,
      cardholderName: 'IVAN PETROV',
    },
    {
      id: 'card-002',
      type: 'Credit',
      cardNumber: '5555123456789012',
      expiry: '08/27',
      cvv: '456',
      status: 'Active',
      limit: 500000.00,
      cardholderName: 'IVAN PETROV',
    },
    {
      id: 'card-003',
      type: 'Debit',
      cardNumber: '4111111111111111',
      expiry: '03/25',
      cvv: '789',
      status: 'Blocked',
      balance: 89450.00,
      cardholderName: 'IVAN PETROV',
    },
  ],

  deposits: [
    {
      id: 'fd-001',
      certificateNo: 'NMB-FD-2024-001',
      principal: 500000.00,
      rate: 7.10,
      maturityDate: '2026-12-20T00:00:00.000Z',
      accruedInterest: 142000.00,
      status: 'Active',
    },
    {
      id: 'fd-002',
      certificateNo: 'NMB-FD-2024-002',
      principal: 1000000.00,
      rate: 8.50,
      maturityDate: '2029-12-15T00:00:00.000Z',
      accruedInterest: 425000.00,
      status: 'Active',
    },
    {
      id: 'fd-003',
      certificateNo: 'NMB-FD-2023-045',
      principal: 250000.00,
      rate: 6.50,
      maturityDate: '2024-11-10T00:00:00.000Z',
      accruedInterest: 16250.00,
      status: 'Matured',
    },
  ],

  loans: [
    {
      id: 'loan-001',
      loanType: 'Personal Loan',
      accountNo: 'LN-4002-001',
      outstandingBalance: 450000.00,
      originalAmount: 500000.00,
      emiAmount: 25000.00,
      nextPaymentDate: '2024-12-15T00:00:00.000Z',
      interestRate: 12.5,
      status: 'Active',
      tenureMonths: 24,
      paidMonths: 2,
    },
    {
      id: 'loan-002',
      loanType: 'Home Loan',
      accountNo: 'LN-4002-002',
      outstandingBalance: 8500000.00,
      originalAmount: 10000000.00,
      emiAmount: 125000.00,
      nextPaymentDate: '2024-12-20T00:00:00.000Z',
      interestRate: 9.75,
      status: 'Active',
      tenureMonths: 120,
      paidMonths: 12,
    },
    {
      id: 'loan-003',
      loanType: 'Car Loan',
      accountNo: 'LN-4002-003',
      outstandingBalance: 0.00,
      originalAmount: 1500000.00,
      emiAmount: 0.00,
      nextPaymentDate: '2024-01-01T00:00:00.000Z',
      interestRate: 10.5,
      status: 'Closed',
      tenureMonths: 60,
      paidMonths: 60,
    },
  ],

  transactions: [
    {
      id: 'txn-001',
      description: 'Salary Credit',
      amount: 150000.00,
      type: 'credit',
      date: '2024-12-01T00:00:00.000Z',
      category: 'Salary',
      accountId: 'acc-001',
      status: 'success',
    },
    {
      id: 'txn-002',
      description: 'Netflix Subscription',
      amount: 499.00,
      type: 'debit',
      date: '2024-12-03T00:00:00.000Z',
      category: 'Entertainment',
      cardId: 'card-001',
      status: 'success',
    },
    {
      id: 'txn-003',
      description: 'Starbucks Coffee',
      amount: 350.00,
      type: 'debit',
      date: '2024-12-05T00:00:00.000Z',
      category: 'Food & Dining',
      cardId: 'card-001',
      status: 'success',
    },
    {
      id: 'txn-004',
      description: 'Grocery Shopping',
      amount: 2500.00,
      type: 'debit',
      date: '2024-12-07T00:00:00.000Z',
      category: 'Shopping',
      cardId: 'card-002',
      status: 'success',
    },
    {
      id: 'txn-005',
      description: 'Loan EMI Payment',
      amount: 25000.00,
      type: 'debit',
      date: '2024-11-15T00:00:00.000Z',
      category: 'Loan Payment',
      accountId: 'acc-001',
      status: 'success',
    },
    {
      id: 'txn-006',
      description: 'Fixed Deposit Interest',
      amount: 2958.33,
      type: 'credit',
      date: '2024-12-01T00:00:00.000Z',
      category: 'Interest',
      accountId: 'acc-001',
      status: 'success',
    },
    {
      id: 'txn-007',
      description: 'Transfer to Friend',
      amount: 5000.00,
      type: 'debit',
      date: '2024-12-08T00:00:00.000Z',
      category: 'Transfer',
      accountId: 'acc-001',
      status: 'success',
    },
    {
      id: 'txn-008',
      description: 'ATM Withdrawal',
      amount: 10000.00,
      type: 'debit',
      date: '2024-12-10T00:00:00.000Z',
      category: 'Cash Withdrawal',
      cardId: 'card-001',
      status: 'success',
      merchant: 'ATM-1234',
    },
    {
      id: 'txn-009',
      description: 'Amazon Purchase',
      amount: 12500.00,
      type: 'debit',
      date: '2024-12-11T00:00:00.000Z',
      category: 'Shopping',
      cardId: 'card-001',
      status: 'success',
      merchant: 'Amazon',
    },
    {
      id: 'txn-010',
      description: 'Electricity Bill Payment',
      amount: 3500.00,
      type: 'debit',
      date: '2024-12-12T00:00:00.000Z',
      category: 'Utilities',
      accountId: 'acc-001',
      status: 'success',
      merchant: 'Moscow Energy',
    },
  ],

  investments: [
    {
      id: 'inv-001',
      name: 'Sberbank Shares',
      type: 'Stocks',
      value: 250000.00,
      roi: 12.5,
      purchaseDate: '2023-06-15T00:00:00.000Z',
      quantity: 100,
      currentPrice: 2500.00,
    },
    {
      id: 'inv-002',
      name: 'Government Bonds',
      type: 'Bonds',
      value: 500000.00,
      roi: 7.2,
      purchaseDate: '2022-01-10T00:00:00.000Z',
      quantity: 50,
      currentPrice: 10000.00,
    },
    {
      id: 'inv-003',
      name: 'Tech ETF Portfolio',
      type: 'ETFs',
      value: 150000.00,
      roi: 18.3,
      purchaseDate: '2024-03-20T00:00:00.000Z',
      quantity: 75,
      currentPrice: 2000.00,
    },
    {
      id: 'inv-004',
      name: 'Real Estate Investment Trust',
      type: 'Real Estate',
      value: 2000000.00,
      roi: 9.8,
      purchaseDate: '2021-11-05T00:00:00.000Z',
    },
    {
      id: 'inv-005',
      name: 'Global Mutual Fund',
      type: 'Mutual Funds',
      value: 750000.00,
      roi: 11.2,
      purchaseDate: '2023-09-12T00:00:00.000Z',
    },
  ],

  insurance: [
    {
      id: 'ins-001',
      policyNo: 'POL-2024-001234',
      provider: 'Rosgosstrakh',
      coverageAmount: 5000000.00,
      expiry: '2025-12-31T00:00:00.000Z',
      type: 'Life',
      premium: 50000.00,
      status: 'Active',
    },
    {
      id: 'ins-002',
      policyNo: 'POL-2024-002567',
      provider: 'Alfa Insurance',
      coverageAmount: 2000000.00,
      expiry: '2025-06-30T00:00:00.000Z',
      type: 'Health',
      premium: 30000.00,
      status: 'Active',
    },
    {
      id: 'ins-003',
      policyNo: 'POL-2023-009876',
      provider: 'Ingosstrakh',
      coverageAmount: 3000000.00,
      expiry: '2024-11-15T00:00:00.000Z',
      type: 'Auto',
      premium: 25000.00,
      status: 'Expired',
    },
    {
      id: 'ins-004',
      policyNo: 'POL-2024-003890',
      provider: 'RESO-Garantia',
      coverageAmount: 10000000.00,
      expiry: '2026-03-20T00:00:00.000Z',
      type: 'Home',
      premium: 45000.00,
      status: 'Active',
    },
  ],

  payments: [
    {
      id: 'pay-001',
      biller: 'Moscow Energy',
      amount: 3500.00,
      dueDate: '2024-12-15T00:00:00.000Z',
      status: 'paid',
      category: 'Utilities',
      paymentDate: '2024-12-12T00:00:00.000Z',
      accountId: 'acc-001',
    },
    {
      id: 'pay-002',
      biller: 'Credit Card Payment',
      amount: 15000.00,
      dueDate: '2024-12-20T00:00:00.000Z',
      status: 'pending',
      category: 'Credit Card',
      accountId: 'acc-001',
    },
    {
      id: 'pay-003',
      biller: 'Internet Provider',
      amount: 1200.00,
      dueDate: '2024-12-18T00:00:00.000Z',
      status: 'pending',
      category: 'Utilities',
      accountId: 'acc-002',
    },
    {
      id: 'pay-004',
      biller: 'Netflix Subscription',
      amount: 499.00,
      dueDate: '2024-12-25T00:00:00.000Z',
      status: 'pending',
      category: 'Subscription',
      cardId: 'card-001',
    },
    {
      id: 'pay-005',
      biller: 'Insurance Premium - Life',
      amount: 50000.00,
      dueDate: '2025-01-05T00:00:00.000Z',
      status: 'pending',
      category: 'Insurance',
      accountId: 'acc-001',
    },
    {
      id: 'pay-006',
      biller: 'Loan EMI - Personal Loan',
      amount: 25000.00,
      dueDate: '2024-12-15T00:00:00.000Z',
      status: 'pending',
      category: 'Loan',
      accountId: 'acc-001',
    },
  ],

  rates: [
    { currency: 'USD', buy: 92.50, sell: 93.20 },
    { currency: 'EUR', buy: 100.30, sell: 101.10 },
    { currency: 'GBP', buy: 115.80, sell: 116.60 },
    { currency: 'CNY', buy: 12.90, sell: 13.20 },
    { currency: 'JPY', buy: 0.62, sell: 0.64 },
  ],

  rewards: [
    {
      title: 'Platinum Cashback - 5% on Dining',
      description: 'Get 5% cashback on all restaurant and food delivery purchases. Valid for Platinum cardholders.',
      validUntil: '2025-03-31T00:00:00.000Z',
    },
    {
      title: 'Zero Forex Markup',
      description: 'No foreign exchange markup on international transactions. Exclusive for Premium account holders.',
      validUntil: '2025-12-31T00:00:00.000Z',
    },
    {
      title: 'Airport Lounge Access',
      description: 'Complimentary access to premium airport lounges worldwide. Unlimited visits per year.',
      validUntil: '2025-12-31T00:00:00.000Z',
    },
    {
      title: 'Investment Advisory - Free Session',
      description: 'Book a free 1-hour session with our certified financial advisors. Limited time offer.',
      validUntil: '2025-01-31T00:00:00.000Z',
    },
    {
      title: 'Premium Insurance Discount',
      description: 'Get 20% discount on all insurance products. Apply code PREMIUM20 at checkout.',
      validUntil: '2025-06-30T00:00:00.000Z',
    },
  ],
};
