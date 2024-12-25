import { useEffect, useRef } from "react";
import { useLyricsStore } from "../../store/useLyricsStore";
import { useMusicStore } from "../../store/useMusicStore";

interface LyricsCardProps {
    lyrics: string;
    id: number;
    timestamp?: number;
    isSynced?: boolean;
}

const LyricsCard = ({ lyrics, id, timestamp, isSynced }: LyricsCardProps) => {
    const currentlyActiveCard = useLyricsStore((state) => state.currentlyActiveCard);
    const currentTimestamp = useMusicStore((state) => state.currentTimestamp);
    const updateLyricsTimestamp = useLyricsStore((state) => state.updateLyricTimestamp);
    const isActive = currentlyActiveCard == id;
    const cardRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isActive && cardRef.current) {
            requestAnimationFrame(() => {
                cardRef.current?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            });
            updateLyricsTimestamp(id, currentTimestamp);
        }
    }, [isActive, currentTimestamp, id]);

    const formatTimestamp = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return  `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    return (
        <div
            ref={cardRef}
            id={`l-${id}`}
            className={`
                bg-white 
                items-center 
                ${isActive ? 'ring-2 ring-blue-400 bg-blue-400/20' : ''} 
                min-h-[50px] 
                rounded-md 
                m-2 
                p-1 
                font-semibold 
                text-base 
                grid 
                grid-cols-[90%_10%] 
                hover:bg-slate-100 
                hover:cursor-pointer
                transition-colors
                duration-200
            `}
        >
            <div className="flex justify-between items-center">
                <p>{lyrics}</p>
                {isSynced && (
                    <span className="text-sm opacity-70">
                        {formatTimestamp(timestamp)}
                    </span>
                )}
            </div>
        </div>
    );
};

export default LyricsCard;