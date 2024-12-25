import { useRef, useEffect } from 'react';
import { useLyricsStore } from '../../store/useLyricsStore';

const LyricsInputContainer = () => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const lyrics = useLyricsStore((state) => state.staticLyrics);
    const setLyrics = useLyricsStore((state) => state.setStaticLyrics);

    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            const adjustHeight = () => {
                textarea.style.height = 'auto';
                textarea.style.height = `${textarea.scrollHeight}px`;
            };

            textarea.addEventListener('input', adjustHeight);
            adjustHeight();

            return () => textarea.removeEventListener('input', adjustHeight);
        }
    }, []);

    // @ts-ignore
    const onInputChanged = (e) => {
        setLyrics(e.target.value);
    }

    return (
        <div className="w-[99%] mx-auto h-full bg-white p-1 rounded-sm">
            <textarea 
                ref={textareaRef}
                onChange={onInputChanged}
                name="lyrics"
                value={lyrics}
                id="lyrics" 
                placeholder="Paste your lyrics here..." 
                className="block rounded-md p-2 w-full min-h-[100px] resize-none overflow-hidden border-none focus:outline-none focus:ring-0"
            />
        </div>
    );
};

export default LyricsInputContainer;

