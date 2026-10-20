import type { Line, SyncMode } from "@/models";
import { formatLrcTime } from "./time";

export interface LrcMeta {
    title: string;
    artist: string;
    album: string;
    lyricist: string;
    length: string;
    by: string;
}

const lineByLine = (lines: Line[]) =>
    lines.filter((line) => line.time !== null).map((line) => `[${formatLrcTime(line.time!)}]${line.text}`);

const wordByWord = (lines: Line[]) =>
    lines.map((line) => {
        const start = formatLrcTime(line.words[0]?.time ?? 0);
        const words = line.words
            .map((word) => (word.time !== null ? `<${formatLrcTime(word.time)}>${word.text}` : word.text))
            .join(" ");
        return `[${start}]${words} <${formatLrcTime((line.end ?? 0) + 0.5)}>`;
    });

export function buildLrc(lines: Line[], mode: SyncMode, meta: LrcMeta) {
    const header = [
        `[ti:${meta.title || "Title"}]`,
        `[ar:${meta.artist || "Artist"}]`,
        `[al:${meta.album || "Album"}]`,
        `[lr:${meta.lyricist || "Unknown"}]`,
        `[length:${meta.length || "00:00"}]`,
        `[by:${meta.by || "Generated with LRC Generator"}]`,
        `[re:LRC Generator - ${mode === "word" ? "Word-by-Word" : "Line-by-Line"} Sync]`,
        "",
    ];
    const body = mode === "word" ? wordByWord(lines) : lineByLine(lines);
    return [...header, ...body].join("\n");
}

export function downloadText(content: string, fileName: string) {
    const url = URL.createObjectURL(new Blob([content], { type: "text/plain;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}
