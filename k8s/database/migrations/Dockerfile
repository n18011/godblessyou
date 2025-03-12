FROM node:20-slim

WORKDIR /app

RUN apt install -y curl
# bunのインストール
RUN curl -fsSL https://bun.sh/install | bash

# 依存関係のインストール
COPY package.json bun.lockb