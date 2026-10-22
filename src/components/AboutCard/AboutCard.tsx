import type { ReactNode } from "react";
import { GithubIcon, LinkedinIcon, MailIcon, TelegramIcon } from "../icons/icons";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const socials = [
  { href: "https://github.com/Alien501", label: "GitHub", Icon: GithubIcon },
  { href: "mailto:cvignesh404@gmail.com", label: "Email", Icon: MailIcon },
  { href: "https://t.me/Alien_501", label: "Telegram", Icon: TelegramIcon },
  {
    href: "https://www.linkedin.com/in/vignesh501",
    label: "LinkedIn",
    Icon: LinkedinIcon,
  },
];

const keybindings = [
  { keys: ["Num 0"], label: "Play / Pause" },
  { keys: ["Num 1"], label: "Rewind" },
  { keys: ["Num 2"], label: "Move down" },
  { keys: ["Num 3"], label: "Fast forward" },
  { keys: ["Num 4"], label: "Adjust line back" },
  { keys: ["Num 5"], label: "Adjust line forward" },
  { keys: ["↑"], label: "Previous line" },
  { keys: ["↓"], label: "Next line" },
];

const Kbd = ({ children }: { children: ReactNode }) => (
  <kbd className="inline-flex h-5 min-w-[1.5rem] shrink-0 items-center justify-center rounded border border-zinc-200 bg-zinc-50 px-1.5 font-mono text-[10px] font-medium text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
    {children}
  </kbd>
);

const AboutCard = ({ trigger }: { trigger: ReactNode }) => {
  return (
    <Dialog>
      <DialogTrigger>{trigger}</DialogTrigger>

      {/* max-h + overflow so the dialog scrolls instead of running off-screen */}
      <DialogContent className="max-h-[85vh] overflow-x-hidden overflow-y-auto rounded-sm sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>About</DialogTitle>
          <DialogDescription className="sr-only">
            About Alien501, the LRC generator, and its keyboard shortcuts.
          </DialogDescription>
        </DialogHeader>

        {/* Profile + socials */}
        <div className="flex min-w-0 items-center gap-3">
          <Avatar className="size-10 shrink-0">
            <AvatarImage
              src="https://avatars.githubusercontent.com/u/97647867?s=400&u=e66d423a605f8055ce282cd96a3c24000e540ae7&v=4"
              alt="Alien501"
              className="object-cover"
            />
            <AvatarFallback className="text-xs">A5</AvatarFallback>
          </Avatar>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold leading-tight">
              Alien501 👽
            </p>
            <p className="truncate text-xs text-muted-foreground">
              LRC Generator · Made with 💖 & 🎵
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-0.5">
            {socials.map(({ href, label, Icon }) => {
              const isMail = href.startsWith("mailto:");
              return (
                <a
                  key={href}
                  href={href}
                  target={isMail ? undefined : "_blank"}
                  rel={isMail ? undefined : "noopener noreferrer"}
                  aria-label={label}
                  className="inline-flex size-7 items-center justify-center rounded-md text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-50 [&_svg]:size-4"
                >
                  <Icon />
                </a>
              );
            })}
          </div>
        </div>

        <Separator />

        {/* Keyboard shortcuts */}
        <div className="space-y-2">
          <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            Keyboard shortcuts (Line-By-Line Only)
          </p>
          <div className="space-y-1.5">
            {keybindings.map(({ keys, label }) => (
              <div
                key={label}
                className="flex min-w-0 items-center gap-2 text-xs"
              >
                {keys.map((k) => (
                  <Kbd key={k}>{k}</Kbd>
                ))}
                <span className="truncate text-muted-foreground">{label}</span>
              </div>
            ))}
          </div>
        </div>

        <DialogFooter className="border-t border-border pt-3">
          <div className="grid w-full min-w-0 grid-cols-2 items-center gap-2">
            <Button
              className="h-10 w-full min-w-0 rounded-md bg-zinc-900 text-sm font-semibold text-zinc-50 transition-colors hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              <a
                href="https://github.com/Alien501/lrc-generator"
                target="_blank"
                rel="noopener noreferrer"
              >
                Source Code
              </a>
            </Button>

            <a
              href="https://www.buymeacoffee.com/alien501"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Buy me a coffee"
              className="flex h-10 w-full min-w-0 items-center justify-center overflow-hidden"
            >
              {/* max-h + max-w so the img can only shrink, never widen its cell */}
              <img
                src="https://img.buymeacoffee.com/button-api/?text=Buy me a coffee&emoji=&slug=alien501&button_colour=FFDD00&font_colour=000000&font_family=Cookie&outline_colour=000000&coffee_colour=ffffff"
                alt="Buy me a coffee"
                className="max-h-full max-w-full object-contain"
              />
            </a>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AboutCard;