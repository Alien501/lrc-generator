import type { ReactNode } from "react";
import { Model } from "./Model";

export type Tab = "lyrics" | "sync";

interface UIState {
    tab: Tab;
    playerExpanded: boolean;
    modal: { title: string; content: ReactNode } | null;
}

const initialState: UIState = {
    tab: "lyrics",
    playerExpanded: false,
    modal: null,
};

export class UI extends Model<UIState> {
    constructor() {
        super(initialState);
    }

    setTab = (tab: Tab) => this.setState({ tab });

    togglePlayer = () => this.setState({ playerExpanded: !this.state.playerExpanded });

    openModal = (title: string, content: ReactNode) => this.setState({ modal: { title, content } });

    closeModal = () => this.setState({ modal: null });

    reset = () => this.setState(initialState);
}
