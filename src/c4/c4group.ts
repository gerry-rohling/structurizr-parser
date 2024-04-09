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
}