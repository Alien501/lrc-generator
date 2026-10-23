import { Button } from "../ui/button";
// import { PlayIcon } from "@hugeicons/core-free-icons";
import { Progress } from "../ui/progress";
import { song } from "@/models";
import { PauseIcon, PlayIcon } from "../icons/icons";
import { formatClock } from "@/lib/time";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  GoBackward5SecIcon,
  GoForward5SecIcon,
} from "@hugeicons/core-free-icons";
import { useEffect, useRef, useState } from "react";
import { ButtonGroup } from "../ui/button-group";
import { Toggle } from "../ui/toggle";

export default function MusicPlayer() {
  // TODO: Track Numlock status
  // const [isNumLockOn, setIsNumLockOn] = useState<boolean>(false);
  const playing = song.use((s) => s.playing);
  const songDuration = song.use((s) => s.duration);
  const currentTimeStamp = song.use((s) => s.position);
  const progress = song.use((s) =>
    s.duration ? (s.position / s.duration) * 100 : 0,
  );

  const barRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragPercent, setDragPercent] = useState<number>(0);

  const getPercent = (clientX: number) => {
    const rect = barRef.current?.getBoundingClientRect();
    if (!rect || !rect.width) return 0;
    return Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1) * 100;
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDragging(true);
    setDragPercent(getPercent(e.clientX));
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    setDragPercent(getPercent(e.clientX));
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    song.seek((getPercent(e.clientX) / 100) * songDuration);
    setIsDragging(false);
  };

  const displayProgress = isDragging ? dragPercent : progress;
  const displayTime = isDragging
    ? (dragPercent / 100) * songDuration
    : currentTimeStamp;

  useEffect(() => {
    const handleMusicControlsKey = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === "0") {
        e.preventDefault();
        song.toggle();
      }
    };

    const handleMusicTimeline = (e: KeyboardEvent) => {
      const { position, duration } = song.getState();

      if (e.key === "1" || e.code === "Numpad1") {
        e.preventDefault();
        song.seek(Math.max(position - 5, 0));
      } else if (e.key === "3" || e.code === "Numpad3") {
        e.preventDefault();
        song.seek(Math.min(duration, position + 5));
      }
    };

    document.addEventListener("keydown", handleMusicControlsKey);
    document.addEventListener("keydown", handleMusicTimeline);

    return () => {
      document.removeEventListener("keydown", handleMusicControlsKey);
      document.removeEventListener("keydown", handleMusicTimeline);
    };
  }, [song]);

  return (
    <div className="flex items-center gap-x-2 w-82 px-4 py-2">
      <div>
        <Button
          onClick={song.toggle}
          variant="secondary"
          className="rounded-full size-8"
        >
          {playing ? <PauseIcon /> : <PlayIcon />}
        </Button>
      </div>
      <div className="w-full gap-y-0.5 flex flex-col">
        <div
          ref={barRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={() => setIsDragging(false)}
          className="relative py-1.5 mt-4 cursor-pointer touch-none"
        >
          <Progress
            value={displayProgress}
            className="hover:scale-y-150 duration-150 *:data-[slot=progress-track]:bg-zinc-200"
          />
          <div
            className="absolute top-1/2 h-3 w-1 bg-primary -translate-x-1/2 -translate-y-1/2 rounded-sm shadow pointer-events-none"
            style={{ left: `${displayProgress}%` }}
          />
        </div>
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium text-muted-foreground">{formatClock(displayTime)}</p>
          <p className="text-xs font-medium text-muted-foreground">{formatClock(songDuration)}</p>
        </div>
      </div>
      <div className="flex items-center gap-x-1">
        <ButtonGroup>
          <Button onClick={() => song.seek(Math.max(currentTimeStamp - 5, 0))} variant="secondary" className="size-8">
            <HugeiconsIcon icon={GoBackward5SecIcon} />
          </Button>
          <Button onClick={() => song.seek(Math.min(songDuration, currentTimeStamp + 5))} variant="secondary" className="rounded- size-8">
            <HugeiconsIcon icon={GoForward5SecIcon} />
          </Button>
        </ButtonGroup>
        <Toggle variant="default" onPressedChange={(e) => {
          if(e) {
            song.setPlaybackRate(0.5);
          } else {
            song.setPlaybackRate(1);
          }
        }}>
          <p className="font-medium text-xs">0.5x</p>
        </Toggle>
      </div>
    </div>
  );
}