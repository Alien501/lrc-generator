import { useNavStore } from "../../store/useNavStore";
import LyricsInputContainer from "../LyricsInputContainer/LyricsInputContainer";
import SyncContainer from "../SyncContainer/SyncContainer";

const LineByLine = () => {
    const currentTab = useNavStore(state => state.currentTab);

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