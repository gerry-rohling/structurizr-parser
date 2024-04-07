import { C4Element } from "./c4element";

export class C4Person extends C4Element {

    private location?: "External" | "Internal" | "Unspecified";

    constructor(id: string, name: string, description?: string, location?: "External" | "Internal" | "Unspecified") {
        super(id, name, description);
        this.location = location;
    }

    findSourceElement(s_id: string) {
        if (this.Id === s_id) {
            return this;
        } 
        return undefined;
    }
}