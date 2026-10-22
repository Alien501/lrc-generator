import { useState, FormEvent, ChangeEvent, useId } from "react";
import { lyrics, resetSession, song } from "@/models";
import { buildLrc, downloadText, type LrcMeta } from "@/lib/lrc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { copyToClipboard } from "@/lib/utils";

const fields: {
  name: keyof LrcMeta;
  label: string;
  placeholder: string;
  required?: boolean;
}[] = [
  {
    name: "title",
    label: "Title",
    placeholder: "Enter track title",
    required: true,
  },
  { name: "artist", label: "Artist", placeholder: "Enter artist name" },
  { name: "album", label: "Album", placeholder: "Enter album name" },
  { name: "lyricist", label: "Lyricist", placeholder: "Enter lyricist name" },
  {
    name: "length",
    label: "Length",
    placeholder: "Enter song length (e.g., 3:45)",
  },
  { name: "by", label: "By", placeholder: "Enter 'by' information" },
];

const SaveCard = ({ trigger }: { trigger: React.JSX.Element }) => {
  const formId = useId();
  const songName = song.baseName;
  const songDuration = song.use((s) => s.duration);

  const [meta, setMeta] = useState<LrcMeta>({
    title: songName || "",
    artist: "",
    album: "",
    lyricist: "",
    length: songDuration.toString() || "",
    by: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMeta({ ...meta, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { lines, mode } = lyrics.getState();
    const fileName = `${song.baseName || "lyrics"}.lrc`;
    downloadText(buildLrc(lines, mode, meta), fileName);
  };

  const onSyncAnother = () => {
    resetSession();
    window.location.pathname = "/";
  };

  const onCopy = () => {
    const { lines, mode } = lyrics.getState();
    const lrcContent = buildLrc(lines, mode, meta);
    copyToClipboard(lrcContent);
  }

  return (
    <Dialog>
      <DialogTrigger>{trigger}</DialogTrigger>

      <DialogContent className="rounded-sm">
        <DialogHeader>
          <DialogTitle>Save/Download</DialogTitle>
        </DialogHeader>

        <form id={formId} onSubmit={handleSubmit} className="space-y-4">
          {fields.map((field) => (
            <div key={field.name} className="grid gap-2">
              <Label htmlFor={field.name}>{field.label}</Label>
              <Input
                required={field.required}
                id={field.name}
                name={field.name}
                type="text"
                placeholder={field.placeholder}
                value={meta[field.name]}
                onChange={handleChange}
                className="rounded-sm"
              />
            </div>
          ))}
        </form>

        <DialogFooter className="!flex-row items-center justify-between gap-2 sm:justify-between border-t-2 border-t-zinc-200 pt-2">
        <Button onClick={onCopy} type="button" variant="secondary" className="rounded-sm">
            Copy
        </Button>

        <div className="flex items-center gap-2">
            <Button type="submit" form={formId} className="rounded-sm">
            Save
            </Button>
            <Button type="button" variant="outline" className="rounded-sm" onClick={onSyncAnother}>
            Sync Another!
            </Button>
        </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SaveCard;
