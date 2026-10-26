import { Model } from "./Model";

export type SyncMode = "line" | "word";

export interface Word {
  text: string;
  time: number | null; // tracker entered the word
  end: number | null; // tracker left the word
}

export interface Line {
  text: string;
  time: number | null; // line start (line mode)
  words: Word[];
}

interface LyricsState {
  text: string;
  lines: Line[];
  mode: SyncMode;
  uploadedFile?: boolean;
  // Line mode starts at -1, meaning "before the first line".
  activeLine: number;
  tracker: number;
}

const startLine = (mode: SyncMode) => (mode === "line" ? -1 : 0);

const toWords = (text: string): Word[] =>
  text.split(" ").map((word) => ({ text: word, time: null, end: null }));

export const wordSpans = (words: Word[]) => {
  let offset = 0;
  return words.map((word) => {
    const span = { start: offset, end: offset + word.text.length };
    offset = span.end + 1;
    return span;
  });
};

const parse = (text: string): Line[] => {
  const rows = text.split("\n").map((row) => row.trim());
  rows.push("");
  return rows.map((row) => ({
    text: row,
    time: null,
    words: toWords(row),
  }));
};

// ---------------------------------------------------------------------------
// LRC parsing
// ---------------------------------------------------------------------------

// Leading line timestamps:  [mm:ss.xx]  [mm:ss:xx]  [mm:ss]
const LEADING_TIME = /^\[(\d{1,3}):(\d{1,2})(?:[.:](\d{1,3}))?\]/;
// Inline word timestamps (enhanced LRC / A2):  <mm:ss.xx>
const WORD_TIME = /<(\d{1,3}):(\d{1,2})(?:[.:](\d{1,3}))?>/g;
// [ti:], [ar:], [al:], [by:], [re:], [ve:], [length:], [offset:] - To Ignore
const METADATA = /^\[(ti|ar|al|by|re|ve|length|offset):.*\]$/i;

const toSeconds = (min: string, sec: string, frac?: string): number => {
  const ms = frac ? parseInt(frac.padEnd(3, "0"), 10) : 0;
  return parseInt(min, 10) * 60 + parseInt(sec, 10) + ms / 1000;
};

/** Returns word-by-word timing when `<mm:ss.xx>` tags are present. */
const parseWordTimings = (text: string): Word[] | null => {
  const matches = [...text.matchAll(WORD_TIME)];
  if (matches.length === 0) return null;

  const words: Word[] = [];


  const lead = text.slice(0, matches[0].index!).trim();
  if (lead) {
    for (const w of lead.split(/\s+/).filter(Boolean)) {
      words.push({ text: w, time: null, end: null });
    }
  }

  for (let i = 0; i < matches.length; i++) {
    const m = matches[i];
    const start = m.index! + m[0].length;
    const stop = i + 1 < matches.length ? matches[i + 1].index! : text.length;
    const chunk = text.slice(start, stop).trim();
    if (!chunk) continue;

    const time = toSeconds(m[1], m[2], m[3]);
    for (const w of chunk.split(/\s+/).filter(Boolean)) {
      words.push({ text: w, time, end: null });
    }
  }

  // A word ends when the next one begins.
  for (let i = 0; i < words.length - 1; i++) {
    if (words[i].time != null) words[i].end = words[i + 1].time ?? null;
  }

  return words.length > 0 ? words : null;
};

interface ParsedLrc {
  lines: Line[];
  mode: SyncMode;
}

const parseLrc = (content: string): ParsedLrc => {
  const rows = content.split(/\r?\n/);
  const entries: { time: number; text: string; words: Word[] | null }[] = [];

  let offsetMs = 0;
  let hasWordTiming = false;

  for (const raw of rows) {
    const row = raw.trim();
    if (!row) continue;

    // [offset:±ms] — added to every timestamp (positive = later) - Need to verify
    const offsetMatch = row.match(/^\[offset:\s*([+-]?\d+)\s*\]$/i);
    if (offsetMatch) {
      offsetMs = parseInt(offsetMatch[1], 10);
      continue;
    }

    const times: number[] = [];
    let rest = row;
    let m: RegExpMatchArray | null;
    while ((m = rest.match(LEADING_TIME))) {
      times.push(toSeconds(m[1], m[2], m[3]));
      rest = rest.slice(m[0].length);
    }

    if (times.length === 0) continue;

    const words = parseWordTimings(rest);
    if (words) hasWordTiming = true;

    const text = words
      ? rest.replace(WORD_TIME, "").replace(/\s+/g, " ").trim()
      : rest.trim();

    for (const t of times) {
      entries.push({ time: t, text, words });
    }
  }

  if (entries.length === 0) {
    const plain = rows
      .map((r) => r.trim())
      .filter((r) => r && !METADATA.test(r))
      .join("\n");
    return { lines: parse(plain), mode: "line" };
  }

  entries.sort((a, b) => a.time - b.time);

  const offset = offsetMs / 1000;
  const shift = (n: number) => Math.max(0, n + offset);

  const lines: Line[] = entries.map(({ time, text, words }) => ({
    text,
    time: shift(time),
    words: words
      ? words.map((w) => ({
          text: w.text,
          time: w.time == null ? null : shift(w.time),
          end: w.end == null ? null : shift(w.end),
        }))
      : toWords(text),
  }));

  lines.push({ text: "", time: null, words: [] });

  return { lines, mode: hasWordTiming ? "word" : "line" };
};

// ---------------------------------------------------------------------------
// Model
// ---------------------------------------------------------------------------

const initialState: LyricsState = {
  text: "",
  lines: [],
  mode: "line",
  uploadedFile: false,
  activeLine: -1,
  tracker: 0,
};

