import { C4Relationship } from "./c4relationship";

export class C4Element {

    private id: string;
    private name: string;
    private description?: string;
    private parentId?: string;
    private relationships: C4Relationship[] = [];
    private proxyRelationships: C4Relationship[] = [];

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

    get ParentId() {
        return this.parentId;
    }

    get Relationships() {
        return this.relationships;
    }

    get ProxyRelationships() {
        return this.proxyRelationships;
    }

    setParentId(parentId: string) {
        this.parentId = parentId;
    }

    addRelationship(targetId: string, description?: string, technology?: string) {
        const rel = new C4Relationship(targetId, description, technology);
        this.relationships.push(rel);
    }

    addProxyRelationship(targetId: string, description?: string, technology?: string){
        const rel = new C4Relationship(targetId, description, technology);
        this.proxyRelationships.push(rel);
    }
}