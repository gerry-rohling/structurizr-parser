import * as fsPromise from 'fs/promises';
import { StructurizrLexer } from '../src/Lexer';
import { StructurizrParser } from '../src/Parser';
import { DrawioInterpreter } from '../src/DrawioInterpreter'
// import { MxBuilder } from 'mxbuilder';
import { paths, components } from "../src/structurizr.schema";

describe('Testing DrawioInterpreter', () => {

    test('Can drawio interpret getting started dsl', async() => {
        var dsl = await fsPromise.readFile('./tests/data/getting-started.dsl', 'utf-8');
        const lexingResult = StructurizrLexer.tokenize(dsl);
        expect(lexingResult.errors.length).toBe(0);
        StructurizrParser.input = lexingResult.tokens;
        const cst = StructurizrParser.workspaceWrapper();
        expect(StructurizrParser.errors.length).toBe(0);
        expect(cst.name).toBe("workspaceWrapper");
        const c4Workspace = DrawioInterpreter.visit(cst) as components["schemas"]["Workspace"];
        expect(c4Workspace).toBeDefined();
        await fsPromise.writeFile("./tests/c4/getting-started.json", JSON.stringify(c4Workspace));
    });

});