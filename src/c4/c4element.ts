import { C4Relationship } from "./c4relationship";

export class C4Element {

    private id: string;
    private name: string;
    private description?: string;
    private relationships:C4Relationship[] = [];

    constructor(id: string, name: string, description?: string) {
        this.id = id;
        this.name = name;
        this.description = description;
    }

    get Id() {
        return this.id;
    }

    get Name() {
        return this.name;
    }

    get Description() {
        return this.description;
    }

    get Relationships() {
        return this.relationships;
    }

    addRelationship(targetId: string, description?: string, technology?: string) {
        const rel = new C4Relationship(targetId, description, technology);
        this.relationships.push(rel);
    }
}