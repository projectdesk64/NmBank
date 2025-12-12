import { create } from 'zustand';

interface BalanceState {
    isVisible: boolean;
    toggleVisibility: () => void;
}

export const useBalanceStore = create<BalanceState>((set) => ({
    isVisible: true, // Default to visible for demo
    toggleVisibility: () => set((state) => ({ isVisible: !state.isVisible })),
}));
