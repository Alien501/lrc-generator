import { useEffect, useRef } from "react";
import { useLyricsStore } from "../../store/useLyricsStore";
import { useMusicStore } from "../../store/useMusicStore";
import { ChevronDownIcon, ChevronUpIcon } from "../icons/icons";
import LyricsCard from "../LyricsCard/LyricsCard";
import { Button } from "../ui/button";

const SyncControls = () => {
    const controlsState = useMusicStore((state) => state.controlsState);
    const currentlyActiveCard = useLyricsStore((state) => state.currentlyActiveCard);
    const setCurrentlyActiveCard = useLyricsStore((state) => state.setCurrentlyActiveCard);
    const revertTimestamp = useLyricsStore((state) => state.revertTimestamp);
    const lyricsLength = useLyricsStore((state) => state.syncedLyrics.length)
    const upButtonRef = useRef<HTMLButtonElement | null>(null);
    const downButtonRef = useRef<HTMLButtonElement | null>(null);
    const handleUpClick = () => {
        if (currentlyActiveCard > 0) {
            revertTimestamp(currentlyActiveCard);
            setCurrentlyActiveCard(currentlyActiveCard - 1);
        }
    };

    const handleDownClick = () => {
        if(currentlyActiveCard + 1 > lyricsLength) {
            // console.log("End");
        }else{
            setCurrentlyActiveCard(currentlyActiveCard + 1);
        }
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowUp') {
                e.preventDefault();
                handleUpClick();
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                handleDownClick();
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [currentlyActiveCard, lyricsLength]);

    return (
        <div className={`absolute transition-all flex items-center justify-center border-t border-t-black/10 ${
            controlsState ? 'bottom-[130px]' : 'bottom-[82px]'
        } left-0 right-0 w-full h-16 bg-white shadow-md`}>
            <div className="h-full space-x-2 text-white flex items-center justify-between">
                <Button 
                    ref={upButtonRef}
                    onClick={handleUpClick}
                    disabled={currentlyActiveCard === 0}
                    className={`h-14 w-28 p-0 bg-neutral-300 text-black active:scale-[.9] transition-all duration-200 flex rounded-md items-center justify-center ${
                        currentlyActiveCard === 0 ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                >
                    <ChevronUpIcon />
                </Button>
                <Button 
                    ref={downButtonRef}
                    onClick={handleDownClick}
                    className="h-14 w-28 p-0 bg-black hover:bg-black/70 active:scale-[.9] transition-all duration-200 flex rounded-md items-center justify-center"
                >
                    <ChevronDownIcon />
                </Button>
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
                timestamp={0}
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