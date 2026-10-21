import { lyrics, song } from "@/models";
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

export default function LineByLineControl() {
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
