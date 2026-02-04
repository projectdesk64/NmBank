import {
  User, Transaction, MonthlySpending
} from '../types';
export * from '../types';

// --- 1. Centralized Spending Statistics (Matches High Net Worth) ---
export const spendingStats: MonthlySpending = {
  total: 4500000, // 4.5 Million RUB monthly spend
  byCategory: [
    { category: 'Housing', amount: 2000000, color: '#FF6B00' },
    { category: 'Transport', amount: 1000000, color: '#3B82F6' },
    { category: 'Food', amount: 500000, color: '#10B981' },
    { category: 'Shopping', amount: 800000, color: '#8B5CF6' },
    { category: 'Utilities', amount: 200000, color: '#6B7280' }
  ]
};

// --- 2. Centralized Transactions (Mix of High Value & Daily Use) ---
export const transactions: Transaction[] = [
  {
    id: 't_jan28_2026_2',
    date: '2026-01-28T14:32:00',
    description: 'Transfer to 34819616337',
    amount: 65848202,
    type: 'debit',
    category: 'Transfer',
    status: 'success',
    balance: 1307523565182,
    referenceId: 'txn-1769427869728'
  },
  {
    id: 't_jan28_2026_1',
    date: '2026-01-28T14:28:00',
    description: 'Transfer to 2406262157371913',
    amount: 65848202,
    type: 'debit',
    category: 'Transfer',
    status: 'success',
    balance: 1307589413384,
    referenceId: 'txn-1769427869727'
  },

  // --- January 2026 Transfers ---
  {
    id: 't_jan26_2026_1',
    date: '2026-01-26T17:14:00',
    description: 'Transfer to 2029693610',
    amount: 65848202,
    type: 'debit',
    category: 'Transfer',
    status: 'success',
    balance: 1307655261586,
    referenceId: 'txn-1769427869697'
  },
  {
    id: 't_jan26_2026_2',
    date: '2026-01-26T17:11:00',
    description: 'Transfer to 37211678291',
    amount: 65848202,
    type: 'debit',
    category: 'Transfer',
    status: 'success',
    balance: 1307721109788,
    referenceId: 'txn-1769427708499'
  },
  {
    id: 't_jan26_2026_3',
    date: '2026-01-26T17:10:00',
    description: 'Transfer to 32076033837',
    amount: 65848202,
    type: 'debit',
    category: 'Transfer',
    status: 'success',
    balance: 1307786957990,
    referenceId: 'txn-1769427638186'
  },
  {
    id: 't_jan26_2026_4',
    date: '2026-01-26T17:09:00',
    description: 'Transfer to 11196531627',
    amount: 65848202,
    type: 'debit',
    category: 'Transfer',
    status: 'success',
    balance: 1307852806192,
    referenceId: 'txn-1769427564123'
  },
  {
    id: 't_jan26_2026_5',
    date: '2026-01-26T17:03:00',
    description: 'Transfer to 41665964747',
    amount: 65848202,
    type: 'debit',
    category: 'Transfer',
    status: 'success',
    balance: 1307918654394,
    referenceId: 'txn-1769427213312'
  },
  {
    id: 't_jan26_2026_6',
    date: '2026-01-26T17:01:00',
    description: 'Transfer to 36384180646',
    amount: 832883094,
    type: 'debit',
    category: 'Transfer',
    status: 'success',
    balance: 1307984502596,
    referenceId: 'txn-1769427090839'
  },
  {
    id: 't_jan26_2026_7',
    date: '2026-01-26T16:59:00',
    description: 'Transfer to 1112603363371440',
    amount: 41644154704,
    type: 'debit',
    category: 'Transfer',
    status: 'success',
    balance: 1308817385690,
    referenceId: 'txn-1769426983504'
  },
  {
    id: 't_jan26_2026_8',
    date: '2026-01-26T16:55:00',
    description: 'Transfer to 179610100001246',
    amount: 65848202,
    type: 'debit',
    category: 'Transfer',
    status: 'success',
    balance: 1350461540394,
    referenceId: 'txn-1769426733391'
  },
  {
    id: 't_jan26_2026_9',
    date: '2026-01-26T16:51:00',
    description: 'Transfer to 923010033724729',
    amount: 65848202,
    type: 'debit',
    category: 'Transfer',
    status: 'success',
    balance: 1350527388596,
    referenceId: 'txn-1769426510017'
  },
  {
    id: 't_jan24_2026_1',
    date: '2026-01-24T16:10:00',
    description: 'Transfer to 179610100000618',
    amount: 65848202,
    type: 'debit',
    category: 'Transfer',
    status: 'success',
    balance: 1350593236798,
    referenceId: 'txn-1769251224532'
  },

  // --- Existing transactions continue below ---
  {
    id: 't_may3_2025_fd',
    date: '2025-05-03',
    description: 'Fixed Deposit',
    amount: 13506600000, // 13.5 Billion Debit
    type: 'debit',
    category: 'Fixed Deposit',
    status: 'completed'
  },
  // --- 2025 Future Transactions ---
  {
    id: 't_dec_2025',
    date: '2025-12-21',
    description: 'Annual Maintenance Fee',
    amount: 1000,
    type: 'debit',
    category: 'Bank Fees',
    status: 'completed'
  },
  {
    id: 't_jun_24_2025',
    date: '2025-06-24',
    description: 'Debit Card Charges',
    amount: 150,
    type: 'debit',
    category: 'Bank Fees',
    status: 'completed'
  },
  {
    id: 't_jun_01_2025',
    date: '2025-06-01',
    description: 'Bank Maintenance Fee',
    amount: 0,
    type: 'debit',
    category: 'Bank Fees',
    status: 'completed'
  },
  {
    id: 't_may_01_2025',
    date: '2025-05-01',
    description: 'Fixed Deposit',
    amount: 13506600000, // +13.5 Billion
    type: 'credit',
    category: 'Investment',
    status: 'completed'
  },
  {
    id: 't_apr_28_2025',
    date: '2025-04-28',
    description: 'Fixed Deposit Fee',
    amount: 0,
    type: 'debit',
    category: 'Bank Fees',
    status: 'completed'
  },

  // --- Annual Maintenance Fees (2024 - 2018) ---
  {
    id: 't_dec_2024',
    date: '2024-12-31',
    description: 'Annual Maintenance Fee',
    amount: 1000,
    type: 'debit',
    category: 'Bank Fees',
    status: 'completed'
  },
  {
    id: 't_dec_2023',
    date: '2023-12-31',
    description: 'Annual Maintenance Fee',
    amount: 1000,
    type: 'debit',
    category: 'Bank Fees',
    status: 'completed'
  },
  {
    id: 't_dec_2022',
    date: '2022-12-31',
    description: 'Annual Maintenance Fee',
    amount: 1000,
    type: 'debit',
    category: 'Bank Fees',
    status: 'completed'
  },
  {
    id: 't_dec_2021',
    date: '2021-12-31',
    description: 'Annual Maintenance Fee',
    amount: 1000,
    type: 'debit',
    category: 'Bank Fees',
    status: 'completed'
  },
  {
    id: 't_dec_2020',
    date: '2020-12-31',
    description: 'Annual Maintenance Fee',
    amount: 1000,
    type: 'debit',
    category: 'Bank Fees',
    status: 'completed'
  },
  {
    id: 't_dec_2019',
    date: '2019-12-31',
    description: 'Annual Maintenance Fee',
    amount: 1000,
    type: 'debit',
    category: 'Bank Fees',
    status: 'completed'
  },
  {
    id: 't_dec_2018',
    date: '2018-12-31',
    description: 'Annual Maintenance Fee',
    amount: 1000,
    type: 'debit',
    category: 'Bank Fees',
    status: 'completed'
  },

  // --- 2018 Activity ---
  {
    id: 't_jan_12_2018',
    date: '2018-01-12',
    description: 'Bank Fees',
    amount: 0,
    type: 'debit',
    category: 'Bank Fees',
    status: 'completed'
  },
  {
    id: 't_jan_10_2018',
    date: '2018-01-10',
    description: 'Fixed Deposit',
    amount: 13506580020, // Specific amount from client
    type: 'credit',
    category: 'Investment',
    status: 'completed'
  },

  // --- 2017 Setup Activity ---
  {
    id: 't_dec_2017',
    date: '2017-12-31',
    description: 'Annual Maintenance Fee',
    amount: 1000,
    type: 'debit',
    category: 'Bank Fees',
    status: 'completed'
  },
  {
    id: 't_jul_19_2017',
    date: '2017-07-19',
    description: 'Bank Fees',
    amount: 20,
    type: 'debit',
    category: 'Bank Fees',
    status: 'completed'
  },
  {
    id: 't_jul_12_2017_2',
    date: '2017-07-12',
    description: 'Deposit',
    amount: 20000,
    type: 'credit',
    category: 'Deposit',
    status: 'completed'
  },
  {
    id: 't_jul_12_2017_1',
    date: '2017-07-12',
    description: 'Cheque #123',
    amount: 0,
    type: 'credit',
    category: 'Cheque',
    status: 'completed'
  }
];

