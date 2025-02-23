import * as vscode from "vscode";

export const getQuickPickInput = async (placeholder: string) => {
  const quickPick = vscode.window.createQuickPick();
  quickPick.placeholder = placeholder;
  quickPick.title = "PG Fixtures Editor";

  return await new Promise<string | null>((resolve, reject) => {
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
};
