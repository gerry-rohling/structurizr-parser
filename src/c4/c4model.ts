import { C4Person } from "./c4person";
import { C4Relationship } from "./c4relationship";
import { C4SoftwareSystem } from "./c4softwaresystem";

export class C4Model {

    private people:C4Person[] = [];
    private softwaresystems:C4SoftwareSystem[] = [];

    constructor() {} 

    addPerson(person: C4Person) {
        this.people.push(person);
    }

    addSoftwareSystem(ssys: C4SoftwareSystem) {
        this.softwaresystems.push(ssys);
    }

    addRelationship(s_id: string, t_id: string, desc: string) {
        // Find person
        for (const per of this.people){
            const ele = per.findSourceElement(s_id);
                        // If found, add relationship
                        if (ele != undefined) {
                            ele.addRelationship(t_id, desc);
                            return;
                        }
        }
        // Find entity
        for (const element of this.softwaresystems){
            const ele = element.findSourceElement(s_id);
            // If found, add relationship
            if (ele != undefined) {
                ele.addRelationship(t_id, desc);
                return;
            }
        }
    }
}