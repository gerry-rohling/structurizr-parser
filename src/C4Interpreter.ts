import { BaseStructurizrVisitor, StructurizrParser } from "./Parser";
import { C4Component } from "./c4/c4component";
import { C4ComponentView } from "./c4/c4componentview";
import { C4Container } from "./c4/c4container";
import { C4ContainerView } from "./c4/c4containerview";
import { C4ElementStyle } from "./c4/c4elementstyle";
import { C4Group } from "./c4/c4group";
import { C4Person } from "./c4/c4person";
import { C4Relationship } from "./c4/c4relationship";
import { C4RelationshipStyle } from "./c4/c4relationshipstyle";
import { C4SoftwareSystem } from "./c4/c4softwaresystem";
import { C4SystemContextView } from "./c4/c4systemcontextview";
import { C4SystemLandscapeView } from "./c4/c4systemlandscapeview";
import { C4Workspace } from "./c4/c4workspace";

class c4Interpreter extends BaseStructurizrVisitor {

    // This needs to be better
    private workspace:C4Workspace = new C4Workspace("","","");

    constructor() {
        super();
        this.validateVisitor();
    }

    // This is the top level entry point. It will recurse the entire Parser tree and then build MX files
    // based on the view instructions
    // At present it returns the workspace object but that will be changed once this works
    workspaceWrapper(node: any) {
        console.log('Here we are at workspaceWrapper node:');
        // this.theWorkspace.name = node.name;
        // this.theWorkspace.description = node.description;
        this.workspace = new C4Workspace("main", node.name, node.description);
        if (node.workspaceSection) {
            this.visit(node.workspaceSection);
        }
        // this.mxDrawings.push(this.mxWorkspace);
        // return this.mxDrawings;
        return this.workspace;
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
        let id = "";
        if (node.identifier) { id = node.identifier[0].image; }
        const name = stripQuotes(node.StringLiteral[0]?.image ?? "");
        const group = new C4Group(id, name);
        if (node.groupChildSection) {
            this.visit(node.groupChildSection, group);
        }
        this.workspace.addGroup(group);
    }

    groupChildSection(node: any, group: C4Group) {
        console.log(`Here we are at groupChildSection with node: ${node.name}`);
        if (node.personSection) { for (const person of node.personSection) { this.visit(person, group); }}
        if (node.softwareSystemSection) { for (const sSystem of node.softwareSystemSection) { this.visit(sSystem, group); }}
    }

    personSection(node: any, group?: C4Group) {
        console.log('Here we are at personSection node:');
        const id = node.identifier[0].image;
        const name = stripQuotes(node.StringLiteral[0]?.image ?? "");
        const description = stripQuotes(node.StringLiteral[1]?.image ?? "");
        const person = new C4Person(id, name, description);
        if (group){
            group.addPerson(person);
        } else {
            this.workspace.addPerson(person);
        }
    }

    softwareSystemSection(node: any, group?: C4Group) {
        console.log('Here we are at softwareSystemSection node:');
        const id = node.identifier[0].image;
        const name = stripQuotes(node.StringLiteral[0]?.image ?? "");
        const description = stripQuotes(node.StringLiteral[1]?.image ?? "");
        const ssys = new C4SoftwareSystem(id, name, description);
        if (node.softwareSystemChildSection){ this.visit(node.softwareSystemChildSection, ssys); }
        if (group){
            group.addSoftwareSystem(ssys);
        } else {
            this.workspace.addSoftwareSystem(ssys);
        }
    }

    softwareSystemChildSection(node: any, ssys: C4SoftwareSystem) {
        console.log(`Here we are at softwareSystemChildSection with node: ${node.name}`);
        if (node.containerSection) { for (const ctr of node.containerSection) { this.visit(ctr, ssys); }}
    }

    containerSection(node: any, ssys:C4SoftwareSystem) {
        console.log(`Here we are at ContainerSection with node: ${node.name}`);
        const id = node.identifier[0].image;
        const name = stripQuotes(node.StringLiteral[0]?.image ?? "");
        const description = stripQuotes(node.StringLiteral[1]?.image ?? "");
        const container = new C4Container(id, name, description);
        if (node.containerChildSection) { this.visit(node.containerChildSection, container)}
        ssys.addContainer(container);
    }

    containerChildSection(node: any, ctr: C4Container) {
        console.log(`Here we are at ContainerChildSection with node: ${node.name}`);
        if (node.componentSection) { for (const comp of node.componentSection) { this.visit(comp, ctr); }}
    }

    componentSection(node: any, ctr: C4Container) {
        console.log(`Here we are at ComponentSection with node: ${node.name}`);
        const id = node.identifier[0].image;
        const name = stripQuotes(node.StringLiteral[0]?.image ?? "");
        const description = stripQuotes(node.StringLiteral[1]?.image ?? "");
        const component = new C4Component(id, name, description);
        ctr.addComponent(component);
    }

    explicitRelationship(node: any) {
        console.log('Here we are at explicitRelationship node:');
        const s_id = node.identifier[0].image;
        const t_id = node.identifier[1].image;
        const desc = stripQuotes(node.StringLiteral[0]?.image ?? "");
        this.workspace.addRelationship(s_id, t_id, desc);
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
        console.log('Here we are at viewsSection node:');
        if (node.viewsChildSection) {
            this.visit(node.viewsChildSection);
        }
    }

