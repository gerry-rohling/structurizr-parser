import * as fsPromise from 'fs/promises';
import { StructurizrLexer } from '../src/Lexer';
import { StructurizrParser } from '../src/Parser';
import { RawInterpreter } from '../src/RawInterpreter';
import { components } from '../src/structurizr.schema';

describe('Testing RawInterpreter', () => {
    test('Can RAW interpret getting started dsl', async() => {
        var dsl = await fsPromise.readFile('./tests/data/getting-started.dsl', 'utf-8');
        const lexingResult = StructurizrLexer.tokenize(dsl);
        expect(lexingResult.errors.length).toBe(0);
        StructurizrParser.input = lexingResult.tokens;
        const cst = StructurizrParser.workspaceWrapper();
        expect(StructurizrParser.errors.length).toBe(0);
        expect(cst.name).toBe("workspaceWrapper");
        RawInterpreter.Debug = true;
        const c4wspace = RawInterpreter.visit(cst) as components["schemas"]["Workspace"];
        expect(c4wspace).toBeDefined();
        await fsPromise.writeFile("./tests/raw/c4-getting-started.json", JSON.stringify(c4wspace));
    });
});