import { create } from "zustand";

type TabType = 'lyrics' | 'sync';

interface NavState {
    currentTab: TabType;
    setCurrentTab: (tab: TabType) => void;
    resetNav: () => void;
}

export const useNavStore = create<NavState>((set) => ({
    currentTab: "lyrics",
    setCurrentTab: (tab) => set({currentTab: tab}),
    resetNav: () => set(() => ({
        currentTab: "lyrics",
    }))
}))