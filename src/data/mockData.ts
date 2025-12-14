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
}

export interface CurrentUser {
  accounts: Account[];
  cards: Card[];
  deposits: FixedDeposit[];
  loans: Loan[];
  transactions: Transaction[];
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
    },
  ],
};