    viewsChildSection(node: any) {
        console.log('Here we are at viewsChildSection node:');
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
        console.log(`Here we are at systemLandscapeView with node: ${node.name}`);
        const view = new C4SystemLandscapeView();
        this.workspace.addView(view);
    }

    viewOptions(node: any, view: any) {
        console.log('Here we are at viewOptions node:');
        if (node.includeOptions) { for (const inc of node.includeOptions) { this.visit(inc, view); } }
        if (node.autoLayoutOptions) { this.visit(node.autoLayoutOptions, view); }
        if (node.animationOptions) {}
        if (node.descriptionOptions) {}
        if (node.propertiesOptions) {}
    }

    includeOptions(node: any, view: any) {
        console.log('Here we are at includeOptions node:');
        if (node.wildcard) {  } // Default is include everything
        if (node.identifier) {
             view.includeEntity(node.indentifer[0].image);
        }
    }

    autoLayoutOptions(node: any, view: any) {
        console.log('Here we are at autoLayoutOptions node:');
        const rankDir = node.identifier?.[0].image ?? "TopBottom";
        const rankSep = node.int?.[0].image;
        const nodeSep = node.int?.[1].image;
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
        console.log('Here we are at systemContextView node:');
        const sws_id = node.identifier[0].image ?? "";
        const key = stripQuotes(node.StringLiteral[0]?.image ?? "");
        const desc = stripQuotes(node.StringLiteral[1]?.image ?? "");
        const view = new C4SystemContextView(sws_id, key, desc);
        this.workspace.addView(view);
        if (node.viewOptions) { this.visit(node.viewOptions, view); }
    }

    containerView(node: any) {
        console.log(`Here we are at containerView with node: ${node.name}`);
        const ctr_id = node.identifier[0].image ?? "";
        const key = stripQuotes(node.StringLiteral[0]?.image ?? "");
        const desc = stripQuotes(node.StringLiteral[1]?.image ?? "");
        const view = new C4ContainerView(ctr_id, key, desc);
        this.workspace.addView(view);
        if (node.viewOptions) { this.visit(node.viewOptions, view); }
    }

    componentView(node: any) { 
        console.log(`Here we are at componentView with node: ${node.name}`);
        const com_id = node.identifier[0].image ?? "";
        const key = stripQuotes(node.StringLiteral[0]?.image ?? "");
        const desc = stripQuotes(node.StringLiteral[1]?.image ?? "");
        const view = new C4ComponentView(com_id, key, desc);
        this.workspace.addView(view);
        if (node.viewOptions) { this.visit(node.viewOptions, view); }
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
        if (node.elementStyleSection) { for (const style of node.elementStyleSection) { this.visit(style);} }
        if (node.relationshipStyleSection) { for (const rel of node.relationshipStyleSection) { this.visit(rel);} }
    }

    elementStyleSection(node: any) {
        console.log(`Here we are at elementStyleSection with node: ${node.name}`);
        const style = new C4ElementStyle();
        style.tag = stripQuotes(node.StringLiteral[0]?.image ?? "");
        if (node.shapeStyle) { this.visit(node.shapeStyle, style); }
        if (node.backgroundStyle) { this.visit(node.backgroundStyle, style); }
        if (node.colorStyle) { this.visit(node.colorStyle, style); }
        if (node.colourStyle) { this.visit(node.colourStyle, style); }
        this.workspace.addElementStyle(style);
    }

    relationshipStyleSection(node: any) {
        console.log(`Here we are at relationshipStyleSection with node: ${node.name}`);
        const style = new C4RelationshipStyle();
        this.workspace.addRelationshipStyle(style);
    }

    shapeStyle(node: any, style: any) {
        console.log(`Here we are at shapeStyle with node: ${node.name}`);
        if (node.person) {
            style.shape = "Person";
        } else {
            style.shape = node.shapeEnum[0].image;
        }
    }

    backgroundStyle(node: any, style: any) {
        console.log(`Here we are at backgroundStyle with node: ${node.name}`);
        style.background = node.hexColor[0].image;
    }

    colorStyle(node: any, style: any) {
        console.log(`Here we are at colorStyle with node: ${node.name}`);
        style.color = node.hexColor[0].image;
    }

    colourStyle(node: any, style: any) {
        console.log(`Here we are at colourStyle with node: ${node.name}`);
        style.color = node.hexColor[0].image;
    }

    fontStyle(node: any) {
        console.log(`Here we are at fontStyle with node: ${node.name}`);
    }

    opacityStyle(node: any) {
        console.log(`Here we are at opacityStyle with node: ${node.name}`);
    }
}

export const C4Interpreter = new c4Interpreter();

// HELPER FUNCTIONS

function stripQuotes(str: string) : string {
    // Fail if an invalid argument is provided
    if (typeof str !== 'string') {
      throw new TypeError('Expected a string');
    }
    return str.replace(/^"(.+)"$/, '$1');
}