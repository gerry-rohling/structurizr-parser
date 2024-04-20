import { C4ElementStyle } from "./c4elementstyle";
import { C4RelationshipStyle } from "./c4relationshipstyle";

export class C4Styles {

    private elementStyles: C4ElementStyle[] = [];
    private relationshipStyles: C4RelationshipStyle[] = [];

    constructor() {
        
    }

    addElementStyle(style: C4ElementStyle) {
        this.elementStyles.push(style);
    }

    addRelationshipStyle(style: C4RelationshipStyle) {
        this.relationshipStyles.push(style);
    }

    get ElementStyles() {
        return this.elementStyles;
    }

    get RelationshipStyles() {
        return this.relationshipStyles;
    }
}