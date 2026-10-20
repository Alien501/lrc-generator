import { useLocation, useNavigate } from "react-router-dom";
import { lyrics, song, ui } from "@/models";
import { BackIcon, InfoIcon } from "../icons/icons";
import AboutCard from "../AboutCard/AboutCard";
import SaveCard from "../SaveCard/SaveCard";
import { Button } from "../ui/button";

const TopBar = () => {
    const songName = song.use(() => song.name);
    const canSave = lyrics.use((s) => s.lines.length > 0);
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const isRoot = pathname === '/' || pathname === '/menu';

    const onSongSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) song.load(file);
    }

    const onBack = () => {
        lyrics.reset();
        navigate(-1);
    }

    return (
        <div className="flex font-display w-full justify-between p-2 bg-white shadow-md top-0 left-0 right-0 h-16 z-50 border-b border-b-black/10">
            <div className="flex items-center space-x-1 max-w-[50%] text-ellipsis overflow-hidden h-full">
                <div>
                    <Button
                        disabled={isRoot}
                        onClick={onBack}
                        className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center disabled:text-gray-500 disabled:cursor-not-allowed"
                    >
                        <BackIcon />
                    </Button>
                </div>
                <label htmlFor="song-select" className="font-medium text-nowrap text-ellipsis inline-block w-36 overflow-hidden">{songName || 'Select a song'}</label>
                <input onChange={onSongSelected} accept="audio/*" id="song-select" type="file" name="song" className="hidden" />
            </div>
            <div className="space-x-2 flex items-center">
                {/* Dono why disabled class is working, so just hardcoded the color */}
                <button
                    disabled={!canSave}
                    onClick={() => ui.openModal('Save File', <SaveCard />)}
                    className={`h-max pl-4 pr-4 pt-1 pb-1 rounded-full text-white ${canSave ? 'bg-black' : 'bg-gray-500 hover:cursor-not-allowed'}`}
                >
                    Save
                </button>
                <button onClick={() => ui.openModal('About', <AboutCard />)} className="w-10 h-10 bg-slate-200/0 rounded-full flex items-center justify-center hover:bg-slate-100">
                    <InfoIcon />
                </button>
            </div>
        </div>
    )
}

export default TopBar;
