# 🚀 Vercelデプロイ ＆ GitHub自動連携 完全ガイド

このプロジェクトは、**「Vercel上で動くWebサイトにPDF/TXTをアップロードすると、GitHubリポジトリに自動でコミット＆保存され、データが永続化される」** フルスタック構成（Next.js + GitHub REST API）で構築されています。

---

## 🎯 アーキテクチャの概要

```
[ ブラウザ (Vercelデプロイ先URL) ]
   │
   │ 1. PDF/TXTをドラッグ＆ドロップ
   ▼
[ Next.js API (/api/upload) ]
   │
   │ 2. テキスト抽出・日置流KPI/意思決定を自動解析
   │ 3. GitHub REST APIを叩いて自動コミット (原本 + data/chronicle.json)
   ▼
[ あなたの GitHub リポジトリ ] ──(自動Webhook)──▶ [ Vercel CI/CD 自動再ビルド ]
```

---

## 🛠️ デプロイ手順（3ステップ）

### ステップ 1: GitHubに新しいリポジトリを作ってPushする

ターミナルで以下のコマンドを実行します：

```bash
cd "/Users/takutookada/Downloads/日置さんver3.0"

# git初期化
git init
git add .
git commit -m "feat: Initial commit for VEXUM CFO Portal"

# GitHubで新しいリポジトリ（例: vexum-cfo-portal）を作成後：
git remote add origin https://github.com/あなたのユーザー名/vexum-cfo-portal.git
git branch -M main
git push -u origin main
```

---

### ステップ 2: GitHub Personal Access Token (PAT) を取得する

Web画面からのアップロードをGitHubに自動コミットさせるためのアクセストークンを発行します：

1. GitHubの **[Settings > Developer Settings > Personal access tokens > Tokens (classic)](https://github.com/settings/tokens)** にアクセス。
2. **「Generate new token (classic)」** をクリック。
3. Noteに `Vercel CFO Portal` と入力。
4. スコープで **`repo`**（リポジトリへの読み書き権限）にチェックを入れる。
5. **「Generate token」** をクリックし、表示されたトークン（`ghp_...`）をコピー。

---

### ステップ 3: Vercelにインポートしてデプロイする

1. **[Vercel Dashboard](https://vercel.com/dashboard)** を開き、**「Add New...」>「Project」** をクリック。
2. 先ほどPushした GitHub リポジトリ（`vexum-cfo-portal`）を選択して **「Import」** をクリック。
3. **「Environment Variables」**（環境変数）に以下を追加します：

| 環境変数名 | 設定値の例 | 説明 |
|---|---|---|
| `GITHUB_TOKEN` | `ghp_xxxxxxxxxxxxxxxxxxxx` | ステップ2で取得したPAT |
| `GITHUB_OWNER` | `takutookada` | あなたのGitHubユーザー名 |
| `GITHUB_REPO` | `vexum-cfo-portal` | リポジトリ名 |
| `GITHUB_BRANCH` | `main` | ブランチ名（通常はmain） |

4. **「Deploy」** ボタンを押します！

---

## 🌟 デプロイ完了後の使い方

1. 発行されたURL（例: `https://vexum-cfo-portal.vercel.app`）をブラウザで開きます。
2. 「5. ドキュメント投入 / GitHub自動同期」タブから、新しい経営会議のPDFや文字起こしTXTをドロップします。
3. **即座に解析され、あなたのGitHubリポジトリに原本ファイル（`meetings/`）と解析データ（`data/chronicle.json`）が自動コミットされます！**
4. どこからアクセスしても、常にチーム全体で最新の日置さんCFOポータルを共有・学習できます。
