import { CstNode } from "chevrotain";
import { BaseStructurizrVisitor, StructurizrParser } from "./Parser";
import { MxBuilder } from "mxbuilder";
// import { paths, components } from "./structurizr.schema";

// This class creates a Draw.io XML object from the parsed DSL

//  type WorkSpace = components["schemas"]["Workspace"];

class drawioInterpreter extends BaseStructurizrVisitor {

    private elementsByIdentifier = new Map<string, string>(); // identifier, id
    private mxWorkspace = new MxBuilder(); // Dummy object, should be overwritten when new builder created
    // private theWorkspace:WorkSpace = {};

    constructor() {
        super();

        this.validateVisitor();
    }

    // This is the top level entry point. It will recurse the entire Parser tree and then build MX files
    // based on the view instructions
    workspaceWrapper(node: any) {
        console.log('Here we are at workspaceWrapper node:');
        // this.theWorkspace.name = node.name;
        // this.theWorkspace.description = node.description;
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

    modelSection(node: any) {
        console.log('Here we are at modelSection node:');
        if (node.modelChildSection) {
            this.visit(node.modelChildSection);
        }
    }

    modelChildSection(node: any) {
        console.log('Here we are at modelChildSection node:');
        if (node.groupSection) { for (const group of node.groupSection) { this.visit(group); }}
        if (node.personSection) { for (const person of node.personSection) { this.visit(person); }}
        if (node.softwareSystemSection) { for (const sSystem of node.softwareSystemSection) { this.visit(sSystem); }}
        if (node.explicitRelationship) { for (const relationship of node. explicitRelationship) { this.visit(relationship); }}
        if (node.deploymentEnvironmentSection) { for (const depEnv of node.deploymentEnvironmentSection) { this.visit(depEnv); }}
    }

    groupSection(node: any) {
        console.log(`Here we are at groupSection with node: ${node.name}`);
        // We do not seem to have group elements supported?!
        // const g = this.workspace.model.
        // Just iterate over child elements for now
    }

    groupChildSection(node: any) {
        console.log(`Here we are at groupChildSection with node: ${node.name}`);
    }

    personSection(node: any) {
        console.log('Here we are at personSection node:');
        const name = node.StringLiteral[0]?.image ?? "";
        const desc = node.StringLiteral[1]?.image ?? "";
        const p = this.mxWorkspace.placePerson(stripQuotes(name), stripQuotes(desc));
        // const p = this.workspace.model.addPerson(stripQuotes(name), stripQuotes(desc));
        if (node.identifier && p) {
            this.elementsByIdentifier.set(stripQuotes(node.identifier[0].image), p);
        }
    }

    softwareSystemSection(node: any) {
        console.log('Here we are at softwareSystemSection node:');
        const name = node.StringLiteral[0]?.image ?? "";
        const desc = node.StringLiteral[1]?.image ?? "";
        const s = this.mxWorkspace.placeSoftwareSystem(stripQuotes(name), stripQuotes(desc));
        // const s = this.workspace.model.addSoftwareSystem(stripQuotes(name), stripQuotes(desc));
        if (node.identifier && s) {
            this.elementsByIdentifier.set(stripQuotes(node.identifier[0].image), s);
        }
    }

    softwareSystemChildSection(node: any) {
        console.log(`Here we are at softwareSystemChildSection with node: ${node.name}`);
    }

    containerSection(node: any) {
        console.log(`Here we are at ContainerSection with node: ${node.name}`);
    }

    containerChildSection(node: any) {
        console.log(`Here we are at ContainerChildSection with node: ${node.name}`);
    }

    componentSection(node: any) {
        console.log(`Here we are at ComponentSection with node: ${node.name}`);
    }

    explicitRelationship(node: any) {
        console.log('Here we are at explicitRelationship node:');
        const s_id = this.elementsByIdentifier.get(node.identifier[0].image);
        const t_id = this.elementsByIdentifier.get(node.identifier[1].image);
        if (s_id && t_id) {
            // const source = this.workspace.model.getElement(s_id);
            // const target = this.workspace.model.getElement(t_id);
            const desc = node.StringLiteral[0]?.image ?? "";
            const r = this.mxWorkspace.placeRelationship(desc, "", s_id, t_id);
            // const r = this.workspace.model.addRelationship(source, target, desc);
        } else {
            throw new Error("Unknown identifiers used in relationship definition");
        }
    }
}

// HELPER FUNCTIONS

function stripQuotes(str: string) : string {
    // Fail if an invalid argument is provided
    if (typeof str !== 'string') {
      throw new TypeError('Expected a string');
    }
    return str.replace(/^"(.+)"$/, '$1');
}

export const DrawioInterpreter = new drawioInterpreter();