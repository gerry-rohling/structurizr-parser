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
        const c4wspace = RawInterpreter.visit(cst) as components["schemas"]["Workspace"];
        expect(c4wspace).toBeDefined();
        expect(c4wspace.model?.people).toHaveLength(1);
        expect(c4wspace.model?.softwareSystems).toHaveLength(1);
        expect(c4wspace.views?.systemContextViews).toHaveLength(1);
        await fsPromise.writeFile("./tests/raw/getting-started.json", JSON.stringify(c4wspace));
    });

    test('Can RAW interpret NESTED relationships', async () => {
        var dsl = await fsPromise.readFile('./tests/data/nested.dsl', 'utf-8');
        const lexingResult = StructurizrLexer.tokenize(dsl);
        expect(lexingResult.errors.length).toBe(0);
        StructurizrParser.input = lexingResult.tokens;
        const cst = StructurizrParser.workspaceWrapper();
        expect(StructurizrParser.errors.length).toBe(0);
        expect(cst.name).toBe("workspaceWrapper");
        const c4wspace = RawInterpreter.visit(cst) as components["schemas"]["Workspace"];
        expect(c4wspace).toBeDefined();
        expect(c4wspace.model?.softwareSystems).toHaveLength(2);
        expect(c4wspace.model?.softwareSystems?.[0].containers?.[0].components?.[0].relationships?.[0].sourceId).toBe("component1");
        await fsPromise.writeFile("./tests/raw/nested.json", JSON.stringify(c4wspace));
    });

    test('Can RAW interpret Grouping of entities', async () => {
        var dsl = await fsPromise.readFile('./tests/data/groups.dsl', 'utf-8');
        const lexingResult = StructurizrLexer.tokenize(dsl);
        expect(lexingResult.errors.length).toBe(0);
        StructurizrParser.input = lexingResult.tokens;
        const cst = StructurizrParser.workspaceWrapper();
        if (StructurizrParser.errors.length > 0) {
            console.log(StructurizrParser.errors);
        }
        expect(StructurizrParser.errors.length).toBe(0);
        expect(cst.name).toBe("workspaceWrapper");
        RawInterpreter.Debug = true;
        const c4wspace = RawInterpreter.visit(cst) as components["schemas"]["Workspace"];
        expect(c4wspace).toBeDefined();
        await fsPromise.writeFile("./tests/raw/groups.json", JSON.stringify(c4wspace));
    });
});