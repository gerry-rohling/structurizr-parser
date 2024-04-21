import { C4Container } from "./c4container";
import { C4Element } from "./c4element";

export class C4Component extends C4Element {

    constructor(id: string, name: string, description?: string) {
        super(id, name, description);
    }
    
    findSourceElement(s_id: string) : C4Element | undefined {
        if (this.Id === s_id) {
            return this;
        } 
        return undefined;
    }
}