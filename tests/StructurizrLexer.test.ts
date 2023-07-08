import * as fsPromise from 'fs/promises';
import { StructurizrLexer } from '../src/Lexer';

describe('Testing StructurizrLexer', () => {
    test('Can scan file', async() => {
        var dsl = await fsPromise.readFile('./tests/data/big-bank-plc.dsl', 'utf-8');
        let lexingResult = StructurizrLexer.tokenize(dsl);
        expect(lexingResult).toBeDefined();
        expect(lexingResult.errors.length).toBe(0);
    });
});