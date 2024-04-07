import { C4Component } from "./c4component";
import { C4Element } from "./c4element";

export class C4Container extends C4Element {

    private components:C4Component[] = [];

    constructor(id: string, name: string, description?: string) {
        super(id, name, description);
    }

    findSourceElement(s_id: string) {
        if (this.Id === s_id) {
            return this;
        } else {
            for (const com of this.components)  {
                const ele = com.findSourceElement(s_id);
                if (ele != undefined) {
                    return ele;
                } 
            }
        }
        return undefined;
    }
}