import { C4Element } from "./c4element";
import { C4Group } from "./c4group";
import { C4Person } from "./c4person";
import { C4SoftwareSystem } from "./c4softwaresystem";

export class C4Model {

    private people:C4Person[] = [];
    private softwaresystems:C4SoftwareSystem[] = [];
    private groups:C4Group[] = [];

    constructor() {} 

    addGroup(group: C4Group) {
        this.groups.push(group);
    }

    addPerson(person: C4Person) {
        this.people.push(person);
    }

    addSoftwareSystem(ssys: C4SoftwareSystem) {
        this.softwaresystems.push(ssys);
    }

    addRelationship(s_id: string, t_id: string, desc: string, technology?: string, tags?: string){
        let source_tree = this.findElement(s_id);
        let target_tree = this.findElement(t_id);
        if (source_tree.length > 0){
            // Source and target found
            // Add documented relationship
            let src_ele = source_tree.pop();
            let tgt_ele = target_tree.pop();
            src_ele?.addRelationship(s_id, t_id, desc, technology, tags);
        }
    }

    findElement(e_id: string) : C4Element[] {
        let tree: C4Element[] = [];

        // Find person in root Model
        for (const per of this.people){
            let tree = per.findElement(e_id);
            // If found, return tree
            if (tree.length > 0) {
                return tree;
            }
        }

        // If not, find element in root Software Systems
        for (const element of this.softwaresystems){
            let tree = element.findElement(e_id);
            // If found, return tree
            if (tree.length > 0) {
                return tree;
            }
        }

        // If not, find element in any groups
        for (const grp of this.groups){
            let tree = grp.findElement(e_id);
            // If found, return tree
            if (tree.length > 0) {
                return tree;
            }
        }

        return tree;
    }

    get People() {
        return this.people;
    }

    get SoftwareSystems() {
        return this.softwaresystems;
    }

    get Groups() {
        return this.groups;
    }
}