import { useLyricsStore } from "../../store/useLyricsStore";
import { useNavStore } from "../../store/useNavStore";

type TabType = 'lyrics' | 'sync';

interface TabButtonProps {
  label: string;
  isActive: boolean;
  disabled?: boolean;
  onClick: () => void;
}

const TabButton = ({ label, isActive, onClick, disabled = false }: TabButtonProps) => (
  <button
    onClick={onClick}
    className={`
      w-20 px-4 py-1 rounded-full h-10
      transition-all duration-200 ease-in-out
      ${isActive 
        ? 'bg-black text-white shadow-lg transform scale-105' 
        : 'bg-transparent text-gray-600 hover:bg-gray-200'
      }
      focus:outline-none
    `}
    disabled={disabled}
  >
    {label}
  </button>
);

const Navbar = () => {
  const currentTab = useNavStore((state) => state.currentTab);
  const setCurrentTab = useNavStore((state) => state.setCurrentTab);
  const lyrics = useLyricsStore((state) => state.staticLyrics);
  
  const tabs: TabType[] = ['lyrics', 'sync'];

  return (
    <div className="h-max p-1 bg-white/80 backdrop-blur-sm w-full z-40 shadow-sm border  flex items-center justify-center">
      <div className="w-max flex justify-between items-center rounded-full bg-gray-300/30 p-1 gap-2">
        {tabs.map((tab) => (
          <TabButton
            key={tab}
            label={tab.charAt(0).toUpperCase() + tab.slice(1)}
            isActive={currentTab === tab}
            onClick={() => setCurrentTab(tab)}
            disabled={lyrics.trim() != ""? false: true}
          />
        ))}
      </div>
    </div>
  );
};

export default Navbar;