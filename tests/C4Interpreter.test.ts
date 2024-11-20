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

    test('Can c4 interpret extension to getting started dsl', async() => {
        var dsl = await fsPromise.readFile('./tests/data/getting-started-extended.dsl', 'utf-8');
        const lexingResult = StructurizrLexer.tokenize(dsl);
        expect(lexingResult.errors.length).toBe(0);
        StructurizrParser.input = lexingResult.tokens;
        const cst = StructurizrParser.workspaceWrapper();
        expect(StructurizrParser.errors.length).toBe(0);
        expect(cst.name).toBe("workspaceWrapper");
        const c4wspace = C4Interpreter.visit(cst) as C4Workspace;
        expect(c4wspace).toBeDefined();
        await fsPromise.writeFile("./tests/c4/c4-getting-started-extended.json", JSON.stringify(c4wspace));
    });

    test('Can c4 interpret the random Elsevier dsl', async() => {
        var dsl = await fsPromise.readFile('./tests/data/elsevier.dsl', 'utf-8');
        const lexingResult = StructurizrLexer.tokenize(dsl);
        expect(lexingResult.errors.length).toBe(0);
        StructurizrParser.input = lexingResult.tokens;
        const cst = StructurizrParser.workspaceWrapper();
        expect(StructurizrParser.errors.length).toBe(0);
        expect(cst.name).toBe("workspaceWrapper");
        const c4wspace = C4Interpreter.visit(cst) as C4Workspace;
        expect(c4wspace).toBeDefined();
        await fsPromise.writeFile("./tests/c4/c4-elsevier.json", JSON.stringify(c4wspace));
    });

    test('Can c4 interpret BIG BANK dsl', async() => {
        var dsl = await fsPromise.readFile('./tests/data/big-bank-plc.dsl', 'utf-8');
        const lexingResult = StructurizrLexer.tokenize(dsl);
        expect(lexingResult.errors.length).toBe(0);
        StructurizrParser.input = lexingResult.tokens;
        const cst = StructurizrParser.workspaceWrapper();
        expect(StructurizrParser.errors.length).toBe(0);
        expect(cst.name).toBe("workspaceWrapper");
        const c4wspace = C4Interpreter.visit(cst) as C4Workspace;
        expect(c4wspace).toBeDefined();
        await fsPromise.writeFile("./tests/c4/c4-big-bank-plc.json", JSON.stringify(c4wspace));
    });

    test('Can c4 interpret NESTED relationships', async () => {
        var dsl = await fsPromise.readFile('./tests/data/nested.dsl', 'utf-8');
        const lexingResult = StructurizrLexer.tokenize(dsl);
        expect(lexingResult.errors.length).toBe(0);
        StructurizrParser.input = lexingResult.tokens;
        const cst = StructurizrParser.workspaceWrapper();
        expect(StructurizrParser.errors.length).toBe(0);
        expect(cst.name).toBe("workspaceWrapper");
        const c4wspace = C4Interpreter.visit(cst) as C4Workspace;
        expect(c4wspace).toBeDefined();
        //const allRel = c4wspace.Model.SoftwareSystems[0].NestedRelationships;
        //await fsPromise.writeFile("./tests/c4/c4-nested-rolled-up-software.json", JSON.stringify(allRel));
        await fsPromise.writeFile("./tests/c4/c4-nested.json", JSON.stringify(c4wspace));
    });

});