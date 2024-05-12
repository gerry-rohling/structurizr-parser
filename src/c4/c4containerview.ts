import { C4View } from "./c4view";

export class C4ContainerView extends C4View {

    private containerID: string;
    /**
     *
     */
    constructor(containerId:string, key?: string, description?: string, tags?: string) {
        super("Container", key, description ,tags);
        this.containerID = containerId;
    }

    get ContainerId() {
        return this.containerID;
    }
}