import { useLyricsStore } from "../../store/useLyricsStore";
import { useMusicStore } from "../../store/useMusicStore";
import { ChevronDownIcon, ChevronUpIcon } from "../icons/icons";
import LyricsCard from "../LyricsCard/LyricsCard";

const SyncControls = () => {
    const controlsState = useMusicStore((state) => state.controlsState);
    const currentlyActiveCard = useLyricsStore((state) => state.currentlyActiveCard);
    const setCurrentlyActiveCard = useLyricsStore((state) => state.setCurrentlyActiveCard);
    const revertTimestamp = useLyricsStore((state) => state.revertTimestamp);
    const lyricsLength = useLyricsStore((state) => state.syncedLyrics.length)
    const handleUpClick = () => {
        if (currentlyActiveCard > 0) {
            revertTimestamp(currentlyActiveCard);
            setCurrentlyActiveCard(currentlyActiveCard - 1);
        }
    };

    const handleDownClick = () => {
        if(currentlyActiveCard + 1 > lyricsLength) {
            console.log("End");
        }else{
            setCurrentlyActiveCard(currentlyActiveCard + 1);
        }
    };

    return (
        <div className={`absolute border shadow-up transition-all flex items-center justify-center ${
            controlsState ? 'bottom-[130px]' : 'bottom-[82px]'
        } left-0 right-0 w-full h-16 bg-white shadow-md`}>
            <div className="h-full space-x-2 text-white flex items-center justify-between">
                <button 
                    onKeyDown={(e) => console.log(e)}
                    onClick={handleUpClick}
                    disabled={currentlyActiveCard === 0}
                    className={`h-14 w-28 bg-black hover:bg-black/70 active:scale-[.9] transition-all duration-200 flex rounded-md items-center justify-center ${
                        currentlyActiveCard === 0 ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                >
                    <ChevronUpIcon />
                </button>
                <button 
                    onClick={handleDownClick}
                    className="h-14 w-28 bg-black hover:bg-black/70 active:scale-[.9] transition-all duration-200 flex rounded-md items-center justify-center"
                >
                    <ChevronDownIcon />
                </button>
            </div>
        </div>
    );
};

const SyncContainer = () => {
    const lyrics = useLyricsStore((state) => state.syncedLyrics);

    return (
        <div id="sync-container" className="h-full md:w-[90%] sm:w-[99%] mx-auto">
            <LyricsCard
                key={0}
                lyrics=""
                id={0}
            />
            {lyrics.map((lyric, i) => (
                <LyricsCard
                    key={i + 1}
                    id={i + 1}
                    lyrics={lyric.lyrics}
                    timestamp={lyric.timestamp}
                    isSynced={lyric.isSynced}
                />
            ))}
            <SyncControls />
        </div>
    );
};

export default SyncContainer;