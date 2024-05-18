import { C4ElementStyle } from "./c4elementstyle";
import { C4Group } from "./c4group";
import { C4Model } from "./c4model";
import { C4Person } from "./c4person";
import { C4Relationship } from "./c4relationship";
import { C4RelationshipStyle } from "./c4relationshipstyle";
import { C4SoftwareSystem } from "./c4softwaresystem";
import { C4Styles } from "./c4styles";
import { C4SystemLandscapeView } from "./c4systemlandscapeview";
import { C4View } from "./c4view";

export class C4Workspace {

    private id: string;
    private name: string;
    private description?: string;

    private model: C4Model = new C4Model();
    private views: C4View[] = [];
    private styles: C4Styles = new C4Styles();

    constructor(id:string, name:string, description?:string) {
        this.id = id;
        this.name = name;
        this.description = description;
    }

    addGroup(group: C4Group) {
        this.model.addGroup(group);
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

    addRelationshipStyle(style: C4RelationshipStyle) {
        this.styles.addRelationshipStyle(style);
    }

    addElementStyle(style: C4ElementStyle) {
        this.styles.addElementStyle(style);
    }

    get Model() {
        return this.model;
    }

    get Views() {
        return this.views;
    }

    get Styles() {
        return this.styles;
    }
}