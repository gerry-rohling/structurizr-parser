import { C4Component } from "./c4component";
import { C4Element } from "./c4element";

export class C4Container extends C4Element {

    private components:C4Component[] = [];

    constructor(id: string, name: string, description?: string) {
        super(id, name, description);
    }

    addComponent(component: C4Component) {
        this.components.push(component);
    }

    findElement(e_id: string) : C4Element[] {
        let reply:C4Element[] = [];
        if (this.Id === e_id) {
            reply.push(this);
            return reply;
        } else {
            for (const con of this.components)  {
                const ele = con.findElement(e_id);
                if (ele.length > 0) {
                    reply.push(this);
                    reply.push(...ele);
                    return reply;
                } 
            }
        }
        return reply;
    }

    get Components() {
        return this.components;
    }
}