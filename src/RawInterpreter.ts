import { BaseStructurizrVisitor } from "./Parser";
import { Stack } from "./stack";
import { paths, components } from "./structurizr.schema";

class rawInterpreter extends BaseStructurizrVisitor {
    private _debug:boolean = false;
    private workspace: components["schemas"]["Workspace"] = {};

    // WRONG! A change to the reference changes the underlying object so we cannot replace one system with another
    // private _system: components["schemas"]["SoftwareSystem"] = {};
    // private _container: components["schemas"]["Container"] = {};

    // This is OK as it is transitory and is used to build what is recorded in the workspace object
    private _systemGroup:Stack<string> = new Stack<string>();
    private _containerGroup:Stack<string> = new Stack<string>();
    private _componentGroup:Stack<string> = new Stack<string>();

    private _groupSeparator:string = '/';
    
    // WRONG! We cannot store a reference to a view here, changing the reference changes the object :( 
    // private _currentView: any = {};

    constructor() {
        super();
        this._systemGroup.clear();
        this._containerGroup.clear();
        this._componentGroup.clear();
        this.validateVisitor();
    }

    public set Debug(flag: boolean) {
        this._debug = flag;
    }

    workspaceWrapper(node: any) {
        this._debug && console.log('Here we are at workspaceWrapper node:');
        this.workspace = {};
        this.workspace.name = "Name";
        this.workspace.description = "Description";
        if (node.workspaceSection) {
            this.visit(node.workspaceSection);
        }
        return this.workspace;
    }

    workspaceSection(node: any) {
        this._debug && console.log('Here we are at workspaceSection node:');
        if (node.name) { this.workspace.name = node.StringLiteral[0]?.image };
        if (node.description) { this.workspace.description = node.StringLiteral[1]?.image };
        if (node.modelSection) {
            this.visit(node.modelSection);
        }
        if (node.viewsSection) {
            this.visit(node.viewsSection);
        }
    }

    modelSection(node: any) {
        this._debug && console.log('Here we are at modelSection node:');
        this.workspace.model = {} as components["schemas"]["Model"];
        this.workspace.model.people = [];
        this.workspace.model.softwareSystems = [];
        this.workspace.model.deploymentNodes = [];
        if (node.modelChildSection) {
            this.visit(node.modelChildSection);
        }
    }

    modelChildSection(node: any) {
        this._debug && console.log('Here we are at modelChildSection node:');
        if (node.propertiesSection) { this.visit(node.propertiesSection); }
        if (node.systemGroupSection) { for (const group of node.systemGroupSection) { this.visit(group); }}
        if (node.personSection) { for (const person of node.personSection) { this.visit(person); }}
        if (node.softwareSystemSection) { for (const sSystem of node.softwareSystemSection) { this.visit(sSystem); }}
        if (node.explicitRelationship) { for (const relationship of node. explicitRelationship) { this.visit(relationship); }}
        if (node.deploymentEnvironmentSection) { for (const depEnv of node.deploymentEnvironmentSection) { this.visit(depEnv); }}
    }

    // This should ideally be from the list at https://docs.structurizr.com/ui/properties
    // TODO: And change the parser to identify the property names and fail if not aligned
    // TODO: This will mean a lot more handlers for each property and whether it is model or view related
    propertiesSection(node: any) {
        this._debug && console.log('Here we are at propertiesSection node:');
        let offset = 0;
        while (node.StringLiteral.length > offset) {
            const parameter = stripQuotes(node.StringLiteral[offset].image);
            const value = stripQuotes(node.StringLiteral[offset+1].image);
            if (!this.workspace.model?.properties){
                this.workspace.model!.properties = {};
            }
            this.workspace.model!.properties![parameter] = value;
            if (parameter.toLowerCase() === "structurizr.groupseparator") {
                this._groupSeparator = value;
            }
            offset += 2;
        }
    }

    systemGroupSection(node: any) {
        this._debug && console.log('Here we are at systemGroupSection node:');
        const groupName = stripQuotes(node.StringLiteral?.[0]?.image ?? "");
        this._systemGroup.push(groupName);
        if (node.systemGroupChildSection) {
            this.visit(node.systemGroupChildSection);
        }
        this._systemGroup.pop();
    }

    systemGroupChildSection(node: any) {
        this._debug && console.log('Here we are at systemGroupChildSection with node:');
        if (node.systemGroupSection) { for (const group of node.systemGroupSection) { this.visit(group); }}
        if (node.personSection) { for (const person of node.personSection) { this.visit(person); }}
        if (node.softwareSystemSection) { for (const sSystem of node.softwareSystemSection) { this.visit(sSystem); }}
    }

