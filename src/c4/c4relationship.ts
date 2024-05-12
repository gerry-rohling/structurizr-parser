export class C4Relationship {
    private sourceId: string;
    private destinationId: string;
    private description?: string;
    private technology?: string;
    private tags?: string;

    constructor(sourceId: string, destinationId: string, description?: string, technology?: string, tags?: string) {
        this.sourceId = sourceId;
        this.destinationId = destinationId;
        this.description = description ?? '';
        this.technology = technology ?? '';
        this.tags = tags ?? '';
    }

    get SourceId() {
        return this.sourceId;
    }

    get DestinationId() {
        return this.destinationId;
    }


    get Description() {
        return this.description;
    }

    get Technology() {
        return this.technology;
    }

    get Tags() {
        return this.tags;
    }
}