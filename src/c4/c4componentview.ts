import { C4View } from "./c4view";

export class C4ComponentView extends C4View {
    /**
     *
     */
    constructor(title?: string, description?: string) {
        super("Component", title, description);
    }
}