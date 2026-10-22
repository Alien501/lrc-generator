import { PauseIcon, PlayIcon } from "@/components/icons/icons";
import LyricInput from "@/components/LyricInput/LyricInput";
import OptionMenu from "@/components/OptionMenu/OptionMenu";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { lyrics, song } from "@/models";
import { useNavigate } from "react-router-dom";

export function MainPage() {
  const hasSong = song.use((s) => s.file !== null);
  const hasLyrics = lyrics.use((l) => l.text.trim().length > 0 );
  const router = useNavigate();

  const onSongSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) song.load(file);
  };

  return (
    <div className="h-dvh relative overflow-hidden flex justify-center items-center flex-col gap-y-4 bg-zinc-100 max-h-[90%]">
      <div className="relative">
        <div className={`absolute z-0  left-1/2 -translate-1/2 transition-[top] duration-500 ease-in-out ${hasSong ? "top-[-12%]": "top-[40%]"}`}>
            <SongPlayer />
        </div>
        <div className="relative z-10 min-h-10 w-85 rounded-sm bg-white border border-zinc-200 px-2 py-4 shadow-sm flex flex-col gap-y-4">
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
        <div className={`overflow-hidden duration-300 ${hasSong? 'h-95': 'h-0'} max-h-96`}>
          <LyricInput />
        </div>
      }
      {
        <Card className={`rounded-sm bg-white border border-zinc-200 shadow-xs p-2 absolute z-10 left-1/2 -translate-1/2 ease-in-out duration-300 ${hasLyrics ? 'bottom-[-20px]': '-bottom-40'}`}>
          <CardContent>
            <p className="text-sm font-medium text-center mb-2 text-muted-foreground">Start Syncing</p>
            <ButtonGroup>
              <Button onClick={() => router('/line')} className="py-4 px-8 rounded-sm">
                Line-By-Line
              </Button>
              <Button onClick={() => router('/word')} className="py-4 px-8 rounded-sm">
                Word-By-Word
              </Button>
            </ButtonGroup>
          </CardContent>
        </Card>
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
    <div className="w-80 bg-zinc-50 border border-zinc-200 rounded-sm p-2 flex items-center gap-x-2 pb-8">
      <Button variant="ghost" onClick={song.toggle}>
        {playing ? <PauseIcon /> : <PlayIcon />}
      </Button>
      <div className="flex flex-col gap-y-2 w-65">
        <div className="w-full overflow-hidden mask-[linear-gradient(to_right,black_75%,transparent)] animate-in">
            <p className="text-xs font-medium text-nowrap">{name || "Song name..."}</p>
        </div>
        <Progress onClick={handleSeek} className="hover:scale-y-150 duration-150 *:data-[slot=progress-track]:bg-zinc-200" value={progress} />
      </div>
    </div>
  );
}
