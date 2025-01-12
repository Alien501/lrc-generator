import { useNavigate } from "react-router-dom";

const Menu = () => {
    const navigate = useNavigate();


    return(
        <div className="h-full w-full flex flex-col justify-center items-center space-y-6">
            <button onClick={() => navigate('/line')} className="bg-black text-white text-sm border border-black hover:bg-white hover:shadow-md hover:text-black transition-all hover:scale-95 p-2 pr-4 pl-4 rounded-md duration-300 font-semibold">Line-by-Line Sync</button>
            <button onClick={() => navigate('/word')} className="bg-black text-white text-sm border border-black hover:bg-white hover:shadow-md hover:text-black transition-all hover:scale-95 p-2 pr-4 pl-4 rounded-md duration-300 font-semibold">Word-by-Word Sync</button>
        </div>
    )
};

export default Menu;