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
    findSourceElement(s_id: string) : C4Element | undefined {
        if (this.Id === s_id) {
            return this;
        } else {
            for (const con of this.containers)  {
                const ele = con.findSourceElement(s_id);
                if (ele != undefined) {
                    return ele;
                } 
            }
        }
        return undefined;
    }
}