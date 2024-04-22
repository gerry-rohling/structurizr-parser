import { C4Element } from "./c4element";
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

    get People() {
        return this.people;
    }

    get SoftwareSystems() {
        return this.softwaresystems;
    }

    findElement(e_id: string) : C4Element[] {
        let tree: C4Element[] = [];

        // Find Person 
        for (const per of this.people){
            let tree = per.findElement(e_id);
            // If found, return tree
            if (tree.length > 0) {
                return tree;
            }
        }

        // If not, find element in Software Systems
        for (const element of this.softwaresystems){
            let tree = element.findElement(e_id);
            // If found, return tree
            if (tree.length > 0) {
                return tree;
            }
        }

        return tree;
    }
}