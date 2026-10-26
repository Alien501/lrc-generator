import { lyrics, song } from "@/models";
import { Button } from "../ui/button";
import { ButtonGroup } from "../ui/button-group";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Textarea } from "../ui/textarea";
import { copyToClipboard, readFromClipboard } from "@/lib/utils";

export default function LyricInput() {
    const searchForLyricsOnline = () => song.searchForLyricsOnline();
    const lyricsText = lyrics.use((s) => s.text);
    const uploadedFile = lyrics.use((l) => l.uploadedFile);

    const pasteFromClipboard = async () => {
        if(uploadedFile) {
            // Pasting From Clipboard - Override file Content
            lyrics.unload();
        }
        const content = await readFromClipboard();
        onLyricsChange(content);
    }

    const onLyricsChange = (text: string) => lyrics.setText(text);
    const disableButtons = lyricsText.trim().length == 0;

    return(
        <Card className="w-86 rounded-sm bg-white border border-zinc-200 shadow-none h-95 gap-y-2">
            <CardHeader className="flex justify-between items-center">
                <ButtonGroup className="rounded-sm">
                    <Button onClick={pasteFromClipboard} className="text-xs font-medium rounded-sm" variant="secondary">
                        Paste
                    </Button>
                    <Button disabled={disableButtons} onClick={() => copyToClipboard(lyricsText)} className="text-xs font-medium rounded-sm" variant="secondary">
                        Copy
                    </Button>
                    <Button disabled={disableButtons} onClick={() => {if(uploadedFile) lyrics.unload(); onLyricsChange('')}} className="text-xs font-medium rounded-sm" variant="destructive">
                        Clear
                    </Button>
                </ButtonGroup>
                <ButtonGroup>
                    <Button onClick={searchForLyricsOnline} className="text-xs font-medium rounded-sm" variant="default">
                        Search Online
                    </Button>
                </ButtonGroup>
            </CardHeader>
            <CardContent>
                <Textarea
                    onChange={(e) => onLyricsChange(e.target.value)}
                    value={lyricsText}
                    className="rounded-sm h-78"
                    placeholder="Enter Your Lyrics Here"
                />
            </CardContent>
        </Card>   
    )
}