import { useModalStore } from "../../store/useModalStore";
import { CrossIcon } from "../icons/icons";

const Modal = () => {
    const { changeState, title, children } = useModalStore();
    return(
        <div className="h-screen w-full overflow-hidden z-40 bg-black/50 backdrop-blur-sm fixed left-0 top-0 right-0 bottom-0 flex items-center justify-center transition-all duration-500">
            <div className="w-[300px] min-h-[100px] bg-white rounded-md shadow-sm p-1">
                <div className="h-10 flex items-center justify-between">
                    <p className="ml-2 text-lg- font-semibold">{title}</p>
                    <button aria-label="Close Button" onClick={() => changeState()} className="h-9 w-9 rounded-full hover:bg-slate-200 flex items-center justify-center">
                        <CrossIcon />
                    </button>
                </div>
                {children}
            </div>
        </div>
    )
} 

export default Modal;