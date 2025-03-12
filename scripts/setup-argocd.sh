#!/bin/bash

set -euo pipefail

# ArgoCDのインストール
echo "Installing ArgoCD..."
kubectl create namespace argocd --dry-run=client -o yaml | kubectl apply -f -
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

# ArgoCDの準備完了を待機
echo "Waiting for ArgoCD to be ready..."
kubectl wait --namespace argocd \
  --for=condition=ready pod \
  --selector=app.kubernetes.io/name=argocd-server \
  --timeout=300s

# 初期パスワードの取得
echo "Getting initial admin password..."
ARGOCD_PASSWORD=$(kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d)
echo "ArgoCD initial admin password: $ARGOCD_PASSWORD"

# アプリケーションのデプロイ
echo "Creating ArgoCD applications..."
cat <<EOF | kubectl apply -f -
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

echo "ArgoCD setup completed successfully!"
echo "Access the ArgoCD UI by port-forwarding: kubectl port-forward svc/argocd-server -n argocd 8080:443"
echo "Login with username: admin, password: $ARGOCD_PASSWORD" 