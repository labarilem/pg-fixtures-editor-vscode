import { addColumn } from "pg-fixtures-editor";
import * as vscode from "vscode";
import { getQuickPickInput } from "../utils";

export const addColumnCommand = async () => {
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

  try {
    // Get column name from user using QuickPick
    const colName = await getQuickPickInput(
      "Enter the name of the new column (case sensitive)"
    );
    if (colName == null) return; // user cancelled

    // Get column name from user using QuickPick
    const colValue = await getQuickPickInput(
      "Enter the value of the new column (escape and quote if needed)"
    );
    if (colValue == null) return; // user cancelled

    // process selected SQL
    const out = addColumn(colName, colValue, selectedText);

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
