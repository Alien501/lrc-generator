import type { ReactNode } from "react";
import { Model } from "./Model";

interface UIState {
    modal: { title: string; content: ReactNode } | null;
}

const initialState: UIState = {
    modal: null,
};

export class UI extends Model<UIState> {
    constructor() {
        super(initialState);
    }

    openModal = (title: string, content: ReactNode) => this.setState({ modal: { title, content } });

    closeModal = () => this.setState({ modal: null });

    reset = () => this.setState(initialState);
}
