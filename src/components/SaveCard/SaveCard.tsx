import { useState, FormEvent, ChangeEvent } from "react"
import { lyrics, resetSession, song } from "@/models"
import { buildLrc, downloadText, type LrcMeta } from "@/lib/lrc"

const fields: { name: keyof LrcMeta; label: string; placeholder: string; required?: boolean }[] = [
    { name: "title", label: "Title", placeholder: "Enter track title", required: true },
    { name: "artist", label: "Artist", placeholder: "Enter artist name" },
    { name: "album", label: "Album", placeholder: "Enter album name" },
    { name: "lyricist", label: "Lyricist", placeholder: "Enter lyricist name" },
    { name: "length", label: "Length", placeholder: "Enter song length (e.g., 3:45)" },
    { name: "by", label: "By", placeholder: "Enter 'by' information" },
];

const SaveCard = () => {
    const [meta, setMeta] = useState<LrcMeta>({
        title: "",
        artist: "",
        album: "",
        lyricist: "",
        length: "",
        by: "",
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setMeta({ ...meta, [e.target.name]: e.target.value })
    }

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const { lines, mode } = lyrics.getState();
        const fileName = `${song.baseName || 'lyrics'}-${mode}-sync.lrc`;
        downloadText(buildLrc(lines, mode, meta), fileName);
    }

    const onSyncAnother = () => {
        resetSession();
        window.location.pathname = '/';
    }

    return (
        <div className="w-full max-w-md mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="px-6 py-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                    {fields.map((field) => (
                        <div key={field.name}>
                            <label htmlFor={field.name} className="block text-sm font-medium text-gray-700">
                                {field.label}
                            </label>
                            <input
                                required={field.required}
                                id={field.name}
                                name={field.name}
                                type="text"
                                placeholder={field.placeholder}
                                value={meta[field.name]}
                                onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
                                focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
                            />
                        </div>
                    ))}
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
