import { ILexingResult, IToken } from "chevrotain";

export class LexerVisualizer {
    
    private name: string; 

    constructor(theName: string) {
        this.name = theName;
    }

    createVisual(lexingResult: ILexingResult) : string {
        let tokens:string = "";
        let currentLine = 0;
        if (lexingResult.tokens.length > 0) {
            currentLine = lexingResult.tokens[0].startLine ?? 0;
            tokens += this.lineStart(currentLine);
        };
        for (let token of lexingResult.tokens) {
            if (token.startLine != currentLine) {
                currentLine = token.startLine ?? currentLine + 1;
                tokens += this.lineEnd();
                tokens += this.lineStart(currentLine);
            }
            tokens += this.makeLozenge(token);
        };
        if (lexingResult.tokens.length > 0) {
            tokens += this.lineEnd();
        };
        return this.header() + tokens + this.footer();
    }

    header() : string {
        return `<!doctype html><html><head><meta charset="UTF-8"><script src="https://cdn.tailwindcss.com"></script></head><body class="p-2"><h1 class="text-3xl font-bold mb-2">Token assignment for ${this.name}</h1>\n`;
    }

    footer() : string {
        return `</body></html>`;
    }

    lineStart(line: number) : string {
        const zeroPad = (num: number, places: number) => String(num).padStart(places, '0');
        return `<div class="flex flex-row flex-nowrap space-x-1 mb-1"><div class="border-solid border-2 border-rose-600 p-1">${zeroPad(line,5)}</div>`;
    }

    lineEnd() : string {
        return `</div>\n`;
    }

    makeLozenge(token: IToken) : string {
        return `<div class="border-solid border-2 border-indigo-600 p-1"><div class="flex flex-col"><div class="text-center">${token.image}</div><div class="text-center text-xs">${token.tokenType.name}</div></div></div>`;
    }    
}


