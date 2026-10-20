import { useRef, useEffect } from 'react';
import { lyrics } from '@/models';

const LyricsInputContainer = () => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const text = lyrics.use((s) => s.text);

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

    return (
        <div className="w-[99%] mx-auto h-full bg-white p-1 rounded-sm">
            <textarea
                ref={textareaRef}
                onChange={(e) => lyrics.setText(e.target.value)}
                name="lyrics"
                value={text}
                id="lyrics"
                placeholder="Paste your lyrics here..."
                className="block rounded-md p-2 w-full min-h-25 resize-none overflow-hidden border-none focus:outline-none focus:ring-0"
            />
        </div>
    );
};

export default LyricsInputContainer;
