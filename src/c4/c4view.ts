export class C4View {
    
    private type: "SystemLandscape" | "SystemContext" | "Container" | "Component";
    private title?: string;
    private description?: string;

    constructor(type: "SystemLandscape" | "SystemContext" | "Container" | "Component", title?: string, description?: string) {
        this.type = type;
        this.title = title;
        this.description = description;
    }
}