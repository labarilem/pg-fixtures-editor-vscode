import { removeColumn } from "pg-fixtures-editor";
import * as vscode from "vscode";

export const removeColumnCommand = async () => {
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
};