    personSection(node: any) {
        this._debug && console.log('Here we are at personSection node:');
        const id = node.identifier[0].image;
        const name = stripQuotes(node.StringLiteral[0]?.image ?? "");
        const description = stripQuotes(node.StringLiteral[1]?.image ?? "");
        const p = {} as components["schemas"]["Person"];
        p.id = id;
        p.name = name;
        p.description = description;
        p.perspectives = [];
        p.relationships = [];
        this.workspace.model?.people?.push(p);
    }

    softwareSystemSection(node: any) {
        this._debug && console.log('Here we are at softwareSystemSection node:');
        const id = node.identifier[0].image;
        const name = stripQuotes(node.StringLiteral[0]?.image ?? "");
        const description = stripQuotes(node.StringLiteral[1]?.image ?? "");
        const s = {} as components["schemas"]["SoftwareSystem"];
        s.id = id;
        s.name = name;
        s.description = description;
        if (!this._systemGroup.isEmpty()) { s.group = this._systemGroup.dump(this._groupSeparator); }
        s.containers = [];
        s.perspectives = [];
        s.relationships = [];
        this.workspace.model?.softwareSystems?.push(s);
        // this._system = s;
        if (node.softwareSystemChildSection){ this.visit(node.softwareSystemChildSection, s); }
    }

    softwareSystemChildSection(node: any, system: components["schemas"]["SoftwareSystem"]) {
        this._debug && console.log(`Here we are at softwareSystemChildSection with node: ${system.name}`);
        if (node.containerSection) { for (const ctr of node.containerSection) { this.visit(ctr, system); }}
    }

    containerGroupSection(node: any) {
        this._debug && console.log(`Here we are at containerGroupSection with node: ${node.name}`);
        const groupName = stripQuotes(node.StringLiteral?.[0]?.image ?? "");
        this._containerGroup.push(groupName);
        if (node.containerGroupChildSection) {
            this.visit(node.containerGroupChildSection);
        }
        this._containerGroup.pop();
    }

    containerGroupChildSection(node: any) {
        this._debug && console.log(`Here we are at containerGroupChildSection with node: ${node.name}`);
    }

    containerSection(node: any, system: components["schemas"]["SoftwareSystem"]) {
        this._debug && console.log(`Here we are at ContainerSection with node: ${node.name}`);
        const id = node.identifier[0].image;
        const name = stripQuotes(node.StringLiteral[0]?.image ?? "");
        const description = stripQuotes(node.StringLiteral[1]?.image ?? "");
        const tech = stripQuotes(node.StringLiteral[2]?.image ?? "");
        const c = {} as components["schemas"]["Container"];
        c.id = id;
        c.name = name;
        c.description = description;
        c.technology = tech;
        if (!this._containerGroup.isEmpty()) { c.group = this._containerGroup.dump(this._groupSeparator); }
        c.components = [];
        c.perspectives = [];
        c.relationships = [];
        system.containers?.push(c);
        // this._container = c;
        if (node.containerChildSection){ this.visit(node.containerChildSection, c);}
    }

    containerChildSection(node: any, container: components["schemas"]["Container"]) {
        this._debug && console.log(`Here we are at ContainerChildSection with node: ${node.name}`);
        if (node.componentSection) { for (const com of node.componentSection) { this.visit(com, container); }}
    }

    componentGroupSection(node: any) {
        this._debug && console.log(`Here we are at componentGroupSection with node: ${node.name}`);
        const groupName = stripQuotes(node.StringLiteral?.[0]?.image ?? "");
        this._componentGroup.push(groupName);
        if (node.componentGroupChildSection) {
            this.visit(node.componentGroupChildSection);
        }
        this._componentGroup.pop();
    }

    componentGroupChildSection(node: any) {
        this._debug && console.log(`Here we are at componentGroupChildSection with node: ${node.name}`);
    }

    componentSection(node: any, container: components["schemas"]["Container"]) {
        this._debug && console.log(`Here we are at ComponentSection with node: ${node.name}`);
        const id = node.identifier[0].image;
        const name = stripQuotes(node.StringLiteral[0]?.image ?? "");
        const description = stripQuotes(node.StringLiteral[1]?.image ?? "");
        const tech = stripQuotes(node.StringLiteral[2]?.image ?? "");
        const c = {} as components["schemas"]["Component"];
        c.id = id;
        c.name = name;
        c.description = description;
        c.technology = tech;
        if (!this._componentGroup.isEmpty()) { c.group = this._componentGroup.dump(this._groupSeparator); }
        c.perspectives = [];
        c.relationships = [];
        container.components?.push(c);
    }

