import { PauseIcon, PlayIcon } from "@/components/icons/icons";
import LyricInput from "@/components/LyricInput/LyricInput";
import OptionMenu from "@/components/OptionMenu/OptionMenu";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { song } from "@/models";

export function MainPage() {
  const hasSong = song.use((s) => s.file !== null);

  const onSongSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) song.load(file);
  };

  return (
    <div className="h-screen overflow-hidden flex justify-center items-center flex-col gap-y-4 bg-zinc-100 max-h-[90%]">
      <div className="relative">
        <div className={`absolute z-0  left-1/2 -translate-1/2 transition-[top] duration-500 ease-in-out ${hasSong ? "top-[-12%]": "top-[40%]"}`}>
            <SongPlayer />
        </div>
        <div className="relative z-10 min-h-10 w-100 rounded-sm bg-white border border-zinc-200 px-2 py-4 shadow-sm flex flex-col gap-y-4">
          <OptionMenu
            label={hasSong? "Not this one?": "Select Song"}
            ctaText={hasSong? "Change Song": "Upload Song"}
            id="upload-song"
            inputType="file"
            fileType="audio/*"
            onClick={onSongSelected}
          />
          <Separator />
          <OptionMenu
            disabled
            id="upload-lrc"
            label="Sync Lyrics?"
            ctaText="Upload LRC"
          />
        </div>
      </div>
      {
        <div className={`overflow-hidden duration-300 ${hasSong? 'h-[380px]': 'h-0'} max-h-[384px]`}>
          <LyricInput />
        </div>
      }
    </div>
  );
}

function SongPlayer() {
  const name = song.use(() => song.name);
  const playing = song.use((s) => s.playing);
  const songDuration = song.use((s) => s.duration);
  const progress = song.use((s) => (s.duration ? (s.position / s.duration) * 100 : 0));

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const bar = e.currentTarget;
    if(!bar) return;

    const rect = bar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;

    const percent = Math.min(Math.max(clickX/rect.width, 0), 1);
    song.seek(percent * songDuration);
  }

  return (
    <div className="w-90 bg-zinc-50 border border-zinc-200 rounded-sm p-2 flex items-center gap-x-2 pb-8">
      <Button variant="ghost" onClick={song.toggle}>
        {playing ? <PauseIcon /> : <PlayIcon />}
      </Button>
      <div className="flex flex-col gap-y-2 w-75">
        <div className="w-full overflow-hidden mask-[linear-gradient(to_right,black_75%,transparent)] animate-in">
            <p className="text-xs font-medium text-nowrap">{name || "Song name..."}</p>
        </div>
        <Progress onClick={handleSeek} className="hover:scale-y-150 duration-150 *:data-[slot=progress-track]:bg-zinc-200" value={progress} />
      </div>
    </div>
  );
}
