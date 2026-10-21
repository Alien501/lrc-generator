import MusicPlayer from "../MusicPlayer/MusicPlayer";
import { Card, CardContent } from "../ui/card";

export default function MusicBarV2({
  control,
}: {
  control: React.JSX.Element;
}) {
  return (
    <div className="bottom-bar relative">
      {control}
      <Card className="rounded-none bg-white shadow-md h-full border-zinc-200 relative z-10">
        <CardContent className="flex items-center justify-center h-full">
          <MusicPlayer />
        </CardContent>
      </Card>
    </div>
  );
}
