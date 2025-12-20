import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, Transaction } from '../types';
import { currentUser as defaultUser } from '../data/mockData';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../lib/firebase';

interface UserContextType {
    user: User | null;
    loading: boolean;
    transferMoney: (fromAccountNo: string, toAccountNo: string, amount: number) => Promise<void>;
    updateUser: (updates: Partial<User>) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser) {
                // In a real app, we would fetch the user profile from Firestore here.
                // For this demo, we will use the mock 'defaultUser' but ensure the session is valid.
                setUser(prev => ({
                    ...defaultUser,
                    // Optional: You could sync email from firebaseUser if needed
                    // email: firebaseUser.email || defaultUser.email 
                    lastLogin: prev?.lastLogin || new Date().toLocaleString('en-US', {
                        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                    })
                }));
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const transferMoney = async (fromAccountNo: string, toAccountNo: string, amount: number) => {
        if (!user) throw new Error("User not authenticated");

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        setUser(prevUser => {
            if (!prevUser) return null;
            const newUser = { ...prevUser };

            // 1. Find Source Account
            const sourceAccountIndex = newUser.accounts.findIndex(acc => acc.accountNumber === fromAccountNo);
            if (sourceAccountIndex === -1) throw new Error("Source account not found");

            const sourceAccount = { ...newUser.accounts[sourceAccountIndex] };
            if (sourceAccount.balance < amount) throw new Error("Insufficient balance");

            // Update Source
            sourceAccount.balance -= amount;
            const newAccounts = [...newUser.accounts];
            newAccounts[sourceAccountIndex] = sourceAccount;

            // 2. Find Destination Account
            const destAccountIndex = newUser.accounts.findIndex(acc => acc.accountNumber === toAccountNo);

            if (destAccountIndex !== -1) {
                const destAccount = { ...newUser.accounts[destAccountIndex] };
                destAccount.balance += amount;
                newAccounts[destAccountIndex] = destAccount;

                // Also sync 'deposits' array if this is an FD
                if (destAccount.type === 'Fixed Deposit') {
                    const depositIndex = newUser.deposits.findIndex(dep => dep.certificateNo === destAccount.accountNumber || dep.id === destAccount.id);
                    if (depositIndex !== -1) {
                        const newDeposits = [...newUser.deposits];
                        newDeposits[depositIndex] = {
                            ...newDeposits[depositIndex],
                            principal: newDeposits[depositIndex].principal + amount
                        };
                        newUser.deposits = newDeposits;
                    }
                }
            }

            newUser.accounts = newAccounts;

            // 3. Create Transaction
            const newTransaction: Transaction = {
                id: `txn-${Date.now()}`,
                type: 'debit',
                amount: amount,
                description: `Transfer to ${toAccountNo}`,
                date: new Date().toISOString(),
                category: 'Transfer',
                status: 'success',
                accountId: sourceAccount.id,
                accountName: sourceAccount.nickname || sourceAccount.type
            };

            newUser.transactions = [newTransaction, ...newUser.transactions];

            return newUser;
        });
    };

    const updateUser = (updates: Partial<User>) => {
        setUser(prev => (prev ? { ...prev, ...updates } : null));
    };

    return (
        <UserContext.Provider value={{ user, loading, transferMoney, updateUser }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};