export class Lyrics extends Model<LyricsState> {
  constructor() {
    super(initialState);
  }

  get hasText() {
    return this.state.text.trim() !== "";
  }

  /**
   * Loads an .lrc / .txt lyrics file.
   * Resolves with the detected sync mode: "word" when the file contains
   * `<mm:ss.xx>` word timestamps, "line" otherwise.
   */
  load = (file: File): Promise<SyncMode> => {
    this.unload();

    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        const content = e.target?.result;
        if (typeof content !== "string") {
          reject(new Error("Lyrics file could not be read as text."));
          return;
        }

        const { lines, mode } = parseLrc(content);
        const body =
          lines.length > 0 && lines[lines.length - 1].text === ""
            ? lines.slice(0, -1)
            : lines;

        this.setState({
          text: body.map((l) => l.text).join("\n"),
          lines,
          mode,
          uploadedFile: true,
          activeLine: startLine(mode),
          tracker: 0,
        });

        resolve(mode);
      };

      reader.onerror = () =>
        reject(reader.error ?? new Error("Lyrics file could not be read."));

      reader.readAsText(file);
    });
  };

  unload = () => {
    this.setState({
      text: "",
      lines: [],
      mode: "line",
      uploadedFile: false,
      activeLine: -1,
      tracker: 0,
    });
  };

  setText = (text: string) => {
    this.setState({
      text,
      lines: parse(text),
      activeLine: startLine(this.state.mode),
      tracker: 0,
    });
  };

  setMode = (mode: SyncMode) => {
    this.setState({ mode, activeLine: startLine(mode), tracker: 0 });
  };

  reset = () => this.setState(initialState);

  // --- Line-by-line ---

  // Moves to the next line and stamps its start time.
  next = (time: number) => {
    const { activeLine, lines } = this.state;
    if (activeLine >= lines.length - 1) return;
    const target = activeLine + 1;
    this.updateLine(target, (line) => ({ ...line, time }));
    this.setState({ activeLine: target });
  };

  // Un-stamps the current line and steps back.
  prev = () => {
    const { activeLine } = this.state;
    if (activeLine < 0) return;
    this.updateLine(activeLine, (line) => ({ ...line, time: null }));
    this.setState({ activeLine: activeLine - 1 });
  };

  // --- Word-by-word ---

  // Moves the tracker to `pos`: words it enters get a start, words it leaves get an end.
  // Moving back clears stamps past the tracker, so a part can simply be re-slid.
  track = (pos: number, time: number) => {
    this.updateLine(this.state.activeLine, (line) => {
      const spans = wordSpans(line.words);
      return {
        ...line,
        words: line.words.map((word, i) => {
          const entered = pos > spans[i].start;
          const left = entered && pos >= spans[i].end;
          return {
            ...word,
            time: entered ? (word.time ?? time) : null,
            end: left ? (word.end ?? time) : null,
          };
        }),
      };
    });
    this.setState({ tracker: pos });
  };

  resetWordByWord = () => {
    const { activeLine, lines } = this.state;
    const words = lines[activeLine]?.words ?? [];

    const hasTimestamps = words.some((w) => w.time != null || w.end != null);
    if (!hasTimestamps) return;

    this.updateLine(activeLine, (line) => ({
      ...line,
      words: line.words.map((word) => ({ ...word, time: null, end: null })),
    }));

    this.setState({ tracker: 0 });
  };

  // Called when the tracker is released: advances once the whole line has been slid through.
  finishTrack = () => {
    const { activeLine, lines } = this.state;
    const words = lines[activeLine]?.words ?? [];
    if (words[words.length - 1]?.end == null || activeLine >= lines.length - 1) return;
    this.setState({ activeLine: activeLine + 1, tracker: 0 });
  };

  adjustLine = (index: number, timeToAdjust: number) => {
    this.updateLine(index, (line) =>
      line.time == null ? line : { ...line, time: line.time + timeToAdjust },
    );
    this.setState({ activeLine: index });
  };

  // update here referes to insertion or removal
  // Insert after given index or remove after given index
  upsertLine = (index: number, text: string, update?: "insert" | "remove" | "duplicate") => {
    const lines = [...this.state.lines];

    if(update && update == "duplicate") {
      text = lines[index].text;
    }

    const hasSentinel = lines.length > 0 && lines[lines.length - 1].text === "";
    const body = hasSentinel ? lines.slice(0, -1) : lines;
    const sentinel: Line = hasSentinel
      ? lines[lines.length - 1]
      : { text: "", time: null, words: [] };

    const makeLine = (): Line => ({
      text,
      time: null,
      words: toWords(text),
    });

    if (update === "insert" || update === "duplicate") {
      body.splice(index + 1, 0, makeLine());
    } else if (update === "remove") {
      if (index + 1 < body.length) body.splice(index + 1, 1);
    } else {
      const prev = body[index];
      if (prev) {
        body[index] = { ...prev, text, words: makeLine().words };
      } else {
        body.push(makeLine());
      }
    }

    this.setState({
      lines: [...body, sentinel],
      text: body.map((l) => l.text).join("\n"),
    });
  };

  private updateLine(index: number, update: (line: Line) => Line) {
    this.setState({
      lines: this.state.lines.map((line, i) =>
        i === index ? update(line) : line,
      ),
    });
  }

  // word mode: jump to a line without touching any timestamps - Song seek should be handled near Caller
  goToLine = (index: number) => {
    const { lines } = this.state;
    if (lines.length === 0) return;
    const clamped = Math.max(0, Math.min(index, lines.length - 1));
    this.setState({ activeLine: clamped, tracker: 0 });
  };
}
