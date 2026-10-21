import {
  ArrowDown01Icon,
  ArrowLeft,
  ArrowLeft02FreeIcons,
  ArrowRight,
  ArrowUp01Icon,
  CopyPlusIcon,
  Download02Icon,
  MusicNote03Icon,
  PencilEdit01Icon,
  Queue02Icon,
} from "@hugeicons/core-free-icons";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { HugeiconsIcon } from "@hugeicons/react";
import { useNavigate } from "react-router-dom";
import { lyrics, song } from "@/models";
import MusicPlayer from "../MusicPlayer/MusicPlayer";
import { ButtonGroup, ButtonGroupSeparator } from "../ui/button-group";
import { useEffect, useRef } from "react";
import { formatLrcTime } from "@/lib/time";
import SaveCard from "../SaveCard/SaveCard";

export default function LineByLineV2() {
  const navigate = useNavigate();
  const songName = song.baseName;
  const lines = lyrics.use((l) => l.lines) ;
  const activeLine = lyrics.use((l) => l.activeLine);

  return (
    <div className="h-dvh overflow-hidden grid grid-rows-[60px_1fr_60px] ">
      <div className="top-bar">
        <Card className="rounded-none bg-white shadow-md h-full border-zinc-200">
          <CardContent className="flex items-center justify-between h-full">
            <div>
              <Button
                onClick={() => navigate(-1)}
                variant="secondary"
                className="rounded-sm"
              >
                <HugeiconsIcon icon={ArrowLeft02FreeIcons} />
                Back
              </Button>
            </div>
            <div className="max-w-[320px]">
              <p className="text-sm font-medium mask-[linear-gradient(to_right,transparent,black_15%,black_85%,transparent)] text-nowrap">
                {songName}
              </p>
            </div>
            <div>
              <SaveCard
                trigger={
                  <Button className="rounded-sm">
                    <HugeiconsIcon icon={Download02Icon} />
                    Save
                  </Button>
                }
              />
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="bg-zinc-100 overflow-y-scroll">
        <div className="w-[95%] sm:w-[80%] mx-auto h-full m-2">
          {/* Content should be here: for ref */}
          {lines.map((line, i) => (
            <LyricsCard
              index={i}
              isActive={activeLine == i}
              key={i}
              text={line.text}
              time={line.time}
            />
          ))}
          <div className="h-18"></div>
        </div>
      </div>
      <div className="bottom-bar relative">
        <SyncControls />
        <Card className="rounded-none bg-white shadow-md h-full border-zinc-200 relative z-10">
          <CardContent className="flex items-center justify-center h-full">
            <MusicPlayer />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

interface LyricsCardProps {
  text: string;
  time?: number | null;
  index: number;
  isActive: boolean;
}

function LyricsCard({ text, time = null, isActive, index }: LyricsCardProps) {
  const songDuration = song.use((s) => s.duration);
  const cardRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (isActive) {
      requestAnimationFrame(() => {
        cardRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      });
    }
  }, [isActive]);

  //   useEffect(() => {
  //     const handleLyricsAdjustKeys = (e: KeyboardEvent) => {
  //       if(e.key === "ArrowLeft") {
  //         e.preventDefault();
  //         adjustLyricTimeStamp(-.05);
  //       } else if(e.key === "ArrowRight") {
  //         e.preventDefault();
  //         adjustLyricTimeStamp(.05)
  //       }
  //     }

  //     document.addEventListener('keydown', handleLyricsAdjustKeys);

  //     return () => document.removeEventListener('keydown', handleLyricsAdjustKeys);
  //   }, []);

  const round2 = (n: number) => Math.round(n * 100) / 100;

  const adjustLyricTimeStamp = (number: number) => {
    if(time) {
      const lineTime = time;
  
      const target = Math.min(songDuration, Math.max(0, round2(time + number)));
      const delta = round2(target - lineTime);
  
      if (delta === 0) return;
  
      lyrics.adjustLine(index, delta);
      song.seek(target);
    }
  };

  return (
    <div
      ref={cardRef}
      className={`min-h-15 flex items-center justify-between px-2 py-4 bg-white border-2 rounded-sm duration-300 ease-in-out ${isActive ? " border-zinc-400" : "border-zinc-50"} hover:bg-zinc-100`}
    >
      <div>
        <p className="text-sm font-semibold">{text}</p>
      </div>
      <div>
        {(time !== null || time == 0) ? (
          <ButtonGroup>
            <Button
              onClick={() => adjustLyricTimeStamp(-0.05)}
              variant="secondary"
            >
              <HugeiconsIcon icon={ArrowLeft} />
            </Button>
            <Button variant="ghost" disabled>
              <p>{formatLrcTime(time)}</p>
            </Button>
            <Button
              onClick={() => adjustLyricTimeStamp(0.05)}
              variant="secondary"
            >
              <HugeiconsIcon icon={ArrowRight} />
            </Button>
          </ButtonGroup>
        ): (
          <div className="w-34"></div>
        )}
      </div>
    </div>
  );
}

function SyncControls() {
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
  }

  const moveToPrevLine = () => {
    lyrics.prev();
  }

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if(e.key === "2" || e.code == "Numpad2") {
        e.preventDefault();
        moveToNextLine();
      } else if(e.key == "5" || e.code == "Numpad5") {
        e.preventDefault();
        moveToPrevLine();
      }
    }

    document.addEventListener('keydown', handleKeyPress);

    return () => document.removeEventListener('keydown', handleKeyPress);
  }, []);

  return (
    <div className="absolute -top-14 left-1/2 -translate-1/2 z-1">
      <Card className="rounded-sm border-zinc-200 shadow-xl">
        <CardContent className="gap-y-4">
          <div className="flex items-center justify-center">
            <LyricUtils />
          </div>
          <div className="h-2"></div>
          <ButtonGroup className="mx-auto">
            <Button
              disabled={atStart}
              onClick={moveToPrevLine}
              className="px-14 py-6 rounded-sm"
            >
              <HugeiconsIcon className="size-6" icon={ArrowUp01Icon} />
            </Button>
            <ButtonGroupSeparator />
            <Button
              onClick={moveToNextLine}
              className="px-14 py-6 rounded-sm"
            >
              <HugeiconsIcon className="size-6" icon={ArrowDown01Icon} />
            </Button>
          </ButtonGroup>
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
