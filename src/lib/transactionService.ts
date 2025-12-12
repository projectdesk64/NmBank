import { doc, updateDoc, collection, addDoc, Timestamp, getDoc } from "firebase/firestore";
import { db } from "./firebase";

export interface TransferParams {
  userId: string;
  fromAccount: string;
  toAccount: string;
  amount: number;
  description?: string;
}

export const performTransfer = async ({ userId, fromAccount, toAccount, amount, description }: TransferParams) => {
  try {
    // Validate inputs
    if (!userId || !fromAccount || !toAccount || !amount) {
      throw new Error("Missing required transfer parameters");
    }

    if (amount <= 0) {
      throw new Error("Transfer amount must be greater than zero");
    }

    if (amount < 1) {
      throw new Error("Minimum transfer amount is ₹1");
    }

    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      throw new Error("User not found");
    }

    const userData = userSnap.data();
    const currentBalance = userData?.balance || 0;

    if (currentBalance < amount) {
      throw new Error("Insufficient balance");
    }

    // Update balance
    const newBalance = currentBalance - amount;
    await updateDoc(userRef, {
      balance: newBalance
    });

    // Add transaction record
    const transactionsRef = collection(userRef, "transactions");
    await addDoc(transactionsRef, {
      description: description || `Transfer to ${toAccount}`,
      amount: amount,
      type: "debit",
      category: "Transfer",
      date: Timestamp.now(),
      status: "success",
      fromAccount,
      toAccount
    });

    return { success: true, newBalance };
  } catch (error: unknown) {
    // Re-throw with proper error message
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("An unexpected error occurred during transfer");
  }
};

