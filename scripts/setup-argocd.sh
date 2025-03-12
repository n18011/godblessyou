#!/bin/bash

set -euo pipefail

# クラスタの状態を確認
echo "Checking cluster status..."
kubectl cluster-info

# ArgoCDのインストール
echo "Installing ArgoCD..."
kubectl create namespace argocd --dry-run=client -o yaml | kubectl apply -f -

# ArgoCD manifestsのダウンロードと適用
echo "Downloading ArgoCD manifests..."
curl -sL https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml > argocd-install.yaml

echo "Applying ArgoCD manifests..."
kubectl apply -n argocd -f argocd-install.yaml --validate=false

# ArgoCDの準備完了を待機
echo "Waiting for ArgoCD pods to be ready..."
kubectl wait --namespace argocd \
  --for=condition=ready pod \
  --selector=app.kubernetes.io/name=argocd-server \
  --timeout=600s

# すべてのArgoCDポッドの状態を確認
echo "Checking ArgoCD pods status..."
kubectl get pods -n argocd

# 初期パスワードの取得
echo "Getting initial admin password..."
sleep 30  # シークレットの生成を待機
ARGOCD_PASSWORD=$(kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d)
echo "ArgoCD initial admin password: $ARGOCD_PASSWORD"

# アプリケーションのデプロイ
echo "Creating ArgoCD applications..."
cat <<EOF | kubectl apply -f - --validate=false
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: godblessyou-dev
  namespace: argocd
spec:
  project: default
  source:
    repoURL: https://github.com/n18011/godblessyou.git
    targetRevision: HEAD
    path: k8s/overlays/development
  destination:
    server: https://kubernetes.default.svc
    namespace: godblessyou-dev
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
---
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: godblessyou-prod
  namespace: argocd
spec:
  project: default
  source:
    repoURL: https://github.com/n18011/godblessyou.git
    targetRevision: HEAD
    path: k8s/overlays/production
  destination:
    server: https://kubernetes.default.svc
    namespace: godblessyou-prod
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
EOF

# 必要なネームスペースの作成
echo "Creating required namespaces..."
kubectl create namespace godblessyou-dev --dry-run=client -o yaml | kubectl apply -f -
kubectl create namespace godblessyou-prod --dry-run=client -o yaml | kubectl apply -f -

echo "ArgoCD setup completed successfully!"
echo "Access the ArgoCD UI by port-forwarding: kubectl port-forward svc/argocd-server -n argocd 8080:443"
echo "Login with username: admin, password: $ARGOCD_PASSWORD"

# ArgoCDのUIにアクセスするためのポートフォワーディングを開始
echo "Starting port-forward for ArgoCD UI..."
kubectl port-forward svc/argocd-server -n argocd 8080:443 &
echo "ArgoCD UI will be available at https://localhost:8080" 