import { CstParser } from "chevrotain";
import { Group, LBrace, Model, RBrace, StringLiteral, Views, Workspace, allTokens } from "./Lexer";

class structurizrParser extends CstParser {
  constructor() {
    super(allTokens);
    // very important to call this after all the rules have been defined.
    // otherwise the parser may not work correctly as it will lack information
    // derived during the self analysis phase.
    this.performSelfAnalysis();
  }

  // Rules go here
  private workspaceWrapper = this.RULE("workspaceWrapper", () => {
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
  });

  private viewsSection = this.RULE("viewsSection", () => {
    this.CONSUME(Views);
  });

  private childSection = this.RULE("childSection", () => {
    this.CONSUME1(LBrace);
    this.CONSUME1(RBrace);
  });
}

export const StructurizrParser = new structurizrParser();
export const BaseStructurizrVisitor =
  StructurizrParser.getBaseCstVisitorConstructorWithDefaults();
