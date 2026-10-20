# Code guide

State and logic live in **models** (plain classes). Components only **read** state and **call** methods.

```
models/     Song, Lyrics, UI: state + actions, one shared instance each (models/index.ts)
lib/        Pure helpers with no state: LRC building, time formatting
components/ UI only
pages/      Route-level screens
```

## Reading and changing state

```tsx
import { song, lyrics } from "@/models";

const playing = song.use((s) => s.playing);   // re-renders only when `playing` changes
<button onClick={song.toggle} />               // actions are plain methods
lyrics.next(song.currentTime);                 // models can be used together anywhere
```

- Select the smallest value you need. A selector must return a primitive or an existing reference, never a new `{}`/`[]` (that re-renders forever).
- Outside React (event handlers, other models), use `model.getState()` or getters, not `use()`.

## Adding a feature

**New behaviour on an existing model**: add a method to the class and update state with `setState`:

```ts
// models/Song.ts
setRate = (rate: number) => {
    this.howl?.rate(rate);
    this.setState({ rate });   // add `rate` to SongState + initialState too
};
```

Then use it in any component: `song.use((s) => s.rate)` / `song.setRate(1.5)`.

**New model**: extend `Model`, then export one instance from `models/index.ts` (and reset it in `resetSession` if needed):

```ts
export class Settings extends Model<{ theme: "light" | "dark" }> {
    constructor() { super({ theme: "light" }); }
    toggleTheme = () => this.setState({ theme: this.state.theme === "light" ? "dark" : "light" });
}
```

**New export format or formatting logic**: add a pure function in `lib/` that takes data and returns a value.

## Rules of thumb

- No business logic in components; if it's more than calling a method, it belongs in a model or `lib/`.
- Write actions as arrow properties (`name = () => {}`) so they can be passed straight to `onClick`.
- Keep UI-only state (hover, drag, refs) in the component with `useState`/`useRef`.
