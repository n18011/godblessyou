# GodBlessYou - K8sマイクロサービスアプリケーション

## プロジェクト概要
このプロジェクトは、Kubernetesを使用したマイクロサービスアーキテクチャに基づくWebアプリケーションです。

### 技術スタック
- フロントエンド: SvelteKit
- バックエンド: SvelteKit (Server)
- データベース: PostgreSQL
- ORM: Prisma
- コンテナオーケストレーション: Kubernetes
- 開発言語: TypeScript

### ディレクトリ構造
```
/
├── src/                    # SvelteKitアプリケーション
│   ├── routes/            # ルーティング
│   └── lib/              # 共有ライブラリ
├── prisma/                # Prismaの設定
│   └── schema.prisma     # データベーススキーマ
├── k8s/                  # Kubernetes設定
│   ├── frontend/        # フロントエンド関連
│   ├── backend/         # バックエンド関連
│   └── database/       # データベース関連
├── docs/                # プロジェクトドキュメント
└── tests/              # テストファイル
```

### セットアップ手順
1. 依存関係のインストール
```bash
bun install
```

2. 開発サーバーの起動
```bash
bun run dev
```

3. データベースのセットアップ
```bash
bunx prisma generate
bunx prisma migrate dev
```

4. Kubernetesクラスタの準備
```bash
kind create cluster
kubectl apply -f k8s/
```

### 開発ガイドライン
- コードスタイル: Prettier + ESLint
- テスト: Vitest + Playwright
- Git: Conventional Commits
- CI/CD: GitHub Actions
