import { Howl } from "howler";

// ─── Callbacks ────────────────────────────────────────────────────────────────

export interface SongCallbacks {
    onLoad?: (duration: number) => void;
    onEnd?:  () => void;
}

// ─────────────────────────────────────────────────────────────────────────────

class Song {
    // Howler instance — the actual audio engine
    private howl:    Howl | null = null;
    // The blob URL we created — we own its lifecycle (create + revoke)
    private _url:    string | null = null;
    // Total duration in seconds, populated once Howler fires onload
    private _duration = 0;
    // animation-frame ID for the tick loop
    private _rafId = 0;

    // ── Load / Unload ─────────────────────────────────────────────────────────

    /**
     * Load a File into Howler.
     * Creates the blob URL internally — callers never touch URLs.
     * Cleans up the previous sound automatically.
     */
    load(file: File, callbacks: SongCallbacks = {}): void {
        this.unload(); // clean up previous sound + revoke old URL

        this._url  = URL.createObjectURL(file); // we create it...
        this.howl  = new Howl({
            src:   [this._url],
            html5: true,
            onload: () => {
                this._duration = this.howl!.duration();
                callbacks.onLoad?.(this._duration);
            },
            onend: () => {
                callbacks.onEnd?.();
            },
        });
    }

    /**
     * Destroy the Howl instance and revoke the blob URL we created.
     * Call this in a useEffect cleanup, or when the user changes song.
     */
    unload(): void {
        this.stopTick();
        this.howl?.unload();
        this.howl = null;

        if (this._url) {
            URL.revokeObjectURL(this._url); // ...and we revoke it
            this._url = null;
        }

        this._duration = 0;
    }

    // ── Playback controls ─────────────────────────────────────────────────────

    play():  void { this.howl?.play(); }
    pause(): void { this.howl?.pause(); }

    /** Seek to an absolute position in seconds. */
    seek(seconds: number): void {
        this.howl?.seek(seconds);
    }

    /** Jump forward by delta seconds (default 3 s), clamped to duration. */
    forward(delta = 3): void {
        if (!this.howl) return;
        this.howl.seek(Math.min(this.currentTime + delta, this._duration));
    }

    /** Jump backward by delta seconds (default 3 s), clamped to 0. */
    rewind(delta = 3): void {
        if (!this.howl) return;
        this.howl.seek(Math.max(this.currentTime - delta, 0));
    }

    // ── Getters ───────────────────────────────────────────────────────────────

    /** Total duration of loaded audio in seconds. 0 if nothing loaded. */
    get duration():    number  { return this._duration; }

    /** Current playhead position in seconds (pulled from Howler on demand). */
    get currentTime(): number  { return (this.howl?.seek() as number) ?? 0; }

    /** True once a file has been loaded and Howler is ready. */
    get isLoaded():    boolean { return this.howl !== null; }

    // ── Tick loop ─────────────────────────────────────────────────────────────

    /**
     * Start an animation-frame loop that fires callback(currentTime) every
     * frame. Use this to pump the playback position into your Zustand store.
     *
     * Returns a cleanup function — drop it straight into a useEffect return:
     *
     *   useEffect(() => {
     *     if (playerStatus !== 'pause') return;
     *     return song.startTick((t) => setCurrentTimeStamp(t));
     *   }, [playerStatus]);
     */
    startTick(callback: (seconds: number) => void): () => void {
        const loop = () => {
            callback(this.currentTime);
            this._rafId = requestAnimationFrame(loop);
        };
        this._rafId = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(this._rafId); // cleanup
    }

    /** Stop the tick loop manually (usually prefer the cleanup fn instead). */
    stopTick(): void {
        cancelAnimationFrame(this._rafId);
    }

    // ── TODO: Song meta ───────────────────────────────────────────────────────
    // Read ID3 / Vorbis tags from the File so TopBar can pre-fill
    // title, artist, album without the user typing them.
    // Library to look at: music-metadata-browser
    getSongMeta() {
        return null;
    }
}

// ─── Singleton ────────────────────────────────────────────────────────────────
// One shared instance = one Howl across the whole app.
// Every component imports `song` and calls methods on it.

export const song = new Song();
export default Song;
