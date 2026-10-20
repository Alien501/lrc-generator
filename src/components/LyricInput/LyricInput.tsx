import { Card, CardContent } from "../ui/card";
import { Textarea } from "../ui/textarea";

export default function LyricInput() {
    return(
        <Card className="w-100 rounded-sm bg-white border border-zinc-200 shadow-none h-[380px]">
            <CardContent>
                <Textarea
                    className="h-full rounded-sm h-[356px]"
                    placeholder="Enter Your Lyrics Here"
                />
            </CardContent>
        </Card>   
    )
}