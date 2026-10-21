type SyncLayoutProps = {
    topBar: React.JSX.Element;
    mainContent: React.JSX.Element;
    bottomBar: React.JSX.Element;
}

export default function SyncLayout({
    topBar,
    mainContent,
    bottomBar,
}: SyncLayoutProps) {
    return(
    <div className="h-dvh overflow-hidden grid grid-rows-[60px_1fr_60px]">
        {
            topBar
        }
        <div className="bg-zinc-100 overflow-y-scroll">
            <div className="w-[95%] sm:w-[80%] mx-auto h-full m-2">
                {mainContent}
            </div>
        </div>
        {
            bottomBar
        }
    </div>
    )
}