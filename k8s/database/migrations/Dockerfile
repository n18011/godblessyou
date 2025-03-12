FROM node:20-slim

WORKDIR /app

RUN apt-get update && apt-get install -y curl && curl -fsSL https://bun.sh/install | bash

# 依存関係のインストール
COPY package.json bun.lockb