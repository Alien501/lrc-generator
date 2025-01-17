import { create } from "zustand";

interface SyncedLyrics {
    lyrics: string;
    timestamp: number;
    isSynced: boolean;
}

interface WordByWordLyrics {
    lyrics: SyncedLyrics[];
    timestamp: number; // end timestamp
}

interface LyricsState {
    staticLyrics: string;
    setStaticLyrics: (lyrics: string) => void;
    syncedLyrics: SyncedLyrics[];
    setSyncedLyrics: (lyrics: SyncedLyrics[]) => void;
    wordByWordLyrics: WordByWordLyrics[];
    updateWordByWordLyrics: (lineId: number, wordId: number, timestamp: number) => void;
    currentlyActiveCard: number;
    setCurrentlyActiveCard: (id: number) => void;
    updateLyricTimestamp: (id: number, timestamp: number) => void;
    revertTimestamp: (id: number) => void;
    resetLyrics: () => void;
}

export const useLyricsStore = create<LyricsState>((set) => ({
    staticLyrics: "",
    syncedLyrics: [],
    wordByWordLyrics: [],
    currentlyActiveCard: 0,
    setStaticLyrics: (lyrics) =>
        set(() => {
            const lines = lyrics.split("\n").map((line) => line.trim());
            lines.push('');
            return {
                staticLyrics: lyrics,
                syncedLyrics: lines.map((line) => ({
                    lyrics: line,
                    timestamp: 0,
                    isSynced: false,
                })),
                wordByWordLyrics: lines.map((line) => ({
                    lyrics: line.split(" ").map((word) => ({
                        lyrics: word,
                        timestamp: 0,
                        isSynced: false,
                    })),
                    timestamp: 0,
                })),
            };
        }),
    updateWordByWordLyrics: (lineId, wordId, timestamp) =>
        set((state) => ({
            wordByWordLyrics: state.wordByWordLyrics.map((line, index) =>
                index === lineId
                    ? {
                          ...line,
                          lyrics: line.lyrics.map((word, idx) =>
                              idx === wordId && !word.isSynced ? { ...word, timestamp, isSynced: true } : word
                          ),
                          timestamp: wordId == 0 ? timestamp: line.timestamp
                      }
                    : line
            ),
        })),
    setSyncedLyrics: (lyrics) => set(() => ({ syncedLyrics: lyrics })),
    setCurrentlyActiveCard: (id) => set(() => ({ currentlyActiveCard: id })),
    updateLyricTimestamp: (id, timestamp) =>
        set((state) => ({
            syncedLyrics: state.syncedLyrics.map((lyric, index) =>
                index === id ? { ...lyric, timestamp, isSynced: true } : lyric
            ),
        })),
    revertTimestamp: (id) =>
        set((state) => ({
            syncedLyrics: state.syncedLyrics.map((lyric, index) =>
                index === id ? { ...lyric, timestamp: 0, isSynced: false } : lyric
            ),
        })),
    resetLyrics: () =>
        set(() => ({
            staticLyrics: "",
            syncedLyrics: [],
            wordByWordLyrics: [],
            currentlyActiveCard: 0,
        })),
}));
