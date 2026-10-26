import { lyrics, song } from "@/models";
import { useEffect, useRef } from "react";
import { ButtonGroup } from "../ui/button-group";
import { Button } from "../ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft, ArrowRight } from "@hugeicons/core-free-icons";
import { formatLrcTime } from "@/lib/time";

interface LyricsCardProps {
  text: string;
  time?: number | null;
  index: number;
  isActive: boolean;
}

export default function LyricsCardV2({ text, time = null, isActive, index }: LyricsCardProps) {
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

  const onCardClicked = () => {
    if(time) {
      // Just a workaround - Enough for now ig
      lyrics.adjustLine(index, 0);
      song.seek(time);
    };
  }

  return (
    <div
      onClick={onCardClicked}
      ref={cardRef}
      className={`hover:cursor-pointer min-h-15 flex items-center justify-between px-2 py-4 bg-white border-2 rounded-sm duration-300 ease-in-out ${isActive ? " border-zinc-400" : "border-zinc-50"} hover:bg-zinc-100`}
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