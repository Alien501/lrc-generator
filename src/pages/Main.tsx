import AboutCard from "@/components/AboutCard/AboutCard";
import { PauseIcon, PlayIcon } from "@/components/icons/icons";
import LyricInput from "@/components/LyricInput/LyricInput";
import OptionMenu from "@/components/OptionMenu/OptionMenu";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useSEO } from "@/hooks/useSEO";
import { lyrics, song } from "@/models";
import { AlertCircleIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useNavigate } from "react-router-dom";

export function MainPage() {
  const hasSong = song.use((s) => s.file !== null);
  const hasLyrics = lyrics.use((l) => l.text.trim().length > 0 );
  const router = useNavigate();

  const onSongSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) song.load(file);
  };

useSEO({
  title:
    "LRC Generator - Free Word-by-Word & Line-by-Line Lyrics Sync | Karaoke Maker",
  description:
    "Free online LRC generator with word-by-word and line-by-line sync. Create enhanced LRC files for karaoke, lyric videos, and music players. Supports instrumental sections, duplicate lines, keyboard shortcuts, and full accessibility – no install needed.",
  keywords: [
    // Primary
    "LRC generator",
    "LRC maker",
    "lyrics sync",
    // Mode-specific
    "word by word LRC",
    "line by line LRC",
    "enhanced LRC generator",
    "karaoke lyrics sync",
    // Feature-specific
    "LRC generator with instrumental",
    "duplicate lyric lines",
    "LRC editor keyboard shortcuts",
    "accessible lyrics synchronizer",
    // Long-tail / intent
    "free online LRC tool",
    "create LRC file without install",
    "sync lyrics to music online",
    "karaoke subtitle maker",
  ].join(", "),
  url: "https://lrc-gen.alien501.in/menu",
});

  return (
    <div className="h-dvh relative overflow-hidden flex justify-center items-center flex-col gap-y-4 bg-zinc-100 max-h-[90%]">
      <Card className="absolute left-1/2 top-5 -translate-1/2 w-[95%] sm:w-[80%] h-16 bg-white border-zinc-200 rounded-bl-md rounded-br-md shadow-sm">
        <CardContent className="flex flex-col justify-end">
          <div className="mt-2 flex flex-row items-center justify-between">
            <p className="text-lg font-semibold">LRC Generator</p>
            <AboutCard
                trigger={
                  <Button className="rounded-sm" variant="secondary">
                    <HugeiconsIcon icon={AlertCircleIcon} />
                  </Button>
                }
              />
          </div>
        </CardContent>
      </Card>
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
