import * as fsPromise from 'fs/promises';
import { StructurizrLexer } from '../src/Lexer';
import { StructurizrParser } from '../src/Parser';
import { C4Interpreter } from '../src/C4Interpreter';
import { C4Workspace } from '../src/c4/c4workspace';
// import { MxBuilder } from 'mxbuilder';

describe('Testing C4Interpreter', () => {

    test('Can c4 interpret getting started dsl', async() => {
        var dsl = await fsPromise.readFile('./tests/data/getting-started.dsl', 'utf-8');
        const lexingResult = StructurizrLexer.tokenize(dsl);
        expect(lexingResult.errors.length).toBe(0);
        StructurizrParser.input = lexingResult.tokens;
        const cst = StructurizrParser.workspaceWrapper();
        expect(StructurizrParser.errors.length).toBe(0);
        expect(cst.name).toBe("workspaceWrapper");
        const c4wspace = C4Interpreter.visit(cst) as C4Workspace;
        expect(c4wspace).toBeDefined();
        await fsPromise.writeFile("./tests/c4/c4-getting-started.json", JSON.stringify(c4wspace));
    });

});