export class C4View {
    
    private type: "SystemLandscape" | "SystemContext" | "Container" | "Component";
    private key?: string;
    private description?: string;

    constructor(type: "SystemLandscape" | "SystemContext" | "Container" | "Component", key?: string, description?: string) {
        this.type = type;
        this.key = key;
        this.description = description;
    }
}