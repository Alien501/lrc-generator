import { GithubIcon, LinkedinIcon, MailIcon, TelegramIcon } from "../icons/icons";

const AboutCard = () => {
    return(
        <div className="h-full w-full p-2 font-satoshi space-y-2">
            <div className="w-full h-[150px] rounded-md bg-slate-200/80 flex flex-col justify-center items-center space-y-2">
                <div className="h-[80px] w-[80px] rounded-full overflow-hidden">
                    <img src="/me.jpg" className="object-cover" alt="Alien501 (The Dev)" />
                </div>
                <p className="text-xs italic">Made with 💖 & 🎵</p>
                <p className="text-sm font-bold">Alien501 👽</p>
            </div>
            <div className="h-12 bg-slate-200/80 rounded-md flex justify-evenly items-center">
                <a href="https://github.com/Alien501" target="_blank" rel="noopener noreferrer" aria-label="Visit GitHub profile" className="h-8 w-8 bg-gray-400/60 text-gray-800/70 hover:bg-gray-950 hover:text-gray-50 transition-all duration-300 rounded-md flex items-center justify-center">
                    <GithubIcon />
                </a>
                <a href="mailto:cvignesh404@gmail.com" aria-label="Send email" className="h-8 w-8 bg-gray-400/60 text-gray-800/70 hover:bg-gray-950 hover:text-gray-50 transition-all duration-300 rounded-md flex items-center justify-center">
                    <MailIcon />
                </a>
                <a href="https://t.me/Alien_501" target="_blank" rel="noopener noreferrer" aria-label="Visit Telegram profile" className="h-8 w-8 bg-gray-400/60 text-gray-800/70 hover:bg-gray-950 hover:text-gray-50 transition-all duration-300 rounded-md flex items-center justify-center">
                    <TelegramIcon />
                </a>
                <a href="https://www.linkedin.com/in/vignesh-chellapandi-2207b5257/" target="_blank" rel="noopener noreferrer" aria-label="Visit LinkedIn profile" className="h-8 w-8 bg-gray-400/60 text-gray-800/70 hover:bg-gray-950 hover:text-gray-50 transition-all duration-300 rounded-md flex items-center justify-center">
                    <LinkedinIcon />
                </a>
            </div>
            <div className="h-max flex items-center justify-center flex-col space-y-2">
                <a target="_blank" rel="noopener noreferrer" href="https://github.com/Alien501/lrc-generator" aria-label="View source code on GitHub" className="bg-black hover:bg-black/90 transition-all duration-300 text-white text-sm font-semibold pr-3 pl-3 pt-2 pb-2 rounded-md">Source Code</a>
                <a href="https://www.buymeacoffee.com/alien501" target="_blank" rel="noopener noreferrer" aria-label="Buy me a coffee">
                    <img src="https://img.buymeacoffee.com/button-api/?text=Buy me a coffee&emoji=&slug=alien501&button_colour=FFDD00&font_colour=000000&font_family=Cookie&outline_colour=000000&coffee_colour=ffffff" alt="Buy me a coffee button" />
                </a>
                <p className="text-sm">Design inspired from <i><a href="https://www.musixmatch.com/" className="font-semibold hover:underline" target="_blank" rel="noopener noreferrer" aria-label="Visit Musixmatch website">Musixmatch</a></i></p>
            </div>
        </div>
    )
};

export default AboutCard;