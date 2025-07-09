# GitHub Opener

VSCodeで開いているファイル上で右クリックしたときのメニューに`GitHubで開く`を追加します。  
デフォルトブランチで開かれます。  
選択中の行がある場合は行まで含まれます。

## install
```sh
code --install-extension vscode-github-opener-0.0.1.vsix
```

## 使い方

1. Git管理されているプロジェクトのファイルを開く
2. 右クリック → 「GitHubで開く」をクリック
3. デフォルトブラウザで対象のページが開かれる

## 開発者向け
### build
```sh
npx @vscode/vsce package
```