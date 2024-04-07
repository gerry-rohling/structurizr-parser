export class C4Relationship {
    private targetId: string;
    private description?: string;
    private technology?: string;

    constructor(targetId: string, description?: string, technology?: string) {
        this.targetId = targetId;
        this.description = description;
        this.technology = technology;
    }
}