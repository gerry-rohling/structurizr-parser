export class C4View {
    
    private type: "SystemLandscape" | "SystemContext" | "Container" | "Component";
    private key?: string;
    private description?: string;
    private include:string[] = [];

    constructor(type: "SystemLandscape" | "SystemContext" | "Container" | "Component", key?: string, description?: string) {
        this.type = type;
        this.key = key;
        this.description = description;
    }

    includeEntity(id:string) {
        this.include.push(id);
    }

    get Type() {
        return this.type;
    }

    get Key() {
        return this.key;
    }

    get Description() {
        return this.description;
    }

    get Include() {
        return this.include;
    }
}