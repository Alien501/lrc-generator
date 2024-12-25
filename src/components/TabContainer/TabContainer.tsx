import React from "react";
import { useNavStore } from "../../store/useNavStore";

const TabContainer = ({ children }: { children: React.JSX.Element }) => {
    const currentTab = useNavStore((state) => state.currentTab);

    return (
        <div className={`${currentTab == 'lyrics'? 'h-[74vh]': 'h-[65vh]'} p-2 overflow-y-scroll [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100/10 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300/10    dark:[&::-webkit-scrollbar-track]:bg-neutral-700/10 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500/10`}>
            {children}
        </div>
    )
};

export default TabContainer;