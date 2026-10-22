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
  rows.push(""); // trailing empty line marks the end of the last lyric
  return rows.map((row) => ({
    text: row,
    time: null,
    words: toWords(row),
  }));
};

const initialState: LyricsState = {
  text: "",
  lines: [],
  mode: "line",
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
