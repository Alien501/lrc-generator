import { useLyricsStore } from "../../store/useLyricsStore";
import { useMusicStore } from "../../store/useMusicStore";
import { useNavStore } from "../../store/useNavStore";

const TopBar = () => {
    const {selectedFile, setSelectedFile, setAudioUrl, resetMusic} = useMusicStore();
    const {syncedLyrics, resetLyrics} = useLyricsStore();
    const {resetNav} = useNavStore();

    const onSongSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if(!files || files.length == 0) return;

        const file = files[0];
        const audioUrl = URL.createObjectURL(file);

        setSelectedFile(file);
        setAudioUrl(audioUrl);
    }

    const formatTimestamp = (timestamp: number) => {
        const min = Math.floor(timestamp / 60);
        const sec = Math.floor(timestamp % 60);
        const msec = Math.floor((timestamp % 1) * 100);

        return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}.${msec.toString().padStart(2, '0')}`
    }

    const formatLyricsToLrc = () => {
        const sortedLyrics = [...syncedLyrics].sort((a, b) => a.timestamp - b.timestamp);
        const metadata = [
            '[ar:Artist]',
            '[al:Album]',
            '[ti:Title]',
            '[by:Generated with LRC Generator]',
            '[re:LRC Generator - Alien501]',
            ''
        ];
    
        const formattedLyrics = sortedLyrics
            .filter(lyric => lyric.isSynced && lyric.lyrics.trim() !== '')
            .map(lyric => `[${formatTimestamp(lyric.timestamp)}]${lyric.lyrics}`);
        return [...metadata, ...formattedLyrics].join('\n');
    }

    const onSaveButtonClicked = () => {
        const lrcContent = formatLyricsToLrc();
        const blob = new Blob([lrcContent], {type: 'text/plain;charset=utf-8'});
        const url = URL.createObjectURL(blob);

        const downloadLink = document.createElement('a');
        downloadLink.href = url;
        downloadLink.download = selectedFile?.name.split('.')[1] + '.lrc';
        document.body.appendChild(downloadLink);
        downloadLink.click();
        setTimeout(() => {
            resetLyrics();
            resetMusic();
            resetNav();
        }, 3000)
    }

    return (
        <div className="flex w-full justify-between p-4 bg-white shadow-md top-0 left-0 right-0 h-15 z-50">
            <div className="flex items-center">
                <label htmlFor="song-select" className="font-medium">{selectedFile?.name || 'Select a song'}</label>
                <input onChange={onSongSelected} accept="audio/*" id="song-select" type="file" name="song" className="hidden" />
            </div>
            <div>
                <button onClick={onSaveButtonClicked} className="h-max pl-4 pr-4 pt-2 pb-2 rounded-full bg-black text-white">
                    Save
                </button>
            </div>
        </div>
    )
}

export default TopBar;