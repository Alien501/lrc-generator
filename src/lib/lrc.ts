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
  lines
    .filter((line) => line.time !== null)
    .map((line) => `[${formatLrcTime(line.time!)}]${line.text}`);

// A word's end is written only when a pause follows it (or it's the last word);
// otherwise the next word's start already marks it.
// const PAUSE = 0.1;

// LET THIS BE THERE
// const wordByWord = (lines: Line[]) =>
//   lines.map((line) => {
//     const start = formatLrcTime(line.words[0]?.time ?? 0);
//     const words = line.words
//       .map((word, i) => {
//         const text =
//           word.time !== null
//             ? `<${formatLrcTime(word.time)}>${word.text}`
//             : word.text;
//         const next = line.words[i + 1]?.time ?? null;
//         const pauseAfter =
//           word.end !== null && (next === null || next - word.end > PAUSE);
//         return pauseAfter ? `${text} <${formatLrcTime(word.end!)}>` : text;
//       })
//       .join(" ");
//     return `[${start}]${words}`;
//   });

const wordByWord = (lines: Line[]) =>
  lines.map((line) => {
    const start = formatLrcTime(line.words[0]?.time ?? 0);
    const words = line.words
      .map((word) => {
        if (word.time === null) return word.text;
        const open = `<${formatLrcTime(word.time)}>${word.text}`;
        // explicit closing tag: <start>word<end>
        const close = word.end !== null ? `<${formatLrcTime(word.end)}>` : "";
        return `${open}${close}`;
      })
      .join(" ");
    return `[${start}]${words}`;
  });

export function buildLrc(lines: Line[], mode: SyncMode, meta: LrcMeta) {
  const header = [
    `[ti:${meta.title || "Title"}]`,
    `[ar:${meta.artist || "Artist"}]`,
    `[al:${meta.album || "Album"}]`,
    `[lr:${meta.lyricist || "Unknown"}]`,
    `[length:${meta.length || "00:00"}]`,
    `[by:${meta.by || "Generated with LRC Generator - Alien501"}]`,
    `[re:LRC Generator - ${mode === "word" ? "Word-by-Word" : "Line-by-Line"} Sync - Alien501]`,
    "",
  ];
  const body = mode === "word" ? wordByWord(lines) : lineByLine(lines);
  return [...header, ...body].join("\n");
}

export function downloadText(content: string, fileName: string) {
  const url = URL.createObjectURL(
    new Blob([content], { type: "text/plain;charset=utf-8" }),
  );
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
