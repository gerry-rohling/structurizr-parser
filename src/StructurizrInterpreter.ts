import { CstNode } from "chevrotain";
import { BaseStructurizrVisitor, StructurizrParser } from "./Parser";
import { RankDirection, SoftwareSystem, Workspace } from "structurizr-typescript";

// This class creates a structurizr workspace object from the parsed DSL

class structurizrInterpreter extends BaseStructurizrVisitor {
    #debug: boolean = false;

    private elementsByIdentifier = new Map<string, string>(); // identifier, id
    private workspace: Workspace = new Workspace("",""); // Dummy object, should be overwritten when new Cst provided
    
    constructor() {
        super();

        this.validateVisitor();
    }

    setDebug(debug: boolean) {
        this.#debug = debug;
    }

    workspaceWrapper(node: any) {
        this.#debug && console.log('Here we are at workspaceWrapper node:');
        this.workspace = new Workspace("Name", "Description"); // Two options string literals after workspace keyword
        if (node.workspaceSection) {
            this.visit(node.workspaceSection);
        }
        return this.workspace;
    }

    workspaceSection(node: any) {
        this.#debug && console.log('`Here we are at workspaceSection node:');
        if (node.modelSection) {
            this.visit(node.modelSection);
        }
        if (node.viewsSection) {
            this.visit(node.viewsSection);
        }
    }

    modelSection(node: any) {
        this.#debug && console.log('Here we are at modelSection node:');
        if (node.modelChildSection) {
            this.visit(node.modelChildSection);
        }
    }

    modelChildSection(node: any) {
        this.#debug && console.log('Here we are at modelChildSection node:');
        if (node.groupSection) { for (const group of node.groupSection) { this.visit(group); }}
        if (node.personSection) { for (const person of node.personSection) { this.visit(person); }}
        if (node.softwareSystemSection) { for (const sSystem of node.softwareSystemSection) { this.visit(sSystem); }}
        if (node.explicitRelationship) { for (const relationship of node. explicitRelationship) { this.visit(relationship); }}
        if (node.deploymentEnvironmentSection) { for (const depEnv of node.deploymentEnvironmentSection) { this.visit(depEnv); }}
    }

    groupSection(node: any) {
        this.#debug && console.log(`Here we are at groupSection with node: ${node.name}`);
        // We do not seem to have group elements supported?!
        // const g = this.workspace.model.
        // Just iterate over child elements for now
    }

    groupChildSection(node: any) {
        this.#debug && console.log(`Here we are at groupChildSection with node: ${node.name}`);
    }

    personSection(node: any) {
        this.#debug && console.log('Here we are at personSection node:');
        const name = node.StringLiteral[0]?.image ?? "";
        const desc = node.StringLiteral[1]?.image ?? "";
        const p = this.workspace.model.addPerson(stripQuotes(name), stripQuotes(desc));
        if (node.identifier && p) {
            this.elementsByIdentifier.set(stripQuotes(node.identifier[0].image), p.id);
        }
    }

    softwareSystemSection(node: any) {
        this.#debug && console.log('Here we are at softwareSystemSection node:');
        const name = node.StringLiteral[0]?.image ?? "";
        const desc = node.StringLiteral[1]?.image ?? "";
        const s = this.workspace.model.addSoftwareSystem(stripQuotes(name), stripQuotes(desc));
        if (node.identifier && s) {
            this.elementsByIdentifier.set(stripQuotes(node.identifier[0].image), s.id);
        }
    }

    softwareSystemChildSection(node: any) {
        this.#debug && console.log(`Here we are at softwareSystemChildSection with node: ${node.name}`);
    }

    containerSection(node: any) {
        this.#debug && console.log(`Here we are at ContainerSection with node: ${node.name}`);
    }

    containerChildSection(node: any) {
        this.#debug && console.log(`Here we are at ContainerChildSection with node: ${node.name}`);
    }

    componentSection(node: any) {
        this.#debug && console.log(`Here we are at ComponentSection with node: ${node.name}`);
    }

    explicitRelationship(node: any) {
        this.#debug && console.log('Here we are at explicitRelationship node:');
        const s_id = this.elementsByIdentifier.get(node.identifier[0].image);
        const t_id = this.elementsByIdentifier.get(node.identifier[1].image);
        if (s_id && t_id) {
            const source = this.workspace.model.getElement(s_id);
            const target = this.workspace.model.getElement(t_id);
            const desc = node.StringLiteral[0]?.image ?? "";
            const r = this.workspace.model.addRelationship(source, target, desc);
        } else {
            throw new Error("Unknown identifiers used in relationship definition");
        }
    }

    implicitRelationship(node: any) {
        this.#debug && console.log(`Here we are at implicitRelationship with node: ${node.name}`);
    }

    deploymentEnvironmentSection(node: any) {
        this.#debug && console.log(`Here we are at deploymentEnvironmentSection with node: ${node.name}`);
    }

    deploymentEnvironmentChildSection(node: any) {
        this.#debug && console.log(`Here we are at deploymentEnvironmentChildSection with node: ${node.name}`);
    }

    deploymentNodeSection(node: any) {
        this.#debug && console.log(`Here we are at deploymentNodeSection with node: ${node.name}`);
    }

    deploymentNodeChildSection(node: any) {
        this.#debug && console.log(`Here we are at deploymentNodeChildSection with node: ${node.name}`);
    }

    containerInstanceSection(node: any) {
        this.#debug && console.log(`Here we are at containerInstanceSection with node: ${node.name}`);
    }

    softwareSystemInstanceSection(node: any) {
        this.#debug && console.log(`Here we are at softwareSystemInstanceSection with node: ${node.name}`);
    }

