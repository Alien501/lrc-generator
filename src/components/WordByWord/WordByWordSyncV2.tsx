import { useEffect } from "react";
import { lyrics, song, wordSpans, type Line } from "@/models";
import SyncLayout from "../Layout/syncLayout";
import MusicBarV2 from "../MusicBar/MusicBarV2";
import TopBarV2 from "../TopBar/TopBarV2";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowDown01Icon, ArrowUp01Icon } from "@hugeicons/core-free-icons";
import { WordByWordControl } from "../SyncControls/SyncControls";

export default function WordByWordSyncV2() {
    useEffect(() => lyrics.setMode("word"), []);

    return(
        <SyncLayout
            topBar={
                <TopBarV2 />
            }
            bottomBar={<MusicBarV2 control={<WordByWordControl />} />}
            mainContent={ <WordByWordLyricContainer /> }
        />
    )
}

function WordByWordLyricContainer() {
    const lines = lyrics.use((l) => l.lines);
    const activeLine = lyrics.use((l) => l.activeLine);
    const tracker = lyrics.use((l) => l.tracker);

    const mainLine = lines[activeLine];
    if (!mainLine) return null;

    const moveLine = (number: number) => {
        if(lines.length == 0) return;
        const clamped = Math.max(0, Math.min(activeLine + number, lines.length - 1))
        const currentLine = lines[clamped];
        // Means synced
        if(currentLine.words.length !== 0 && currentLine.words[0].time !== null) {
            song.seek(currentLine.words[0].time);
        }
        lyrics.goToLine(activeLine + number);
    }
    console.log(lines[activeLine])

    return(
        <div className="relative h-full flex items-center justify-center">
            <div className="w-[320px] space-y-2 -mt-20">
                <p className="text-lg font-bold text-muted-foreground/50 min-h-7 px-4">{lines[activeLine - 1]?.text}</p>
                <Card className="py-0 px-1 rounded-sm shadow-xs">
                    <CardContent>
                        <Button
                            className="w-full rounded-xs" variant="ghost"
                            disabled={activeLine === 0}
                            onClick={() => moveLine(-1)}
                        >
                            <HugeiconsIcon icon={ArrowUp01Icon} className="size-4" />
                        </Button>
                        <TrackedLine line={mainLine} tracker={tracker} />
                        <Button
                            className="w-full rounded-xs" variant="ghost"
                            disabled={activeLine === lines.length - 1}
                            onClick={() => moveLine(+1)}
                        >
                            <HugeiconsIcon icon={ArrowDown01Icon} className="size-4" />
                        </Button>
                    </CardContent>
                </Card>
                <p className="text-lg font-bold text-muted-foreground/50 min-h-7 px-4">{lines[activeLine + 1]?.text}</p>
            </div>
        </div>
    )
}

// Each word fills left-to-right as the tracker passes over it; a word that has been left stays filled.
function TrackedLine({ line, tracker }: { line: Line; tracker: number }) {
    const spans = wordSpans(line.words);

    return (
        <p className="text-xl font-extrabold py-2">
            {line.words.map((word, i) => {
                const { start, end } = spans[i];
                const fill =
                    word.end !== null ? 100
                    : word.time !== null ? Math.min(Math.max((tracker - start) / Math.max(end - start, 1), 0), 1) * 100
                    : 0;

                return (
                    <span key={i} className="relative">
                        <span
                            className="bg-clip-text text-transparent relative z-1 leading-relaxed"
                            style={{ backgroundImage: `linear-gradient(to right, var(--foreground) ${fill}%, var(--muted-foreground) ${fill}%)` }}
                        >
                        <span style={{ left: `${fill}%` }} className={`h-6.5 w-0.75 rounded-sm absolute  z-5 top-1/2 -translate-1/2 duration-30 ease-in-out ${(fill%100) == 0? "bg-transparent": "bg-zinc-900"}`}></span>
                            {/* ${(fill%100) == 0? "left-0": `left-${[fill]}px`} */}
                            {word.text}
                        </span>{" "}
                    </span>
                );
            })}
        </p>
    );
}
