import { C4Container } from "./c4container";
import { C4Element } from "./c4element";

export class C4Component extends C4Element {

    constructor(id: string, name: string, description?: string, tags?: string) {
        super(id, name, description, tags);
    }
    
    findElement(e_id: string) : C4Element[] {
        let reply:C4Element[] = [];
        if (this.Id === e_id) {
            reply.push(this);
            return reply;
        } 
        return reply;
    }
}