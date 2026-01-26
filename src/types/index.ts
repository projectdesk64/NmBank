export interface Account {
    id: string;
    accountNumber: string;
    accountNo?: string; // Backward compatibility
    balance: number;
    currency: string;
    status: 'Active' | 'Inactive' | 'Frozen' | 'Closed';
    iban?: string;
    type: string;
    nickname?: string;
    interestRate?: number;
    maturityDate?: string;
    ifsc?: string;
    branch?: string;
}

export interface Card {
    id: string;
    type: 'Debit' | 'Credit';
    cardNumber: string;
    expiry: string;
    cvv: string;
    status: 'Active' | 'Blocked' | 'Expired' | 'Processing';
    balance?: number;
    limit?: number;
    cardholderName: string;
}

export interface FixedDeposit {
    id: string;
    certificateNo: string;
    principal: number;
    rate: number;
    maturityDate: string;
    accruedInterest: number;
    status: 'Active' | 'Matured' | 'Closed';
    nickname?: string;
}

export interface Loan {
    id: string;
    loanType?: string; // User snippet doesn't show loan structure, keeping existing
    accountNo?: string;
    outstandingBalance?: number;
    originalAmount?: number;
    emiAmount?: number;
    nextPaymentDate?: string;
    interestRate?: number;
    status: 'Active' | 'Closed' | 'Overdue';
    tenureMonths?: number;
    paidMonths?: number;
}

export interface Transaction {
    id: string;
    type: 'credit' | 'debit';
    amount: number;
    description: string;
    date: string;
    category: string;
    status: 'info' | 'success' | 'warning' | 'error' | 'completed' | 'pending' | 'failed'; // Expanded status
    accountName?: string; // From user snippet
    accountId?: string; // Existing
    cardId?: string; // Existing
    merchant?: string; // Existing
    balance?: number; // Balance after transaction
    referenceId?: string; // Reference ID for transaction (e.g., txn-1769427869697)
}

export interface Investment {
    id: string;
    name: string;
    type: 'Stocks' | 'Bonds' | 'Mutual Funds' | 'ETFs' | 'Real Estate';
    value: number;
    roi: number;
    purchaseDate: string;
    quantity?: number;
    currentPrice?: number;
}

export interface Insurance {
    id: string;
    policyNo: string;
    provider: string;
    coverageAmount: number;
    expiry: string;
    type: 'Life' | 'Health' | 'Auto' | 'Home' | 'Travel';
    premium: number;
    status: 'Active' | 'Expired' | 'Cancelled';
}

export interface Payment {
    id: string;
    biller: string;
    amount: number;
    dueDate: string;
    status: 'paid' | 'payment' | 'pending' | 'overdue';
    category: 'Utilities' | 'Credit Card' | 'Loan' | 'Insurance' | 'Subscription' | 'Other';
    paymentDate?: string;
    accountId?: string;
    cardId?: string;
}

export interface ExchangeRate {
    currency: string;
    buy: number;
    sell: number;
}

export interface Reward {
    title: string;
    description: string;
    validUntil: string;
}

export interface Beneficiary {
    id: string;
    name: string;
    accountNumber: string;
    bankName: string;
    ifsc?: string;
}

export interface Bill {
    id: string;
    billerName: string;
    amount: number;
    dueDate: string;
    status: 'due' | 'paid';
}

export interface Service {
    id: string;
    name: string;
    icon: string;
    category: string;
}

export interface ServiceCategory {
    id: string;
    name: string;
}

export interface MonthlySpending {
    total: number;
    byCategory: {
        category: string;
        amount: number;
        color: string;
    }[];
}

export interface User {
    id: string;
    name: string;
    email: string;
    avatar: string;
    accounts: Account[];
    // Legacy properties to maintain compatibility
    cards: Card[];
    deposits: FixedDeposit[]; // Note: User snippet splits accounts into Savings/FD. mockData had separate deposits array. I'll need to sync/dup them.
    loans: Loan[];
    transactions: Transaction[];
    investments: Investment[];
    insurance: Insurance[];
    payments: Payment[];
    rates: ExchangeRate[];
    rewards: Reward[];
    lastLogin?: string;
}
