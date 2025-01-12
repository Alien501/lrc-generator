import { useNavStore } from "../../store/useNavStore"
import LyricsInputContainer from "../LyricsInputContainer/LyricsInputContainer";
import WordByWordSync from "./WordByWordSync";

const WordByWord = () => {
    const currentTab = useNavStore(state => state.currentTab);
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