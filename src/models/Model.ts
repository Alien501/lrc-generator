import { useSyncExternalStore } from "react";

type Listener = () => void;

// Base for every domain model: state lives here and only changes through setState.
// Components read it with `model.use(selector)` and call actions directly, no props needed.
export abstract class Model<S extends object> {
    private listeners = new Set<Listener>();

    constructor(protected state: S) {}

    getState = () => this.state;

    subscribe = (listener: Listener) => {
        this.listeners.add(listener);
        return () => {
            this.listeners.delete(listener);
        };
    };

    // The selector must return a primitive or an existing reference, never a new object/array.
    use<T>(selector: (state: S) => T): T {
        // This is a hook; call sites (`song.use(...)`) are still checked by rules-of-hooks.
        // eslint-disable-next-line react-hooks/rules-of-hooks
        return useSyncExternalStore(this.subscribe, () => selector(this.state));
    }

    protected setState(patch: Partial<S>) {
        const changed = (Object.keys(patch) as (keyof S)[]).some((key) => !Object.is(patch[key], this.state[key]));
        if (!changed) return;
        this.state = { ...this.state, ...patch };
        this.listeners.forEach((listener) => listener());
    }
}
