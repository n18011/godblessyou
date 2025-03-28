# インフラストラクチャドキュメント

このディレクトリには、GBCプロダクトのインフラストラクチャに関する全てのドキュメントが含まれています。

## ディレクトリ構造

```
docs/
├── README.md                     # 本ファイル
├── architecture/                 # アーキテクチャ設計ドキュメント
│   ├── infrastructure.md        # インフラ構成図
│   └── network.md              # ネットワーク構成図
├── implementation/              # 実装関連ドキュメント
│   ├── implementation-plan.md  # 実装計画書
│   └── task-list.md           # タスクリスト
├── operations/                  # 運用関連ドキュメント
│   ├── backup.md              # バックアップ/リストア手順
│   ├── monitoring.md          # 監視運用手順
│   └── maintenance.md         # メンテナンス手順
└── specifications/             # 仕様書
    ├── requirements.md        # 要件定義書
    └── security.md           # セキュリティ仕様書
```

## ドキュメント管理ルール

1. 命名規則
   - ファイル名は全て小文字
   - 単語の区切りはハイフン(-)を使用
   - Markdown形式(.md)を使用

2. コミットルール
   - プレフィックス
     - docs: ドキュメントの追加・更新
     - fix: 誤字脱字の修正
     - refactor: ドキュメント構成の変更
   - 日本語で簡潔に変更内容を記述

3. レビュールール
   - 技術的な正確性
   - 表現の一貫性
   - 図表の適切性

4. 更新ルール
   - 変更履歴は各ドキュメントの末尾に記載
   - 重要な変更は変更履歴に記載

## 使用するツール

- Markdown: ドキュメント作成
- PlantUML: システム構成図作成
- Mermaid: シーケンス図、フロー図作成

## 注意事項

1. 機密情報の扱い
   - 環境変数やシークレット情報は記載しない
   - 必要な場合は.env.exampleとして例示

2. 図表の管理
   - PlantUML、Mermaidのソースコードも管理
   - 画像ファイルは`assets/`ディレクトリに配置

3. バージョン管理
   - 各ドキュメントにバージョン番号を記載
   - メジャーな変更時にバージョンを更新 