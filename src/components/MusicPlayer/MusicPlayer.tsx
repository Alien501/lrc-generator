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
import { useEffect } from "react";

export default function MusicPlayer() {
  // TODO: Track Numlock status
  // const [isNumLockOn, setIsNumLockOn] = useState<boolean>(false);
  const playing = song.use((s) => s.playing);
  const songDuration = song.use((s) => s.duration);
  const currentTimeStamp = song.use((s) => s.position);
  const progress = song.use((s) =>
    s.duration ? (s.position / s.duration) * 100 : 0,
  );

  const handleSeek = (e?: React.MouseEvent<HTMLDivElement>, moveTimeline?: number) => {
    if(e) {
      const bar = e.currentTarget;
      if (!bar) return;
  
      const rect = bar.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const percent = Math.min(Math.max(clickX / rect.width, 0), 1);
      song.seek(percent * songDuration);
    } else {
      if(moveTimeline) {
        song.seek(moveTimeline);
      }
    }
  };

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
      <div className="w-full gap-y-2 flex flex-col">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium text-muted-foreground">{formatClock(songDuration)}</p>
          <p className="text-xs font-medium text-muted-foreground">{formatClock(currentTimeStamp)}</p>
        </div>
        <div>
          <Progress
            onClick={handleSeek}
            value={progress}
            className="hover:scale-y-150 duration-150 *:data-[slot=progress-track]:bg-zinc-200"
          />
        </div>
      </div>
      <div className="flex items-center gap-x-1">
        <Button onClick={() => song.seek(Math.max(currentTimeStamp - 5, 0))} variant="secondary" className="rounded-full size-8">
          <HugeiconsIcon icon={GoBackward5SecIcon} />
        </Button>
        <Button onClick={() => song.seek(Math.min(songDuration, currentTimeStamp + 5))} variant="secondary" className="rounded-full size-8">
          <HugeiconsIcon icon={GoForward5SecIcon} />
        </Button>
      </div>
    </div>
  );
}
