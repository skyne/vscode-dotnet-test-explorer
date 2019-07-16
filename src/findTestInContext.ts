import * as vscode from "vscode";
import { SymbolKind } from "vscode";
import { AppInsightsClient } from "./appInsightsClient";
import { ITestSymbol, Symbols } from "./symbols";
import { ITestRunContext } from "./testCommands";

export class FindTestInContext {

    public async find(doc: vscode.TextDocument, position: vscode.Position): Promise<ITestRunContext> {

        AppInsightsClient.sendEvent("findTestInContext");

        return Symbols.getSymbols(doc.uri, true).then( (documentSymbols: ITestSymbol[]) => {

            const symbolsInRange = documentSymbols.filter( (ds) => ds.documentSymbol.range.contains(position));

            let symbolCandidate: ITestSymbol;

            symbolCandidate = symbolsInRange.find( (s) => s.documentSymbol.kind === vscode.SymbolKind.Method);

            if (symbolCandidate) {
                return {testName: (symbolCandidate.fullName), testCaseName: "", isSingleTest: true};
            }

            symbolCandidate = symbolsInRange.find( (s) => s.documentSymbol.kind === vscode.SymbolKind.Class);

            if (symbolCandidate) {
                return {testName: symbolCandidate.fullName, testCaseName: "", isSingleTest: false};
            }
        });
    }
}
