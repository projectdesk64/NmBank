import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, Transaction } from '../types';
import { currentUser as defaultUser } from '../data/mockData';

interface UserContextType {
    user: User;
    transferMoney: (fromAccountNo: string, toAccountNo: string, amount: number) => Promise<void>;
    updateUser: (updates: Partial<User>) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User>(defaultUser);

    useEffect(() => {
        const stored = localStorage.getItem('previousLoginTime');

        if (stored) {
            // Logic to format and set state
            const formatted = new Date(stored).toLocaleString('en-US', {
                month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
            });
            setUser(prev => ({ ...prev, lastLogin: formatted }));
        } else {
            setUser(prev => ({ ...prev, lastLogin: "First Session" }));
        }

        // Save CURRENT time for next visit
        localStorage.setItem('previousLoginTime', new Date().toISOString());
    }, []);

    const transferMoney = async (fromAccountNo: string, toAccountNo: string, amount: number) => {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        setUser(prevUser => {
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

            // Only update destination if it belongs to the user (Internal Transfer)
            // The requirement says: "Update: Deduct amount from source, add amount to destination"
            // If toAccount is external, we only deduct. But user scenario is transfer to "Fixed Deposit 2025" (internal).

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
        setUser(prev => ({ ...prev, ...updates }));
    };

    return (
        <UserContext.Provider value={{ user, transferMoney, updateUser }}>
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
