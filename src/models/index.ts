import { Lyrics } from "./Lyrics";
import { Song } from "./Song";
import { UI } from "./UI";

export const song = new Song();
export const lyrics = new Lyrics();
export const ui = new UI();

export function resetSession() {
    song.reset();
    lyrics.reset();
    ui.reset();
}

export type { Line, SyncMode, Word } from "./Lyrics";
export type { Tab } from "./UI";
