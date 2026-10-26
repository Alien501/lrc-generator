import { lyrics, song, wordSpans } from "@/models";
import { useEffect } from "react";
import { Card, CardContent } from "../ui/card";
import { ButtonGroup, ButtonGroupSeparator } from "../ui/button-group";
import { Button } from "../ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowDown01Icon,
  ArrowUp01Icon,
  ChatPreview01Icon,
  CopyPlusIcon,
  ListRestartIcon,
  MusicNote03Icon,
  PencilEdit01Icon,
  Queue02Icon,
} from "@hugeicons/core-free-icons";
import { cn } from "cn";
import { Slider } from "../ui/slider";
import { Drawer, DrawerContent, DrawerHeader, DrawerTrigger, DrawerTitle, DrawerDescription, DrawerFooter } from "../ui/drawer";
import MusicPlayer from "../MusicPlayer/MusicPlayer";

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

  const resetThisLineSync = () => {
    if(length > 0) {
      const startTime = words[0].time;
      if(startTime != null) song.seek(startTime);
    }
    // Reset line sync
    lyrics.resetWordByWord();
    // Seek song back
  }

  return (
    <SyncControls
      control={
        <div className="relative sm:w-115 w-[320px] max-w-[calc(100vw-2rem)]">
          {/* Word start markers, behind the slider */}
          <div className="absolute inset-y-0 left-5 right-5 pointer-events-none">
            {spans.map((span, i) => (
              <div
                key={i}
                className="absolute top-4 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black/40"
                style={{ left: `${(span.start / max) * 100}%` }}
              />
            ))}
          </div>

          <div className="flex items-center justify-between space-x-1.5">
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
                "[&_[data-slot=slider-track]]:h-6",
                "[&_[data-slot=slider-track]]:rounded-full",
                "[&_[data-slot=slider-track]]:bg-black/10",
                "[&_[data-slot=slider-range]]:rounded-full",
                "[&_[data-slot=slider-range]]:bg-black/20",
                "[&_[data-slot=slider-thumb]]:h-8",
                "[&_[data-slot=slider-thumb]]:w-8",
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
            <Button className="rounded-sm size-8" onClick={resetThisLineSync}>
              <HugeiconsIcon
                icon={ListRestartIcon}
              />
            </Button>
          </div>
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
    <div className="flex items-center justify-center w-full gap-x-2">
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
      <ButtonGroup>
        <LineByLineLyricsPreview />
      </ButtonGroup>
    </div>
  );
}

// TODO: Extract stuff from here to clean the code once completed fully
function LineByLineLyricsPreview() {
  const syncedLyrics = lyrics.use((l) => l.lines);
  const songName = song.baseName;
  const musicPlayerCurrentTime = song.use((s) => s.position);
  const currentLineIndex = lyrics.getIndexBasedOnDuration(musicPlayerCurrentTime);
  const lineSibiling = lyrics.getLineSiblings(currentLineIndex);

  return(
    <Drawer showSwipeHandle>
      <DrawerTrigger
        render={<Button variant="outline" />}
      >
        <HugeiconsIcon
            icon={ChatPreview01Icon}
          />
      </DrawerTrigger>
      <DrawerContent className="rounded-sm max-h-dvh min-h-75 duration-300">
        <DrawerHeader>
          <DrawerTitle>
            Lyrics Preview
          </DrawerTitle>
          <DrawerDescription>
            <p className="text-sm animate-marquee font-medium mask-[linear-gradient(to_right,transparent,black_15%,black_85%,transparent)] text-nowrap">
                {songName}
            </p>
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex-1 p-4 sm:w-[80%] w-[95%] mx-auto">
          <div className="rounded-sm flex flex-col items-center justify-center gap-y-2">
            <div className="px-0.5 py-1 flex-row items-center justify-start perspective-distant transform-3d w-full overflow-hidden">
              <p key={currentLineIndex - 1} className="font-medium text-zinc-500 text-xl animate-from-top-to-top origin-bottom-left">{(lineSibiling && lineSibiling.prev) ? lineSibiling.prev.text:""}</p>
            </div>
            <div className="px-1 py-2 flex-row items-center justify-start w-full perspective-distant transform-3d overflow-hidden">
              <p key={currentLineIndex} className="text-900 font-semibold text-2xl origin-bottom-left animate-fade-in-up">{syncedLyrics[currentLineIndex]?.text}</p>
            </div>
            <div className="px-0.5 py-1 flex-row items-center justify-start w-full perspective-distant transform-3d overflow-hidden">
              <p key={currentLineIndex + 1} className="font-medium text-zinc-500 text-xl animate-from-bottom-to-bottom origin-bottom-left">{(lineSibiling && lineSibiling.next) ? lineSibiling.next.text:""}</p>
            </div>
          </div>
        </div>
        <DrawerFooter className="flex items-center justify-center">
          <MusicPlayer />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}