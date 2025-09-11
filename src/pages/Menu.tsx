import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useSEO } from "../hooks/useSEO";

const Menu = () => {
    const navigate = useNavigate();
    
    useSEO({
        title: "LRC Generator - Choose Sync Mode | Free Lyrics Synchronization Tool",
        description: "Choose between line-by-line or word-by-word synchronization modes for creating perfect LRC files. Start your lyrics synchronization journey with our free online tool.",
        keywords: "LRC generator, lyrics sync mode, line by line sync, word by word sync, karaoke lyrics, music synchronization",
        url: "https://lrc-generator.vercel.app/menu"
    });


    return(
        <div className="h-full w-full flex flex-col justify-center items-center space-y-6">
            <Card className="w-[320px] h-[120px] bg-neutral-900 flex items-center justify-center relative">
                <CardContent className="p-0">
                    <p className="absolute text-neutral-400/10 font-black text-4xl left-0 top-0">LINE</p>
                    <p className="absolute text-neutral-400/10 font-black text-9xl left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">BY</p>
                    <p className="absolute text-neutral-400/10 font-black text-4xl right-0 bottom-0">LINE</p>
                    <Button onClick={() => navigate('/line')} className="bg-neutral-100 cursor-pointer relative z-10 hover:bg-neutral-200">Line-by-Line Sync</Button>
                </CardContent>
            </Card>

            <Card className="w-[320px] h-[120px] bg-neutral-900 flex items-center justify-center relative">
                <CardContent className="p-0">
                    <p className="absolute text-neutral-400/10 font-black text-4xl left-0 top-0">WORD</p>
                    <p className="absolute text-neutral-400/10 font-black text-9xl left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">BY</p>
                    <p className="absolute text-neutral-400/10 font-black text-4xl right-0 bottom-0">WORD</p>
                    <Button onClick={() => navigate('/word')} className="bg-neutral-100 cursor-pointer relative z-10 hover:bg-neutral-200">Word-by-Word Sync</Button>
                </CardContent>
            </Card>
        </div>
    )
};

export default Menu;