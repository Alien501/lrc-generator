import { useEffect } from "react";
import { lyrics, song, ui } from "@/models";
import { ChevronDownIcon, ChevronUpIcon } from "../icons/icons";
import LyricsCard from "../LyricsCard/LyricsCard";
import { Button } from "../ui/button";

const next = () => lyrics.next(song.currentTime);

const SyncControls = () => {
    const expanded = ui.use((s) => s.playerExpanded);
    const atStart = lyrics.use((s) => s.activeLine < 0);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowUp') {
                e.preventDefault();
                lyrics.prev();
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                next();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <div className={`absolute transition-all flex items-center justify-center border-t border-t-black/10 ${
            expanded ? 'bottom-[130px]' : 'bottom-[82px]'
        } left-0 right-0 w-full h-16 bg-white shadow-md`}>
            <div className="h-full space-x-2 text-white flex items-center justify-between">
                <Button
                    onClick={lyrics.prev}
                    disabled={atStart}
                    className={`h-14 w-28 p-0 bg-neutral-300 text-black active:scale-[.9] transition-all duration-200 flex rounded-md items-center justify-center ${
                        atStart ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                >
                    <ChevronUpIcon />
                </Button>
                <Button
                    onClick={next}
                    className="h-14 w-28 p-0 bg-black hover:bg-black/70 active:scale-[.9] transition-all duration-200 flex rounded-md items-center justify-center"
                >
                    <ChevronDownIcon />
                </Button>
            </div>
        </div>
    );
};

const SyncContainer = () => {
    const lines = lyrics.use((s) => s.lines);
    const activeLine = lyrics.use((s) => s.activeLine);

    return (
        <div id="sync-container" className="h-full md:w-[90%] sm:w-[99%] mx-auto">
            {/* Placeholder card, active before the first line is stamped */}
            <LyricsCard text="" isActive={activeLine === -1} />
            {lines.map((line, i) => (
                <LyricsCard
                    key={i}
                    text={line.text}
                    time={line.time}
                    isActive={activeLine === i}
                />
            ))}
            <SyncControls />
        </div>
    );
};

export default SyncContainer;
