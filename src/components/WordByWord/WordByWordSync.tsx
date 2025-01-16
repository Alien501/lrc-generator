import React, { useState, useRef, useEffect } from 'react';
import { useLyricsStore } from "../../store/useLyricsStore";
import { useMusicStore } from "../../store/useMusicStore";

const WordByWordSync = () => {
    const { syncedLyrics, updateLyricTimestamp, currentlyActiveCard, setCurrentlyActiveCard, updateWordByWordLyrics } = useLyricsStore();
    const { controlsState, currentTimestamp } = useMusicStore();
    const [words, setWords] = useState<string[]>([]);
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const sliderRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (syncedLyrics.length > 0 && currentlyActiveCard < syncedLyrics.length) {
            const currentLine = syncedLyrics[currentlyActiveCard]?.lyrics || "";
            setWords(currentLine.split(' '));
            setCurrentWordIndex(0);
            if (sliderRef.current) {
                sliderRef.current.style.left = '0px';
            }
        }
    }, [syncedLyrics, currentlyActiveCard]);

    const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragEnd = () => {
        setIsDragging(false);

        if (currentWordIndex === words.length - 1) {
            const timestamp = Date.now();
            updateLyricTimestamp(currentlyActiveCard, timestamp);
            if (currentlyActiveCard < syncedLyrics.length - 1) {
                setCurrentlyActiveCard(currentlyActiveCard + 1);
            }
        }
    };

    useEffect(() => {
        document.addEventListener('mouseup', handleDragEnd);
        document.addEventListener('touchend', handleDragEnd);
        return () => {
            document.removeEventListener('mouseup', handleDragEnd);
            document.removeEventListener('touchend', handleDragEnd);
        };
    }, [currentWordIndex, words.length, currentlyActiveCard]);

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
        const newWordIndex = Math.floor(progress * (words.length - 1));
        const currentWordIndex = Math.max(0, Math.min(newWordIndex, words.length - 1))
        updateWordByWordLyrics(currentlyActiveCard, currentWordIndex, currentTimestamp);
        console.log("Current Time Stamp: ", currentTimestamp)
        setCurrentWordIndex(currentWordIndex);
    };

    return (
        <div id="sync-container" className="h-full md:w-[90%] sm:w-[99%] mx-auto relative select-none">
            <div className="space-y-4 pb-32">
                {syncedLyrics.map((line, index) => (
                    <div 
                        key={index} 
                        className={`p-4 border rounded-lg transition-all duration-200 ${
                            index === currentlyActiveCard 
                                ? 'bg-black/5 border-blue-500' 
                                : index < currentlyActiveCard 
                                    ? 'opacity-50' 
                                    : 'border-transparent'
                        }`}
                    >
                        {index === currentlyActiveCard ? (
                            line.lyrics.split(' ').map((word, wordIndex) => (
                                <span 
                                    key={wordIndex} 
                                    className={`text-lg ${
                                        wordIndex <= currentWordIndex 
                                            ? 'text-blue-600 font-semibold' 
                                            : ''
                                    } transition-colors duration-200`}
                                >
                                    {word}{' '}
                                </span>
                            ))
                        ) : (
                            <span className="text-lg">{line.lyrics}</span>
                        )}
                    </div>
                ))}
            </div>

            <div 
                ref={containerRef}
                className={`fixed h-12 bg-black/10 rounded-full mx-auto mb-4 transition-all ${
                    controlsState ? 'bottom-[130px]' : 'bottom-[82px]'
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
                    {words.map((_, index) => (
                        <div
                            key={index}
                            className={`h-1 w-1 bg-black/20 rounded-full mx-[calc(100%/${words.length})]`}
                            style={{
                                position: 'absolute',
                                left: `${index == words.length - 1 ? (index/words.length) * 100 + 20: (index / (words.length - 1)) * 100}%`,
                            }}
                        ></div>
                    ))}
                </div>
                <div 
                    className="absolute top-0 left-0 h-full bg-black/10 rounded-l-full transition-all"
                    style={{ 
                        width: `${(currentWordIndex / (words.length - 1)) * 100}%`,
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




// Word by word sync with button

// import React, { useState, useEffect } from 'react';
// import { useLyricsStore } from "../../store/useLyricsStore";
// import { useMusicStore } from "../../store/useMusicStore";

// const WordByWordSync = () => {
//     const { syncedLyrics, updateLyricTimestamp, currentlyActiveCard, setCurrentlyActiveCard } = useLyricsStore();
//     const controlsState = useMusicStore((state) => state.controlsState);
//     const [words, setWords] = useState<string[]>([]);
//     const [currentWordIndex, setCurrentWordIndex] = useState(0);

//     useEffect(() => {
//         if (syncedLyrics.length > 0 && currentlyActiveCard < syncedLyrics.length) {
//             const currentLine = syncedLyrics[currentlyActiveCard]?.lyrics || "";
//             setWords(currentLine.split(' '));
//             setCurrentWordIndex(0);
//         }
//     }, [syncedLyrics, currentlyActiveCard]);

//     const handleNextWord = () => {
//         if (currentWordIndex < words.length - 1) {
//             setCurrentWordIndex((prev) => prev + 1);
//         } 
//         else if (currentlyActiveCard < syncedLyrics.length - 1) {
//             const timestamp = Date.now();
//             updateLyricTimestamp(currentlyActiveCard, timestamp);
//             setCurrentlyActiveCard(currentlyActiveCard + 1);
//         }
//     };

//     const handlePreviousWord = () => {
//         if (currentWordIndex > 0) {
//             setCurrentWordIndex((prev) => prev - 1);
//         } 
//         else if (currentlyActiveCard > 0) {
//             setCurrentlyActiveCard(currentlyActiveCard - 1);
//         }
//     };

//     return (
//         <div id="sync-container" className="h-full md:w-[90%] sm:w-[99%] mx-auto relative select-none">
//             <div className="space-y-4 pb-32">
//                 {syncedLyrics.map((line, index) => (
//                     <div 
//                         key={index} 
//                         className={`p-4 border rounded-lg transition-all duration-200 ${
//                             index === currentlyActiveCard 
//                                 ? 'bg-black/5 border-blue-500' 
//                                 : index < currentlyActiveCard 
//                                     ? 'opacity-50' 
//                                     : 'border-transparent'
//                         }`}
//                     >
//                         {index === currentlyActiveCard ? (
//                             line.lyrics.split(' ').map((word, wordIndex) => (
//                                 <span 
//                                     key={wordIndex} 
//                                     className={`text-lg ${
//                                         wordIndex <= currentWordIndex 
//                                             ? 'text-blue-600 font-semibold' 
//                                             : ''
//                                     } transition-colors duration-200`}
//                                 >
//                                     {word}{' '}
//                                 </span>
//                             ))
//                         ) : (
//                             <span className="text-lg">{line.lyrics}</span>
//                         )}
//                     </div>
//                 ))}
//             </div>

//             <div 
//                 className={`fixed h-12 flex items-center justify-center space-x-4 mx-4 mb-4 transition-all ${
//                     controlsState ? 'bottom-[130px]' : 'bottom-[82px]'
//                 }`}
//                 style={{
//                     left: '50%',
//                     transform: 'translateX(-50%)',
//                     width: 'calc(100% - 2rem)',
//                     maxWidth: '500px'
//                 }}
//             >
//                 <button 
//                     className="h-10 px-4 bg-gray-700 text-white rounded-lg hover:bg-gray-600 active:bg-gray-500 transition-all"
//                     onClick={handlePreviousWord}
//                     disabled={currentWordIndex === 0 && currentlyActiveCard === 0}
//                 >
//                     Previous
//                 </button>
//                 <button 
//                     className="h-10 px-4 bg-blue-700 text-white rounded-lg hover:bg-blue-600 active:bg-blue-500 transition-all"
//                     onClick={handleNextWord}
//                     disabled={currentWordIndex === words.length - 1 && currentlyActiveCard === syncedLyrics.length - 1}
//                 >
//                     Next
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default WordByWordSync;
