import type { ReactNode } from "react";
import { GithubIcon, LinkedinIcon, MailIcon, TelegramIcon } from "../icons/icons";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  {
    href: "https://github.com/Alien501",
    label: "Visit GitHub profile",
    Icon: GithubIcon,
  },
  {
    href: "mailto:cvignesh404@gmail.com",
    label: "Send email",
    Icon: MailIcon,
  },
  {
    href: "https://t.me/Alien_501",
    label: "Visit Telegram profile",
    Icon: TelegramIcon,
  },
  {
    href: "https://www.linkedin.com/in/vignesh-chellapandi-2207b5257/",
    label: "Visit LinkedIn profile",
    Icon: LinkedinIcon,
  },
];

const AboutCard = ({ trigger }: { trigger: ReactNode }) => {
  return (
    <Dialog>
      <DialogTrigger>{trigger}</DialogTrigger>

      <DialogContent className="rounded-sm">
        <DialogHeader>
          <DialogTitle>About</DialogTitle>
          <DialogDescription className="sr-only">
            About Alien501 and this LRC generator.
          </DialogDescription>
        </DialogHeader>

        {/* Profile */}
        <div className="flex flex-col items-center gap-2 py-4">
          <Avatar className="size-20">
            <AvatarImage
              src="https://avatars.githubusercontent.com/u/97647867?s=400&u=e66d423a605f8055ce282cd96a3c24000e540ae7&v=4"
              alt="Alien501 (The Dev)"
              className="object-cover"
            />
            <AvatarFallback>A5</AvatarFallback>
          </Avatar>
          <p className="text-xs italic text-muted-foreground">
            Made with 💖 & 🎵
          </p>
          <p className="text-sm font-bold">Alien501 👽</p>
        </div>

        {/* Socials */}
        <div className="flex justify-center gap-2">
          {socials.map(({ href, label, Icon }) => {
            const isMail = href.startsWith("mailto:");
            return (
              <Button
                key={href}
                variant="ghost"
                size="icon"
                className="size-9 rounded-md bg-muted text-muted-foreground hover:bg-foreground hover:text-background transition-colors [&_svg]:size-4"
              >
                <a
                  href={href}
                  target={isMail ? undefined : "_blank"}
                  rel={isMail ? undefined : "noopener noreferrer"}
                  aria-label={label}
                >
                  <Icon />
                </a>
              </Button>
            );
          })}
        </div>

        {/* Actions — equal-height grid so both buttons line up */}
        <DialogFooter className="!flex-col gap-0 border-t border-border pt-3 sm:!flex-col sm:!space-x-0">
          <div className="grid w-full grid-cols-2 items-center gap-2">
            <Button
              className="h-11 w-full rounded-md bg-black text-sm font-semibold text-white hover:bg-black/90 transition-colors"
            >
              <a
                href="https://github.com/Alien501/lrc-generator"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="View source code on GitHub"
              >
                Source Code
              </a>
            </Button>

            <a
              href="https://www.buymeacoffee.com/alien501"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Buy me a coffee"
              className="flex h-11 items-center justify-center"
            >
              <img
                src="https://img.buymeacoffee.com/button-api/?text=Buy me a coffee&emoji=&slug=alien501&button_colour=FFDD00&font_colour=000000&font_family=Cookie&outline_colour=000000&coffee_colour=ffffff"
                alt="Buy me a coffee button"
                className="h-full w-auto object-contain"
              />
            </a>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AboutCard;