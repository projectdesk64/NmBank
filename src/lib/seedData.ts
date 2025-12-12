import { doc, writeBatch, collection, Timestamp } from "firebase/firestore";
import { db } from "./firebase";

export const seedNewUser = async (userId: string, email: string, name: string) => {
  const batch = writeBatch(db);
  const userRef = doc(db, "users", userId);

  // 1. Create Profile & Account Info (Req #3, #4, #6)
  batch.set(userRef, {
    profile: {
      name: name || "New User",
      email: email,
      phone: "+91 98765 43210",
      customerId: "NMB" + Math.floor(100000 + Math.random() * 900000),
      joinedAt: Timestamp.now()
    },
    accountDetails: {
      accountNumber: "4002" + Math.floor(100000000000 + Math.random() * 900000000000),
      ifsc: "NMB0004002",
      branch: "Cyber City Main",
      type: "Savings Advantage"
    },
    balance: 150000.00, // <--- Starting Balance
    // 2. Fixed Deposits (Req #2)
    fixedDeposits: [
      {
        id: "fd_01",
        principal: 500000,
        interestRate: "7.10%",
        maturityDate: "20 Dec 2026",
        status: "Active"
      }
    ]
  });

  // 3. Transaction History (Req #5)
  const txnRef = collection(userRef, "transactions");
  const history = [
    { desc: "Opening Deposit", amt: 150000, type: "credit", cat: "Transfer", day: 0 },
    { desc: "Netflix", amt: 499, type: "debit", cat: "Entertainment", day: 2 },
    { desc: "Starbucks", amt: 350, type: "debit", cat: "Food", day: 5 }
  ];

  history.forEach(t => {
    const newDoc = doc(txnRef);
    const d = new Date(); d.setDate(d.getDate() - t.day);
    batch.set(newDoc, {
      description: t.desc, amount: t.amt, type: t.type, category: t.cat,
      date: Timestamp.fromDate(d), status: "success"
    });
  });

  await batch.commit();
};