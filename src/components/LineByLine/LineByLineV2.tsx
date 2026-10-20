import {
  ArrowDown01Icon,
  ArrowLeft,
  ArrowLeft02FreeIcons,
  ArrowRight,
  ArrowUp01Icon,
  Download02Icon,
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

export default function LineByLineV2() {
  const navigate = useNavigate();
  const songName = song.baseName;
  const lines = lyrics.use((l) => l.lines);
  const activeLine = lyrics.use((l) => l.activeLine);

  return (
    <div className="h-screen overflow-hidden grid grid-rows-[80px_1fr_80px] ">
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
              <Button className="rounded-sm">
                <HugeiconsIcon icon={Download02Icon} />
                Save
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="bg-zinc-100 overflow-y-scroll">
        <div className="w-[80%] mx-auto h-full m-2">
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
  const cardRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (isActive) {
      requestAnimationFrame(() => {
        console.log("req");
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

  const adjustLyricTimeStamp = (number: number) => {
        if(time) {
            lyrics.adjustLine(index, number);
            song.seek(time + number);
        }
  }

  return (
    <div
      ref={cardRef}
      className={`min-h-15 flex items-center justify-between px-2 bg-white border-2 rounded-sm duration-300 ease-in-out ${isActive ? " border-zinc-400" : "border-zinc-50"} hover:bg-zinc-100`}
    >
      <div>
        <p className="text-sm font-medium">{text}</p>
      </div>
      <div>
        {time && (
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

  return (
    <div className="absolute -top-1/3 left-1/2 -translate-1/2 z-1">
      <Card className="rounded-sm border-zinc-200 shadow-xl">
        <CardContent>
          <ButtonGroup>
            <Button
              disabled={atStart}
              onClick={lyrics.prev}
              className="px-14 py-6 rounded-sm"
            >
              <HugeiconsIcon className="size-6" icon={ArrowUp01Icon} />
            </Button>
            <ButtonGroupSeparator></ButtonGroupSeparator>
            <Button
              onClick={() => lyrics.next(song.currentTime)}
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
