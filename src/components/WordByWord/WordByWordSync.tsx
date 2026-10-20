import React, { useState, useRef, useEffect } from 'react';
import { lyrics, song, ui } from "@/models";

const WordByWordSync = () => {
    const lines = lyrics.use((s) => s.lines);
    const activeLine = lyrics.use((s) => s.activeLine);
    const activeWord = lyrics.use((s) => s.activeWord);
    const expanded = ui.use((s) => s.playerExpanded);
    const [isDragging, setIsDragging] = useState(false);
    const sliderRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const line = lines[activeLine];
    const wordCount = line?.words.length ?? 0;

    // Snap the handle back whenever a line is finished.
    useEffect(() => {
        if (sliderRef.current) sliderRef.current.style.left = '0px';
    }, [activeLine, line?.end]);

    useEffect(() => {
        if (!isDragging) return;
        const handleDragEnd = () => {
            setIsDragging(false);
            lyrics.finishLine(song.currentTime);
        };
        document.addEventListener('mouseup', handleDragEnd);
        document.addEventListener('touchend', handleDragEnd);
        return () => {
            document.removeEventListener('mouseup', handleDragEnd);
            document.removeEventListener('touchend', handleDragEnd);
        };
    }, [isDragging]);

    const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleSliderDrag = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDragging || !containerRef.current || !sliderRef.current) return;

        const containerRect = containerRef.current.getBoundingClientRect();
        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const newPosition = Math.max(clientX - containerRect.left, 0);
        const containerWidth = containerRect.width;
        const sliderWidth = sliderRef.current.offsetWidth;

        const newLeft = Math.max(0, Math.min(newPosition - sliderWidth / 2, containerWidth - sliderWidth));
        sliderRef.current.style.left = `${newLeft}px`;
        const progress = newLeft / (containerWidth - sliderWidth);
        const wordIndex = Math.max(0, Math.min(Math.floor(progress * (wordCount - 1)), wordCount - 1));
        lyrics.reachWord(wordIndex, song.currentTime);
    };

    return (
        <div id="sync-container" className="h-full md:w-[90%] sm:w-[99%] mx-auto relative select-none">
            <div className="space-y-4 pb-32">
                {lines.map((l, index) => (
                    <div
                        key={index}
                        className={`p-4 border rounded-lg transition-all duration-200 ${
                            index === activeLine
                                ? 'bg-black/5 border-blue-500'
                                : index < activeLine
                                    ? 'opacity-50'
                                    : 'border-transparent'
                        }`}
                    >
                        {index === activeLine ? (
                            l.words.map((word, wordIndex) => (
                                <span
                                    key={wordIndex}
                                    className={`text-lg ${
                                        wordIndex <= activeWord
                                            ? 'text-blue-600 font-semibold'
                                            : ''
                                    } transition-colors duration-200`}
                                >
                                    {word.text}{' '}
                                </span>
                            ))
                        ) : (
                            <span className="text-lg">{l.text}</span>
                        )}
                    </div>
                ))}
            </div>

            <div
                ref={containerRef}
                className={`fixed h-12 bg-black/10 rounded-full mx-auto mb-4 transition-all ${
                    expanded ? 'bottom-[130px]' : 'bottom-[82px]'
                } overflow-hidden z-40`}
                style={{
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 'calc(100% - 2rem)',
                    maxWidth: '500px'
                }}
                onMouseMove={handleSliderDrag}
                onTouchMove={handleSliderDrag}
                onClick={handleSliderDrag}
            >
                <div className="absolute inset-0 flex items-center">
                    {Array.from({ length: wordCount }, (_, index) => (
                        <div
                            key={index}
                            className="h-1 w-1 bg-black/20 rounded-full"
                            style={{
                                position: 'absolute',
                                left: `${index == wordCount - 1 ? (index / wordCount) * 100 + 20 : (index / (wordCount - 1)) * 100}%`,
                            }}
                        ></div>
                    ))}
                </div>
                <div
                    className="absolute top-0 left-0 h-full bg-black/10 rounded-l-full transition-all"
                    style={{
                        width: `${wordCount > 1 ? (activeWord / (wordCount - 1)) * 100 : 0}%`,
                    }}
                />
                <div
                    ref={sliderRef}
                    onMouseDown={handleDragStart}
                    onTouchStart={handleDragStart}
                    className="absolute top-1/2 -translate-y-1/2 h-10 w-10 bg-black rounded-full cursor-grab active:cursor-grabbing shadow-lg hover:shadow-xl flex items-center justify-center touch-none"
                >
                    <div className="w-5 h-5 flex flex-col justify-center items-center gap-1">
                        <div className="w-4 h-0.5 bg-white rounded-full"/>
                        <div className="w-4 h-0.5 bg-white rounded-full"/>
                        <div className="w-4 h-0.5 bg-white rounded-full"/>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WordByWordSync;
