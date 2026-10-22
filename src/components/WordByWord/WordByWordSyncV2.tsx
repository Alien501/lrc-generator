import { lyrics } from "@/models";
import SyncLayout from "../Layout/syncLayout";
import MusicBarV2 from "../MusicBar/MusicBarV2";
import TopBarV2 from "../TopBar/TopBarV2";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowDown01Icon, ArrowUp01Icon } from "@hugeicons/core-free-icons";
import { WordByWordControl } from "../SyncControls/SyncControls";

export default function WordByWordSyncV2() {
    return(
        <SyncLayout
            topBar={
                <TopBarV2 />
            }
            bottomBar={<MusicBarV2 control={<WordByWordControl />} />}
            mainContent={ <WordByWordLyricContainer /> }
        />
    )
}

// Kind of complex bruh
function WordByWordLyricContainer() {
    // stuff needed
    // Lyrics
    // Active line
    // 
    const lines = lyrics.use((l) => l.lines);
    const activeLine = lyrics.use((l) => l.activeLine);
    const activeWord = lyrics.use((l) => l.activeWord);

    const prevLine = activeLine == -1 ? null :lines[activeLine-1]; 
    const mainLine = activeLine == -1 ? lines[0]: lines[activeLine];
    const nextLine = activeLine == (lines.length-1) ? null :lines[activeLine+1]; 

    console.log(activeLine, activeWord)
    return(
        <div className="relative h-full flex items-center justify-center">
            {/* Lyrics - Scrollable inside container - activeLine -> current center lyrics - Overflow Y - visible */}
            <div>
                <div className="bg-red-300 w-[320px] h-[120px] p-4">
                    <p className="text-xl font-extrabold">{prevLine?.text}</p>
                </div>
                <Card className="w-[320px] min-h-[120px] py-0 px-1 rounded-sm shadow-xs">
                    <CardContent>
                        <Button
                            className="w-full rounded-xs" variant="ghost"
                        >
                            <HugeiconsIcon
                                icon={
                                    ArrowUp01Icon
                                }
                                className="size-4"
                            />
                        </Button>
                        <div className="">
                            <p className="text-xl font-extrabold">{mainLine.text}</p>
                        </div>
                        <Button
                            className="w-full rounded-xs" variant="ghost"
                        >
                            <HugeiconsIcon
                                icon={
                                    ArrowDown01Icon
                                }
                                className="size-4"
                            />
                        </Button>
                    </CardContent>
                </Card>
                <div className="bg-yellow-500 w-[320px] h-[120px] p-4">
                    <p className="text-xl font-extrabold">{nextLine?.text}</p>
                </div>
            </div>
        </div>
    )
}