import { C4View } from "./c4view";

export class C4ContainerView extends C4View {

    private containerID: string;
    /**
     *
     */
    constructor(containerId:string, key?: string, description?: string) {
        super("Container", key, description);
        this.containerID = containerId;
    }
}