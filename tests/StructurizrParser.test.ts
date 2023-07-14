import * as fsPromise from 'fs/promises';
import { StructurizrParser } from '../src/Parser';
import { createSyntaxDiagramsCode } from 'chevrotain';
import { StructurizrLexer } from '../src/Lexer';

describe('Testing StructurizrParser', () => {
    test('Can generate diagrams', async() => {
        const targetDir = './tests/diagrams/';
        const serializedGrammar = StructurizrParser.getSerializedGastProductions();
        const htmlText = createSyntaxDiagramsCode(serializedGrammar);
        await fsPromise.writeFile(targetDir + "generated_diagrams.html", htmlText);
        expect(htmlText.length).toBeGreaterThan(0);
    });

    test('Can parse getting started dsl', async() => {
        var dsl = await fsPromise.readFile('./tests/data/getting-started.dsl', 'utf-8');
        const lexingResult = StructurizrLexer.tokenize(dsl);
        expect(lexingResult.errors.length).toBe(0);
        StructurizrParser.input = lexingResult.tokens;
        const cst = StructurizrParser.workspaceWrapper();
        if (StructurizrParser.errors.length > 0) {
            console.log(StructurizrParser.errors[0].message);
            console.log(StructurizrParser.errors[0].context.ruleStack);
            console.log(StructurizrParser.errors[0].resyncedTokens);
        };
        expect(StructurizrParser.errors).toBe(0);
    });
});