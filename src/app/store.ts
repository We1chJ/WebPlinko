import { create } from "zustand";

type PlinkoStore = {
    balance: number;
    betAmount: number;
    setBalance: (balance: number) => void;
    setBetAmount: (betAmount: number) => boolean;
};

export const usePlinkoStore = create<PlinkoStore>((set, get) => ({
    balance: 100,
    betAmount: 0,
    setBalance: (balance: number) => {
        set({ balance });
    },
    // return true if invalid, false otherwise
    setBetAmount: (betAmount: number) => {
        if (betAmount > get().balance) {
            return true;
        }
        set({ betAmount });
        return false;
    }
}));