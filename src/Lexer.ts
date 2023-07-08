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
const blockComment = createToken({name: "blockComment", pattern: /\/\*[^*]*\*+([^/*][^*]*\*+)*\// });
const lineComment = createToken({name: "lineComment", pattern: /\/\/(.*?)\r?\n/ });
const hashComment = createToken({name: "hashComment", pattern: /\#(.*?)\r?\n/ });

/// Literals
const stringLiteral = createToken({name: "StringLiteral", pattern: /"(?:[^\\"]|\\(?:[bfnrtv"\\/]|u[0-9a-fA-F]{4}))*"/ });

/// Identifiers
const identifier = createToken({ name: 'identifier', pattern: /[a-zA-Z0-9]\w*/ });

/// Keywords
const bangInclude = createToken({name: "bangInclude", pattern: /!include/i });
const bangConstant = createToken({name: "bangConstant", pattern: /!constant/i });
const bangDocs = createToken({name: "bangDocs", pattern: /!docs/i });
const bangAdrs = createToken({name: "bangAdrs", pattern: /!adrs/i });
const bangIndentifiers = createToken({name: "bangIdentifiers", pattern: /!identifiers/i });
const bangImpliedRelationships = createToken({name: "bangImpliedRelationships", pattern: /!impliedrelationships/i });
const workspace = createToken({ name: "workspace", pattern: /workspace/i, longer_alt: identifier });
const model = createToken({ name: "model", pattern: /model/i, longer_alt: identifier });
const enterprise = createToken({ name: "enterprise", pattern: /enterprise/i, longer_alt: identifier });
const group = createToken({ name: "group", pattern: /group/i, longer_alt: identifier });
const person = createToken({ name: "person", pattern: /person/i, longer_alt: identifier });
const softwareSystem = createToken({ name: "softwareSystem", pattern: /softwaresystem/i, longer_alt: identifier });
const container = createToken({ name: "container", pattern: /container/i, longer_alt: identifier });
const component = createToken({ name: "component", pattern: /component/i, longer_alt: identifier });
const deploymentEnvironment = createToken({name: "deploymentEnvironment", pattern: /deploymentenvironment/i });
const deploymentGroup = createToken({name: "deploymentGroup", pattern: /deploymentgroup/i });
const deploymentNode = createToken({name: "deploymentNode", pattern: /deploymentnode/i });
const infrastructureNode = createToken({name: "infrastructureNodel", pattern: /infrastructurenode/i });
const softwareSystemInstance = createToken({name: "softwareSystemInstance", pattern: /softwaresysteminstance/i });
const containerInstance = createToken({name: "containerInstance", pattern: /containerinstance/i });
const element = createToken({name: "element", pattern: /element/i, longer_alt: identifier  });
const views = createToken({name: "views", pattern: /views/i, longer_alt: identifier  });
const systemLandscape = createToken({name: "systemLandscape", pattern: /systemlandscape/i });
const systemContext = createToken({name: "systemContext", pattern: /systemcontext/i });
const filtered = createToken({name: "filtered", pattern: /filtered/i, longer_alt: identifier });
const dynamic = createToken({name: "dynamic", pattern: /dynamic/i, longer_alt: identifier  });
const deployment = createToken({name: "deployment", pattern: /deployment/i, longer_alt: identifier });
const custom = createToken({name: "custom", pattern: /custom/i, longer_alt: identifier });
const styles = createToken({name: "styles", pattern: /styles/i, longer_alt: identifier });
const relationship = createToken({name: "relationship", pattern: /relationship/i, longer_alt: identifier });
const themes = createToken({name: "themes", pattern: /themes/i, longer_alt: identifier });
const theme = createToken({name: "theme", pattern: /theme/i, longer_alt: themes });
const branding = createToken({name: "branding", pattern: /branding/i, longer_alt: identifier });
const terminology = createToken({name: "terminology", pattern: /terminology/i, longer_alt: identifier });
const configuration = createToken({name: "configuration", pattern: /configuration/i, longer_alt: identifier });
const users = createToken({name: "users", pattern: /users/i, longer_alt: identifier  });

/// Relationships
const equals = createToken({ name: "equals", pattern: /=/ });
const relatedTo = createToken({ name: "relatedTo", pattern: /->/ });

/// Values
const value = createToken({ name: "value", pattern: Lexer.NA });
const word = createToken({ name: "word", pattern: /[a-zA-Z][a-zA-Z0-9_]*/, categories: value });
const float = createToken({ name: "float", pattern: /-?[0-9]+\.[0-9]+/, categories: value });
const int = createToken({ name: "int", pattern: /-?(?:0|[1-9][0-9]*)/, categories: value });

/// Wildcards
const wildcard = createToken({name: "wildcard", pattern: /(\*)/ });

/// Furniture
const endline = createToken({ name: "endline", pattern: /\r\n|\r|\n/, line_breaks: true });
const lBrace = createToken({ name: "lBrace", pattern: /\{/, label: "{" });
const rBrace = createToken({ name: "rBrace", pattern: /\}/, label: "}" });

/// Noise
const whiteSpace = createToken({ name: 'whiteSpace', pattern: /\s+/, group: Lexer.SKIPPED });

// Build in order of frequency and priority. First encountered is a match. Keywords before identifiers, whitespace at beginning
export const allTokens = [
    whiteSpace,
    blockComment,
    lineComment,
    hashComment,

    stringLiteral,

    bangInclude,
    bangConstant,
    bangDocs,
    bangAdrs,
    bangIndentifiers,
    bangImpliedRelationships,
    workspace,
    model,
    enterprise,
    group,
    person,
    softwareSystemInstance,
    softwareSystem,
    containerInstance,
    container,
    component,
    deploymentEnvironment,
    deploymentGroup,
    deploymentNode,
    infrastructureNode,
    element,
    views,
    systemLandscape,
    systemContext,
    filtered,
    dynamic,
    deployment,
    custom,
    styles,
    relationship,
    themes,
    theme,
    branding,
    terminology,
    configuration,
    users,

    equals,
    relatedTo,

    identifier,
    value,
    word,
    float,
    int,

    wildcard,

    lBrace,
    rBrace,
    endline
];

export const StructurizrLexer = new Lexer(allTokens);