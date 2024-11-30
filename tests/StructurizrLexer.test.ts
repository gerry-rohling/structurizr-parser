import * as fsPromise from 'fs/promises';
import { StructurizrLexer } from '../src/Lexer';
import { LexerVisualizer } from '../src/LexerVisualizer';

describe('Testing StructurizrLexer', () => {
    test('Can scan getting started file', async() => {
        var dsl = await fsPromise.readFile('./tests/data/getting-started.dsl', 'utf-8');
        let lexingResult = StructurizrLexer.tokenize(dsl);
        if (lexingResult){
            let viz = new LexerVisualizer("getting-started.dsl");
            let htmlText = viz.createVisual(lexingResult);
            await fsPromise.writeFile("./tests/diagrams/getting-started.html", htmlText);
        }
        expect(lexingResult).toBeDefined();
        expect(lexingResult.errors.length).toBe(0);
    });
    test('Can scan extension DSL of getting started file', async() => {
        var dsl = await fsPromise.readFile('./tests/data/getting-started-extended.dsl', 'utf-8');
        let lexingResult = StructurizrLexer.tokenize(dsl);
        if (lexingResult){
            let viz = new LexerVisualizer("getting-started-extended.dsl");
            let htmlText = viz.createVisual(lexingResult);
            await fsPromise.writeFile("./tests/diagrams/getting-started-extended.html", htmlText);
        }
        expect(lexingResult).toBeDefined();
        expect(lexingResult.errors.length).toBe(0);
    });
    test('Can scan random Elsevier file', async() => {
        var dsl = await fsPromise.readFile('./tests/data/elsevier.dsl', 'utf-8');
        let lexingResult = StructurizrLexer.tokenize(dsl);
        if (lexingResult){
            let viz = new LexerVisualizer("elsevier.dsl");
            let htmlText = viz.createVisual(lexingResult);
            await fsPromise.writeFile("./tests/diagrams/elsevier.html", htmlText);
        }
        expect(lexingResult).toBeDefined();
        expect(lexingResult.errors.length).toBe(0);
    });
    test('Can scan big bank file', async() => {
        var dsl = await fsPromise.readFile('./tests/data/big-bank-plc.dsl', 'utf-8');
        let lexingResult = StructurizrLexer.tokenize(dsl);
        if (lexingResult){
            let viz = new LexerVisualizer("big-bank-plc.dsl");
            let htmlText = viz.createVisual(lexingResult);
            await fsPromise.writeFile("./tests/diagrams/big-bank-plc.html", htmlText);
        }
        expect(lexingResult).toBeDefined();
        if (lexingResult.errors.length > 0) {
            console.log(lexingResult.errors);
        }
        expect(lexingResult.errors.length).toBe(0);
    });
    test('Can identify bad tokens', async() => {
        var dsl = await fsPromise.readFile('./tests/data/bad-getting-started.dsl', 'utf-8');
        let lexingResult = StructurizrLexer.tokenize(dsl);
        if (lexingResult){
            let viz = new LexerVisualizer("getting-started.dsl");
            let htmlText = viz.createVisual(lexingResult);
            await fsPromise.writeFile("./tests/diagrams/bad-getting-started.html", htmlText);
        }
        expect(lexingResult).toBeDefined();
        expect(lexingResult.errors.length).toBe(1);
        expect(lexingResult.errors[0].offset).toBe(215);
    });

    test('Can understand nested groups', async() => {
        var dsl = await fsPromise.readFile('./tests/data/groups.dsl', 'utf-8');
        let lexingResult = StructurizrLexer.tokenize(dsl);
        if (lexingResult){
            let viz = new LexerVisualizer("groups.dsl");
            let htmlText = viz.createVisual(lexingResult);
            await fsPromise.writeFile("./tests/diagrams/groups.html", htmlText);
        }
        expect(lexingResult).toBeDefined();
        expect(lexingResult.errors.length).toBe(0);        
    });
});