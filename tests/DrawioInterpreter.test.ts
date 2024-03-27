import * as fsPromise from 'fs/promises';
import { StructurizrLexer } from '../src/Lexer';
import { StructurizrParser } from '../src/Parser';
import { DrawioInterpreter } from '../src/DrawioInterpreter'
import { Workspace } from 'structurizr-typescript';

describe('Testing DrawioInterpreter', () => {

    test('Can drawio interpret getting started dsl', async() => {
        var dsl = await fsPromise.readFile('./tests/data/getting-started.dsl', 'utf-8');
        const lexingResult = StructurizrLexer.tokenize(dsl);
        expect(lexingResult.errors.length).toBe(0);
        StructurizrParser.input = lexingResult.tokens;
        const cst = StructurizrParser.workspaceWrapper();
        expect(StructurizrParser.errors.length).toBe(0);
        expect(cst.name).toBe("workspaceWrapper");
        const c4Diagram = DrawioInterpreter.visit(cst) as string;
        expect(c4Diagram).toBeDefined();
    });

});