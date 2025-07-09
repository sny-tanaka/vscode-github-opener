const vscode = require('vscode');
const { execSync } = require('child_process');

function activate(context) {
  let disposable = vscode.commands.registerCommand('githubOpener.openInGitHub', () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) return;

    const filePath = editor.document.fileName;
    const workspaceFolder = vscode.workspace.getWorkspaceFolder(editor.document.uri);
    if (!workspaceFolder) {
      vscode.window.showErrorMessage('ワークスペースが見つかりません');
      return;
    }

    const relativePath = filePath.replace(workspaceFolder.uri.fsPath + '/', '');

    try {
      const options = { cwd: workspaceFolder.uri.fsPath };
      const remoteUrl = execSync('git config --get remote.origin.url', options).toString().trim();
      const branch = execSync('git rev-parse --abbrev-ref HEAD', options).toString().trim();

      let githubUrl = remoteUrl
        .replace(/git@github\.com:/, 'https://github.com/')
        .replace(/\.git$/, '');

      githubUrl += `/blob/${branch}/${relativePath}`;

      vscode.env.openExternal(vscode.Uri.parse(githubUrl));
    } catch (err) {
      vscode.window.showErrorMessage(`GitHub URLを生成できませんでした: ${err.message}`);
    }
  });

  context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = {
  activate,
  deactivate
};