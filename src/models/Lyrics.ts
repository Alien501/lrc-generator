import { Model } from "./Model";

export type SyncMode = "line" | "word";

export interface Word {
    text: string;
    time: number | null;
}

export interface Line {
    text: string;
    time: number | null; // line start (line mode)
    end: number | null; // line end (word mode)
    words: Word[];
}

interface LyricsState {
    text: string;
    lines: Line[];
    mode: SyncMode;
    // Line mode starts at -1, meaning "before the first line".
    activeLine: number;
    activeWord: number;
}

const startLine = (mode: SyncMode) => (mode === "line" ? -1 : 0);

const parse = (text: string): Line[] => {
    const rows = text.split("\n").map((row) => row.trim());
    rows.push(""); // trailing empty line marks the end of the last lyric
    return rows.map((row) => ({
        text: row,
        time: null,
        end: null,
        words: row.split(" ").map((word) => ({ text: word, time: null })),
    }));
};

const initialState: LyricsState = {
    text: "",
    lines: [],
    mode: "line",
    activeLine: -1,
    activeWord: 0,
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
            activeWord: 0,
        });
    };

    setMode = (mode: SyncMode) => {
        this.setState({ mode, activeLine: startLine(mode), activeWord: 0 });
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

    // Marks the slider reaching a word; a word keeps its first stamp.
    reachWord = (index: number, time: number) => {
        this.updateLine(this.state.activeLine, (line) => ({
            ...line,
            words: line.words.map((word, i) => (i === index && word.time === null ? { ...word, time } : word)),
        }));
        this.setState({ activeWord: index });
    };

    // Closes the active line once its last word is reached, then advances.
    finishLine = (time: number) => {
        const { activeLine, activeWord, lines } = this.state;
        const line = lines[activeLine];
        if (!line || activeWord !== line.words.length - 1) return;
        this.updateLine(activeLine, (l) => ({ ...l, end: time }));
        this.setState({
            activeLine: activeLine < lines.length - 1 ? activeLine + 1 : activeLine,
            activeWord: 0,
        });
    };

    private updateLine(index: number, update: (line: Line) => Line) {
        this.setState({
            lines: this.state.lines.map((line, i) => (i === index ? update(line) : line)),
        });
    }
}
