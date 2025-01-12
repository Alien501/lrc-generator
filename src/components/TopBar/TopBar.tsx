import { useNavigate } from "react-router-dom";
import { useLyricsStore } from "../../store/useLyricsStore";
import { useMusicStore } from "../../store/useMusicStore";
import { useNavStore } from "../../store/useNavStore";
import { BackIcon, InfoIcon } from "../icons/icons";
import { useModalStore } from "../../store/useModalStore";
import AboutCard from "../AboutCard/AboutCard";

const TopBar = () => {
    const {selectedFile, setSelectedFile, setAudioUrl, resetMusic} = useMusicStore();
    const {syncedLyrics, resetLyrics} = useLyricsStore();
    const {resetNav} = useNavStore();
    const navigate = useNavigate();
    const { changeState, setChildren, setTitle } = useModalStore();

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
            <div className="flex items-center space-x-1 max-w-36 text-ellipsis overflow-hidden">
                <div>
                    {
                        window.location.pathname == '/' || window.location.pathname == '/menu'?
                        <button disabled className="w-10 h-10 rounded-full hover:bg-slate-200 flex items-center justify-center disabled:text-gray-500 disabled:cursor-not-allowed">
                            <BackIcon />
                        </button>
                        :
                        <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center">
                            <BackIcon />
                        </button>
                    }
                </div>
                <label htmlFor="song-select" className="font-medium">{selectedFile?.name || 'Select a song'}</label>
                <input onChange={onSongSelected} accept="audio/*" id="song-select" type="file" name="song" className="hidden" />
            </div>
            <div className="space-x-2 flex items-center">
                <button onClick={onSaveButtonClicked} className="h-max pl-4 pr-4 pt-2 pb-2 rounded-full bg-black text-white">
                    Save
                </button>
                <button onClick={() => {setTitle('About');setChildren(<AboutCard />);changeState()}} className="w-10 h-10 bg-slate-200/0 rounded-full flex items-center justify-center hover:bg-slate-100">
                    <InfoIcon />
                </button>
            </div>
        </div>
    )
}

export default TopBar;