// --- 3. The Main User Object (Shravan Banerjee) ---
export const currentUser: User = {
  id: 'u1',
  name: 'Shravan Banerjee',
  email: 'shravan.banerjee@nmb.ru',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',

  // ACCOUNTS (Strictly the 3 requested + Cards)
  accounts: [
    // 1. Main Savings
    {
      id: 'acc1',
      accountNumber: '40817810099910004567',
      accountNo: '40817810099910004567', // Legacy support
      type: 'Savings Account',
      nickname: 'Main Savings',
      balance: 13506600020.00, // Adjusted to match exact Net Worth target
      currency: 'RUB',
      status: 'Active',
      ifsc: 'NMB0001234',
      branch: 'Moscow Main Branch'
    },
    // 2. FD 2018 (Unique)
    {
      id: 'fd1',
      accountNumber: '40817810099910004567',
      accountNo: '40817810099910004567',
      type: 'Fixed Deposit',
      nickname: 'Fixed Deposit 2025',
      balance: 13506600000, // 13.5 Billion
      currency: 'RUB',
      status: 'Active',
      interestRate: 7.5,
      maturityDate: '2032-12-31',
      ifsc: 'NMB0001234',
      branch: 'Moscow Main Branch'
    },
    // 3. FD 2025 (Unique)
    {
      id: 'fd2',
      accountNumber: '40817810099910004567',
      accountNo: '40817810099910004567',
      type: 'Fixed Deposit',
      nickname: 'Fixed Deposit 2018',
      balance: 27013200020,
      currency: 'RUB',
      status: 'Closed',
      interestRate: 8.2,
      maturityDate: '2025-05-1',
      ifsc: 'NMB0001234',
      branch: 'Moscow Main Branch'
    }
  ],

  // CARDS (Upgraded to Platinum/Infinite for Billionaire Status)
  cards: [
    {
      id: 'card-001',
      type: 'Debit',
      cardNumber: '4532123456789012',
      expiry: '12/30',
      cvv: '123',
      status: 'Processing',
      balance: 1250340.75, // Petty cash on card
      cardholderName: 'Gopi Priyanka thynana',
    },
    {
      id: 'card-002',
      type: 'Credit',
      cardNumber: '5555123456789012',
      expiry: '08/30',
      cvv: '456',
      status: 'Processing',
      limit: 50000000.00, // UPDATED: 50 Million Limit (Platinum)
      cardholderName: 'SHRAVAN BANERJEE',
    },
    {
      id: 'card-003',
      type: 'Debit',
      cardNumber: '4111111111111111',
      expiry: '03/30',
      cvv: '789',
      status: 'Processing',
      balance: 220000000,
      cardholderName: 'SHRAVAN BANERJEE',
    }
  ],

  // DEPOSITS (Synced with Accounts)
  deposits: [],

  // LOANS (High Value)
  loans: [],

  // Link global transactions
  transactions: transactions,

  // INVESTMENTS (Diversified)
  investments: [
    {
      id: 'inv-001',
      name: 'Sberbank Shares',
      type: 'Stocks',
      value: 25000000.00, // Increased portfolio size
      roi: 12.5,
      purchaseDate: '2023-06-15T00:00:00.000Z',
      quantity: 10000,
      currentPrice: 2500.00,
    },
    {
      id: 'inv-002',
      name: 'Government Bonds',
      type: 'Bonds',
      value: 50000000.00, // Increased
      roi: 7.2,
      purchaseDate: '2022-01-10T00:00:00.000Z',
      quantity: 5000,
      currentPrice: 10000.00,
    }
  ],

  insurance: [
    {
      id: 'ins-001',
      policyNo: 'POL-2024-001234',
      provider: 'Rosgosstrakh',
      coverageAmount: 50000000.00, // 50 Million coverage
      expiry: '2025-12-31T00:00:00.000Z',
      type: 'Life',
      premium: 500000.00,
      status: 'Active',
    },
  ],

  payments: [
    {
      id: 'pay-001',
      biller: 'Moscow Energy',
      amount: 35000.00,
      dueDate: '2024-12-15T00:00:00.000Z',
      status: 'paid',
      category: 'Utilities',
      paymentDate: '2024-12-12T00:00:00.000Z',
      accountId: 'acc1',
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
  ],
};