    viewsSection(node: any) {
        this.#debug && console.log('Here we are at viewsSection node:');
        if (node.viewsChildSection) {
            this.visit(node.viewsChildSection);
        }
    }

    viewsChildSection(node: any) {
        this.#debug && console.log('Here we are at viewsChildSection node:');
        if (node.systemLandscapeView) { for (const view of node.systemLandscapeView) { this.visit(view);} }
        if (node.systemContextView) { for (const view of node.systemContextView) { this.visit(view);} }
        if (node.containerView) { for (const view of node.containerView) { this.visit(view);} }
        if (node.componentView) { for (const view of node.componentView) { this.visit(view);} }
        if (node.imageSection) { for (const image of node.imageSection) { this.visit(image);} }
        if (node.stylesSection) { for (const style of node.stylesSection) { this.visit(style);} }
        if (node.dynamicSection) { for (const dyn of node.dynamicSection) { this.visit(dyn);} }
        if (node.deploymentSection) { for (const deployment of node.deploymentSection) { this.visit(deployment);} }
    }

    systemLandscapeView(node: any) {
        this.#debug && console.log(`Here we are at systemLandscapeView with node: ${node.name}`);
    }

    viewOptions(node: any, view: any) {
        this.#debug && console.log('Here we are at viewOptions node:');
        if (node.includeOptions) { for (const inc of node.includeOptions) { this.visit(inc, view); } }
        if (node.autoLayoutOptions) { this.visit(node.autoLayoutOptions, view); }
        if (node.animationOptions) {}
        if (node.descriptionOptions) {}
        if (node.propertiesOptions) {}
    }

    includeOptions(node: any, view: any) {
        this.#debug && console.log('Here we are at includeOptions node:');
        if (node.wildcard) { view.addAllElements(); }
        if (node.identifier) {
            const e_id = this.elementsByIdentifier.get(node.identifier[0].image) ?? "";
            const ele = this.workspace.model.getElement(e_id);
            if (ele) {
                view.addElement(ele, true);
            }
        }
    }

    autoLayoutOptions(node: any, view: any) {
        this.#debug && console.log('Here we are at autoLayoutOptions node:');
        const rankDir = node.identifier?.[0].image;
        const rankSep = node.int?.[0].image;
        const nodeSep = node.int?.[1].image;
        let rankDirEnum: RankDirection = RankDirection.TopBottom;
        if (rankDir) {
            switch (rankDir) {
                case 'tb': rankDirEnum = RankDirection.TopBottom; break;
                case 'bt': rankDirEnum = RankDirection.BottomTop; break;
                case 'lr': rankDirEnum = RankDirection.LeftRight; break;
                case 'rl': rankDirEnum = RankDirection.RightLeft; break;
            }
            view.setAutomaticLayout(rankDirEnum, rankSep, nodeSep);
        } else {
            view.setAutomaticLayout(true);
        }
    }

    animationOptions(node: any) {
        this.#debug && console.log(`Here we are at animationOptions with node: ${node.name}`);
    }

    descriptionOptions(node: any) {
        this.#debug && console.log(`Here we are at descriptionOptions with node: ${node.name}`);
    }

    propertiesOptions(node: any) {
        this.#debug && console.log(`Here we are at propertiesOptions with node: ${node.name}`);
    }

    systemContextView(node: any) {
        this.#debug && console.log('Here we are at systemContextView node:');
        const sws_id = this.elementsByIdentifier.get(node.identifier[0].image) ?? "";
        const sws = this.workspace.model.getElement(sws_id);
        const key = node.StringLiteral[0]?.image ?? "";
        const desc = node.StringLiteral[1]?.image ?? "";
        const view = this.workspace.views.createSystemContextView(sws as SoftwareSystem, stripQuotes(key), stripQuotes(desc));
        if (node.viewOptions) { this.visit(node.viewOptions, view); }
    }

    containerView(node: any) {
        this.#debug && console.log(`Here we are at containerView with node: ${node.name}`);
    }

    componentView(node: any) { 
        this.#debug && console.log(`Here we are at componentView with node: ${node.name}`);
    }

    imageSection(node: any) {
        this.#debug && console.log(`Here we are at imageSection with node: ${node.name}`);
    }

    dynamicSection(node: any) {
        this.#debug && console.log(`Here we are at dynamicSection with node: ${node.name}`);
    }

    deploymentSection(node: any) {
        this.#debug && console.log(`Here we are at deploymentSection with node: ${node.name}`);
    }

    stylesSection(node: any) {
        this.#debug && console.log(`Here we are at stylesSection with node: ${node.name}`);
    }

    elementStyleSection(node: any) {
        this.#debug && console.log(`Here we are at elementStyleSection with node: ${node.name}`);
    }

    relationshipStyleSection(node: any) {
        this.#debug && console.log(`Here we are at relationshipStyleSection with node: ${node.name}`);
    }

    shapeStyle(node: any) {
        this.#debug && console.log(`Here we are at shapeStyle with node: ${node.name}`);
    }

    backgroundStyle(node: any) {
        this.#debug && console.log(`Here we are at backgroundStyle with node: ${node.name}`);
    }

    colorStyle(node: any) {
        this.#debug && console.log(`Here we are at colorStyle with node: ${node.name}`);
    }

    colourStyle(node: any) {
        this.#debug && console.log(`Here we are at colourStyle with node: ${node.name}`);
    }

    fontStyle(node: any) {
        this.#debug && console.log(`Here we are at fontStyle with node: ${node.name}`);
    }

    opacityStyle(node: any) {
        this.#debug && console.log(`Here we are at opacityStyle with node: ${node.name}`);
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