// import { useLyricsStore } from "../../store/useLyricsStore";

const WordByWordSync = () => {
    // const {staticLyrics} = useLyricsStore();

    return(
        <div className="h-full w-full bg-blue-200">
            <div className="h-full w-full">
                
            </div>
            <div id="word-by-word-slider-container" className="fixed h-16 shadow-md border rounded-full left-0 right-0 bottom-[85px] w-[99%] max-w-[320px] mx-auto">
                <div draggable className="slider h-[90%] w-[50px] bg-red-500"></div>
            </div>
        </div>
    )
}

export default WordByWordSync;