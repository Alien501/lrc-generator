import { useNavigate } from "react-router-dom";
import { useMusicStore } from "../../store/useMusicStore";
import { BackIcon, InfoIcon } from "../icons/icons";
import { useModalStore } from "../../store/useModalStore";
import AboutCard from "../AboutCard/AboutCard";
import SaveCard from "../SaveCard/SaveCard";
import { useLyricsStore } from "../../store/useLyricsStore";

const TopBar = () => {
    const { selectedFile, setSelectedFile, setAudioUrl } = useMusicStore();
    const { syncedLyrics, resetLyrics } = useLyricsStore();
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

    const onSaveButtonClicked = () => {
        setTitle('Save File');
        setChildren(<SaveCard />);
        changeState();
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
                        <button onClick={() => {resetLyrics();navigate(-1)}} className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center">
                            <BackIcon />
                        </button>
                    }
                </div>
                <label htmlFor="song-select" className="font-medium">{selectedFile?.name || 'Select a song'}</label>
                <input onChange={onSongSelected} accept="audio/*" id="song-select" type="file" name="song" className="hidden" />
            </div>
            <div className="space-x-2 flex items-center">
                {/* Dono why disabled class is working, so just hardcoded the color */}
                {
                    syncedLyrics.length === 0?
                    <button disabled className="bg-gray-500 h-max pl-4 pr-4 pt-1 pb-1 rounded-full  text-white hover:cursor-not-allowed">
                        Save
                    </button>
                    :
                    <button onClick={onSaveButtonClicked} className="h-max pl-4 pr-4 pt-1 pb-1 rounded-full bg-black text-white">
                        Save
                    </button>
                }
                <button onClick={() => {setTitle('About');setChildren(<AboutCard />);changeState()}} className="w-10 h-10 bg-slate-200/0 rounded-full flex items-center justify-center hover:bg-slate-100">
                    <InfoIcon />
                </button>
            </div>
        </div>
    )
}

export default TopBar;