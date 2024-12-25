import { create } from "zustand";

interface SyncedLyrics {
    lyrics: string;
    timestamp: number;
    isSynced: boolean;
}

interface LyricsState {
    staticLyrics: string;
    setStaticLyrics: (lyrics: string) => void;
    syncedLyrics: SyncedLyrics[];
    setSyncedLyrics: (lyrics: SyncedLyrics[]) => void;
    currentlyActiveCard: number;
    setCurrentlyActiveCard: (id: number) => void;
    updateLyricTimestamp: (id: number, timestamp: number) => void;
    revertTimestamp: (id: number) => void;
    resetLyrics: () => void;
}

export const useLyricsStore = create<LyricsState>((set) => ({
    staticLyrics: "",
    syncedLyrics: [],
    currentlyActiveCard: 0,
    setStaticLyrics: (lyrics) => set(() => ({
        staticLyrics: lyrics,
        syncedLyrics: lyrics.split('\n').map(line => ({
            lyrics: line,
            timestamp: 0,
            isSynced: false
        }))
    })),
    setSyncedLyrics: (lyrics) => set(() => ({ syncedLyrics: lyrics })),
    setCurrentlyActiveCard: (id) => set(() => ({
        currentlyActiveCard: id,
    })),
    updateLyricTimestamp: (id, timestamp) => set((state) => ({
        syncedLyrics: state.syncedLyrics.map((lyric, index) => 
            index === id ? { ...lyric, timestamp, isSynced: true } : lyric
        )
    })),
    revertTimestamp: (id) => set((state) => ({
        syncedLyrics: state.syncedLyrics.map((lyric, index) => 
            index === id ? { ...lyric, timestamp: 0, isSynced: false } : lyric
        )
    })),
    resetLyrics: () => set(() => (
        {
            staticLyrics: "",
            syncedLyrics: [],
            currentlyActiveCard: 0,
        }
    ))
}));
