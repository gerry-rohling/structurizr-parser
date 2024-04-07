import { C4View } from "./c4view";

export class C4SystemContextView extends C4View {

    private systemID: string;
    /**
     *
     */
    constructor(systemId: string, key?:string,  description?: string) {
        super("SystemContext", key, description);
        this.systemID = systemId;
    }
}