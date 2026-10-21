import { Card, CardContent } from "../ui/card";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft02FreeIcons, Download02Icon } from "@hugeicons/core-free-icons";
import SaveCard from "../SaveCard/SaveCard";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { song } from "@/models";

export default function TopBarV2() {
    const navigate = useNavigate();
    const songName = song.baseName;

    return(
      <div className="top-bar">
        <Card className="rounded-none bg-white shadow-md h-full border-zinc-200">
          <CardContent className="flex items-center justify-between h-full">
            <div>
              <Button
                onClick={() => navigate(-1)}
                variant="secondary"
                className="rounded-sm"
              >
                <HugeiconsIcon icon={ArrowLeft02FreeIcons} />
                Back
              </Button>
            </div>
            <div className="max-w-[320px]">
              <p className="text-sm animate-marquee font-medium mask-[linear-gradient(to_right,transparent,black_15%,black_85%,transparent)] text-nowrap">
                {songName}
              </p>
            </div>
            <div>
              <SaveCard
                trigger={
                  <Button className="rounded-sm">
                    <HugeiconsIcon icon={Download02Icon} />
                    Save
                  </Button>
                }
              />
            </div>
          </CardContent>
        </Card>
      </div>
    );
}