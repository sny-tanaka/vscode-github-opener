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
      const defaultBranchRef = execSync('git symbolic-ref refs/remotes/origin/HEAD', options).toString().trim();
      const defaultBranch = defaultBranchRef.replace('refs/remotes/origin/', '');

      let githubUrl = remoteUrl
        .replace(/git@github\.com:/, 'https://github.com/')
        .replace(/\.git$/, '');

      githubUrl += `/blob/${defaultBranch}/${relativePath}`;

      // ✅ 選択中の行番号を取得してハッシュとして追加
      const selection = editor.selection;
      if (!selection.isEmpty) {
        const start = selection.start.line + 1; // VSCodeは0始まり、GitHubは1始まり
        const end = selection.end.line + 1;
        const lineHash = start === end ? `#L${start}` : `#L${start}-L${end}`;
        githubUrl += lineHash;
      }

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