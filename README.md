# God Bless You

マイクロサービスアーキテクチャを採用したアプリケーション

## プロジェクト構造

```
├── apps/
│   ├── frontend/     # フロントエンドアプリケーション（SvelteKit）
│   └── api/          # APIサービス（SvelteKit + Prisma）
├── base/             # 共通のKubernetesマニフェスト
├── clusters/         # クラスター固有の設定
└── overlays/         # 環境固有のオーバーレイ
```

## 開発環境のセットアップ

1. 必要な依存関係をインストール:
   ```bash
   cd apps/frontend && npm install
   cd ../api && npm install
   ```

2. データベースの設定:
   ```bash
   cd apps/api
   npx prisma generate
   npx prisma migrate dev
   ```

3. 開発サーバーの起動:
   ```bash
   # フロントエンド
   cd apps/frontend
   npm run dev

   # API
   cd apps/api
   npm run dev
   ```

## デプロイメント

1. コンテナイメージのビルド:
   ```bash
   docker build -t frontend:latest apps/frontend
   docker build -t api:latest apps/api
   ```

2. Kubernetesへのデプロイ:
   ```bash
   kubectl apply -k overlays/development
   ```
