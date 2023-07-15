import { BaseStructurizrVisitor, StructurizrParser } from "./Parser";

class structurizrInterpreter extends BaseStructurizrVisitor {

    constructor() {
        super();

        this.validateVisitor();
    }
}

export const StructurizrInterpreter = new structurizrInterpreter();