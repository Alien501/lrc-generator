import { useNavStore } from "../../store/useNavStore";
import LyricsInputContainer from "../LyricsInputContainer/LyricsInputContainer";
import SyncContainer from "../SyncContainer/SyncContainer";
import { useSEO } from "../../hooks/useSEO";

const LineByLine = () => {
    const currentTab = useNavStore(state => state.currentTab);
    
    useSEO({
        title: "Line-by-Line Lyrics Sync | LRC Generator - Professional Lyrics Synchronization",
        description: "Synchronize your lyrics line by line with audio playback. Create professional LRC files with precise timing for each line. Perfect for karaoke and music players.",
        keywords: "line by line lyrics sync, LRC file creation, lyrics synchronization, karaoke lyrics, music player lyrics, line sync tool",
        url: "https://lrc-gen.alien501.in//line"
    });

    return (
        <>
            {
                currentTab == 'lyrics' ?
                    <LyricsInputContainer />
                    :
                    <SyncContainer />
            }
        </>
    )
}

export default LineByLine;