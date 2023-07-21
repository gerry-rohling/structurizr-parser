import { CstParser } from "chevrotain";
import { Animation, AutoLayout, Component, Container, ContainerInstance, DeploymentEnvironment, DeploymentNode, Description, Element, Equals, Group, Identifier, Include, Int, LBrace, Model, Person, Properties, RBrace, RelatedTo, Relationship, SoftwareSystem, SoftwareSystemInstance, StringLiteral, Styles, SystemContext, SystemLandscape, Value, Views, Wildcard, Workspace, allTokens } from "./Lexer";

class structurizrParser extends CstParser {
  constructor() {
    super(allTokens);
    // very important to call this after all the rules have been defined.
    // otherwise the parser may not work correctly as it will lack information
    // derived during the self analysis phase.
    this.performSelfAnalysis();
  }

  // Rules go here
  public workspaceWrapper = this.RULE("workspaceWrapper", () => {
    this.CONSUME(Workspace);
    this.OPTION1(() => {
      this.CONSUME1(StringLiteral);
    });
    this.OPTION2(() => {
      this.CONSUME2(StringLiteral);
    });
    this.SUBRULE(this.workspaceSection);
  });

  private workspaceSection = this.RULE("workspaceSection", () => {
    this.CONSUME(LBrace);
    this.SUBRULE(this.modelSection);
    this.OPTION(() => {
      this.SUBRULE(this.viewsSection);
    });
    this.CONSUME(RBrace);
  });

  private modelSection = this.RULE("modelSection", () => {
    this.CONSUME(Model);
    this.SUBRULE(this.modelChildSection);
  });

  private modelChildSection = this.RULE("modelChildSection", () => {
    this.CONSUME1(LBrace);
    this.MANY(() => {
        this.OR([
            {ALT: () => {this.SUBRULE(this.groupSection)}},
            {ALT: () => {this.SUBRULE(this.personSection)}},
            {ALT: () => {this.SUBRULE(this.softwareSystemSection)}},
            {ALT: () => {this.SUBRULE(this.explicitRelationship)}},
            {ALT: () => {this.SUBRULE(this.deploymentEnvironmentSection)}}
        ]);
    });
    this.CONSUME1(RBrace);
  });

  private groupSection = this.RULE("groupSection", () => {
    this.OPTION(() => {
        this.CONSUME(Identifier);
        this.CONSUME(Equals);
    });
    this.CONSUME(Group);
    this.CONSUME(StringLiteral);
    this.SUBRULE(this.groupChildSection);
  });

  private groupChildSection = this.RULE("groupChildSection", () => {
    this.CONSUME(LBrace);
    this.MANY(() => {
        this.OR([
            {ALT: () => {this.SUBRULE(this.personSection)}},
            {ALT: () => {this.SUBRULE(this.softwareSystemSection)}}
        ]);
    });
    this.CONSUME(RBrace);
  });

  private personSection = this.RULE("personSection", () => {
    this.OPTION(() => {
        this.CONSUME(Identifier);
        this.CONSUME(Equals);
    });
    this.CONSUME(Person);
    this.CONSUME(StringLiteral);
    this.OPTION1(() => {
        this.CONSUME1(StringLiteral);
    });
    this.OPTION2(() => {
        this.CONSUME2(StringLiteral);
    });
  });

  private softwareSystemSection = this.RULE("softwareSystemSection", () => {
    this.OPTION(() => {
        this.CONSUME(Identifier);
        this.CONSUME(Equals);
    });
    this.CONSUME(SoftwareSystem);
    this.CONSUME(StringLiteral);
    this.MANY(() => {
        this.CONSUME1(StringLiteral);
    });
    this.OPTION1(() => {
      this.SUBRULE(this.softwareSystemChildSection);
    });
  });

  private softwareSystemChildSection = this.RULE("softwareSystemChildSection", () => {
    this.CONSUME1(LBrace);
    this.MANY(() => {
      this.OR([
        {ALT: () => {this.SUBRULE(this.containerSection)}},
        {ALT: () => {this.SUBRULE(this.implicitRelationship)}}
      ]);
        ;
    });
    this.CONSUME1(RBrace);
  });

  private containerSection = this.RULE("containerSection", () => {
    this.OPTION(() => {
        this.CONSUME(Identifier);
        this.CONSUME(Equals);
    });
    this.CONSUME(Container);
    this.CONSUME(StringLiteral);
    this.MANY(() => {
        this.CONSUME1(StringLiteral);
    });
    this.OPTION1(() => this.SUBRULE(this.containerChildSection));    
  });