    explicitRelationship(node: any) {
        this._debug && console.log('Here we are at explicitRelationship node:');
        const s_id = node.identifier[0].image;
        const t_id = node.identifier[1].image;
        const desc = node.StringLiteral?.[0]?.image ?? "";
        const src = this.findSourceEntity(s_id);
        if (src) {
            const rel = {} as components["schemas"]["Relationship"];
            rel.id = "";
            rel.sourceId = s_id;
            rel.destinationId = t_id;
            rel.description = stripQuotes(desc);
            src.relationships?.push(rel);
        }
    }

    implicitRelationship(node: any) {
        this._debug && console.log(`Here we are at implicitRelationship with node: ${node.name}`);
    }

    deploymentEnvironmentSection(node: any) {
        this._debug && console.log(`Here we are at deploymentEnvironmentSection with node: ${node.name}`);
    }

    deploymentEnvironmentChildSection(node: any) {
        this._debug && console.log(`Here we are at deploymentEnvironmentChildSection with node: ${node.name}`);
    }

    deploymentNodeSection(node: any) {
        this._debug && console.log(`Here we are at deploymentNodeSection with node: ${node.name}`);
    }

    deploymentNodeChildSection(node: any) {
        this._debug && console.log(`Here we are at deploymentNodeChildSection with node: ${node.name}`);
    }

    containerInstanceSection(node: any) {
        this._debug && console.log(`Here we are at containerInstanceSection with node: ${node.name}`);
    }

    softwareSystemInstanceSection(node: any) {
        this._debug && console.log(`Here we are at softwareSystemInstanceSection with node: ${node.name}`);
    }

    viewsSection(node: any) {
        this._debug && console.log('Here we are at viewsSection node:');
        if (!this.workspace.views) { this.workspace.views = {}; }
        if (node.viewsChildSection) {
            this.visit(node.viewsChildSection);
        }
    }

    viewsChildSection(node: any) {
        this._debug && console.log('Here we are at viewsChildSection node:');
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
        this._debug && console.log(`Here we are at systemLandscapeView with node: ${node.name}`);
        if (!this.workspace.views?.systemLandscapeViews) { this.workspace.views!.systemLandscapeViews = []; }
        const key = stripQuotes(node.StringLiteral?.[0]?.image ?? "");
        const desc = stripQuotes(node.StringLiteral?.[1]?.image ?? "");
        const sl = {} as components["schemas"]["SystemLandscapeView"];
        sl.key = key;
        sl.description = desc;
        this.workspace.views?.systemLandscapeViews.push(sl);
        // this._currentView = sl;
        if (node.viewOptions) { this.visit(node.viewOptions, sl); }
    }

    viewOptions(node: any, view: any) {
        this._debug && console.log('Here we are at viewOptions node:');
        if (node.includeOptions) { for (const inc of node.includeOptions) { this.visit(inc, view); } }
        if (node.autoLayoutOptions) { this.visit(node.autoLayoutOptions, view); }
        if (node.animationOptions) {}
        if (node.descriptionOptions) {}
        if (node.propertiesOptions) {}
    }

    includeOptions(node: any, view: any) {
        this._debug && console.log('Here we are at includeOptions node:');
        // if (node.wildcard) { view.addAllElements(); }
        // if (node.identifier) {
        //     const e_id = this.elementsByIdentifier.get(node.identifier[0].image) ?? "";
        //     const ele = this.workspace.model.getElement(e_id);
        //     if (ele) {
        //         view.addElement(ele, true);
        //     }
        // }
    }

    autoLayoutOptions(node: any, view: any) {
        this._debug && console.log('Here we are at autoLayoutOptions node:');
        const rankDir = node.identifier?.[0].image;
        const rankSep = node.int?.[0].image;
        const nodeSep = node.int?.[1].image;
        // let rankDirEnum: RankDirection = RankDirection.TopBottom;
        // if (rankDir) {
        //     switch (rankDir) {
        //         case 'tb': rankDirEnum = RankDirection.TopBottom; break;
        //         case 'bt': rankDirEnum = RankDirection.BottomTop; break;
        //         case 'lr': rankDirEnum = RankDirection.LeftRight; break;
        //         case 'rl': rankDirEnum = RankDirection.RightLeft; break;
        //     }
        //     view.setAutomaticLayout(rankDirEnum, rankSep, nodeSep);
        // } else {
        //     view.setAutomaticLayout(true);
        // }
    }

