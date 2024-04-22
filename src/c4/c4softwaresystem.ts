import { C4Container } from "./c4container";
import { C4Element } from "./c4element";

export class C4SoftwareSystem extends C4Element {
    
    private containers:C4Container[] = [];

    constructor(id: string, name: string, description?: string) {
        super(id, name, description);
    }

    addContainer(container: C4Container) {
        this.containers.push(container);
    }

    // This method recursively checks for an element with the ID matching the provided value
    findElement(e_id: string) : C4Element[] {
        let reply:C4Element[] = [];
        if (this.Id === e_id) {
            reply.push(this);
            return reply;
        } else {
            for (const con of this.containers)  {
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

    get Containers() {
        return this.containers;
    }
}