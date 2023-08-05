import { CstNode } from "chevrotain";
import { BaseStructurizrVisitor, StructurizrParser } from "./Parser";
import { Workspace } from "structurizr-typescript";

class structurizrInterpreter extends BaseStructurizrVisitor {

    private elementsByIdentifier = new Map<string, string>(); // identifier, id
    private workspace: Workspace = new Workspace("",""); // Dummy object, should be overwritten when new Cst provided
    
    constructor() {
        super();

        this.validateVisitor();
    }

    workspaceWrapper(node: any) {
        console.log(`Here we are at workspaceWrapper with node: ${node.name}`);
        this.workspace = new Workspace("Name", "Description"); // Two options string literals after workspace keyword
        if (node.workspaceSection) {
            this.visit(node.workspaceSection);
        }
        return this.workspace;
    }

    workspaceSection(node: any) {
        console.log(`Here we are at workspaceSection with node: ${node.name}`);
        if (node.modelSection) {
            this.visit(node.modelSection);
        }
        if (node.viewsSection) {
            this.visit(node.viewsSection);
        }
    }

    modelSection(node: any) {
        console.log(`Here we are at modelSection with node: ${node.name}`);
        if (node.modelChildSection) {
            this.visit(node.modelChildSection);
        }
    }

    modelChildSection(node: any) {
        console.log(`Here we are at modelChildSection with node: ${node.name}`);
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
        console.log(`Here we are at personSection with node: ${node.name}`);
        const name = node.StringLiteral[0].image ?? "";
        const desc = node.StringLiteral[1].image ?? "";
        const p = this.workspace.model.addPerson(stripQuotes(name), stripQuotes(desc));
        if (node.identifier && p) {
            this.elementsByIdentifier.set(stripQuotes(node.identifier[0].image), p.id);
        }
    }

    softwareSystemSection(node: any) {
        console.log(`Here we are at softwareSystemSection with node: ${node.name}`);
        const name = node.StringLiteral[0].image ?? "";
        const desc = node.StringLiteral[1].image ?? "";
        const s = this.workspace.model.addSoftwareSystem(stripQuotes(name), stripQuotes(desc));
        if (node.identifier && s) {
            this.elementsByIdentifier.set(stripQuotes(node.identifier[0].image), s.id);
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
        console.log(`Here we are at explicitRelationship with node: ${node.name}`);
        const s_id = this.elementsByIdentifier.get(node.identifier[0].image);
        const t_id = this.elementsByIdentifier.get(node.identifier[1].image);
        if (s_id && t_id) {
            const source = this.workspace.model.getElement(s_id);
            const target = this.workspace.model.getElement(t_id);
            const desc = node.StringLiteral[0].image ?? "";
            const r = this.workspace.model.addRelationship(source, target, desc);
        } else {
            throw new Error("Unknown identifiers used in relationship definition");
        }
    }

    implicitRelationship(node: any) {
        console.log(`Here we are at implicitRelationship with node: ${node.name}`);
    }

    deploymentEnvironmentSection(node: any) {
        console.log(`Here we are at deploymentEnvironmentSection with node: ${node.name}`);
    }

    deploymentEnvironmentChildSection(node: any) {
        console.log(`Here we are at deploymentEnvironmentChildSection with node: ${node.name}`);
    }

    deploymentNodeSection(node: any) {
        console.log(`Here we are at deploymentNodeSection with node: ${node.name}`);
    }

    deploymentNodeChildSection(node: any) {
        console.log(`Here we are at deploymentNodeChildSection with node: ${node.name}`);
    }

    containerInstanceSection(node: any) {
        console.log(`Here we are at containerInstanceSection with node: ${node.name}`);
    }

    softwareSystemInstanceSection(node: any) {
        console.log(`Here we are at softwareSystemInstanceSection with node: ${node.name}`);
    }

    viewsSection(node: any) {
        console.log(`Here we are at viewsSection with node: ${node.name}`);
    }

    viewsChildSection(node: any) {
        console.log(`Here we are at viewsChildSection with node: ${node.name}`);
    }

    systemLandscapeView(node: any) {
        console.log(`Here we are at systemLandscapeView with node: ${node.name}`);
    }

    viewOptions(node: any) {
        console.log(`Here we are at viewOptions with node: ${node.name}`);
    }

    includeOptions(node: any) {
        console.log(`Here we are at includeOptions with node: ${node.name}`);
    }

    autoLayoutOptions(node: any) {
        console.log(`Here we are at autoLayoutOptions with node: ${node.name}`);
    }

    animationOptions(node: any) {
        console.log(`Here we are at animationOptions with node: ${node.name}`);
    }

    descriptionOptions(node: any) {
        console.log(`Here we are at descriptionOptions with node: ${node.name}`);
    }

    propertiesOptions(node: any) {
        console.log(`Here we are at propertiesOptions with node: ${node.name}`);
    }

    systemContextView(node: any) {
        console.log(`Here we are at systemContextView with node: ${node.name}`);
    }

    containerView(node: any) {
        console.log(`Here we are at containerView with node: ${node.name}`);
    }

    componentView(node: any) {
        console.log(`Here we are at componentView with node: ${node.name}`);
    }

    imageSection(node: any) {
        console.log(`Here we are at imageSection with node: ${node.name}`);
    }

    dynamicSection(node: any) {
        console.log(`Here we are at dynamicSection with node: ${node.name}`);
    }

    deploymentSection(node: any) {
        console.log(`Here we are at deploymentSection with node: ${node.name}`);
    }

    stylesSection(node: any) {
        console.log(`Here we are at stylesSection with node: ${node.name}`);
    }

    elementStyleSection(node: any) {
        console.log(`Here we are at elementStyleSection with node: ${node.name}`);
    }

    relationshipStyleSection(node: any) {
        console.log(`Here we are at relationshipStyleSection with node: ${node.name}`);
    }

    shapeStyle(node: any) {
        console.log(`Here we are at shapeStyle with node: ${node.name}`);
    }

    backgroundStyle(node: any) {
        console.log(`Here we are at backgroundStyle with node: ${node.name}`);
    }

    colorStyle(node: any) {
        console.log(`Here we are at colorStyle with node: ${node.name}`);
    }

    colourStyle(node: any) {
        console.log(`Here we are at colourStyle with node: ${node.name}`);
    }

    fontStyle(node: any) {
        console.log(`Here we are at fontStyle with node: ${node.name}`);
    }

    opacityStyle(node: any) {
        console.log(`Here we are at opacityStyle with node: ${node.name}`);
    }
}

function stripQuotes(str: string) : string {
    // Fail if an invalid argument is provided
    if (typeof str !== 'string') {
      throw new TypeError('Expected a string');
    }
    return str.replace(/^"(.+)"$/, '$1');
  }

export const StructurizrInterpreter = new structurizrInterpreter();