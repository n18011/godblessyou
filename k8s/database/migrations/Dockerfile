FROM oven/bun:latest

WORKDIR /app

# プロジェクトのルートディレクトリから必要なファイルをコピー
COPY ../../package.json ../../bun.lockb ./
COPY ../../prisma ./prisma/

# 依存関係のインストール
RUN bun install --frozen-lockfile

# マイグレーションの実行
CMD ["bunx", "prisma", "migrate", "deploy"]