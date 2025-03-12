FROM postgres:16-alpine

# タイムゾーンの設定
ENV TZ=Asia/Tokyo

# 初期化スクリプトのコピー
COPY ./init.sql /docker-entrypoint-initdb.d/

# 必要なPostgreSQL設定の追加
COPY postgresql.conf /etc/postgresql/postgresql.conf

CMD ["postgres", "-c", "config_file=/etc/postgresql/postgresql.conf"]