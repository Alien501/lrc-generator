import { useNavStore } from "../../store/useNavStore"
import LyricsInputContainer from "../LyricsInputContainer/LyricsInputContainer";
import WordByWordSync from "./WordByWordSync";
import { useSEO } from "../../hooks/useSEO";

const WordByWord = () => {
    const currentTab = useNavStore(state => state.currentTab);
    
    useSEO({
        title: "Word-by-Word Lyrics Sync | LRC Generator - Ultra-Precise Lyrics Synchronization",
        description: "Achieve ultra-precise lyrics synchronization with word-by-word timing. Create professional LRC files with exact timing for each word. Perfect for detailed karaoke experiences.",
        keywords: "word by word lyrics sync, precise lyrics timing, LRC file creation, word sync tool, detailed karaoke lyrics, ultra-precise synchronization",
        url: "https://lrc-generator.vercel.app/word"
    });
    return(
        <>
            {
                currentTab == 'lyrics'?
                <LyricsInputContainer />
                :
                <WordByWordSync />
            }
        </>
    )
};

export default WordByWord;