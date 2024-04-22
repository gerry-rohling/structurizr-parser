import { C4Element } from "./c4element";

export class C4Person extends C4Element {

    private location?: "External" | "Internal" | "Unspecified";

    constructor(id: string, name: string, description?: string, location?: "External" | "Internal" | "Unspecified") {
        super(id, name, description);
        this.location = location;
    }

    findElement(e_id: string) : C4Element[] { 
        let reply:C4Element[] = [];
        if (this.Id === e_id) {
            reply.push(this);
            return reply;
        } 
        return reply;
    }

    get Location() {
        return this.location;
    }
}