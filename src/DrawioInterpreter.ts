import { CstNode } from "chevrotain";
import { BaseStructurizrVisitor, StructurizrParser } from "./Parser";
import { MxBuilder } from "mxbuilder";
import { paths, components } from "./structurizr.schema";

// This class creates a Draw.io XML object from the parsed DSL

type WorkSpace = components["schemas"]["Workspace"];

class drawioInterpreter extends BaseStructurizrVisitor {

    private elementsByIdentifier = new Map<string, string>(); // identifier, id
    private mxWorkspace = new MxBuilder(); // Dummy object, should be overwritten when new builder created
    private theWorkspace:WorkSpace = {};

    constructor() {
        super();

        this.validateVisitor();
    }

    // This is the top level entry point. It will recurse then entire Parser tree and then build MX files
    // based on the view instructions
    workspaceWrapper(node: any) {
        console.log('Here we are at workspaceWrapper node:');
        this.theWorkspace.name = node.name;
        this.theWorkspace.description = node.description;
        if (node.workspaceSection) {
            this.visit(node.workspaceSection);
        }
        return this.mxWorkspace;
    }

    workspaceSection(node: any) {
        console.log('`Here we are at workspaceSection node:');
        if (node.modelSection) {
            this.visit(node.modelSection);
        }
        if (node.viewsSection) {
            this.visit(node.viewsSection);
        }
    }
}

export const DrawioInterpreter = new drawioInterpreter();