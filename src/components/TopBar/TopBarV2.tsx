import { Card, CardContent } from "../ui/card";
import { HugeiconsIcon } from "@hugeicons/react";
import { AlertCircleIcon, ArrowLeft02FreeIcons, Download02Icon } from "@hugeicons/core-free-icons";
import SaveCard from "../SaveCard/SaveCard";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { song } from "@/models";
import AboutCard from "../AboutCard/AboutCard";

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
            <div className="w-40 sm:w-[80%] text-center">
              <p className="text-sm animate-marquee font-medium mask-[linear-gradient(to_right,transparent,black_15%,black_85%,transparent)] text-nowrap">
                {songName}
              </p>
            </div>
            <div className="flex items-center gap-x-1">
              <SaveCard
                trigger={
                  <Button className="rounded-sm">
                    <HugeiconsIcon icon={Download02Icon} />
                    Save
                  </Button>
                }
              />
              <AboutCard
                trigger={
                  <Button className="rounded-sm" variant="secondary">
                    <HugeiconsIcon icon={AlertCircleIcon} />
                  </Button>
                }
              />
            </div>
          </CardContent>
        </Card>
      </div>
    );
}