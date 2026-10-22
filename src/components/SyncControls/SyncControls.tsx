import { lyrics, song, wordSpans } from "@/models";
import { useEffect } from "react";
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
  const words = lyrics.use((s) => s.lines[s.activeLine]?.words);
  const tracker = lyrics.use((s) => s.tracker);

  const length = words?.map((w) => w.text).join(" ").length ?? 0;
  // An empty line still needs some room to slide through.
  const max = Math.max(length, 1);
  const spans = words ? wordSpans(words) : [];

  const first = (v: number | readonly number[]) => (typeof v === "number" ? v : v[0]);

  return (
    <SyncControls
      control={
        <div className="relative w-[460px] max-w-[calc(100vw-2rem)]">
          {/* Word start markers, behind the slider */}
          <div className="absolute inset-y-0 left-5 right-5 pointer-events-none">
            {spans.map((span, i) => (
              <div
                key={i}
                className="absolute top-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black/40"
                style={{ left: `${(span.start / max) * 100}%` }}
              />
            ))}
          </div>

          <Slider
            value={[tracker]}
            min={0}
            max={max}
            step={0.01}
            disabled={!words}
            onValueChange={(v) => lyrics.track(first(v), song.currentTime)}
            onValueCommitted={lyrics.finishTrack}
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
