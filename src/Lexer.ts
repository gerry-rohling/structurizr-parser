import { createToken, ITokenConfig, Lexer } from "chevrotain";

/// If we want to build token list in the same order as definition you can try doing this
/// If you rename this `createToken` you do not have to rewrite the code but you need to specify 
/// what createToken method you are calling in here
const addNewToken = (config: ITokenConfig) => {
    const newToken = createToken(config);
    allTokens.push(newToken);
    return newToken;
};

/// Comments
export const BlockComment = createToken({name: "blockComment", pattern: /\/\*[^*]*\*+([^/*][^*]*\*+)*\//, group: Lexer.SKIPPED });
export const LineComment = createToken({name: "lineComment", pattern: /\/\/(.*?)\r?\n/, group: Lexer.SKIPPED });
export const HashComment = createToken({name: "hashComment", pattern: /\#(.*?)\r?\n/, group: Lexer.SKIPPED });

/// URL
export const Url = createToken({name: "url", pattern: /(https?:\/\/[^ ]*)/i});

// Relative file path
export const FilePath = createToken({name: "filePath", pattern: /\.\.?\/[^\n"?:*<>|]+\.[A-z0-9]+/i });

/// Literals - was /"(?:[^\\"]|\\(?:[bfnrtv"\\/]|u[0-9a-fA-F]{4}))*"/ but I think this also included escaped char and unicode, maybe not required
export const StringLiteral = createToken({name: "stringLiteral", pattern: /"(?:[^"\\]|\\.)*"/ });

/// Identifiers was /[a-zA-Z_0-9]\w*/ and /[a-zA-z][a-zA-z.]*\_?[0-9]*/
export const Identifier = createToken({ name: 'identifier', pattern: /[a-zA-Z_0-9]+/ });

/// Keywords
export const BangInclude = createToken({name: "bangInclude", pattern: /!include/i });
export const BangConstant = createToken({name: "bangConstant", pattern: /!constant/i });
export const BangDocs = createToken({name: "bangDocs", pattern: /!docs/i });
export const BangAdrs = createToken({name: "bangAdrs", pattern: /!adrs/i });
export const BangIndentifiers = createToken({name: "bangIdentifiers", pattern: /!identifiers/i });
export const BangImpliedRelationships = createToken({name: "bangImpliedRelationships", pattern: /!impliedrelationships/i });
export const Workspace = createToken({ name: "workspace", pattern: /workspace/i, longer_alt: Identifier });
export const Extends = createToken({ name: "extends", pattern: /extends/i, longer_alt: Identifier });
export const Model = createToken({ name: "model", pattern: /model/i, longer_alt: Identifier });
export const Name = createToken({ name: "name", pattern: /name/i, longer_alt: Identifier });
export const Enterprise = createToken({ name: "enterprise", pattern: /enterprise/i, longer_alt: Identifier });
export const Group = createToken({ name: "group", pattern: /group/i, longer_alt: Identifier });
export const Person = createToken({ name: "person", pattern: /person/i, longer_alt: Identifier });
export const SoftwareSystem = createToken({ name: "softwareSystem", pattern: /softwaresystem/i, longer_alt: Identifier });
export const Container = createToken({ name: "container", pattern: /container/i, longer_alt: Identifier });
export const Component = createToken({ name: "component", pattern: /component/i, longer_alt: Identifier });
export const DeploymentEnvironment = createToken({name: "deploymentEnvironment", pattern: /deploymentenvironment/i });
export const DeploymentGroup = createToken({name: "deploymentGroup", pattern: /deploymentgroup/i });
export const DeploymentNode = createToken({name: "deploymentNode", pattern: /deploymentnode/i });
export const InfrastructureNode = createToken({name: "infrastructureNodel", pattern: /infrastructurenode/i });
export const SoftwareSystemInstance = createToken({name: "softwareSystemInstance", pattern: /softwaresysteminstance/i });
export const ContainerInstance = createToken({name: "containerInstance", pattern: /containerinstance/i });
export const Element = createToken({name: "element", pattern: /element/i, longer_alt: Identifier  });
export const Views = createToken({name: "views", pattern: /views/i, longer_alt: Identifier  });
export const SystemLandscape = createToken({name: "systemLandscape", pattern: /systemlandscape/i });
export const SystemContext = createToken({name: "systemContext", pattern: /systemcontext/i });
export const Filtered = createToken({name: "filtered", pattern: /filtered/i, longer_alt: Identifier });
export const Dynamic = createToken({name: "dynamic", pattern: /dynamic/i, longer_alt: Identifier  });
export const Deployment = createToken({name: "deployment", pattern: /deployment/i, longer_alt: Identifier });
export const Custom = createToken({name: "custom", pattern: /custom/i, longer_alt: Identifier });
export const Image = createToken({name: "image", pattern: /image/i, longer_alt: Identifier});
export const Title = createToken({name: "title", pattern: /title/i, longer_alt: Identifier});
export const Animation = createToken({name: "animation", pattern: /animation/i, longer_alt: Identifier});
export const Styles = createToken({name: "styles", pattern: /styles/i, longer_alt: Identifier });
export const Relationship = createToken({name: "relationship", pattern: /relationship/i, longer_alt: Identifier });
export const Themes = createToken({name: "themes", pattern: /themes/i, longer_alt: Identifier });
export const Theme = createToken({name: "theme", pattern: /theme/i, longer_alt: Themes });
export const Branding = createToken({name: "branding", pattern: /branding/i, longer_alt: Identifier });
export const Terminology = createToken({name: "terminology", pattern: /terminology/i, longer_alt: Identifier });
export const Configuration = createToken({name: "configuration", pattern: /configuration/i, longer_alt: Identifier });
export const Users = createToken({name: "users", pattern: /users/i, longer_alt: Identifier  });
export const Include = createToken({name: "include", pattern: /include/i, longer_alt: Identifier});
export const AutoLayout = createToken({name: "autoLayout", pattern: /autoLayout/i, longer_alt: Identifier});
export const Description = createToken({name: "description", pattern: /description/i, longer_alt: Identifier});
export const Properties = createToken({name: "properties", pattern: /properties/i, longer_alt: Identifier});
export const Shape = createToken({name: "shape", pattern: /shape/i, longer_alt: Identifier});
export const Background = createToken({name: "background", pattern: /background/i, longer_alt: Identifier});
export const Color = createToken({name: "color", pattern: /color/i, longer_alt: Identifier});
export const Colour = createToken({name: "colour", pattern: /colour/i, longer_alt: Identifier});
export const ShapeEnum = createToken({name: "shapeEnum", pattern: /Box|RoundedBox|Circle|Ellipse|Hexagon|Cylinder|Pipe|Person|Robot|Folder|WebBrowser|MobileDevicePortrait|MobileDeviceLandscape|Component/i, longer_alt:Identifier});
export const FontSize = createToken({name: "fontSize", pattern: /fontsize/i, longer_alt: Identifier});
export const Opacity = createToken({name:"opacity", pattern: /opacity/i, longer_alt: Identifier});
export const StructurizrLocale = createToken({name: "structurizrLocale", pattern: /"structurizr\.locale"|structurizr\.locale/i, longer_alt: Identifier });
export const StructurizrTimezone = createToken({name: "structurizrTimezone", pattern: /"structurizr\.timezone"|structurizr\.timezone/i, longer_alt: Identifier });
export const StructurizrSort = createToken({name: "structurizrSort", pattern: /"structurizr\.sort"|structurizr\.sort/i, longer_alt: Identifier });
export const StructurizrTooltips = createToken({name: "structurizrTooltips", pattern: /"structurizr\.tooltips"|structurizr\.tooltips/i, longer_alt: Identifier });
export const StructurizrTitle = createToken({name: "structurizrTitle", pattern: /"structurizr\.title"|structurizr\.title/i, longer_alt: Identifier });
export const StructurizrDescription = createToken({name: "structurizrDescription", pattern: /"structurizr\.description"|structurizr\.description/i, longer_alt: Identifier });
export const StructurizrMetadata = createToken({name: "structurizrMetadata", pattern: /"structurizr\.metadata"|structurizr\.metadata/i, longer_alt: Identifier });
export const StructurizrEnterpriseBoundary = createToken({name: "structurizrEnterpriseBoundary", pattern: /"structurizr\.enterpriseBoundary"|structurizr\.enterpriseBoundary/i, longer_alt: Identifier });
export const StructurizrGroupSeparator = createToken({name: "structurizrGroupSeparator", pattern: /"structurizr\.groupSeparator"|structurizr\.groupSeparator/i, longer_alt: Identifier });
export const StructurizrGroups = createToken({name: "structurizrGroups", pattern: /"structurizr\.groups"|structurizr\.groups/i, longer_alt: Identifier });
export const StructurizrSoftwareSystemBoundaries = createToken({name: "structurizrSoftwareSystemBoundaries", pattern: /"structurizr\.softwareSystemBoundaries"|structurizr\.softwareSystemBoundaries/i, longer_alt: Identifier });

/// Relationships
export const Equals = createToken({ name: "equals", pattern: /=/ });
export const RelatedTo = createToken({ name: "relatedTo", pattern: /->/ });

/// Values
export const Value = createToken({ name: "value", pattern: Lexer.NA });
export const Bool = createToken({name: "bool", pattern: /(true|false)/i, categories: Value, longer_alt: Identifier});
export const HexColor = createToken({ name: "hexColor", pattern: /#[0-9A-Fa-f]{6}/, categories: Value });
export const Word = createToken({ name: "word", pattern: /[a-zA-Z][a-zA-Z0-9_]*/, categories: Value, longer_alt: Identifier });
export const Float = createToken({ name: "float", pattern: /-?[0-9]+\.[0-9]+/, categories: Value });
export const Int = createToken({ name: "int", pattern: /-?(?:0|[1-9][0-9]*)/, categories: Value });


/// Wildcards
export const Wildcard = createToken({name: "wildcard", pattern: /(\*)/ });

/// Furniture
// export const Endline = createToken({ name: "endline", pattern: /\r\n|\r|\n/, line_breaks: true });
export const LBrace = createToken({ name: "lBrace", pattern: /\{/, label: "{" });
export const RBrace = createToken({ name: "rBrace", pattern: /\}/, label: "}" });

/// Noise - was /\s+/ but now also absorbing line ends
export const WhiteSpace = createToken({ name: 'whiteSpace', pattern: /[\s\t\n\r]+/, group: Lexer.SKIPPED });

// Build in order of frequency and priority. First encountered is a match. 
// Keywords before identifiers, whitespace at beginning
export const allTokens = [
    WhiteSpace,
    BlockComment,
    LineComment,
    Url,
    FilePath,
    HexColor,  
    HashComment,

    StructurizrLocale,
    StructurizrTimezone,
    StructurizrSort,
    StructurizrTooltips,
    StructurizrTitle,
    StructurizrDescription,
    StructurizrMetadata,
    StructurizrEnterpriseBoundary,
    StructurizrGroupSeparator,
    StructurizrGroups,
    StructurizrSoftwareSystemBoundaries,

    StringLiteral,

    BangInclude,
    BangConstant,
    BangDocs,
    BangAdrs,
    BangIndentifiers,
    BangImpliedRelationships,
    Workspace,
    Extends,
    Name,
    Model,
    Enterprise,
    Group,
    Person,
    SoftwareSystemInstance,
    SoftwareSystem,
    ContainerInstance,
    Container,
    Component,
    DeploymentEnvironment,
    DeploymentGroup,
    DeploymentNode,
    InfrastructureNode,
    Element,
    Views,
    SystemLandscape,
    SystemContext,
    Filtered,
    Dynamic,
    Deployment,
    Custom,
    Image,
    Title,
    Animation,
    Styles,
    Relationship,
    Themes,
    Theme,
    Branding,
    Terminology,
    Configuration,
    Users,
    Include,
    AutoLayout,
    Description,
    Properties,
    Shape,
    Background,
    Color,
    Colour,
    ShapeEnum,
    FontSize,
    Opacity,

    Equals,
    RelatedTo,

    Bool, 

    Int,

    Identifier,
    
    Value,  
    Word,
    Float,


    Wildcard,

    LBrace,
    RBrace
];

export const StructurizrLexer = new Lexer(allTokens);