    animationOptions(node: any) {
        this._debug && console.log(`Here we are at animationOptions with node: ${node.name}`);
    }

    descriptionOptions(node: any) {
        this._debug && console.log(`Here we are at descriptionOptions with node: ${node.name}`);
    }

    propertiesOptions(node: any) {
        this._debug && console.log(`Here we are at propertiesOptions with node: ${node.name}`);
    }

    systemContextView(node: any) {
        this._debug && console.log('Here we are at systemContextView node:');
        if (!this.workspace.views?.systemContextViews) { this.workspace.views!.systemContextViews = []; }
        const id = node.identifier[0].image ?? "";
        const key = stripQuotes(node.StringLiteral[0]?.image ?? "");
        const desc = stripQuotes(node.StringLiteral[1]?.image ?? "");
        const cv = {} as components["schemas"]["SystemContextView"];
        cv.softwareSystemId = id;
        cv.key = key;
        cv.description = desc;
        this.workspace.views?.systemContextViews.push(cv);
        // this._currentView = cv;
        if (node.viewOptions) { this.visit(node.viewOptions, cv); }
    }

    containerView(node: any) {
        this._debug && console.log(`Here we are at containerView with node: ${node.name}`);
        if (!this.workspace.views?.containerViews) { this.workspace.views!.containerViews = []; }
    }

    componentView(node: any) { 
        this._debug && console.log(`Here we are at componentView with node: ${node.name}`);
        if (!this.workspace.views?.componentViews) { this.workspace.views!.componentViews = []; }
    }

    imageSection(node: any) {
        this._debug && console.log(`Here we are at imageSection with node: ${node.name}`);
        if (!this.workspace.views?.imageViews) { this.workspace.views!.imageViews = []; }
    }

    dynamicSection(node: any) {
        this._debug && console.log(`Here we are at dynamicSection with node: ${node.name}`);
        if (!this.workspace.views?.dynamicViews) { this.workspace.views!.dynamicViews = []; }
    }

    deploymentSection(node: any) {
        this._debug && console.log(`Here we are at deploymentSection with node: ${node.name}`);
        if (!this.workspace.views?.deploymentViews) { this.workspace.views!.deploymentViews = []; }
    }

    stylesSection(node: any) {
        this._debug && console.log(`Here we are at stylesSection with node: ${node.name}`);
        if (!this.workspace.views?.configuration) { this.workspace.views!.configuration = {}; }
    }

    elementStyleSection(node: any) {
        this._debug && console.log(`Here we are at elementStyleSection with node: ${node.name}`);
    }

    relationshipStyleSection(node: any) {
        this._debug && console.log(`Here we are at relationshipStyleSection with node: ${node.name}`);
    }

    shapeStyle(node: any) {
        this._debug && console.log(`Here we are at shapeStyle with node: ${node.name}`);
    }

    backgroundStyle(node: any) {
        this._debug && console.log(`Here we are at backgroundStyle with node: ${node.name}`);
    }

    colorStyle(node: any) {
        this._debug && console.log(`Here we are at colorStyle with node: ${node.name}`);
    }

    colourStyle(node: any) {
        this._debug && console.log(`Here we are at colourStyle with node: ${node.name}`);
    }

    fontStyle(node: any) {
        this._debug && console.log(`Here we are at fontStyle with node: ${node.name}`);
    }

    opacityStyle(node: any) {
        this._debug && console.log(`Here we are at opacityStyle with node: ${node.name}`);
    }

    findSourceEntity(s_id: string) {
        // Search Person
        let p = this.workspace.model?.people?.find(pr => pr.id === s_id);
        if (p) return p;
        // Search Software Systems recursively
        if (this.workspace.model?.softwareSystems) {
            for (const element of this.workspace.model?.softwareSystems) {
                if (element.id === s_id) return element;
                if (element.containers) {
                    for (const element2 of element.containers) {
                        if (element2.id === s_id) return element2;
                        if (element2.components) {
                            for (const element3 of element2.components) {
                                if (element3.id === s_id) return element3;
                            }
                        }
                    }
                }
            }
        }
        throw new Error("Failed to find a match for the source ID presented: " + s_id);
    }
}

function stripQuotes(str: string) : string {
    // Fail if an invalid argument is provided
    if (typeof str !== 'string') {
      throw new TypeError('Expected a string');
    }
    return str.replace(/^"(.+)"$/, '$1');
  }

export const RawInterpreter = new rawInterpreter();