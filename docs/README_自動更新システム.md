# 🔄 VEXUM CFO Intelligence Portal - ドキュメント自動更新システム 使い方ガイド

新しい議事録PDFやテキスト（文字起こし、Geminiメモなど）が手に入った際、**ポータルを常に最新状態へ更新する方法**は以下の3通り用意されています。お好みの方法でご利用いただけます。

---

## 方式 1: ブラウザ画面にドラッグ＆ドロップ（最も手軽！）

1. [日置さん_CFOインテリジェンス_ポータル.html](file:///Users/takutookada/Downloads/日置さんver3.0/日置さん_CFOインテリジェンス_ポータル.html) をブラウザで開きます。
2. 上部タブの **「5. ドキュメント投入 / 自動更新」** をクリックします。
3. 画面上の破線エリアに **PDFファイルやTXTファイルをドラッグ＆ドロップ** します（複数ファイル同時投入も可能）。
4. ブラウザが自動的にテキストを解析し、日置さんの重要意思決定やKPIを抽出してタイムラインに追加・ローカル保存されます。

---

## 方式 2: コマンド1発でフォルダ全体を一括自動同期

1. 新しいPDFやテキストファイルをフォルダ（`/Users/takutookada/Downloads/日置さんver3.0/`）に入れます。
2. ターミナルで以下のコマンドを実行します：
   ```bash
   python3 update_portal.py
   ```
3. フォルダ内の全PDF・TXTが自動スキャンされ、`chronicle_data.json` と `日置さん_CFOインテリジェンス_ポータル.html` が最新の解析データで再生成されます。

---

## 方式 3: フォルダ常時監視（Auto-Watcher）

ファイルをフォルダに保存した瞬間に完全自動で更新させたい場合：
1. ターミナルで以下を実行しておきます：
   ```bash
   python3 watch_meetings.py
   ```
2. この状態でフォルダ内に新しいファイルが追加・変更されると、2秒以内に自動検知してポータルを即座に最新化します。
3. 終了したい時は `Ctrl + C` を押します。

---

## 📂 生成・管理されるファイル一覧

| ファイル名 | 役割 |
|---|---|
| [日置さん_CFOインテリジェンス_ポータル.html](file:///Users/takutookada/Downloads/日置さんver3.0/日置さん_CFOインテリジェンス_ポータル.html) | メインのWebポータル（シミュレーター・全会議分析・ドリル・更新機能搭載） |
| [update_portal.py](file:///Users/takutookada/Downloads/日置さんver3.0/update_portal.py) | フォルダ内の全ドキュメントをスキャンしてHTMLを更新する自動同期スクリプト |
| [watch_meetings.py](file:///Users/takutookada/Downloads/日置さんver3.0/watch_meetings.py) | フォルダをリアルタイム監視して自動同期する常駐スクリプト |
| [generate_portal_lib.py](file:///Users/takutookada/Downloads/日置さんver3.0/generate_portal_lib.py) | ポータル生成エンジン |
| [chronicle_data.json](file:///Users/takutookada/Downloads/日置さんver3.0/chronicle_data.json) | 構造化された全会議のデータベースJSON |
