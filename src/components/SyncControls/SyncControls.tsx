import { lyrics, song } from "@/models";
import { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "../ui/card";
import { ButtonGroup, ButtonGroupSeparator } from "../ui/button-group";
import { Button } from "../ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowDown01Icon,
  ArrowUp01Icon,
  CopyPlusIcon,
  MusicNote03Icon,
  PencilEdit01Icon,
  Queue02Icon,
} from "@hugeicons/core-free-icons";
import { cn } from "cn";
import { Slider } from "../ui/slider";

export function LineByLineControl() {
  const atStart = lyrics.use((l) => l.activeLine < 0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp") {
        e.preventDefault();
        lyrics.prev();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        lyrics.next(song.currentTime);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const moveToNextLine = () => {
    lyrics.next(song.currentTime);
  };

  const moveToPrevLine = () => {
    lyrics.prev();
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "2" || e.code == "Numpad2") {
        e.preventDefault();
        moveToNextLine();
      } else if (e.key == "5" || e.code == "Numpad5") {
        e.preventDefault();
        moveToPrevLine();
      }
    };

    document.addEventListener("keydown", handleKeyPress);

    return () => document.removeEventListener("keydown", handleKeyPress);
  }, []);

  return (
    <SyncControls
      control={
        <ButtonGroup className="mx-auto">
          <Button
            disabled={atStart}
            onClick={moveToPrevLine}
            className="px-14 py-6 rounded-sm"
          >
            <HugeiconsIcon className="size-6" icon={ArrowUp01Icon} />
          </Button>
          <ButtonGroupSeparator />
          <Button onClick={moveToNextLine} className="px-14 py-6 rounded-sm">
            <HugeiconsIcon className="size-6" icon={ArrowDown01Icon} />
          </Button>
        </ButtonGroup>
      }
    />
  );
}

export function WordByWordControl() {
  const activeLine = lyrics.use((s) => s.activeLine);
  const activeWord = lyrics.use((s) => s.activeWord);
  const lines = lyrics.use((s) => s.lines);

  const line = lines[activeLine];
  const wordCount = line?.words.length ?? 0;
  const maxWordIndex = Math.max(wordCount - 1, 0);
  const disabled = maxWordIndex <= 0;

  // Local value drives the thumb so it doesn't depend on reachWord()
  // propagating back through the store during the drag.
  const [wordValue, setWordValue] = useState(activeWord);
  const draggingRef = useRef(false);

  // Only resync when we're *not* dragging — the store may lag or not
  // update at all during a drag.
  useEffect(() => {
    if (!draggingRef.current) setWordValue(activeWord);
  }, [activeWord, activeLine]);

  const handleValueChange = (v: number[]) => {
    draggingRef.current = true;
    setWordValue(v[0]);
    lyrics.reachWord(v[0], song.currentTime);
  };

  const handleValueCommit = (v: number[]) => {
    lyrics.reachWord(v[0], song.currentTime);
    lyrics.finishLine(song.currentTime);
    draggingRef.current = false;
  };

  return (
    <SyncControls
      control={
        <div className="relative w-[460px] max-w-[calc(100vw-2rem)]">
          {/* Word marker dots — behind the slider */}
          <div className="absolute inset-y-0 left-5 right-5 pointer-events-none">
            {Array.from({ length: wordCount }, (_, i) => {
              const left = maxWordIndex > 0 ? (i / maxWordIndex) * 100 : 0;
              return (
                <div
                  key={i}
                  className="absolute top-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black/40"
                  style={{ left: `${left}%` }}
                />
              );
            })}
          </div>

          <Slider
            value={[Math.min(wordValue, maxWordIndex)]}
            min={0}
            max={Math.max(maxWordIndex, 1)}
            step={1}
            disabled={disabled}
            onValueChange={handleValueChange}
            onValueCommit={handleValueCommit}
            className={cn(
              "relative",
              "[&_[data-slot=slider-track]]:h-12",
              "[&_[data-slot=slider-track]]:rounded-full",
              "[&_[data-slot=slider-track]]:bg-black/10",
              "[&_[data-slot=slider-range]]:rounded-full",
              "[&_[data-slot=slider-range]]:bg-black/20",
              "[&_[data-slot=slider-thumb]]:h-10",
              "[&_[data-slot=slider-thumb]]:w-10",
              "[&_[data-slot=slider-thumb]]:rounded-full",
              "[&_[data-slot=slider-thumb]]:border-0",
              "[&_[data-slot=slider-thumb]]:bg-black",
              "[&_[data-slot=slider-thumb]]:shadow-lg",
              "[&_[data-slot=slider-thumb]]:hover:shadow-xl",
              "[&_[data-slot=slider-thumb]]:cursor-grab",
              "[&_[data-slot=slider-thumb]]:active:cursor-grabbing",
              // hamburger glyph painted with a ::before + box-shadow trick
              "[&_[data-slot=slider-thumb]]:before:content-['']",
              "[&_[data-slot=slider-thumb]]:before:absolute",
              "[&_[data-slot=slider-thumb]]:before:left-1/2",
              "[&_[data-slot=slider-thumb]]:before:top-1/2",
              "[&_[data-slot=slider-thumb]]:before:h-0.5",
              "[&_[data-slot=slider-thumb]]:before:w-4",
              "[&_[data-slot=slider-thumb]]:before:-translate-x-1/2",
              "[&_[data-slot=slider-thumb]]:before:-translate-y-1/2",
              "[&_[data-slot=slider-thumb]]:before:rounded-full",
              "[&_[data-slot=slider-thumb]]:before:bg-white",
              "[&_[data-slot=slider-thumb]]:before:shadow-[0_-6px_0_0_white,0_6px_0_0_white]",
            )}
          />
        </div>
      }
    />
  );
}


function SyncControls({ control }: { control: React.JSX.Element }) {
  return (
    <div className="absolute -top-14 left-1/2 -translate-1/2 z-1">
      <Card className="rounded-sm border-zinc-200 shadow-xl">
        <CardContent className="gap-y-4">
          <div className="flex items-center justify-center">
            <LyricUtils />
          </div>
          <div className="h-2"></div>
          {control}
        </CardContent>
      </Card>
    </div>
  );
}

function LyricUtils() {
  const activeLine = lyrics.use((l) => l.activeLine);
  return (
    <ButtonGroup>
      <Button
        onClick={() => lyrics.upsertLine(activeLine, "♪", "insert")}
        aria-label="Insert Instrumental Line Next"
        variant="secondary"
      >
        +
        <HugeiconsIcon icon={MusicNote03Icon} />
      </Button>
      <Button
        onClick={() => lyrics.upsertLine(activeLine, "", "insert")}
        aria-label="Insert Empty Line Next"
        variant="secondary"
      >
        +
        <HugeiconsIcon icon={PencilEdit01Icon} />
      </Button>
      <Button
        onClick={() => lyrics.upsertLine(activeLine, "", "duplicate")}
        aria-label="Copy This to Next Line"
        variant="secondary"
      >
        +
        <HugeiconsIcon icon={CopyPlusIcon} />
      </Button>
      <Button
        onClick={() => lyrics.upsertLine(activeLine, "", "remove")}
        aria-label="Remove Next Line"
        variant="secondary"
      >
        -
        <HugeiconsIcon icon={Queue02Icon} />
      </Button>
    </ButtonGroup>
  );
}
