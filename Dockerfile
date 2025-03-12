# ビルドステージ
FROM oven/bun:latest AS builder

WORKDIR /app

# bunのインストール
# RUN apt-get update && apt-get install -y curl && curl -fsSL https://bun.sh/install | bash

# 依存関係のインストール
COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile

# ソースコードのコピー
COPY . .

# Prismaクライアントの生成
RUN bunx prisma generate

# アプリケーションのビルド
RUN bun run build

# 実行ステージ
# FROM node:20-slim AS runner
FROM oven/bun:latest AS runner

WORKDIR /app

# bunのインストール
# RUN apt-get update && apt-get install -y curl && curl -fsSL https://bun.sh/install | bash

# 必要なファイルのみをコピー
COPY --from=builder /app/build ./build
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# 環境変数の設定
ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["bun", "run", "start"]