  private containerChildSection = this.RULE("containerChildSection", () => {
    this.CONSUME1(LBrace);
    this.MANY(() => {
      this.OR([
        {ALT: () => {this.SUBRULE(this.componentSection)}},
        {ALT: () => {this.SUBRULE(this.implicitRelationship)}}
      ]);
    });
    this.CONSUME1(RBrace);
  });

  private componentSection = this.RULE("componentSection", () => {
    this.OPTION(() => {
        this.CONSUME(Identifier);
        this.CONSUME(Equals);
    });
    this.CONSUME(Component);
    this.CONSUME(StringLiteral);
    this.MANY(() => {
        this.CONSUME1(StringLiteral);
    }); 
  });

  private explicitRelationship = this.RULE("explicitRelationship", () => {
    this.CONSUME(Identifier);
    this.CONSUME(RelatedTo);
    this.CONSUME1(Identifier);
    this.MANY(() => {
      this.CONSUME(StringLiteral);
    });
  });

  private implicitRelationship = this.RULE("implicitRelationship", () => {
    this.CONSUME(RelatedTo);
    this.CONSUME1(Identifier);
    this.MANY(() => {
      this.CONSUME(StringLiteral);
    });
  });

  private deploymentEnvironmentSection = this.RULE("deploymentEnvironmentSection", () => {
    this.OPTION(() => {
      this.CONSUME(Identifier);
      this.CONSUME(Equals);
    });
    this.CONSUME(DeploymentEnvironment);
    this.CONSUME(StringLiteral);
    this.SUBRULE(this.deploymentEnvironmentChildSection);
  });

  private deploymentEnvironmentChildSection = this.RULE("deploymentEnvironmentChildSection", () => {
    this.CONSUME(LBrace);
    this.MANY(() => this.OR([
      {ALT: () => {this.SUBRULE(this.deploymentNodeSection)}},
      {ALT: () => {this.SUBRULE(this.containerInstanceSection)}},
      {ALT: () => {this.SUBRULE(this.explicitRelationship)}}
    ]));
    this.CONSUME(RBrace);
  });

  private deploymentNodeSection = this.RULE("deploymentNodeSection", () => {
    this.OPTION(() => {
      this.CONSUME(Identifier);
      this.CONSUME(Equals);
    });
    this.CONSUME(DeploymentNode);
    this.CONSUME(StringLiteral);
    this.OPTION1(() => this.CONSUME1(StringLiteral));
    this.OPTION2(() => this.CONSUME2(StringLiteral));
    this.OPTION3(() => this.CONSUME3(StringLiteral));
    this.OPTION4(() => this.CONSUME4(Int));
    this.OPTION5(() => this.SUBRULE(this.deploymentNodeChildSection));
  });

  private deploymentNodeChildSection = this.RULE("deploymentNodeChildSection", () => {
    this.CONSUME(LBrace);
    this.MANY(() => this.OR([
      {ALT: () => {this.SUBRULE(this.deploymentNodeSection)}},
      {ALT: () => {this.SUBRULE(this.containerInstanceSection)}},
      {ALT: () => {this.SUBRULE(this.softwareSystemInstanceSection)}}
    ]));
    this.CONSUME(RBrace);
  });

  private containerInstanceSection = this.RULE("containerInstanceSection", () => {
    this.OPTION(() => {
      this.CONSUME(Identifier);
      this.CONSUME(Equals);
    });
    this.CONSUME(ContainerInstance);
    this.CONSUME1(Identifier);
    this.MANY(() => {
      this.CONSUME(StringLiteral);
    });
  });

  private softwareSystemInstanceSection = this.RULE("softwareSystemInstanceSection", () => {
    this.CONSUME(SoftwareSystemInstance);
    this.CONSUME(Identifier);
    this.MANY(() => {this.CONSUME(StringLiteral)});
  });

  private viewsSection = this.RULE("viewsSection", () => {
    this.CONSUME(Views);
    this.SUBRULE(this.viewsChildSection);
  });

  private viewsChildSection = this.RULE("viewsChildSection", () => {
    this.CONSUME1(LBrace);
    this.MANY(() => {
      this.OR([
        {ALT: () => {this.SUBRULE(this.systemLandscapeView)}},
        {ALT: () => {this.SUBRULE(this.systemContextView)}},
        {ALT: () => {this.SUBRULE(this.containerView)}},
        {ALT: () => {this.SUBRULE(this.componentView)}},
        {ALT: () => {this.SUBRULE(this.stylesSection)}}
      ]);
    });
    this.CONSUME1(RBrace);
  });

