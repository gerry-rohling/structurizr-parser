import { CstParser } from "chevrotain";
import { Workspace, allTokens } from "./Lexer";

class structurizrParser extends CstParser {

    constructor() {
        super(allTokens);

        // for conciseness
        const $ = this;
        
        // Rules go here
        $.RULE("workspace", () => {
            $.CONSUME(Workspace)
        });

        // very important to call this after all the rules have been defined.
        // otherwise the parser may not work correctly as it will lack information
        // derived during the self analysis phase.
        this.performSelfAnalysis();
    }
}

export const StructurizrParser = new structurizrParser();
export const BaseStructurizrVisitor = StructurizrParser.getBaseCstVisitorConstructorWithDefaults();