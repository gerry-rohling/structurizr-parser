import * as fsPromise from 'fs/promises';
import { StructurizrLexer } from '../src/Lexer';
import { StructurizrParser } from '../src/Parser';
import { StructurizrInterpreter } from '../src/StructurizrInterpreter'
import { Workspace } from 'structurizr-typescript';

describe('Testing StructurizrInterpreter', () => {

    test('Can interpret getting started dsl', async() => {
        var dsl = await fsPromise.readFile('./tests/data/getting-started.dsl', 'utf-8');
        const lexingResult = StructurizrLexer.tokenize(dsl);
        expect(lexingResult.errors.length).toBe(0);
        StructurizrParser.input = lexingResult.tokens;
        const cst = StructurizrParser.workspaceWrapper();
        expect(StructurizrParser.errors.length).toBe(0);
        expect(cst.name).toBe("workspaceWrapper");
        const wspace = StructurizrInterpreter.visit(cst) as Workspace;
        expect(wspace).toBeDefined();
        expect(wspace.model.people.length).toBe(1);
        expect(wspace.model.softwareSystems.length).toBe(1);
        expect(wspace.model.relationships.length).toBe(1);
        expect(wspace.views.systemContextViews.length).toBe(1);
    });

    test('Can interpret extension to getting started dsl', async() => {
        var dsl = await fsPromise.readFile('./tests/data/getting-started-extended.dsl', 'utf-8');
        const lexingResult = StructurizrLexer.tokenize(dsl);
        expect(lexingResult.errors.length).toBe(0);
        StructurizrParser.input = lexingResult.tokens;
        const cst = StructurizrParser.workspaceWrapper();
        expect(StructurizrParser.errors.length).toBe(0);
        expect(cst.name).toBe("workspaceWrapper");
        const wspace = StructurizrInterpreter.visit(cst) as Workspace;
        expect(wspace).toBeDefined();
        expect(wspace.model.people.length).toBe(0);
        expect(wspace.model.softwareSystems.length).toBe(1);
        expect(wspace.model.relationships.length).toBe(0);
        expect(wspace.views.systemContextViews.length).toBe(0);
    });

});