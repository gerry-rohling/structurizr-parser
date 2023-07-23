import { CstNode } from "chevrotain";
import { BaseStructurizrVisitor, StructurizrParser } from "./Parser";

class structurizrInterpreter extends BaseStructurizrVisitor {

    constructor() {
        super();

        this.validateVisitor();
    }

    workspaceWrapper(node: CstNode) {
        console.log(`Here we are at workspaceWrapper with node: ${node.name}`);
    }

    workspaceSection(node: CstNode) {
        console.log(`Here we are at workspaceSection with node: ${node.name}`);
    }

    modelSection(node: CstNode) {
        console.log(`Here we are at modelSection with node: ${node.name}`);
    }

    modelChildSection(node: CstNode) {
        console.log(`Here we are at modelChildSection with node: ${node.name}`);
    }

    groupSection(node: CstNode) {
        console.log(`Here we are at groupSection with node: ${node.name}`);
    }

    groupChildSection(node: CstNode) {
        console.log(`Here we are at groupChildSection with node: ${node.name}`);
    }

    personSection(node: CstNode) {
        console.log(`Here we are at personSection with node: ${node.name}`);
    }

    softwareSystemSection(node: CstNode) {
        console.log(`Here we are at softwareSystemSection with node: ${node.name}`);
    }

    softwareSystemChildSection(node: CstNode) {
        console.log(`Here we are at softwareSystemChildSection with node: ${node.name}`);
    }

    containerSection(node: CstNode) {
        console.log(`Here we are at ContainerSection with node: ${node.name}`);
    }

    containerChildSection(node: CstNode) {
        console.log(`Here we are at ContainerChildSection with node: ${node.name}`);
    }

    componentSection(node: CstNode) {
        console.log(`Here we are at ComponentSection with node: ${node.name}`);
    }

    explicitRelationship(node: CstNode) {
        console.log(`Here we are at explicitRelationship with node: ${node.name}`);
    }

    implicitRelationship(node: CstNode) {
        console.log(`Here we are at implicitRelationship with node: ${node.name}`);
    }

    deploymentEnvironmentSection(node: CstNode) {
        console.log(`Here we are at deploymentEnvironmentSection with node: ${node.name}`);
    }

    deploymentEnvironmentChildSection(node: CstNode) {
        console.log(`Here we are at deploymentEnvironmentChildSection with node: ${node.name}`);
    }

    deploymentNodeSection(node: CstNode) {
        console.log(`Here we are at deploymentNodeSection with node: ${node.name}`);
    }

    deploymentNodeChildSection(node: CstNode) {
        console.log(`Here we are at deploymentNodeChildSection with node: ${node.name}`);
    }

    containerInstanceSection(node: CstNode) {
        console.log(`Here we are at containerInstanceSection with node: ${node.name}`);
    }

    softwareSystemInstanceSection(node: CstNode) {
        console.log(`Here we are at softwareSystemInstanceSection with node: ${node.name}`);
    }

    viewsSection(node: CstNode) {
        console.log(`Here we are at viewsSection with node: ${node.name}`);
    }

    viewsChildSection(node: CstNode) {
        console.log(`Here we are at viewsChildSection with node: ${node.name}`);
    }

    systemLandscapeView(node: CstNode) {
        console.log(`Here we are at systemLandscapeView with node: ${node.name}`);
    }

    viewOptions(node: CstNode) {
        console.log(`Here we are at viewOptions with node: ${node.name}`);
    }

    includeOptions(node: CstNode) {
        console.log(`Here we are at includeOptions with node: ${node.name}`);
    }

    autoLayoutOptions(node: CstNode) {
        console.log(`Here we are at autoLayoutOptions with node: ${node.name}`);
    }

    animationOptions(node: CstNode) {
        console.log(`Here we are at animationOptions with node: ${node.name}`);
    }

    descriptionOptions(node: CstNode) {
        console.log(`Here we are at descriptionOptions with node: ${node.name}`);
    }

    propertiesOptions(node: CstNode) {
        console.log(`Here we are at propertiesOptions with node: ${node.name}`);
    }

    systemContextView(node: CstNode) {
        console.log(`Here we are at systemContextView with node: ${node.name}`);
    }

    containerView(node: CstNode) {
        console.log(`Here we are at containerView with node: ${node.name}`);
    }

    componentView(node: CstNode) {
        console.log(`Here we are at componentView with node: ${node.name}`);
    }

    imageSection(node: CstNode) {
        console.log(`Here we are at imageSection with node: ${node.name}`);
    }

    dynamicSection(node: CstNode) {
        console.log(`Here we are at dynamicSection with node: ${node.name}`);
    }

    deploymentSection(node: CstNode) {
        console.log(`Here we are at deploymentSection with node: ${node.name}`);
    }

    stylesSection(node: CstNode) {
        console.log(`Here we are at stylesSection with node: ${node.name}`);
    }

    elementStyleSection(node: CstNode) {
        console.log(`Here we are at elementStyleSection with node: ${node.name}`);
    }

    relationshipStyleSection(node: CstNode) {
        console.log(`Here we are at relationshipStyleSection with node: ${node.name}`);
    }

    shapeStyle(node: CstNode) {
        console.log(`Here we are at shapeStyle with node: ${node.name}`);
    }

    backgroundStyle(node: CstNode) {
        console.log(`Here we are at backgroundStyle with node: ${node.name}`);
    }

    colorStyle(node: CstNode) {
        console.log(`Here we are at colorStyle with node: ${node.name}`);
    }

    colourStyle(node: CstNode) {
        console.log(`Here we are at colourStyle with node: ${node.name}`);
    }

    fontStyle(node: CstNode) {
        console.log(`Here we are at fontStyle with node: ${node.name}`);
    }

    opacityStyle(node: CstNode) {
        console.log(`Here we are at opacityStyle with node: ${node.name}`);
    }
}

export const StructurizrInterpreter = new structurizrInterpreter();