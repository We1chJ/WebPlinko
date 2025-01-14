import { create } from "zustand";

type PlinkoStore = {
    balance: number;
    setBalance: (balance: number) => void;
    changeBalance: (change: number) => void;
};

export const usePlinkoStore = create<PlinkoStore>((set, get) => ({
    balance: 100,
    betAmount: 0,
    setBalance: (balance: number) => {
        set({ balance });
    },
    changeBalance: (change: number) => {
        set({ balance: get().balance + change })
    },
}));