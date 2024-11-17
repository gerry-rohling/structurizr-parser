import { C4Relationship } from "./c4relationship";

export class C4Element {

    private id: string;
    private name: string;
    private description: string;
    private tags: string[] = [];
    private relationships: C4Relationship[] = [];

    constructor(id: string, name: string, description?: string, tags?: string[]) {
        this.id = id;
        this.name = name;
        this.description = description ?? '';
        if (tags){
            this.tags.push(...tags);
        }
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

    get Tags() {
        return this.tags;
    }

    get Relationships() {
        return this.relationships;
    }

    addRelationship(targetId: string, description?: string, technology?: string) {
        const rel = new C4Relationship(targetId, description, technology);
        this.relationships.push(rel);
    }

}