import { Howl } from "howler";
import { Model } from "./Model";

interface SongState {
    file: File | null;
    playing: boolean;
    position: number;
    duration: number;
}

const initialState: SongState = {
    file: null,
    playing: false,
    position: 0,
    duration: 0,
};

export class Song extends Model<SongState> {
    private howl: Howl | null = null;
    private url: string | null = null;
    private frame = 0;

    constructor() {
        super(initialState);
    }

    searchForLyricsOnline() {
        window.open(`https://google.com/search?q=${this.baseName} Song Lyrics`)
    }

    get name() {
        return this.state.file?.name.trim() ?? "";
    }

    get baseName() {
        return this.state.file?.name.split(".")[0] ?? "";
    }

    // Read straight from the player so sync stamps are exact, not one frame behind.
    get currentTime() {
        return (this.howl?.seek() as number | undefined) ?? 0;
    }

    static getFileObjectURL(file: File) {
        return URL.createObjectURL(file);
    }

    load = (file: File) => {
        this.unload();
        this.url = Song.getFileObjectURL(file);

        const howl = new Howl({
            src: [this.url],
            html5: true,
            onload: () => this.setState({ duration: howl.duration() }),
            onend: () => {
                this.stopTicking();
                this.setState({ playing: false, position: 0 });
            },
            onseek: () => this.setState({ position: this.currentTime }),
        });

        this.howl = howl;
        this.setState({ ...initialState, file });
    };

    play = () => {
        if (!this.howl || this.state.playing) return;
        this.howl.play();
        this.setState({ playing: true });
        this.tick();
    };

    pause = () => {
        if (!this.howl) return;
        this.howl.pause();
        this.stopTicking();
        this.setState({ playing: false, position: this.currentTime });
    };

    toggle = () => (this.state.playing ? this.pause() : this.play());

    seek = (time: number) => {
        if (!this.howl) return;
        const clamped = Math.min(Math.max(time, 0), this.state.duration || time);
        this.howl.seek(clamped);
        this.setState({ position: clamped });
    };

    skip = (delta: number) => this.seek(this.currentTime + delta);

    reset = () => {
        this.unload();
        this.setState(initialState);
    };

    private tick = () => {
        this.setState({ position: this.currentTime });
        this.frame = requestAnimationFrame(this.tick);
    };

    private stopTicking() {
        cancelAnimationFrame(this.frame);
    }

    private unload() {
        this.stopTicking();
        this.howl?.unload();
        this.howl = null;
        if (this.url) URL.revokeObjectURL(this.url);
        this.url = null;
    }
}
