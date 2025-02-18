// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { removeColumn } from "pg-fixtures-editor";
import * as vscode from "vscode";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  // console.log('Congratulations, your extension "pgfixtureseditor" is now active!');

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  const disposable = vscode.commands.registerCommand(
    "pgfixtureseditor.removeColumn",
    async () => {
      // The code you place here will be executed every time your command is executed
      const editor = vscode.window.activeTextEditor;
      // get selected text
      const selection = editor?.selection;
      if (!selection || selection.isEmpty) {
        vscode.window.showWarningMessage(
          "PG Fixtures Editor: Please select some SQL code"
        );
        return;
      }
      // selection found
      const selectionRange = new vscode.Range(
        selection.start.line,
        selection.start.character,
        selection.end.line,
        selection.end.character
      );
      const selectedText = editor.document.getText(selectionRange);

      // Get column name from user using QuickPick
      const quickPick = vscode.window.createQuickPick();
      quickPick.placeholder =
        "Enter the name of the column to remove (case sensitive)";
      quickPick.title = "PG Fixtures Editor";
      try {
        const colName = await new Promise<string | null>((resolve, reject) => {
          quickPick.onDidAccept(() => {
            const value = quickPick.value;
            quickPick.hide();
            resolve(value);
          });
          quickPick.onDidHide(() => {
            quickPick.dispose();
            resolve(null);
          });
          quickPick.show();
        });
        if (!colName) {
          // user cancelled
          return;
        }

        // process selected SQL
        const out = removeColumn(colName, selectedText);

        // Replace the selected text with the processed output
        editor.edit((editBuilder) => {
          editBuilder.replace(selectionRange, out);
        });
      } catch (err) {
        vscode.window.showErrorMessage(
          "PG Fixtures Editor: Error processing SQL code"
        );
      }
    }
  );

  context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
