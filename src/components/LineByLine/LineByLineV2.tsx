import { lyrics } from "@/models";
import TopBarV2 from "../TopBar/TopBarV2";
import LyricsCardV2 from "../LyricsCard/LyricsCardV2";
import MusicBarV2 from "../MusicBar/MusicBarV2";
import SyncLayout from "../Layout/syncLayout";
import { LineByLineControl } from "../SyncControls/SyncControls";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function LineByLineV2() {
  const lines = lyrics.use((l) => l.lines);
  const activeLine = lyrics.use((l) => l.activeLine);
  const navigate = useNavigate();

  useEffect(() => {
    if(lines.length === 0) navigate('/');
  }, []);

  
  useEffect(() => lyrics.setMode('line'), []);

  return (
    <SyncLayout
      topBar={<TopBarV2 />}
      mainContent={
        <>
          {lines.map((line, i) => (
            <LyricsCardV2
              index={i}
              isActive={activeLine == i}
              key={i}
              text={line.text}
              time={line.time}
            />
          ))}
          <div className="h-18"></div>
        </>
      }
      bottomBar={<MusicBarV2 control={<LineByLineControl />} />}
    />
  );
}
