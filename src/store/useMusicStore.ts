import { create } from "zustand";

type PlayerStatus = 'play' | 'pause';

interface PlayerState {
    playerStatus: PlayerStatus;
    setPlayerStatus: (status: PlayerStatus) => void;
    controlsState: boolean;
    setControlsState: (state: boolean) => void;
    selectedFile: File | null;
    setSelectedFile: (file: File) => void;
    audioUrl: string | null;
    setAudioUrl: (url: string) => void;
    currentTimestamp: number;
    setCurrentTimeStamp: (ts: number) => void;
    resetMusic: () => void;
}

export const useMusicStore = create<PlayerState>((set) => ({
    playerStatus: "play",
    controlsState: false,
    selectedFile: null,
    audioUrl: null,
    currentTimestamp: 0,
    setPlayerStatus: (status) => set({ playerStatus: status }),
    setControlsState: (state) => set({controlsState: state}),
    setSelectedFile: (file) => set({selectedFile: file}),
    setAudioUrl: (url) => set({audioUrl: url}),
    setCurrentTimeStamp: (ts) => set({ currentTimestamp: ts }),
    resetMusic: () => set(() => ({
        playerStatus: "play",
        controlsState: false,
        selectedFile: null,
        audioUrl: null,
        currentTimestamp: 0,
    }))
}))