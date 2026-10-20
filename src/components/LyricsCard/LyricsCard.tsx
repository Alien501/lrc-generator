import { useEffect, useRef } from "react";
import { formatClock } from "@/lib/time";

interface LyricsCardProps {
    text: string;
    time?: number | null;
    isActive: boolean;
}

const LyricsCard = ({ text, time = null, isActive }: LyricsCardProps) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const isSynced = time !== null;

    useEffect(() => {
        if (isActive) {
            requestAnimationFrame(() => {
                cardRef.current?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            });
        }
    }, [isActive]);

    return (
        <div
            ref={cardRef}
            className={`
                hover:bg-neutral-50
                border-black/5
                items-center
                ${isActive ? 'ring-2 ring-blue-400' : ''}
                ${isSynced ? 'bg-neutral-100 border border-neutral-400/10' : ''}
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
                <p>{text}</p>
                {isSynced && (
                    <span className="text-sm opacity-70">
                        {formatClock(time)}
                    </span>
                )}
            </div>
        </div>
    );
};

export default LyricsCard;
