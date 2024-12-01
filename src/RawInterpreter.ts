import { BaseStructurizrVisitor } from "./Parser";
import { RankDirection } from "./rankDirection";
import { Stack } from "./stack";
import { paths, components } from "./structurizr.schema";
import { ViewType } from "./viewType";

class rawInterpreter extends BaseStructurizrVisitor {
    private _debug:boolean = false;
    private workspace: components["schemas"]["Workspace"] = {};

    // This is used to build group values that are recorded in the workspace object
    private _systemGroup:Stack<string> = new Stack<string>();
    private _containerGroup:Stack<string> = new Stack<string>();
    private _componentGroup:Stack<string> = new Stack<string>();
    private _groupSeparator:string = '/';

    // View helpers
    private _currentView:ViewType = ViewType.Unknown;
    
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
        if (node.name) { this.workspace.name = node.stringLiteral[0]?.image };
        if (node.description) { this.workspace.description = node.stringLiteral[1]?.image };
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
        if (node.localeProperty) { this.visit(node.localeProperty); }
        if (node.timezoneProperty) { this.visit(node.timezoneProperty); }
        if (node.sortProperty) { this.visit(node.sortProperty); }
        if (node.tooltipsProperty) { this.visit(node.tooltipsProperty); }
        if (node.titleProperty) { this.visit(node.titleProperty); }
        if (node.descriptionProperty) { this.visit(node.descriptionProperty); }
        if (node.metadataProperty) { this.visit(node.metadataProperty); }
        if (node.enterpriseBoundaryProperty) { this.visit(node.enterpriseBoundaryProperty); }
        if (node.groupSeparatorProperty) { this.visit(node.groupSeparatorProperty); }
        if (node.groupsProperty) { this.visit(node.groupsProperty); }
        if (node.softwareSystemBoundariesProperty) { this.visit(node.softwareSystemBoundariesProperty); }
    }

    localeProperty(node: any) {
        this._debug && console.log('Here we are at localeProperty node:');
    }

    timezoneProperty(node: any) {
        this._debug && console.log('Here we are at timezoneProperty node:');
    }

    sortProperty(node: any) {
        this._debug && console.log('Here we are at sortProperty node:');
    }

    tooltipsProperty(node: any) {
        this._debug && console.log('Here we are at tooltipsProperty node:');
    }

    titleProperty(node: any) {
        this._debug && console.log('Here we are at titleProperty node:');
    }

    descriptionProperty(node: any) {
        this._debug && console.log('Here we are at descriptionProperty node:');
    }

    metadataProperty(node: any) {
        this._debug && console.log('Here we are at metadataProperty node:');
    }

    enterpriseBoundaryProperty(node: any) {
        this._debug && console.log('Here we are at enterpriseBoundaryProperty node:');
    }

    groupSeparatorProperty(node: any) {
        this._debug && console.log('Here we are at groupSeparatorProperty node:');
        const value = stripQuotes(node.stringLiteral?.[0]?.image);
        if (!this.workspace.model?.properties){
            this.workspace.model!.properties = {};
        }
        this.workspace.model!.properties!["structurizr.groupseparator"] = value;
        this._groupSeparator = value;
    }

    groupsProperty(node: any) {
        this._debug && console.log('Here we are at groupsProperty node:');
    }

    softwareSystemBoundariesProperty(node: any) {
        this._debug && console.log('Here we are at softwareSystemBoundariesProperty node:');
    }

    systemGroupSection(node: any) {
        this._debug && console.log('Here we are at systemGroupSection node:');
        const groupName = stripQuotes(node.stringLiteral?.[0]?.image ?? "");
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
        const name = stripQuotes(node.stringLiteral[0]?.image ?? "");
        const description = stripQuotes(node.stringLiteral[1]?.image ?? "");
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
        const name = stripQuotes(node.stringLiteral[0]?.image ?? "");
        const description = stripQuotes(node.stringLiteral[1]?.image ?? "");
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
        const groupName = stripQuotes(node.stringLiteral?.[0]?.image ?? "");
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
        const name = stripQuotes(node.stringLiteral[0]?.image ?? "");
        const description = stripQuotes(node.stringLiteral[1]?.image ?? "");
        const tech = stripQuotes(node.stringLiteral[2]?.image ?? "");
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
        const groupName = stripQuotes(node.stringLiteral?.[0]?.image ?? "");
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
        const name = stripQuotes(node.stringLiteral[0]?.image ?? "");
        const description = stripQuotes(node.stringLiteral[1]?.image ?? "");
        const tech = stripQuotes(node.stringLiteral[2]?.image ?? "");
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
        const desc = node.stringLiteral?.[0]?.image ?? "";
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
        this._currentView = ViewType.SystemLandscape;
        if (!this.workspace.views?.systemLandscapeViews) { this.workspace.views!.systemLandscapeViews = []; }
        const key = stripQuotes(node.stringLiteral?.[0]?.image ?? "");
        const desc = stripQuotes(node.stringLiteral?.[1]?.image ?? "");
        const sl = {} as components["schemas"]["SystemLandscapeView"];
        sl.key = key;
        sl.description = desc;
        this.workspace.views?.systemLandscapeViews.push(sl);
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
        if (!view.elements){ view.elements = []; }
        if (node.wildcard) { this.addAllElements(view); }
        if (node.identifier) {
            const e = {} as components["schemas"]["ElementView"];
            e.id = node.identifier[0].image ?? "";
            view.elements.push(e);
        }
    }

    autoLayoutOptions(node: any, view: any) {
        this._debug && console.log('Here we are at autoLayoutOptions node:');
        if (!view.automaticLayout) { view.automaticLayout = {}; }
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
        }
        view.automaticLayout["rankDirection"] = rankDirEnum;
    }

    animationOptions(node: any) {
        this._debug && console.log(`Here we are at animationOptions with node: ${node.name}`);
    }

    descriptionOptions(node: any) {
        this._debug && console.log(`Here we are at descriptionOptions with node: ${node.name}`);
    }

    propertiesOptions(node: any) {
        this._debug && console.log(`Here we are at propertiesOptions with node: ${node.name}`);
        if (node.localeProperty) { this.visit(node.localeProperty); }
        if (node.timezoneProperty) { this.visit(node.timezoneProperty); }
        if (node.sortProperty) { this.visit(node.sortProperty); }
        if (node.tooltipsProperty) { this.visit(node.tooltipsProperty); }
        if (node.titleProperty) { this.visit(node.titleProperty); }
        if (node.descriptionProperty) { this.visit(node.descriptionProperty); }
        if (node.metadataProperty) { this.visit(node.metadataProperty); }
        if (node.enterpriseBoundaryProperty) { this.visit(node.enterpriseBoundaryProperty); }
        if (node.groupSeparatorProperty) { this.visit(node.groupSeparatorProperty); }
        if (node.groupsProperty) { this.visit(node.groupsProperty); }
        if (node.softwareSystemBoundariesProperty) { this.visit(node.softwareSystemBoundariesProperty); }
    }

    systemContextView(node: any) {
        this._debug && console.log('Here we are at systemContextView node:');
        this._currentView = ViewType.SystemContext;
        if (!this.workspace.views?.systemContextViews) { this.workspace.views!.systemContextViews = []; }
        const id = node.identifier[0].image ?? "";
        const key = stripQuotes(node.stringLiteral[0]?.image ?? "");
        const desc = stripQuotes(node.stringLiteral[1]?.image ?? "");
        const cv = {} as components["schemas"]["SystemContextView"];
        cv.softwareSystemId = id;
        cv.key = key;
        cv.description = desc;
        this.workspace.views?.systemContextViews.push(cv);
        if (node.viewOptions) { this.visit(node.viewOptions, cv); }
    }

    containerView(node: any) {
        this._debug && console.log(`Here we are at containerView with node: ${node.name}`);
        this._currentView = ViewType.Container;
        if (!this.workspace.views?.containerViews) { this.workspace.views!.containerViews = []; }
    }

    componentView(node: any) { 
        this._debug && console.log(`Here we are at componentView with node: ${node.name}`);
        this._currentView = ViewType.Component;
        if (!this.workspace.views?.componentViews) { this.workspace.views!.componentViews = []; }
    }

    imageSection(node: any) {
        this._debug && console.log(`Here we are at imageSection with node: ${node.name}`);
        this._currentView = ViewType.Image;
        if (!this.workspace.views?.imageViews) { this.workspace.views!.imageViews = []; }
    }

    dynamicSection(node: any) {
        this._debug && console.log(`Here we are at dynamicSection with node: ${node.name}`);
        this._currentView = ViewType.Dynamic;
        if (!this.workspace.views?.dynamicViews) { this.workspace.views!.dynamicViews = []; }
    }

    deploymentSection(node: any) {
        this._debug && console.log(`Here we are at deploymentSection with node: ${node.name}`);
        this._currentView = ViewType.Deployment;
        if (!this.workspace.views?.deploymentViews) { this.workspace.views!.deploymentViews = []; }
    }

    stylesSection(node: any) {
        this._debug && console.log(`Here we are at stylesSection with node: ${node.name}`);
        if (!this.workspace.views?.configuration) { this.workspace.views!.configuration = {}; }
        if (!this.workspace.views?.configuration.styles) { this.workspace.views!.configuration.styles = {}; }
        if (node.elementStyleSection) { 
            if (!this.workspace.views?.configuration.styles.elements) {
                this.workspace.views!.configuration.styles.elements = [];
            }
            for (const es of node.elementStyleSection) { this.visit(es)}; 
        }
    }

    elementStyleSection(node: any) {
        this._debug && console.log(`Here we are at elementStyleSection with node: ${node.name}`);
        const es = {} as components["schemas"]["ElementStyle"];
        es.tag = stripQuotes(node.stringLiteral[0].image ?? "");
        // TODO: We MUST pass es to the style handlers here and that avoids the whole stupid children issue
        if (node.shapeStyle){ this.visit(node.shapeStyle, es);        }
        if (node.backgroundStyle){ this.visit(node.backgroundStyle, es); }
        if (node.colorStyle){ this.visit(node.colorStyle, es); }
        if (node.colourStyle){ this.visit(node.colourStyle, es); }
        if (node.fontStyle){ this.visit(node.fontStyle, es); }
        if (node.opacityStyle){ this.visit(node.opacityStyle, es); }
        this.workspace.views?.configuration?.styles?.elements?.push(es);
    }

    relationshipStyleSection(node: any) {
        this._debug && console.log(`Here we are at relationshipStyleSection with node: ${node.name}`);
    }

    shapeStyle(node: any, es: components["schemas"]["ElementStyle"]) {
        this._debug && console.log(`Here we are at shapeStyle with node: ${node.name}`);
        // es.shape = stripQuotes(node.shapeStyle[0].image ?? "");
    }

    backgroundStyle(node: any, es: components["schemas"]["ElementStyle"]) {
        this._debug && console.log(`Here we are at backgroundStyle with node: ${node.name}`);
        es.background = stripQuotes(node.hexColor[0].image ?? "");
    }

    colorStyle(node: any, es: components["schemas"]["ElementStyle"]) {
        this._debug && console.log(`Here we are at colorStyle with node: ${node.name}`);
        es.color = stripQuotes(node.hexColor[0].image ?? "");
    }

    colourStyle(node: any, es: components["schemas"]["ElementStyle"]) {
        this._debug && console.log(`Here we are at colourStyle with node: ${node.name}`);
        es.color = stripQuotes(node.hexColor[0].image ?? "");
    }

    fontStyle(node: any, es: components["schemas"]["ElementStyle"]) {
        this._debug && console.log(`Here we are at fontStyle with node: ${node.name}`);
        es.fontSize = node.int[0].image;
    }

    opacityStyle(node: any, es: components["schemas"]["ElementStyle"]) {
        this._debug && console.log(`Here we are at opacityStyle with node: ${node.name}`);
        es.opacity = node.int[0].image;
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

    addAllElements(view: any) {
        switch(this._currentView){
            // System Landscape view: Include all people and software systems.
            case ViewType.SystemLandscape:{
                if (this.workspace.model?.softwareSystems) {
                    for (const sl of this.workspace.model?.softwareSystems){
                        const e = {} as components["schemas"]["ElementView"];
                        e.id = sl.id;
                        view.elements.push(e);
                    }
                };
                if (this.workspace.model?.people) {
                    for (const pl of this.workspace.model.people){
                        const p = {} as components["schemas"]["ElementView"];
                        p.id = pl.id;
                        view.elements.push(p);
                    }
                }
                break;
            }
            // System Context view: Include the software system in scope; 
            // plus all people and software systems that are directly connected to 
            // the software system in scope.
            case ViewType.SystemContext:{
                const ss = {} as components["schemas"]["ElementView"];
                ss.id = view.softwareSystemId;
                view.elements.push(ss);
                break;
            }
            // Container view: Include all containers within the software system in scope; 
            // plus all people and software systems that are directly connected to those containers.
            case ViewType.Container:{
                const ss = {} as components["schemas"]["ElementView"];
                ss.id = view.softwareSystemId;
                view.elements.push(ss);
                break;
            }
            // Component view: Include all components within the container in scope; 
            // plus all people, software systems and containers (belonging to the software system in scope) 
            // directly connected to them.
            case ViewType.Component:{
                break;
            }
        }
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