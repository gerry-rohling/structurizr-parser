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
    test('Can scan big bank file', async() => {
        var dsl = await fsPromise.readFile('./tests/data/big-bank-plc.dsl', 'utf-8');
        let lexingResult = StructurizrLexer.tokenize(dsl);
        if (lexingResult){
            let viz = new LexerVisualizer("big-bank-plc.dsl");
            let htmlText = viz.createVisual(lexingResult);
            await fsPromise.writeFile("./tests/diagrams/big-bank-plc.html", htmlText);
        }
        expect(lexingResult).toBeDefined();
        expect(lexingResult.errors.length).toBe(0);
    });
});