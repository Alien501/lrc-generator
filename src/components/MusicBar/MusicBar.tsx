import { song, ui } from "@/models";
import { ChevronDownIcon, ChevronUpIcon, FastBackwardIcon, FastForwardIcon, PauseIcon, PlayIcon } from "../icons/icons";

const SKIP_SECONDS = 3;

const PlayerControls = () => (
    <div className="h-12 bg-white w-full flex justify-end transition-all duration-150">
        <div className="flex items-center space-x-2">
            <button onClick={() => song.skip(-SKIP_SECONDS)} className="rounded-full hover:bg-slate-100/90 h-8 w-8 flex items-center justify-center">
                <FastBackwardIcon />
            </button>
            <button onClick={() => song.skip(SKIP_SECONDS)} className="rounded-full hover:bg-slate-100/90 h-8 w-8 flex items-center justify-center">
                <FastForwardIcon />
            </button>
        </div>
    </div>
);

export default function MusicBar() {
    const hasSong = song.use((s) => s.file !== null);
    const playing = song.use((s) => s.playing);
    const position = song.use((s) => s.position);
    const duration = song.use((s) => s.duration);
    const expanded = ui.use((s) => s.playerExpanded);

    const percentage = duration ? (position / duration) * 100 : 0;

    return (
        <div className="fixed bottom-0 w-full border-t border-t-black/10">
            {expanded && <PlayerControls />}
            <div className="bg-white w-full h-20 grid grid-cols-[10%_80%_10%] place-content-center place-items-center shadow-sm">
                <div className="flex items-center justify-center">
                    <button
                        onClick={song.toggle}
                        className={`rounded-full hover:bg-slate-100/90 h-8 w-8 flex items-center justify-center ${!hasSong ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={!hasSong}
                    >
                        {playing ? <PauseIcon /> : <PlayIcon />}
                    </button>
                </div>
                <div className="w-[95%]">
                    <input
                        type="range"
                        className="w-full accent-black"
                        min={0}
                        max={duration || 100}
                        value={position}
                        onChange={(e) => song.seek(parseFloat(e.target.value))}
                        disabled={!hasSong}
                        style={{ background: `linear-gradient(to right, black 0%, black ${percentage}%, #4B5563 ${percentage}%, #4B5563 100%)` }}
                    />
                </div>
                <div className="flex items-center justify-center">
                    <button
                        onClick={ui.togglePlayer}
                        className="rounded-full hover:bg-slate-100/90 h-8 w-8 flex items-center justify-center"
                    >
                        {expanded ? <ChevronDownIcon /> : <ChevronUpIcon />}
                    </button>
                </div>
            </div>
        </div>
    );
}
