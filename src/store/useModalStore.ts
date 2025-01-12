import { create } from "zustand";

interface ModalState {
    state: boolean;
    changeState: () => void;
    children: null | React.JSX.Element;
    setChildren: (children: React.JSX.Element) => void;
    title: string | null;
    setTitle: (title: string) => void;
    resetModalStore: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
    state: false,
    changeState: () => set((prev) => ({ state: !prev.state })),
    children: null,
    setChildren: (children) => set({children: children}),
    title: null,
    setTitle: (title) => set({title: title}),
    resetModalStore: () => (set(
        {
            state: false,
            children: null,
            title: null
        }
    ))
}));