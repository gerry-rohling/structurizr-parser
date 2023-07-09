import * as fsPromise from 'fs/promises';
import { StructurizrParser } from '../src/Parser';
import { createSyntaxDiagramsCode } from 'chevrotain';

describe('Testing StructurizrParser', () => {
    test('Can generate diagrams', async() => {
        const targetDir = './tests/diagrams/';
        const serializedGrammar = StructurizrParser.getSerializedGastProductions();
        const htmlText = createSyntaxDiagramsCode(serializedGrammar);
        await fsPromise.writeFile(targetDir + "generated_diagrams.html", htmlText);
        expect(htmlText.length).toBeGreaterThan(0);
    });
});