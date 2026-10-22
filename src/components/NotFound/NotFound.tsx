import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  LaptopIssueIcon,
  Home01Icon,
  ArrowLeft01Icon,
} from "@hugeicons/core-free-icons";

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-background px-4">
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-[500px] w-[500px] rounded-full bg-primary/5 blur-3xl" />
      </div>

      <Card className="relative z-10 w-full max-w-md border-border/60 bg-card/80 backdrop-blur-sm">
        <CardHeader className="items-center text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <HugeiconsIcon icon={LaptopIssueIcon} size={28} strokeWidth={1.5} />
          </div>
          <Badge variant="outline" className="mb-2 font-mono text-xs">
            [??:??.???]
          </Badge>
          <CardTitle className="text-3xl font-bold tracking-tight">
            404 - Line Not Found
          </CardTitle>
          <CardDescription className="text-base">
            The lyric you're looking for doesn't exist in this track.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="rounded-lg border border-dashed border-border/80 bg-muted/50 p-4 text-center font-mono text-sm text-muted-foreground">
            <span className="text-destructive line-through decoration-2">
              [00:00.000] This line was never recorded
            </span>
          </div>
          <Separator />
          <p className="text-center text-xs text-muted-foreground">
            Check the URL, or head back to the studio.
          </p>
        </CardContent>

        <CardFooter className="flex flex-col gap-3 sm:flex-row">
          <Button
            className="w-full group"
            onClick={() => (window.location.href = "/")}
          >
            <HugeiconsIcon
              icon={Home01Icon}
              size={16}
              className="mr-2 transition-transform group-hover:scale-110"
            />
            Back to Studio
          </Button>
          <Button
            variant="outline"
            className="w-full group"
            onClick={() => window.history.back()}
          >
            <HugeiconsIcon
              icon={ArrowLeft01Icon}
              size={16}
              className="mr-2 transition-transform group-hover:-translate-x-1"
            />
            Go Back
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}