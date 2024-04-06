import { CstNode } from "chevrotain";
import * as _ from "lodash";
import { BaseStructurizrVisitor, StructurizrParser } from "./Parser";
// import { MxBuilder } from "mxbuilder";
import { paths, components } from "./structurizr.schema";

// This class a set of Draw.io XML images from the parsed content

type WorkSpace = components["schemas"]["Workspace"];

class drawioInterpreter extends BaseStructurizrVisitor {

    private elementsByIdentifier = new Map<string, string>(); // identifier, id
    // Likely we need an array of strings to return, one element for each view XML requested
    // private mxDrawings:MxBuilder[] = [];
    // private mxWorkspace = new MxBuilder(); // Where we send instructions to build the C4 diagrams
    private sxWorkspace: WorkSpace = {};

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
        this.sxWorkspace.name = node.name;
        this.sxWorkspace.description = node.description;
        if (node.workspaceSection) {
            this.visit(node.workspaceSection);
        }
        // this.mxDrawings.push(this.mxWorkspace);
        // return this.mxDrawings;
        return this.sxWorkspace;
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
        const model: components["schemas"]["Model"] = {};
        this.sxWorkspace.model = model;
        const people:components["schemas"]["Person"][] = [];
        this.sxWorkspace.model.people = people;
        const ss:components["schemas"]["SoftwareSystem"][] = [];
        this.sxWorkspace.model.softwareSystems = ss;
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
        if (node.groupChildSection) {
            this.visit(node.groupChildSection);
        }
    }

    groupChildSection(node: any) {
        console.log(`Here we are at groupChildSection with node: ${node.name}`);
    }

    personSection(node: any) {
        console.log('Here we are at personSection node:');
        let person: components["schemas"]["Person"] = {};
        let relations:components["schemas"]["Relationship"][] = [];
        person.id = getID(22);
        person.name = stripQuotes(node.StringLiteral[0]?.image ?? "");
        person.description = stripQuotes(node.StringLiteral[1]?.image ?? "");
        person.relationships = relations;
        // const p = this.mxWorkspace.placePerson(stripQuotes(name), stripQuotes(desc));
        if (node.identifier && person.id) {
            this.elementsByIdentifier.set(stripQuotes(node.identifier[0].image), person.id);
        }
        this.sxWorkspace.model?.people?.push(person);
    }

    softwareSystemSection(node: any) {
        console.log('Here we are at softwareSystemSection node:');
        let ssys: components["schemas"]["SoftwareSystem"] = {};
        let relations:components["schemas"]["Relationship"][] = [];
        ssys.id = getID(22);
        ssys.name = stripQuotes(node.StringLiteral[0]?.image ?? "");
        ssys.description = stripQuotes(node.StringLiteral[1]?.image ?? "");
        ssys.relationships = relations;
        // const s = this.mxWorkspace.placeSoftwareSystem(stripQuotes(name), stripQuotes(desc));
        if (node.identifier && ssys.id) {
            this.elementsByIdentifier.set(stripQuotes(node.identifier[0].image), ssys.id);
        }
        this.sxWorkspace.model?.softwareSystems?.push(ssys);
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
            const desc = stripQuotes(node.StringLiteral[0]?.image ?? "");
            const rel:components["schemas"]["Relationship"] = {};
            rel.id = getID(22);
            rel.sourceId = s_id;
            rel.destinationId = t_id;
            rel.description = desc;
            insertRelationship(this.sxWorkspace, s_id, rel);
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
        console.log('Here we are at viewsSection node:');
        let views: components["schemas"]["Views"] = {};
        this.sxWorkspace.views = views;
        if (node.viewsChildSection) {
            this.visit(node.viewsChildSection);
        }
    }

    viewsChildSection(node: any) {
        console.log('Here we are at viewsChildSection node:');
        let slv:components["schemas"]["SystemLandscapeView"][] = [];
        let scv:components["schemas"]["SystemContextView"][] = [];
        let ctv:components["schemas"]["ContainerView"][] = [];
        let cov:components["schemas"]["ComponentView"][] = [];
        let iv:components["schemas"]["ImageView"][] = [];
        let cfg:components["schemas"]["Configuration"] = {};
        if (this.sxWorkspace.views != null) {
            this.sxWorkspace.views.systemLandscapeViews = slv;
            this.sxWorkspace.views.systemContextViews = scv;
            this.sxWorkspace.views.containerViews = ctv;
            this.sxWorkspace.views.componentViews = cov;
            this.sxWorkspace.views.imageViews = iv;
            this.sxWorkspace.views.configuration = cfg;
        }
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
        const elements:components["schemas"]["ElementView"][] = [];
        let element:components["schemas"]["ElementView"] = {};
        if (node.wildcard) { element.id = '*'; elements.push(element);  }
        if (node.identifier) {
            const e_id = this.elementsByIdentifier.get(node.identifier[0].image) ?? "";
            let element:components["schemas"]["ElementView"] = {};
            element.id = e_id;
            elements.push(element);
        }
        view.elements = elements;
    }

    autoLayoutOptions(node: any, view: any) {
        console.log('Here we are at autoLayoutOptions node:');
        const rankDir = node.identifier?.[0].image ?? "TopBottom";
        const rankSep = node.int?.[0].image;
        const nodeSep = node.int?.[1].image;
        const autoLayout:components["schemas"]["AutomaticLayout"] = {};
        autoLayout.rankDirection = rankDir;
        autoLayout.rankSeparation = rankSep;
        autoLayout.nodeSeparation = nodeSep;
        view.automaticLayout = autoLayout;
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
        const sws_id = this.elementsByIdentifier.get(node.identifier[0].image) ?? "";
        const key = node.StringLiteral[0]?.image ?? "";
        const desc = node.StringLiteral[1]?.image ?? "";
        // const view = this.workspace.views.createSystemContextView(sws as SoftwareSystem, stripQuotes(key), stripQuotes(desc));
        const scv:components["schemas"]["SystemContextView"] = {};
        scv.key = stripQuotes(key);
        scv.softwareSystemId = sws_id;
        scv.description = stripQuotes(desc);
        this.sxWorkspace.views?.systemContextViews?.push(scv);
        if (node.viewOptions) { this.visit(node.viewOptions, scv); }
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
        if (this.sxWorkspace.views != null && this.sxWorkspace.views.configuration != null){
            this.sxWorkspace.views.configuration.styles = {};
        }
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

// HELPER FUNCTIONS

function stripQuotes(str: string) : string {
    // Fail if an invalid argument is provided
    if (typeof str !== 'string') {
      throw new TypeError('Expected a string');
    }
    return str.replace(/^"(.+)"$/, '$1');
}

// Generates a random string, likely I can do better, first thing I found on Google!
function getID(idLength: number) {
    var id = [...Array(idLength).keys()].map((elem)=>Math.random().toString(36).substr(2, 1)).join("");
    return id;
}

export const DrawioInterpreter = new drawioInterpreter();

function insertRelationship(w:WorkSpace, s_id: string, rel:components["schemas"]["Relationship"]) {
    let item = _.find(w.model?.people, {'id': s_id});
    if (item != null) {item.relationships?.push(rel); return;}
    item = _.find(w.model?.softwareSystems, {'id': s_id});
    if (item != null) {item.relationships?.push(rel); return;}
    if (w.model?.softwareSystems != null) {
        for (let ss of w.model?.softwareSystems){
            item = _.find(ss.containers, {'id': s_id});
            if (item != null) {item.relationships?.push(rel); return;}
        }
    }
    
}