  private systemLandscapeView = this.RULE("systemLandscapeView", () => {
    this.CONSUME(SystemLandscape);
    this.MANY(() => {
      this.CONSUME(StringLiteral);
    });
    this.SUBRULE(this.viewOptions);
  });

  private viewOptions = this.RULE("viewOptions", () => {
    this.CONSUME(LBrace);
    this.MANY(() => {
      this.OR([
        {ALT: () => {this.SUBRULE(this.includeOptions)}},
        {ALT: () => {this.SUBRULE(this.autoLayoutOptions)}},
        {ALT: () => {this.SUBRULE(this.animationOptions)}},
        {ALT: () => {this.SUBRULE(this.descriptionOptions)}},
        {ALT: () => {this.SUBRULE(this.propertiesOptions)}}
      ])
    });
    this.CONSUME(RBrace);
  });

  private includeOptions = this.RULE("includeOptions", () => {
    this.CONSUME(Include);
    this.OR([
      {ALT: () => {this.CONSUME(Wildcard)}},
      {ALT: () => {this.CONSUME(Identifier)}}
    ]);
  });

  private autoLayoutOptions = this.RULE("autoLayoutOptions", () => {
    this.CONSUME(AutoLayout);
    this.OPTION(() => {this.CONSUME(Identifier)});
    this.OPTION1(() => {this.CONSUME(Int)});
    this.OPTION2(() => {this.CONSUME1(Int)});

  });

  private animationOptions = this.RULE("animationOptions", () => {
    this.CONSUME(Animation);
    this.CONSUME(LBrace);
    this.MANY(() => {
      this.CONSUME(Identifier);
      this.OPTION(() => this.CONSUME(Value));
    });
    this.CONSUME(RBrace);
  });

  private descriptionOptions = this.RULE("descriptionOptions", () => {
    this.CONSUME(Description);
    this.CONSUME(StringLiteral);
  });

  private propertiesOptions = this.RULE("propertiesOptions", () => {
    this.CONSUME(Properties);
    this.CONSUME(LBrace);
    this.MANY(() => {
      this.CONSUME(Identifier);
      this.CONSUME(Value);
    });
    this.CONSUME(RBrace);
  });

  private systemContextView = this.RULE("systemContextView", () => {
    this.CONSUME(SystemContext);
    this.CONSUME(Identifier);
    this.MANY(() => {
      this.CONSUME2(StringLiteral);
    });
    this.SUBRULE(this.viewOptions);
  });

  private containerView = this.RULE("containerView", () => {
    this.CONSUME(Container);
    this.CONSUME(Identifier);
    this.MANY(() => {
      this.CONSUME2(StringLiteral);
    });
    this.SUBRULE(this.viewOptions);
  });

  private componentView = this.RULE("componentView", () => {
    this.CONSUME(Component);
    this.CONSUME(Identifier);
    this.MANY(() => {
      this.CONSUME2(StringLiteral);
    });
    this.SUBRULE(this.viewOptions);
  });

  private stylesSection = this.RULE("stylesSection", () => {
    this.CONSUME(Styles);
    this.CONSUME(LBrace);
    this.MANY(() => {
      this.OR([
        {ALT: () => {this.SUBRULE(this.elementStyleSection)}},
        {ALT: () => {this.SUBRULE(this.relationshipStyleSection)}}
      ]);
    });
    this.CONSUME(RBrace);
  });

  private elementStyleSection = this.RULE("elementStyleSection", () => {
    this.CONSUME(Element);
    this.CONSUME(StringLiteral);
    this.CONSUME(LBrace);
    this.MANY(() => {
      this.SUBRULE(this.styleDefinition);
    });
    this.CONSUME(RBrace);
  });

  private relationshipStyleSection = this.RULE("relationshipStyleSection", () => {
    this.CONSUME(Relationship);
    this.CONSUME(Identifier);
    this.CONSUME(LBrace);
    this.MANY(() => {
      this.SUBRULE(this.styleDefinition);
    });
    this.CONSUME(RBrace);
  });

  private styleDefinition = this.RULE("styleDefinition", () => {
    this.CONSUME(Identifier);
    this.OR([
      {ALT: () => {this.CONSUME1(Value)}},
      {ALT: () => {this.CONSUME1(Person)}},
      {ALT: () => {this.CONSUME1(Component)}}
    ]);
  })
}

export const StructurizrParser = new structurizrParser();
export const BaseStructurizrVisitor =
  StructurizrParser.getBaseCstVisitorConstructor();
