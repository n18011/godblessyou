# インフラセットアップガイド

このガイドでは、Kind（Kubernetes in Docker）を使用したローカル開発環境のセットアップ手順を説明します。

## 前提条件

以下のツールがインストールされていることを確認してください。

- Docker
- Kind
- kubectl
- Kustomize
- Helm

## クイックスタート

以下のコマンドを実行すると、デフォルト設定でインフラ環境がセットアップされます。

```bash
./scripts/setup.sh
```

セットアップが完了すると、以下のコンポーネントがデプロイされます。

- KubernetesクラスターとIngress Controller
- SvelteKit フロントエンド/バックエンド（プレースホルダー）
- PostgreSQL データベース
- ArgoCD と Tekton による CI/CD パイプライン
- Prometheus, Grafana, Loki によるモニタリングとロギング

## 詳細なセットアップオプション

セットアップスクリプトでは、以下のオプションが利用可能です。

```bash
Usage: ./scripts/setup.sh [options]

Options:
  -h, --help                Show this help message
  -c, --clean               Clean existing setup before installation
  -s, --skip-checks         Skip prerequisite checks
  --no-ingress              Skip Ingress installation
  --no-storage              Skip storage setup
  --no-monitoring           Skip monitoring installation
  --no-cicd                 Skip CI/CD installation
```

## アクセス方法

セットアップ後、以下のURLでサービスにアクセスできます。

- SvelteKit フロントエンド: http://localhost/
- ArgoCD: http://localhost:8080 (admin / 自動生成パスワード)
- Grafana: http://localhost:9000 (admin / prom-operator)

## デプロイの検証

クラスターとデプロイされたサービスを確認するには、以下のコマンドを実行します。

```bash
# クラスターの確認
kubectl cluster-info

# 名前空間の確認
kubectl get namespaces

# Podの確認
kubectl get pods -A

# サービスの確認
kubectl get services -A

# Ingressの確認
kubectl get ingress -A
```

## データベース管理

PostgreSQLデータベースのバックアップと復元には、専用のスクリプトを提供しています。

### バックアップ

```bash
# データベースのバックアップ
./scripts/backup.sh

# オプションの指定例
./scripts/backup.sh --backup-dir ./my-backups --namespace db --database mydb
```

### 復元

```bash
# データベースの復元
./scripts/restore.sh backups/postgres_gbcproduct_20240325123456.sql.gz

# オプションの指定例
./scripts/restore.sh --namespace db --database mydb backups/postgres_mydb_20240325123456.sql.gz
```

## 定期バックアップ

デフォルトでは、毎日深夜1時にデータベースのバックアップが自動的に実行されます。バックアップは7日間保存され、その後自動的に削除されます。

バックアップの設定は `k8s/db/postgres-backup-cronjob.yaml` で変更できます。

## SvelteKit アプリケーションのデプロイ

実際のSvelteKitアプリケーションをデプロイするには、以下の手順に従います。

1. アプリケーションのDockerイメージをビルドします。
   ```bash
   docker build -t sveltekit-app:latest -f k8s/app/Dockerfile ./app
   ```

2. Kind クラスターにイメージをロードします。
   ```bash
   kind load docker-image sveltekit-app:latest --name gbc-product
   ```

3. デプロイメントのイメージを更新します。
   ```bash
   kubectl set image deployment/sveltekit-frontend sveltekit=sveltekit-app:latest -n app
   ```

## トラブルシューティング

### よくある問題と解決策

1. **Ingressが機能しない**
   ```bash
   kubectl get pods -n ingress-nginx
   kubectl logs -n ingress-nginx deployment/ingress-nginx-controller
   ```

2. **PostgreSQLに接続できない**
   ```bash
   kubectl get pods -n db
   kubectl describe pod postgres-0 -n db
   kubectl logs postgres-0 -n db
   ```

3. **ArgoCD/Grafanaにアクセスできない**
   ```bash
   # ポートフォワーディングの再設定
   kubectl port-forward -n argocd svc/argocd-server 8080:443 &
   kubectl port-forward -n monitoring svc/prometheus-grafana 9000:80 &
   ```

## クラスター管理

### クラスターの削除

環境を完全に削除するには、以下のコマンドを実行します。

```bash
kind delete cluster --name gbc-product
```

### リソースの制限

デフォルトでは、各コンポーネントに適切なリソース制限が設定されています。必要に応じて、各マニフェストファイル内の `resources` セクションを変更してください。

## 次のステップ

1. CI/CD パイプラインの設定
2. カスタムモニタリングダッシュボードの作成
3. 本番環境への移行計画

詳細な情報は、`docs/` ディレクトリ内の各ドキュメントを参照してください。 