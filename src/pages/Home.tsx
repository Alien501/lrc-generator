import LyricsInputContainer from "../components/LyricsInputContainer/LyricsInputContainer";
import MusicBar from "../components/MusicBar/MusicBar";
import Navbar from "../components/Navbar/NavBar";
import SyncContainer from "../components/SyncContainer/SyncContainer";
import TabContainer from "../components/TabContainer/TabContainer";
import TopBar from "../components/TopBar/TopBar";
import { useNavStore } from "../store/useNavStore";

const HomePage = () => {
    const currentTab = useNavStore((state) => state.currentTab);

    return(
        <div className="grid grid-rows-[70px_50px_100%_10%]">
            <TopBar />
            <Navbar />
            <TabContainer>
                {
                    currentTab == 'lyrics'?
                    <LyricsInputContainer />
                    :
                    <SyncContainer />
                }
            </TabContainer>
            <MusicBar />
        </div>
    )
};

export default HomePage;