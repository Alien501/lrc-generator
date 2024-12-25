// @ts-nocheck
import { useEffect, useRef, useState } from "react";
import { useMusicStore } from "../../store/useMusicStore";
import { ChevronDownIcon, ChevronUpIcon, FastBackwardIcon, FastForwardIcon, PauseIcon, PlayIcon } from "../icons/icons";
import { Howl } from "howler";

const PlayerControls = ({ sound, duration }) => {
    const handleForward = () => {
        if (sound) {
            const currentSeek = sound.seek();
            sound.seek(Math.min(currentSeek + 3, duration));
        }
    };

    const handleBackward = () => {
        if (sound) {
            const currentSeek = sound.seek();
            sound.seek(Math.max(currentSeek - 3, 0));
        }
    };

    return (
        <div className="h-12 bg-white w-full flex justify-end transition-all duration-150">
            <div className="flex items-center space-x-2">
                <button onClick={handleBackward} className="rounded-full hover:bg-slate-100/90 h-8 w-8 flex items-center justify-center">
                    <FastBackwardIcon />
                </button>
                <button onClick={handleForward} className="rounded-full hover:bg-slate-100/90 h-8 w-8 flex items-center justify-center">
                    <FastForwardIcon />
                </button>
            </div>
        </div>
    );
};

export default function MusicBar() {
    const { playerStatus, selectedFile, setPlayerStatus, controlsState, setControlsState, audioUrl, setCurrentTimeStamp } = useMusicStore();
    const [sound, setSound] = useState(null);
    const [seek, setSeek] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isLoaded, setIsLoaded] = useState(false);
    const requestRef = useRef();

    useEffect(() => {
        if (audioUrl) {
            if (sound) {
                sound.unload();
            }

            const newSound = new Howl({
                src: [audioUrl],
                html5: true,
                // format: selectedFile?.name.split('.')[2],
                onload: () => {
                    setDuration(newSound.duration());
                },
                onend: () => {
                    setPlayerStatus('play');
                    setSeek(0);
                },
                onseek: () => {
                    setSeek(newSound.seek());
                }
            });

            setSound(newSound);
            setIsLoaded(true);

            return () => {
                newSound.unload();
            };
        }
        console.log("Updated")
    }, [audioUrl, selectedFile]);

    const updateSeek = () => {
        if (sound && playerStatus === 'pause') {
            setSeek(sound.seek());
        }
        requestRef.current = requestAnimationFrame(updateSeek);
    };

    useEffect(() => {
        if (sound && playerStatus === 'pause') {
            const updateTimestamp = () => {
                const currentTime = sound.seek();
                setCurrentTimeStamp(currentTime);
                setSeek(currentTime);
                requestRef.current = requestAnimationFrame(updateTimestamp);
            };
            
            requestRef.current = requestAnimationFrame(updateTimestamp);
            return () => {
                cancelAnimationFrame(requestRef.current);
            };
        }
    }, [sound, playerStatus]);


    const onPlayButtonClicked = () => {
        if (!sound || !isLoaded) return;

        if (playerStatus === 'play') {
            sound.play();
            setPlayerStatus('pause');
        } else {
            sound.pause();
            setPlayerStatus('play');
        }
    };

    const handleSeekChange = (e) => {
        if (!sound) return;
        const value = parseFloat(e.target.value);
        sound.seek(value);
        setSeek(value);
    };

    const getProgressStyle = () => {
        if (!duration) return '0%';
        const percentage = (seek / duration) * 100;
        return `linear-gradient(to right, black 0%, black ${percentage}%, #4B5563 ${percentage}%, #4B5563 100%)`;
    };

    return (
        <div className="fixed bottom-0 w-full border">
            {controlsState && <PlayerControls sound={sound} seek={seek} duration={duration} />}
            <div className="bg-white w-full h-20 grid grid-cols-[10%_80%_10%] place-content-center place-items-center shadow-sm">
                <div className="flex items-center justify-center">
                    <button 
                        onClick={onPlayButtonClicked} 
                        className={`rounded-full hover:bg-slate-100/90 h-8 w-8 flex items-center justify-center ${!isLoaded ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={!isLoaded}
                    >
                        {playerStatus === 'play' ? <PlayIcon /> : <PauseIcon />}
                    </button>
                </div>
                <div className="w-[95%]">
                    <input
                        type="range"
                        className="w-full accent-black"
                        min={0}
                        max={duration || 100}
                        value={seek}
                        onChange={handleSeekChange}
                        disabled={!isLoaded}
                        style={{ background: getProgressStyle() }}
                    />
                </div>
                <div className="flex items-center justify-center">
                    <button 
                        onClick={() => setControlsState(!controlsState)} 
                        className="rounded-full hover:bg-slate-100/90 h-8 w-8 flex items-center justify-center"
                    >
                        {controlsState ? <ChevronDownIcon /> : <ChevronUpIcon />}
                    </button>
                </div>
            </div>
        </div>
    );
}