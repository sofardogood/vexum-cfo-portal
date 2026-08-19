# 📊 VEXUM CFO Intelligence Portal (日置佑輔 CFO思考OS＆全会議分析)

株式会社VEXUMの日置佑輔代表（実質的CFO）の経営哲学・意思決定ロジック・全15回経営会議分析と、「第二の日置さん」を目指す学習ロードマップを提供するフルスタックWebポータルです。

Next.js + GitHub REST API連動により、**Web画面上でPDF/TXTをドラッグ＆ドロップするだけで、GitHubリポジトリに自動でファイルがコミット＆永続化**されます。

---

## 📁 ディレクトリ構成

```
日置さんver3.0/
├── app/                  # Next.js App Router (UI & API Routes)
│   ├── api/
│   │   ├── meetings/     # GitHub / ローカルから最新会議を取得するAPI
│   │   └── upload/       # PDF/TXT解析 ＆ GitHub自動コミットAPI
│   ├── globals.css       # グローバルCSS (Tailwind)
│   ├── layout.tsx        # Next.js レイアウト
│   └── page.tsx          # メインポータルUI (React)
├── data/
│   └── chronicle.json    # 蓄積された全会議の構造化JSONデータベース
├── meetings/             # 過去15回の経営会議PDF、文字起こしテキスト、音声原本
├── docs/                 # 人物像分析・システムプロンプト・デプロイマニュアル
│   ├── 日置さん_人物像_分析.md
│   ├── 日置さん_システムプロンプト.md
│   ├── DEPLOY_TO_VERCEL.md
│   └── README_自動更新システム.md
├── scripts/              # Python自動化スクリプト
│   ├── update_portal.py  # フォルダ内全ファイルをスキャンしてHTML更新
│   ├── watch_meetings.py # フォルダ常時監視（Auto-Watcher）
│   └── generate_portal_lib.py # HTML生成エンジン
├── 日置さん_CFOインテリジェンス_ポータル.html # スタンドアローン動作用ポータル
├── package.json
└── README.md
```

---

## 🚀 使い方

### 1. ローカルでの起動
```bash
npm run dev
# ブラウザで http://localhost:3000 を開きます
```

### 2. Vercelへのデプロイ ＆ GitHub自動コミット連携
詳細な手順は [`docs/DEPLOY_TO_VERCEL.md`](docs/DEPLOY_TO_VERCEL.md) をご覧ください。

1. GitHubリポジトリを作成してPush：
   ```bash
   git add .
   git commit -m "feat: VEXUM CFO Intelligence Portal"
   git push origin main
   ```
2. Vercelでリポジトリをインポートし、以下の環境変数を設定してデプロイ：
   - `GITHUB_TOKEN`: GitHub Personal Access Token (repo権限)
   - `GITHUB_OWNER`: GitHubアカウント名
   - `GITHUB_REPO`: リポジトリ名
   - `GITHUB_BRANCH`: main

### 3. Pythonスクリプトでのローカル自動同期
```bash
# ワンクリックで meetings/ 内の全ファイルをスキャンして同期
python3 scripts/update_portal.py

# フォルダ常時監視（ファイルを置くだけで自動更新）
python3 scripts/watch_meetings.py
```
