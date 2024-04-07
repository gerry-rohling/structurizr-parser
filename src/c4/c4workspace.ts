import { C4Model } from "./c4model";
import { C4Person } from "./c4person";
import { C4Relationship } from "./c4relationship";
import { C4SoftwareSystem } from "./c4softwaresystem";
import { C4SystemLandscapeView } from "./c4systemlandscapeview";
import { C4View } from "./c4view";

export class C4Workspace {

    private id: string;
    private name: string;
    private description?: string;

    private model: C4Model = new C4Model();
    private views: C4View[] = [];

    constructor(id:string, name:string, description?:string) {
        this.id = id;
        this.name = name;
        this.description = description;
    }

    addPerson(person: C4Person) {
        this.model.addPerson(person);
    }

    addSoftwareSystem(ssys: C4SoftwareSystem) {
        this.model.addSoftwareSystem(ssys);
    }

    addRelationship(s_id: string, t_id: string, desc: string) {
        this.model.addRelationship(s_id, t_id, desc);
    }

    addView(view: C4SystemLandscapeView) {
        this.views.push(view);
    }
}