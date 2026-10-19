import { PlayIcon } from "@/components/icons/icons";
import OptionMenu from "@/components/OptionMenu/OptionMenu";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useMusicStore } from "@/store/useMusicStore";

export function MainPage() {
  const { selectedFile, setSelectedFile, setAudioUrl } = useMusicStore();

  const onSongSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (!files || files.length == 0) return;

    const file = files[0];
    const audioURL = URL.createObjectURL(file);

    setSelectedFile(file);
    setAudioUrl(audioURL);
  };

  return (
    <div className="h-screen overflow-hidden flex justify-center items-center">
      <div className="relative">
        <div className={`absolute z-0  left-1/2 -translate-1/2 transition-[top] duration-500 ease-in-out ${selectedFile ? "-top-[12%]": "top-[40%]"}`}>
            <SongPlayer
                songName={selectedFile? selectedFile.name.trim():"Song name..."}
            />
        </div>
        <div className="relative z-10 min-h-[40px] w-[400px] rounded-sm bg-white border-1 border-zinc-200 px-2 py-4 shadow-sm flex flex-col gap-y-4">
          <OptionMenu
            label="Select Song"
            ctaText="Upload Song"
            id="upload-song"
            inputType="file"
            fileType="audio/*"
            onClick={onSongSelected}
          />
          <Separator />
          <OptionMenu
            id="upload-lrc"
            label="Sync Lyrics?"
            ctaText="Upload LRC"
          />
        </div>
      </div>
    </div>
  );
}

function SongPlayer({
    songName
}: {
    songName: string;
}) {
    const {} = useMusicStore();
  return (
    <div className="w-[360px] bg-zinc-50 border-1 border-zinc-200 rounded-sm p-2 flex items-center gap-x-2 pb-8">
      <Button variant="ghost">
        <PlayIcon />
      </Button>
      <div className="flex flex-col gap-y-2 w-[300px]">
        <div className="w-[100%] overflow-hidden [mask-image:linear-gradient(to_right,black_75%,transparent)] animate-in">
            <p className="text-xs font-medium">{songName}</p>
        </div>
        <Progress value={100} />
      </div>
    </div>
  );
}
