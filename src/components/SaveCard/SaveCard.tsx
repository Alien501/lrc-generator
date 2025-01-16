import { useState, FormEvent, ChangeEvent, useEffect } from "react"
import { useLyricsStore } from "../../store/useLyricsStore"
import { useMusicStore } from "../../store/useMusicStore"
import { useNavStore } from "../../store/useNavStore"
import { useModalStore } from "../../store/useModalStore"

interface FormData {
    title: string
    artist: string
    album: string
    lyricist: string
    by: string
    length: string
}

// interface WordTiming {
//     word: string
//     timestamp: number
// }

// interface SyncedLine {
//     lineTimestamp: number
//     words: WordTiming[]
//     lyrics: string
//     isSynced: boolean
// }

const SaveCard = () => {
    const { syncedLyrics, resetLyrics, wordByWordLyrics } = useLyricsStore();
    const { selectedFile, resetMusic } = useMusicStore();
    const { resetNav } = useNavStore();
    const { changeState } = useModalStore();
    const [syncMode, setSyncMode] = useState<'word' | 'line'>('line');

    useEffect(() => {
        setSyncMode(window.location.pathname === '/word' ? 'word' : 'line');
    }, []);

    const [formData, setFormData] = useState<FormData>({
        title: "",
        artist: "",
        album: "",
        lyricist: "",
        by: "",
        length: ""
    });

    const formatTimestamp = (timestamp: number) => {
        const min = Math.floor(timestamp / 60);
        const sec = Math.floor(timestamp % 60);
        const msec = Math.floor((timestamp % 1) * 100);

        return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}.${msec.toString().padStart(2, '0')}`;
    }

    const formatLineByLineLyrics = () => {
        return syncedLyrics
            .filter(line => line.isSynced)
            .map(line => `[${formatTimestamp(line.timestamp)}]${line.lyrics}`);
    }

    const formatWordByWordLyrics = () => {
        return wordByWordLyrics.map((line, lineIndex) => {
            if (!line.lyrics || line.lyrics.length === 0) return '';
            console.log(wordByWordLyrics[lineIndex].timestamp)
            const lineStart = formatTimestamp(wordByWordLyrics[lineIndex].timestamp);
            let wordTimings = '';

            line.lyrics.forEach((wordTiming, index) => {
                if (wordTiming.timestamp > 0) {
                    wordTimings += `<${formatTimestamp(wordTiming.timestamp)}>${wordTiming.lyrics}${index < line.lyrics.length - 1 ? ' ' : ''}`;
                } else {
                    wordTimings += `${wordTiming.lyrics}${index < line.lyrics.length - 1 ? ' ' : ''}`;
                }
            });

            return `[${lineStart}]${wordTimings}`;
        }).filter(line => line !== '');
    }

    const formatLyricsToLrc = () => {
        const metadata = [
            `[ti:${formData.title || 'Title'}]`,
            `[ar:${formData.artist || 'Artist'}]`,
            `[al:${formData.album || 'Album'}]`,
            `[lr:${formData.lyricist || 'Unknown'}]`,
            `[length:${formData.length || '00:00'}]`,
            `[by:${formData.by || 'Generated with LRC Generator'}]`,
            `[re:LRC Generator - ${syncMode === 'word' ? 'Word-by-Word' : 'Line-by-Line'} Sync]`,
            ''
        ];

        const formattedLyrics = syncMode === 'word' 
            ? formatWordByWordLyrics()
            : formatLineByLineLyrics();

        return [...metadata, ...formattedLyrics].join('\n');
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const lrcContent = formatLyricsToLrc();
            const blob = new Blob([lrcContent], { type: 'text/plain;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            
            const fileName = selectedFile?.name.split('.')[0] || 'lyrics';
            const syncType = syncMode === 'word' ? 'word-sync' : 'line-sync';
            const downloadLink = document.createElement('a');
            downloadLink.href = url;
            downloadLink.download = `${fileName}-${syncType}.lrc`;
            
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
            URL.revokeObjectURL(url);

            setTimeout(() => {
            });
        } catch (error) {
            console.error('Error generating LRC file:', error);
        }
    }

    const onSyncAnother = () => {
        resetLyrics();
        resetMusic();
        resetNav();
        changeState();
        window.location.pathname = '/';
    }

    return (
        <div className="w-full max-w-md mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="px-6 py-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                            Title
                        </label>
                        <input
                            required
                            id="title"
                            name="title"
                            type="text"
                            placeholder="Enter track title"
                            value={formData.title}
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
                            focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
                        />
                    </div>
                    <div>
                        <label htmlFor="artist" className="block text-sm font-medium text-gray-700">
                            Artist
                        </label>
                        <input
                            id="artist"
                            name="artist"
                            type="text"
                            placeholder="Enter artist name"
                            value={formData.artist}
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
                            focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
                        />
                    </div>
                    <div>
                        <label htmlFor="album" className="block text-sm font-medium text-gray-700">
                            Album
                        </label>
                        <input
                            id="album"
                            name="album"
                            type="text"
                            placeholder="Enter album name"
                            value={formData.album}
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
                            focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
                        />
                    </div>
                    <div>
                        <label htmlFor="lyricist" className="block text-sm font-medium text-gray-700">
                            Lyricist
                        </label>
                        <input
                            id="lyricist"
                            name="lyricist"
                            type="text"
                            placeholder="Enter lyricist name"
                            value={formData.lyricist}
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
                            focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
                        />
                    </div>
                    <div>
                        <label htmlFor="length" className="block text-sm font-medium text-gray-700">
                            Length
                        </label>
                        <input
                            id="length"
                            name="length"
                            type="text"
                            placeholder="Enter song length (e.g., 3:45)"
                            value={formData.length}
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
                            focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
                        />
                    </div>
                    <div>
                        <label htmlFor="by" className="block text-sm font-medium text-gray-700">
                            By
                        </label>
                        <input
                            id="by"
                            name="by"
                            type="text"
                            placeholder="Enter 'by' information"
                            value={formData.by}
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
                            focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
                        />
                    </div>
                    <div>
                        <button
                            type="submit"
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-black/90"
                        >
                            Save
                        </button>
                    </div>
                </form>
                <button onClick={onSyncAnother} className="w-full mt-4 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-900 hover:bg-black/90">
                    Sync Another!
                </button>
            </div>
        </div>
    )
}

export default SaveCard;