import { C4Person } from "./c4person";
import { C4SoftwareSystem } from "./c4softwaresystem";

export class C4Group {

    private id: string;
    private name: string;

    private people:C4Person[] = [];
    private softwaresystems:C4SoftwareSystem[] = [];

    constructor(id:string, name:string ) {
        this.id = id;
        this.name = name;
    } 

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
                return true;
            }
        }
        // Find entity
        for (const element of this.softwaresystems){
            const ele = element.findSourceElement(s_id);
            // If found, add relationship
            if (ele != undefined) {
                ele.addRelationship(t_id, desc);
                return true;
            }
        }
        return false;
    }

    get People() {
        return this.people;
    }

    get SoftwareSystems() {
        return this.softwaresystems;
    }
}