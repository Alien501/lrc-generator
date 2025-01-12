import { useNavStore } from "../../store/useNavStore"
import LyricsInputContainer from "../LyricsInputContainer/LyricsInputContainer";

const WordByWord = () => {
    const currentTab = useNavStore(state => state.currentTab);
    return(
        <>
            {
                currentTab == 'lyrics'?
                <LyricsInputContainer />
                :
                <p>Word By Word Sync goes here...</p>
            }
        </>
    )
};

export default WordByWord;